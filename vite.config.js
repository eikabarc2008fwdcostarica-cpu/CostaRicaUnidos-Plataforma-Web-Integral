import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function jsonDbServerPlugin() {
  return {
    name: 'vite-json-db-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';

        // Atender peticiones hacia /api/usuarios y /usuarios
        if (url === '/api/usuarios' || url === '/usuarios') {
          const servicesDbPath = path.resolve(__dirname, 'src/services/db.json');
          const dataDbPath = path.resolve(__dirname, 'src/data/db.json');

          // Helper para leer db.json
          const readDb = () => {
            try {
              if (fs.existsSync(servicesDbPath)) {
                return JSON.parse(fs.readFileSync(servicesDbPath, 'utf-8'));
              }
              if (fs.existsSync(dataDbPath)) {
                return JSON.parse(fs.readFileSync(dataDbPath, 'utf-8'));
              }
            } catch (err) {
              console.error('[jsonDbServer] Error leyendo db.json:', err);
            }
            return { usuarios: [], sesionesActivas: [], bitacoraAccesos: [] };
          };

          // Helper para escribir db.json en ambos archivos físicos
          const writeDb = (dbData) => {
            const jsonStr = JSON.stringify(dbData, null, 2);
            fs.writeFileSync(servicesDbPath, jsonStr, 'utf-8');
            if (fs.existsSync(path.dirname(dataDbPath))) {
              fs.writeFileSync(dataDbPath, jsonStr, 'utf-8');
            }
          };

          // 1. Manejo de OPTIONS (Preflight)
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
            res.end();
            return;
          }

          // 2. Manejo de GET (Listar usuarios)
          if (req.method === 'GET') {
            const db = readDb();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(db.usuarios || []));
            return;
          }

          // 3. Manejo de POST (Registrar usuario en db.json)
          if (req.method === 'POST') {
            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                const data = JSON.parse(bodyStr);

                const cleanCedula = String(data.cedula || '').trim();
                const cleanEmail = String(data.correo || '').toLowerCase().trim();
                const digits = cleanCedula.replace(/[^0-9]/g, '');

                if (!cleanCedula || !cleanEmail || !data.nombre) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(
                    JSON.stringify({
                      success: false,
                      message: 'Todos los campos requeridos (cédula, nombre, correo) deben ser completados.'
                    })
                  );
                  return;
                }

                const db = readDb();
                if (!Array.isArray(db.usuarios)) db.usuarios = [];
                if (!Array.isArray(db.sesionesActivas)) db.sesionesActivas = [];
                if (!Array.isArray(db.bitacoraAccesos)) db.bitacoraAccesos = [];

                // Validar si la cédula o correo ya existen en db.json
                const existe = db.usuarios.some((u) => {
                  const uDigits = String(u.cedula || '').replace(/[^0-9]/g, '');
                  const uEmail = String(u.correo || '').toLowerCase().trim();
                  return (digits && uDigits === digits) || uEmail === cleanEmail;
                });

                if (existe) {
                  res.statusCode = 409;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(
                    JSON.stringify({
                      success: false,
                      message: 'Ya existe una cuenta registrada con esta cédula o correo electrónico.'
                    })
                  );
                  return;
                }

                const rol = data.rol || 'Ciudadano/Turista';
                const nivelAcceso =
                  rol === 'Super Administrador Nacional'
                    ? 5
                    : rol === 'Administrador Provincial'
                    ? 4
                    : rol === 'Editor Municipal'
                    ? 3
                    : 2;

                const prefix =
                  rol === 'Super Administrador Nacional'
                    ? 'USR-NAC'
                    : rol === 'Administrador Provincial'
                    ? 'USR-PROV'
                    : rol === 'Editor Municipal'
                    ? 'USR-MUNI'
                    : 'USR-CIUD';

                const newId = `${prefix}-${Date.now().toString().slice(-4)}`;

                const newUser = {
                  id: newId,
                  cedula: cleanCedula,
                  nombre: String(data.nombre).trim(),
                  correo: cleanEmail,
                  password: String(data.password || 'Ciudadano2026*'),
                  rol,
                  nivelAcceso,
                  provincia: data.provincia || 'San José',
                  canton: data.canton || 'San José',
                  distrito: data.distrito || 'Carmen',
                  fechaRegistro: new Date().toISOString(),
                  verificadoHacienda: Boolean(data.verificadoHacienda ?? true)
                };

                db.usuarios.push(newUser);

                db.bitacoraAccesos.push({
                  id: `LOG-${Date.now().toString().slice(-4)}`,
                  usuarioId: newUser.id,
                  usuarioNombre: newUser.nombre,
                  rol: newUser.rol,
                  accion: 'REGISTRO_USUARIO',
                  detalles: `Registro exitoso para ${newUser.nombre} en cantón ${newUser.canton}.`,
                  timestamp: new Date().toISOString()
                });

                // Persistencia física en db.json
                writeDb(db);

                console.log(`[jsonDbServer] Nuevo usuario persistido en db.json: ${newUser.id} (${newUser.correo})`);

                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(
                  JSON.stringify({
                    success: true,
                    user: newUser,
                    message: '¡Registro completado exitosamente!'
                  })
                );
              } catch (parseErr) {
                console.error('[jsonDbServer] Error procesando POST /api/usuarios:', parseErr);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(
                  JSON.stringify({
                    success: false,
                    message: 'Error interno en el servidor al persistir datos.'
                  })
                );
              }
            });
            return;
          }
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), jsonDbServerPlugin()],
  server: {
    port: 5173,
    open: false
  }
});
