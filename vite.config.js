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
          return { usuarios: [], sesionesActivas: [], bitacoraAccesos: [], foro_posts: [] };
        };

        // Helper para escribir db.json en ambos archivos físicos
        const writeDb = (dbData) => {
          const jsonStr = JSON.stringify(dbData, null, 2);
          fs.writeFileSync(servicesDbPath, jsonStr, 'utf-8');
          if (fs.existsSync(path.dirname(dataDbPath))) {
            fs.writeFileSync(dataDbPath, jsonStr, 'utf-8');
          }
        };

        // =====================================================================
        // RUTA 1: /api/usuarios y /usuarios (Gestión de usuarios y registros)
        // =====================================================================
        if (url === '/api/usuarios' || url === '/usuarios') {
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

        // =====================================================================
        // RUTA 2: /api/foro_posts y /foro_posts (Módulo 04: Foro Tico)
        // =====================================================================
        if (
          url === '/api/foro_posts' ||
          url === '/foro_posts' ||
          url.startsWith('/api/foro_posts/') ||
          url.startsWith('/foro_posts/')
        ) {
          // Extraer posible ID del path: /api/foro_posts/:id o /foro_posts/:id
          const cleanPath = url.replace(/^\/api/, '');
          const pathSegments = cleanPath.split('/').filter(Boolean);
          const postIdFromPath = pathSegments.length > 1 ? pathSegments[1] : null;

          // Manejo de CORS Preflight (OPTIONS)
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
            res.end();
            return;
          }

          // 1. GET: Consultar publicaciones (Nacional o filtrado por provincia)
          if (req.method === 'GET') {
            const db = readDb();
            if (!Array.isArray(db.foro_posts)) db.foro_posts = [];

            // Si se pide un post específico por ID
            const fullUrl = new URL(req.url, 'http://localhost');
            const idParam = fullUrl.searchParams.get('id') || postIdFromPath;
            if (idParam) {
              const single = db.foro_posts.find((p) => String(p.id) === String(idParam));
              if (!single) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Publicación no encontrada' }));
                return;
              }
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify(single));
              return;
            }

            // Filtrado por provincia:
            // "nacional" (o vacío): muestra feed nacional completo (nacional + todas las provincias)
            // Provincia específica: muestra solo publicaciones de esa provincia
            const provParam = fullUrl.searchParams.get('provinciaId');
            let resultado = [...db.foro_posts];

            if (provParam && provParam !== 'nacional' && provParam !== 'todas' && provParam !== 'all') {
              resultado = resultado.filter(
                (p) => String(p.provinciaId || '').toLowerCase() === provParam.toLowerCase()
              );
            }

            // Ordenar por fecha descendente (más recientes primero)
            resultado.sort((a, b) => new Date(b.fecha || 0).getTime() - new Date(a.fecha || 0).getTime());

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(resultado));
            return;
          }

          // 2. POST: Crear nueva publicación
          if (req.method === 'POST') {
            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                const data = JSON.parse(bodyStr || '{}');

                if (!data.titulo || !data.contenido) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(
                    JSON.stringify({
                      success: false,
                      message: 'El título y el contenido son obligatorios.'
                    })
                  );
                  return;
                }

                const db = readDb();
                if (!Array.isArray(db.foro_posts)) db.foro_posts = [];

                const provId = String(data.provinciaId || 'nacional').toLowerCase().trim();
                const provNombres = {
                  'nacional': 'Nacional (Todo el País)',
                  'san-jose': 'San José',
                  'alajuela': 'Alajuela',
                  'cartago': 'Cartago',
                  'heredia': 'Heredia',
                  'guanacaste': 'Guanacaste',
                  'puntarenas': 'Puntarenas',
                  'limon': 'Limón'
                };

                const newPost = {
                  id: data.id || `post-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
                  titulo: String(data.titulo).trim(),
                  contenido: String(data.contenido).trim(),
                  provinciaId: provId,
                  provinciaNombre: data.provinciaNombre || provNombres[provId] || 'Nacional',
                  categoria: data.categoria || 'Participación Ciudadana',
                  autorNombre: data.autorNombre || 'Ciudadano',
                  autorCedula: String(data.autorCedula || '1-1823-0456'),
                  fecha: data.fecha || new Date().toISOString(),
                  likes: Number(data.likes || 0),
                  dislikes: Number(data.dislikes || 0),
                  reacciones: data.reacciones || { apoyo: 0, urgente: 0, idea: 0 },
                  usuariosVotaron: data.usuariosVotaron || {},
                  comentarios: Array.isArray(data.comentarios) ? data.comentarios : []
                };

                db.foro_posts.unshift(newPost);
                writeDb(db);

                console.log(`[jsonDbServer] Post creado en Foro Tico: ${newPost.id} (${newPost.provinciaNombre})`);

                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify(newPost));
              } catch (err) {
                console.error('[jsonDbServer] Error en POST /api/foro_posts:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Error interno al guardar la publicación.' }));
              }
            });
            return;
          }

          // 3. PATCH / PUT: Actualizar votos, reacciones o agregar comentarios a un post
          if (req.method === 'PATCH' || req.method === 'PUT') {
            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                const updatePayload = JSON.parse(bodyStr || '{}');

                const targetPostId = postIdFromPath || updatePayload.id;
                if (!targetPostId) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ success: false, message: 'ID de publicación no especificado.' }));
                  return;
                }

                const db = readDb();
                if (!Array.isArray(db.foro_posts)) db.foro_posts = [];

                const postIndex = db.foro_posts.findIndex((p) => String(p.id) === String(targetPostId));
                if (postIndex === -1) {
                  res.statusCode = 404;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ success: false, message: 'Publicación no encontrada.' }));
                  return;
                }

                const post = { ...db.foro_posts[postIndex] };

                // Acción A: Votar (like / dislike) con prevención de votos duplicados por cédula
                if (updatePayload.action === 'votar') {
                  const { tipoVoto, cedula } = updatePayload;
                  const cleanCedula = String(cedula || '1-1823-0456');
                  const usuariosVotaron = { ...(post.usuariosVotaron || {}) };
                  let likes = Number(post.likes || 0);
                  let dislikes = Number(post.dislikes || 0);

                  const votoPrevio = usuariosVotaron[cleanCedula];

                  if (votoPrevio === tipoVoto) {
                    // Si vuelve a presionar el mismo botón, se retira el voto
                    delete usuariosVotaron[cleanCedula];
                    if (tipoVoto === 'like') likes = Math.max(0, likes - 1);
                    if (tipoVoto === 'dislike') dislikes = Math.max(0, dislikes - 1);
                  } else {
                    // Si ya tenía el voto opuesto, se resta del opuesto
                    if (votoPrevio === 'like') likes = Math.max(0, likes - 1);
                    if (votoPrevio === 'dislike') dislikes = Math.max(0, dislikes - 1);

                    // Se aplica el nuevo voto
                    usuariosVotaron[cleanCedula] = tipoVoto;
                    if (tipoVoto === 'like') likes += 1;
                    if (tipoVoto === 'dislike') dislikes += 1;
                  }

                  post.likes = likes;
                  post.dislikes = dislikes;
                  post.usuariosVotaron = usuariosVotaron;
                }
                // Acción B: Reaccionar (apoyo, urgente, idea)
                else if (updatePayload.action === 'reaccionar') {
                  const { tipoReaccion } = updatePayload;
                  const reacciones = { ...(post.reacciones || { apoyo: 0, urgente: 0, idea: 0 }) };
                  if (reacciones[tipoReaccion] !== undefined) {
                    reacciones[tipoReaccion] = (reacciones[tipoReaccion] || 0) + 1;
                  }
                  post.reacciones = reacciones;
                }
                // Acción C: Comentar en la publicación
                else if (updatePayload.action === 'comentar') {
                  const c = updatePayload.comentario || {};
                  if (!c.contenido) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.end(JSON.stringify({ success: false, message: 'El comentario no puede estar vacío.' }));
                    return;
                  }

                  const comentarios = Array.isArray(post.comentarios) ? [...post.comentarios] : [];
                  const nuevoComentario = {
                    id: `com-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
                    autorNombre: c.autorNombre || 'Ciudadano',
                    autorCedula: String(c.autorCedula || '1-1823-0456'),
                    contenido: String(c.contenido).trim(),
                    fecha: new Date().toISOString()
                  };
                  comentarios.push(nuevoComentario);
                  post.comentarios = comentarios;
                }
                // Acción D: Merge general de campos
                else {
                  Object.assign(post, updatePayload);
                }

                db.foro_posts[postIndex] = post;
                writeDb(db);

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify(post));
              } catch (err) {
                console.error('[jsonDbServer] Error en PATCH /api/foro_posts:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Error interno al actualizar la publicación.' }));
              }
            });
            return;
          }

          // 4. DELETE: Eliminar publicación
          if (req.method === 'DELETE') {
            const targetPostId = postIdFromPath;
            const db = readDb();
            if (!Array.isArray(db.foro_posts)) db.foro_posts = [];
            db.foro_posts = db.foro_posts.filter((p) => String(p.id) !== String(targetPostId));
            writeDb(db);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify({ success: true, message: 'Publicación eliminada correctamente.' }));
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
