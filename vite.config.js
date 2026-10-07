import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Normalización de texto (elimina tildes y diacríticos, convierte a minúsculas)
const normalizeStr = (str) => {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
};

// Hash criptográfico de cédula (Ley N° 8968: nunca en texto plano)
const hashCedula = (cedula) => {
  const clean = String(cedula || '').replace(/[^0-9]/g, '');
  return crypto.createHash('sha256').update(clean).digest('hex');
};

// Enmascaramiento de cédula oficial (e.g. 1-****-0789)
const maskCedula = (cedula) => {
  const clean = String(cedula || '').replace(/[^0-9]/g, '');
  if (clean.length < 4) return '***';
  return `${clean.slice(0, 1)}-****-${clean.slice(-4)}`;
};

function jsonDbServerPlugin() {
  return {
    name: 'vite-json-db-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';

        const rootDbPath = path.resolve(__dirname, 'db.json');

        // Helper para leer db.json exclusivamente desde la raíz (fuera de src/)
        const readDb = () => {
          let data = {
            usuarios: [],
            sesionesActivas: [],
            bitacoraAccesos: [],
            foro_posts: [],
            noticias: [],
            solicitudes_emprendedor: [],
            solicitudesComercio: [],
            publicacionesComercio: [],
            intentosLoginComercio: {},
            sanciones_foro: [],
            moderacionContenido: []
          };
          try {
            if (fs.existsSync(rootDbPath)) {
              data = JSON.parse(fs.readFileSync(rootDbPath, 'utf-8'));
            }
          } catch (err) {
            console.error('[jsonDbServer] Error leyendo db.json:', err);
          }
          if (!Array.isArray(data.usuarios)) data.usuarios = [];
          if (!Array.isArray(data.solicitudesComercio)) data.solicitudesComercio = [];
          if (!Array.isArray(data.solicitudes_emprendedor)) data.solicitudes_emprendedor = [];
          if (!Array.isArray(data.publicacionesComercio)) data.publicacionesComercio = [];
          if (!data.intentosLoginComercio || typeof data.intentosLoginComercio !== 'object') data.intentosLoginComercio = {};
          if (!Array.isArray(data.foro_posts)) data.foro_posts = [];
          if (!Array.isArray(data.sanciones_foro)) data.sanciones_foro = [];
          if (!Array.isArray(data.moderacionContenido)) data.moderacionContenido = [];
          return data;
        };

        // Helper para escribir db.json únicamente en la raíz desacoplada de Vite
        const writeDb = (dbData) => {
          const jsonStr = JSON.stringify(dbData, null, 2);
          fs.writeFileSync(rootDbPath, jsonStr, 'utf-8');
        };

        // Helper para verificar en el servidor si una cédula presenta sanción activa no vencida
        const tieneSancionVigente = (db, cedula) => {
          if (!cedula) return null;
          const cleanCed = String(cedula).replace(/[^0-9]/g, '');
          if (!Array.isArray(db.usuarios)) return null;

          const u = db.usuarios.find((user) => {
            const uCed = String(user.cedula || '').replace(/[^0-9]/g, '');
            return user.cedula === cedula || (cleanCed && uCed === cleanCed);
          });

          if (!u || !u.sancion || !u.sancion.activa) return null;

          // Si la suspensión tiene fecha de fin y ya expiró, auto-levantar en db.json
          if (!u.sancion.indefinida && u.sancion.fin) {
            const finTime = new Date(u.sancion.fin).getTime();
            if (!isNaN(finTime) && finTime <= Date.now()) {
              u.sancion.activa = false;
              writeDb(db);
              return null;
            }
          }

          return { usuario: u, sancion: u.sancion };
        };

        // =====================================================================
        // RUTA 0: /api/solicitudes_emprendedor (Trámites de Emprendedor Ciudadano)
        // =====================================================================
        if (
          url === '/api/solicitudes_emprendedor' ||
          url === '/solicitudes_emprendedor' ||
          url.startsWith('/api/solicitudes_emprendedor/') ||
          url.startsWith('/solicitudes_emprendedor/')
        ) {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
            res.end();
            return;
          }

          if (req.method === 'GET') {
            const db = readDb();
            if (!Array.isArray(db.solicitudes_emprendedor)) db.solicitudes_emprendedor = [];
            const fullUrl = new URL(req.url, 'http://localhost');
            const cedulaParam = fullUrl.searchParams.get('cedula');
            let resultado = [...db.solicitudes_emprendedor];
            if (cedulaParam) {
              const cleanCed = cedulaParam.replace(/[^0-9]/g, '');
              resultado = resultado.filter(
                (s) => s.cedula === cedulaParam || (s.cedula && s.cedula.replace(/[^0-9]/g, '') === cleanCed)
              );
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(resultado));
            return;
          }

          if (req.method === 'POST') {
            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                const data = JSON.parse(bodyStr || '{}');

                if (!data.cedula || !data.correoComercial || !data.nombreEmprendimiento) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(
                    JSON.stringify({
                      success: false,
                      message: 'La cédula, el correo comercial y el nombre del emprendimiento son obligatorios.'
                    })
                  );
                  return;
                }

                const db = readDb();
                if (!Array.isArray(db.solicitudes_emprendedor)) db.solicitudes_emprendedor = [];
                if (!Array.isArray(db.solicitudesComercio)) db.solicitudesComercio = [];

                const nuevaSolicitud = {
                  id: data.id || `SOL-EMP-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
                  usuarioId: data.usuarioId || undefined,
                  cedula: String(data.cedula).trim(),
                  nombreCompleto: String(data.nombreCompleto || 'Ciudadano Solicitante').trim(),
                  correoPersonal: String(data.correoPersonal || '').trim(),
                  correoComercial: String(data.correoComercial).toLowerCase().trim(),
                  nombreEmprendimiento: String(data.nombreEmprendimiento).trim(),
                  categoriaComercial: data.categoriaComercial || 'Comercio Local',
                  canton: data.canton || 'San José',
                  provincia: data.provincia || 'San José',
                  justificacion: String(data.justificacion || '').trim(),
                  estado: 'pendiente',
                  fechaSolicitud: data.fechaSolicitud || new Date().toISOString()
                };

                // Guardar en la colección de solicitudes_emprendedor
                db.solicitudes_emprendedor.unshift(nuevaSolicitud);

                // También reflejar en solicitudesComercio para el panel de administración
                const solComercioItem = {
                  id: nuevaSolicitud.id,
                  usuarioId: nuevaSolicitud.usuarioId,
                  cedulaJuridica: nuevaSolicitud.cedula,
                  cedula: nuevaSolicitud.cedula,
                  nombreComercio: nuevaSolicitud.nombreEmprendimiento,
                  nombreNegocio: nuevaSolicitud.nombreEmprendimiento,
                  nombreSolicitante: nuevaSolicitud.nombreCompleto,
                  actividadHacienda: nuevaSolicitud.justificacion,
                  actividadEconomicaHacienda: nuevaSolicitud.justificacion,
                  canton: nuevaSolicitud.canton,
                  provincia: nuevaSolicitud.provincia,
                  sectorFeriaSolicitado: `Categoría: ${nuevaSolicitud.categoriaComercial}`,
                  sectorFeria: `Categoría: ${nuevaSolicitud.categoriaComercial}`,
                  fechaSolicitud: nuevaSolicitud.fechaSolicitud,
                  estado: 'PENDIENTE',
                  justificacion: nuevaSolicitud.justificacion,
                  notas: `Trámite Emprendedor. Nuevo correo comercial: ${nuevaSolicitud.correoComercial}`,
                  verificadoHacienda: true
                };
                db.solicitudesComercio.unshift(solComercioItem);

                writeDb(db);
                console.log(`[jsonDbServer] Solicitud de emprendedor registrada: ${nuevaSolicitud.id} (${nuevaSolicitud.cedula})`);

                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: true, data: nuevaSolicitud }));
              } catch (err) {
                console.error('[jsonDbServer] Error en POST /api/solicitudes_emprendedor:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Error al persistir la solicitud.' }));
              }
            });
            return;
          }

          if (req.method === 'PATCH' || req.method === 'PUT') {
            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                const updatePayload = JSON.parse(bodyStr || '{}');
                const targetId = updatePayload.id;

                const db = readDb();
                if (!Array.isArray(db.solicitudes_emprendedor)) db.solicitudes_emprendedor = [];
                const idx = db.solicitudes_emprendedor.findIndex((s) => s.id === targetId);

                if (idx !== -1) {
                  db.solicitudes_emprendedor[idx] = {
                    ...db.solicitudes_emprendedor[idx],
                    ...updatePayload,
                    fechaResolucion: new Date().toISOString()
                  };

                  // Si se aprueba, actualizar rol del usuario a Emprendedor
                  if (updatePayload.estado === 'aprobado' || updatePayload.estado === 'APROBADO') {
                    const solCed = db.solicitudes_emprendedor[idx].cedula;
                    const cleanCed = solCed.replace(/[^0-9]/g, '');
                    if (Array.isArray(db.usuarios)) {
                      const uIdx = db.usuarios.findIndex(
                        (u) => u.cedula === solCed || (u.cedula && u.cedula.replace(/[^0-9]/g, '') === cleanCed)
                      );
                      if (uIdx !== -1) {
                        db.usuarios[uIdx].rol = 'Emprendedor';
                        db.usuarios[uIdx].isComerciante = true;
                      }
                    }
                  }

                  writeDb(db);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ success: true, data: db.solicitudes_emprendedor[idx] }));
                  return;
                }

                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Solicitud no encontrada.' }));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Error actualizando solicitud.' }));
              }
            });
            return;
          }
        }

        // =====================================================================
        // RUTA 0.1: /api/comercio/login (Autenticación Nombre + Cédula con Hash y Rate Limiting)
        // =====================================================================
        if (url === '/api/comercio/login') {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
            res.end();
            return;
          }

          if (req.method === 'POST') {
            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                const { nombreSolicitante, cedula } = JSON.parse(bodyStr || '{}');

                if (!nombreSolicitante || !cedula) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ success: false, message: 'El nombre del solicitante y la cédula son obligatorios.' }));
                  return;
                }

                const normNombre = normalizeStr(nombreSolicitante);
                const cleanCedula = String(cedula).replace(/[^0-9]/g, '');
                const clientIp = req.socket?.remoteAddress || '127.0.0.1';
                const rateKey = `comercio_${cleanCedula || clientIp}`;

                const db = readDb();
                if (!db.intentosLoginComercio) db.intentosLoginComercio = {};

                const now = Date.now();
                const intentoActual = db.intentosLoginComercio[rateKey] || { intentos: 0, bloqueadoHasta: 0 };

                // Control estricto de Rate Limiting y Bloqueo Temporal (15 min)
                if (intentoActual.bloqueadoHasta && intentoActual.bloqueadoHasta > now) {
                  const segRestantes = Math.ceil((intentoActual.bloqueadoHasta - now) / 1000);
                  const minRestantes = Math.ceil(segRestantes / 60);
                  res.statusCode = 429;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(
                    JSON.stringify({
                      success: false,
                      bloqueado: true,
                      segundosRestantes: segRestantes,
                      message: `Acceso temporalmente suspendido por múltiples intentos fallidos. Intente de nuevo en ${minRestantes} minuto(s).`
                    })
                  );
                  return;
                }

                // Si expiró el bloqueo anterior, reiniciar contador
                if (intentoActual.bloqueadoHasta && intentoActual.bloqueadoHasta <= now) {
                  intentoActual.intentos = 0;
                  intentoActual.bloqueadoHasta = 0;
                }

                // Buscar en solicitudesComercio y usuarios
                const solMatch = db.solicitudesComercio.find((s) => {
                  const sCed = String(s.cedula || s.cedulaJuridica || '').replace(/[^0-9]/g, '');
                  const sNom = normalizeStr(s.nombreSolicitante || s.nombreCompleto || '');
                  return sCed === cleanCedula && (sNom === normNombre || sNom.includes(normNombre) || normNombre.includes(sNom));
                });

                const userMatch = db.usuarios.find((u) => {
                  const uCed = String(u.cedula || '').replace(/[^0-9]/g, '');
                  const uNom = normalizeStr(u.nombre || '');
                  return uCed === cleanCedula && (uNom === normNombre || uNom.includes(normNombre) || normNombre.includes(uNom));
                });

                // Si no coincide credencial ni en solicitudes ni en usuarios -> Error genérico (sin filtrar cuál falló)
                if (!solMatch && !userMatch) {
                  intentoActual.intentos = (intentoActual.intentos || 0) + 1;
                  if (intentoActual.intentos >= 5) {
                    intentoActual.bloqueadoHasta = now + 15 * 60 * 1000;
                  }
                  db.intentosLoginComercio[rateKey] = intentoActual;
                  writeDb(db);

                  res.statusCode = 401;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(
                    JSON.stringify({
                      success: false,
                      intentosRestantes: Math.max(0, 5 - intentoActual.intentos),
                      message: 'Credenciales inválidas.'
                    })
                  );
                  return;
                }

                // Evaluar estado de aprobación
                const estado = String(
                  solMatch?.estado ||
                  (userMatch?.rol?.toLowerCase().includes('comerciante') || userMatch?.isComerciante ? 'aprobado' : 'pendiente')
                ).toLowerCase();

                if (estado === 'pendiente') {
                  res.statusCode = 403;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(
                    JSON.stringify({
                      success: false,
                      estado: 'pendiente',
                      message: 'Tu solicitud de comercio se encuentra en estado PENDIENTE de revisión por la administración municipal.'
                    })
                  );
                  return;
                }

                if (estado === 'rechazado') {
                  const motivo = solMatch?.motivoRechazo || 'Incumplimiento de requisitos reglamentarios cantonales.';
                  res.statusCode = 403;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(
                    JSON.stringify({
                      success: false,
                      estado: 'rechazado',
                      motivoRechazo: motivo,
                      message: `Tu solicitud de acreditación comercial fue RECHAZADA. Motivo: ${motivo}`
                    })
                  );
                  return;
                }

                // Acceso APROBADO: resetear intentos fallidos
                delete db.intentosLoginComercio[rateKey];
                writeDb(db);

                // Formatear usuario y comercio SIN exponer cédula en texto plano (Ley N° 8968)
                const targetUser = userMatch || {
                  id: solMatch?.usuarioId || `USR-COM-${Date.now()}`,
                  nombre: solMatch?.nombreSolicitante,
                  rol: 'Comerciante y Emprendedor',
                  nivelAcceso: 3,
                  isComerciante: true,
                  canton: solMatch?.canton || 'San José',
                  provincia: solMatch?.provincia || 'San José',
                  correo: solMatch?.correoComercial || solMatch?.correoPersonal || 'comercio@costaricaunidos.gob.cr'
                };

                const masked = maskCedula(cleanCedula);
                const cHash = hashCedula(cleanCedula);

                const sanitizedUser = {
                  id: targetUser.id,
                  nombre: targetUser.nombre,
                  email: targetUser.correo || targetUser.email,
                  correo: targetUser.correo || targetUser.email,
                  rol: 'Comerciante y Emprendedor',
                  rolOficial: 'COMERCIANTE',
                  nivelAcceso: 3,
                  isComerciante: true,
                  canton: targetUser.canton || solMatch?.canton || 'San José',
                  provincia: targetUser.provincia || solMatch?.provincia || 'San José',
                  cedulaMascara: masked,
                  token: `TOKEN_COM_${cHash.slice(0, 16)}_${Date.now()}`
                };

                const sanitizedComercio = {
                  id: solMatch?.id || 'SOL-COM-003',
                  nombreComercio: solMatch?.nombreComercio || solMatch?.nombreNegocio || 'Cafetería y Tostaduría Alma Tica',
                  nombreSolicitante: solMatch?.nombreSolicitante || targetUser.nombre,
                  categoria: solMatch?.categoria || solMatch?.categoriaComercial || 'Gastronomía y Café',
                  patenteCantonal: solMatch?.patenteCantonal || 'PAT-MSJ-2026-8812',
                  descripcion: solMatch?.descripcion || 'Comercio local con patente cantonal y acreditación oficial.',
                  contacto: solMatch?.contacto || targetUser.correo || '+506 2221-4589',
                  canton: solMatch?.canton || targetUser.canton || 'San José',
                  provincia: solMatch?.provincia || targetUser.provincia || 'San José',
                  estado: 'aprobado',
                  verificado: true
                };

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(
                  JSON.stringify({
                    success: true,
                    token: sanitizedUser.token,
                    user: sanitizedUser,
                    comercio: sanitizedComercio
                  })
                );
              } catch (loginErr) {
                console.error('[jsonDbServer] Error en POST /api/comercio/login:', loginErr);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Error interno en autenticación comercial.' }));
              }
            });
            return;
          }
        }

        // =====================================================================
        // RUTA 0.2: /api/solicitudesComercio y /solicitudesComercio (Bandeja Admin)
        // =====================================================================
        if (
          url === '/api/solicitudesComercio' ||
          url === '/solicitudesComercio' ||
          url.startsWith('/api/solicitudesComercio/') ||
          url.startsWith('/solicitudesComercio/')
        ) {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, x-user-role');
            res.end();
            return;
          }

          const cleanPath = url.replace(/^\/api/, '');
          const segments = cleanPath.split('/').filter(Boolean);
          const targetId = segments.length > 1 ? decodeURIComponent(segments[1]) : null;

          if (req.method === 'GET') {
            const db = readDb();
            let lista = [...db.solicitudesComercio];
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(lista));
            return;
          }

          if (req.method === 'PATCH' || req.method === 'PUT') {
            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                const updatePayload = JSON.parse(bodyStr || '{}');
                const solId = targetId || updatePayload.id;

                const db = readDb();
                const idx = db.solicitudesComercio.findIndex((s) => s.id === solId);
                if (idx === -1) {
                  res.statusCode = 404;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ success: false, message: 'Solicitud comercial no encontrada.' }));
                  return;
                }

                const fechaNow = new Date().toISOString();
                const nuevoEstado = String(updatePayload.estado || db.solicitudesComercio[idx].estado).toLowerCase();

                db.solicitudesComercio[idx] = {
                  ...db.solicitudesComercio[idx],
                  ...updatePayload,
                  estado: nuevoEstado,
                  fechaResolucion: fechaNow
                };

                // Si es APROBADO: otorgar rol de Comerciante y Emprendedor (Nivel 3)
                if (nuevoEstado === 'aprobado') {
                  const sol = db.solicitudesComercio[idx];
                  sol.verificado = true;
                  sol.verificadoHacienda = true;

                  const cleanCed = String(sol.cedula || sol.cedulaJuridica || '').replace(/[^0-9]/g, '');
                  const uIdx = db.usuarios.findIndex((u) => {
                    const uCed = String(u.cedula || '').replace(/[^0-9]/g, '');
                    return (cleanCed && uCed === cleanCed) || (sol.usuarioId && u.id === sol.usuarioId);
                  });

                  if (uIdx !== -1) {
                    db.usuarios[uIdx].rol = 'Comerciante y Emprendedor';
                    db.usuarios[uIdx].nivelAcceso = 3;
                    db.usuarios[uIdx].isComerciante = true;
                  }
                }

                // Sincronizar en solicitudes_emprendedor si existe
                const empIdx = db.solicitudes_emprendedor.findIndex((e) => e.id === solId);
                if (empIdx !== -1) {
                  db.solicitudes_emprendedor[empIdx] = {
                    ...db.solicitudes_emprendedor[empIdx],
                    estado: nuevoEstado,
                    motivoRechazo: updatePayload.motivoRechazo || null,
                    fechaResolucion: fechaNow
                  };
                }

                writeDb(db);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: true, data: db.solicitudesComercio[idx] }));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Error actualizando solicitud de comercio.' }));
              }
            });
            return;
          }
        }

        // =====================================================================
        // RUTA 0.3: /api/comercio/publicaciones (CRUD y Feed de Comercios)
        // =====================================================================
        if (
          url === '/api/comercio/publicaciones' ||
          url.startsWith('/api/comercio/publicaciones/')
        ) {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
            res.end();
            return;
          }

          const segments = url.replace(/^\/api\/comercio\/publicaciones/, '').split('/').filter(Boolean);
          const pubId = segments.length > 0 ? decodeURIComponent(segments[0]) : null;

          if (req.method === 'GET') {
            const db = readDb();
            const fullUrl = new URL(req.url, 'http://localhost');
            const comercioId = fullUrl.searchParams.get('comercioId');
            const misPublicaciones = fullUrl.searchParams.get('misPublicaciones') === 'true';
            const excluirComercioId = fullUrl.searchParams.get('excluirComercioId');

            let lista = [...db.publicacionesComercio];

            if (misPublicaciones && comercioId) {
              lista = lista.filter((p) => p.comercioId === comercioId || p.usuarioId === comercioId);
            } else if (excluirComercioId) {
              lista = lista.filter((p) => p.comercioId !== excluirComercioId && p.usuarioId !== excluirComercioId);
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(lista));
            return;
          }

          if (req.method === 'POST') {
            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                const data = JSON.parse(bodyStr || '{}');

                if (!data.titulo || !data.descripcion) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ success: false, message: 'El título y la descripción son requeridos.' }));
                  return;
                }

                const db = readDb();
                const nuevaPub = {
                  id: data.id || `PUB-COM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
                  comercioId: data.comercioId || 'SOL-COM-003',
                  usuarioId: data.usuarioId || 'USR-COM-001',
                  nombreComercio: data.nombreComercio || 'Cafetería y Tostaduría Alma Tica',
                  nombreSolicitante: data.nombreSolicitante || 'Carlos Hernández Rojas',
                  titulo: String(data.titulo).trim(),
                  descripcion: String(data.descripcion).trim(),
                  categoria: data.categoria || 'Gastronomía y Café',
                  imagenUrl: data.imagenUrl || 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80',
                  precio: data.precio || '',
                  contacto: data.contacto || '+506 2221-4589',
                  canton: data.canton || 'San José',
                  provincia: data.provincia || 'San José',
                  fechaPublicacion: data.fechaPublicacion || new Date().toISOString(),
                  metricas: {
                    vistas: 1,
                    likes: 0,
                    comentarios: 0,
                    contactos: 0
                  }
                };

                db.publicacionesComercio.unshift(nuevaPub);
                writeDb(db);

                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: true, data: nuevaPub }));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Error al registrar la publicación.' }));
              }
            });
            return;
          }

          if (req.method === 'PATCH' || req.method === 'PUT') {
            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                const updatePayload = JSON.parse(bodyStr || '{}');
                const targetPubId = pubId || updatePayload.id;

                const db = readDb();
                const idx = db.publicacionesComercio.findIndex((p) => p.id === targetPubId);
                if (idx === -1) {
                  res.statusCode = 404;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ success: false, message: 'Publicación no encontrada.' }));
                  return;
                }

                db.publicacionesComercio[idx] = {
                  ...db.publicacionesComercio[idx],
                  ...updatePayload,
                  fechaModificacion: new Date().toISOString()
                };

                writeDb(db);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: true, data: db.publicacionesComercio[idx] }));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Error actualizando publicación.' }));
              }
            });
            return;
          }

          if (req.method === 'DELETE') {
            const db = readDb();
            const initialLen = db.publicacionesComercio.length;
            db.publicacionesComercio = db.publicacionesComercio.filter((p) => p.id !== pubId);

            if (db.publicacionesComercio.length < initialLen) {
              writeDb(db);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({ success: true, message: 'Publicación eliminada correctamente.' }));
              return;
            }

            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify({ success: false, message: 'Publicación no encontrada.' }));
            return;
          }
        }

        // =====================================================================
        // RUTA 0.4: /api/comercio/metricas (Gráficos de Actividad y Crecimiento)
        // =====================================================================
        if (url === '/api/comercio/metricas' || url.startsWith('/api/comercio/metricas')) {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
            res.end();
            return;
          }

          if (req.method === 'GET') {
            const db = readDb();
            const fullUrl = new URL(req.url, 'http://localhost');
            const comercioId = fullUrl.searchParams.get('comercioId') || 'SOL-COM-003';
            const periodo = fullUrl.searchParams.get('periodo') || '30d'; // '30d' | '6m' | '12m'

            const pubsComercio = db.publicacionesComercio.filter(
              (p) => p.comercioId === comercioId || p.usuarioId === comercioId || p.usuarioId === 'USR-COM-001'
            );

            // Nombres de meses en español Costa Rica
            const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];

            // Construir los últimos 12 meses
            const hoy = new Date();
            const ultimos12Meses = [];
            for (let i = 11; i >= 0; i--) {
              const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
              const mesIdx = d.getMonth();
              const anio = d.getFullYear();
              ultimos12Meses.push({
                clave: `${anio}-${String(mesIdx + 1).padStart(2, '0')}`,
                mesNombre: MESES[mesIdx],
                anio: anio,
                cantidad: 0,
                interacciones: 0
              });
            }

            // Agrupar publicaciones por mes
            pubsComercio.forEach((p) => {
              const f = new Date(p.fechaPublicacion);
              if (!isNaN(f.getTime())) {
                const clave = `${f.getFullYear()}-${String(f.getMonth() + 1).padStart(2, '0')}`;
                const entry = ultimos12Meses.find((m) => m.clave === clave);
                if (entry) {
                  entry.cantidad += 1;
                  const totalInter =
                    (p.metricas?.vistas || 0) +
                    (p.metricas?.likes || 0) +
                    (p.metricas?.comentarios || 0) +
                    (p.metricas?.contactos || 0);
                  entry.interacciones += totalInter;
                }
              }
            });

            // Gráfico 2: Interacciones por publicación (ordenadas por fecha más reciente)
            const interaccionesPorPublicacion = pubsComercio.slice(0, 8).map((p) => ({
              id: p.id,
              titulo: p.titulo,
              vistas: p.metricas?.vistas || 0,
              likes: p.metricas?.likes || 0,
              comentarios: p.metricas?.comentarios || 0,
              contactos: p.metricas?.contactos || 0,
              totalInteracciones:
                (p.metricas?.vistas || 0) +
                (p.metricas?.likes || 0) +
                (p.metricas?.comentarios || 0) +
                (p.metricas?.contactos || 0)
            }));

            // Calcular crecimiento según selector (30d, 6m, 12m)
            let diasPeriodo = 30;
            if (periodo === '6m') diasPeriodo = 180;
            if (periodo === '12m') diasPeriodo = 365;

            const ahoraTime = hoy.getTime();
            const limiteActual = ahoraTime - diasPeriodo * 24 * 60 * 60 * 1000;
            const limiteAnterior = ahoraTime - diasPeriodo * 2 * 24 * 60 * 60 * 1000;

            const pubsActual = pubsComercio.filter((p) => {
              const t = new Date(p.fechaPublicacion).getTime();
              return t >= limiteActual && t <= ahoraTime;
            });

            const pubsAnterior = pubsComercio.filter((p) => {
              const t = new Date(p.fechaPublicacion).getTime();
              return t >= limiteAnterior && t < limiteActual;
            });

            const calcMetric = (fn) => {
              const act = pubsActual.reduce((acc, p) => acc + fn(p), 0);
              const ant = pubsAnterior.reduce((acc, p) => acc + fn(p), 0);

              let variacion = 0;
              let tendencia = 'neutral';
              let sinDatosPrevios = false;

              if (ant === 0 && act === 0) {
                variacion = 0;
                sinDatosPrevios = true;
                tendencia = 'neutral';
              } else if (ant === 0 && act > 0) {
                variacion = 100;
                tendencia = 'up';
              } else {
                const diff = act - ant;
                variacion = Math.round((diff / ant) * 100);
                if (variacion > 0) tendencia = 'up';
                else if (variacion < 0) tendencia = 'down';
                else tendencia = 'neutral';
              }

              return {
                actual: act,
                anterior: ant,
                variacion,
                tendencia,
                sinDatosPrevios
              };
            };

            const crecimientoPublicaciones = calcMetric(() => 1);
            const crecimientoInteracciones = calcMetric(
              (p) =>
                (p.metricas?.vistas || 0) +
                (p.metricas?.likes || 0) +
                (p.metricas?.comentarios || 0)
            );
            const crecimientoContactos = calcMetric((p) => p.metricas?.contactos || 0);

            // Generar texto resumen automático inteligente
            let textoResumen = 'Tu comercio mantiene un nivel de actividad estable en el cantón.';
            if (crecimientoInteracciones.variacion > 0) {
              const etiquetaPeriodo = periodo === '30d' ? 'este mes' : periodo === '6m' ? 'este semestre' : 'este año';
              textoResumen = `¡Excelente avance! Tu comercio creció un ${crecimientoInteracciones.variacion} % en interacciones ${etiquetaPeriodo}.`;
            } else if (crecimientoInteracciones.variacion < 0) {
              textoResumen = `Las interacciones variaron un ${Math.abs(crecimientoInteracciones.variacion)} % respecto al período anterior. Recomendamos publicar nuevos productos.`;
            } else if (crecimientoInteracciones.sinDatosPrevios) {
              textoResumen = 'Comenzando el registro de actividad comercial en la plataforma.';
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(
              JSON.stringify({
                success: true,
                data: {
                  publicacionesPorMes: ultimos12Meses,
                  interaccionesPorPublicacion,
                  crecimiento: {
                    periodo,
                    publicaciones: crecimientoPublicaciones,
                    interacciones: crecimientoInteracciones,
                    contactos: crecimientoContactos,
                    textoResumen
                  }
                }
              })
            );
            return;
          }
        }

        // =====================================================================
        // RUTA 0.5: /api/comercio/perfil (Detalles públicos del comercio)
        // =====================================================================
        if (url === '/api/comercio/perfil' || url.startsWith('/api/comercio/perfil')) {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, PUT, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
            res.end();
            return;
          }

          if (req.method === 'GET') {
            const db = readDb();
            const fullUrl = new URL(req.url, 'http://localhost');
            const comercioId = fullUrl.searchParams.get('comercioId') || 'SOL-COM-003';

            const sol = db.solicitudesComercio.find((s) => s.id === comercioId || s.usuarioId === comercioId) || db.solicitudesComercio[0];

            if (!sol) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({ success: false, message: 'Perfil comercial no encontrado.' }));
              return;
            }

            // Sanitizado: NO incluir cédula en texto plano
            const perfil = {
              id: sol.id,
              usuarioId: sol.usuarioId,
              nombreComercio: sol.nombreComercio || sol.nombreNegocio,
              nombreSolicitante: sol.nombreSolicitante,
              categoria: sol.categoria || sol.categoriaComercial || 'Comercio General',
              patenteCantonal: sol.patenteCantonal || 'PAT-MSJ-2026-8812',
              descripcion: sol.descripcion || 'Comercio local verificado.',
              contacto: sol.contacto || '+506 2221-4589',
              canton: sol.canton || 'San José',
              provincia: sol.provincia || 'San José',
              estado: sol.estado || 'aprobado',
              verificado: sol.verificado ?? true,
              fechaAcreditacion: sol.fechaResolucion || sol.fechaSolicitud
            };

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify({ success: true, data: perfil }));
            return;
          }

          if (req.method === 'PATCH' || req.method === 'PUT') {
            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                const updatePayload = JSON.parse(bodyStr || '{}');
                const comercioId = updatePayload.id || 'SOL-COM-003';

                const db = readDb();
                const idx = db.solicitudesComercio.findIndex((s) => s.id === comercioId || s.usuarioId === comercioId);

                if (idx !== -1) {
                  if (updatePayload.descripcion) db.solicitudesComercio[idx].descripcion = updatePayload.descripcion;
                  if (updatePayload.contacto) db.solicitudesComercio[idx].contacto = updatePayload.contacto;
                  if (updatePayload.categoria) db.solicitudesComercio[idx].categoria = updatePayload.categoria;
                  if (updatePayload.nombreComercio) {
                    db.solicitudesComercio[idx].nombreComercio = updatePayload.nombreComercio;
                    db.solicitudesComercio[idx].nombreNegocio = updatePayload.nombreComercio;
                  }

                  writeDb(db);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ success: true, data: db.solicitudesComercio[idx] }));
                  return;
                }

                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Comercio no encontrado.' }));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Error actualizando perfil comercial.' }));
              }
            });
            return;
          }
        }

        // =====================================================================
        // RUTA 1: /api/usuarios y /usuarios (Gestión de usuarios y registros)
        // =====================================================================
        if (
          url === '/api/usuarios' ||
          url === '/usuarios' ||
          url.startsWith('/api/usuarios/') ||
          url.startsWith('/usuarios/')
        ) {
          // 1. Manejo de OPTIONS (Preflight)
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
            res.end();
            return;
          }

          // 2. Manejo de DELETE (Eliminar físicamente de db.json en disco)
          if (req.method === 'DELETE') {
            const cleanPath = url.replace(/^\/api/, '');
            const segments = cleanPath.split('/').filter(Boolean);
            const idToDelete = segments.length > 1 ? decodeURIComponent(segments[1]) : null;

            if (!idToDelete) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({ success: false, message: 'ID de usuario no proporcionado.' }));
              return;
            }

            const db = readDb();
            if (!Array.isArray(db.usuarios)) db.usuarios = [];

            const initialLength = db.usuarios.length;
            db.usuarios = db.usuarios.filter(
              (u) => String(u.id) !== String(idToDelete) && String(u.cedula) !== String(idToDelete)
            );

            if (db.usuarios.length < initialLength) {
              if (Array.isArray(db.sesionesActivas)) {
                db.sesionesActivas = db.sesionesActivas.filter((s) => String(s.usuarioId) !== String(idToDelete));
              }
              if (Array.isArray(db.bitacoraAccesos)) {
                db.bitacoraAccesos.push({
                  id: `LOG-${Date.now().toString().slice(-4)}`,
                  usuarioId: idToDelete,
                  accion: 'BAJA_DEFINITIVA_USUARIO',
                  detalles: `Eliminación física del usuario ${idToDelete} de db.json bajo Ley N° 8292.`,
                  timestamp: new Date().toISOString()
                });
              }

              writeDb(db);
              console.log(`[jsonDbServer] Usuario ${idToDelete} eliminado físicamente de db.json`);

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify({ success: true, message: `Usuario ${idToDelete} eliminado físicamente.` }));
              return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify({ success: true, message: 'El usuario ya no se encuentra en db.json.' }));
            return;
          }

          // 2.1 Manejo de PATCH / PUT (Actualizar parcialmente datos de usuario en db.json)
          if (req.method === 'PATCH' || req.method === 'PUT') {
            const cleanPath = url.replace(/^\/api/, '');
            const segments = cleanPath.split('/').filter(Boolean);
            const idToUpdate = segments.length > 1 ? decodeURIComponent(segments[1]) : null;

            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                const cambios = JSON.parse(bodyStr || '{}');

                const db = readDb();
                if (!Array.isArray(db.usuarios)) db.usuarios = [];

                const userIndex = db.usuarios.findIndex(
                  (u) => String(u.id) === String(idToUpdate) || String(u.cedula) === String(idToUpdate)
                );

                if (userIndex === -1) {
                  res.statusCode = 404;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ success: false, message: 'Usuario no encontrado en db.json.' }));
                  return;
                }

                db.usuarios[userIndex] = {
                  ...db.usuarios[userIndex],
                  ...cambios
                };

                if (Array.isArray(db.bitacoraAccesos)) {
                  db.bitacoraAccesos.push({
                    id: `LOG-${Date.now().toString().slice(-4)}`,
                    usuarioId: db.usuarios[userIndex].id,
                    usuarioNombre: db.usuarios[userIndex].nombre,
                    rol: db.usuarios[userIndex].rol,
                    accion: 'ACTUALIZACION_USUARIO',
                    detalles: `Actualización de usuario ${db.usuarios[userIndex].nombre} (Rol: ${db.usuarios[userIndex].rol}, Nivel: ${db.usuarios[userIndex].nivelAcceso}).`,
                    timestamp: new Date().toISOString()
                  });
                }

                writeDb(db);
                console.log(`[jsonDbServer] Usuario ${idToUpdate} actualizado físicamente en db.json`);

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: true, user: db.usuarios[userIndex] }));
              } catch (err) {
                console.error('[jsonDbServer] Error en PATCH /api/usuarios:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Error interno al actualizar usuario.' }));
              }
            });
            return;
          }

          // 3. Manejo de GET (Listar usuarios)
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
            // "nacional": muestra publicaciones de alcance nacional
            // Provincia específica ("san-jose", etc.): muestra solo publicaciones de esa provincia
            // "todas" / "all" / no provisto: muestra todas las publicaciones
            const provParam = fullUrl.searchParams.get('provinciaId');
            let resultado = [...db.foro_posts];

            if (provParam && provParam !== 'todas' && provParam !== 'all') {
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

                // =====================================================================
                // VALIDACIÓN EN SERVIDOR: RECHAZAR CON 403 SI EL AUTOR TIENE SANCIÓN
                // =====================================================================
                const sancionAutor = tieneSancionVigente(db, data.autorCedula);
                if (sancionAutor) {
                  res.statusCode = 403;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(
                    JSON.stringify({
                      success: false,
                      error: 'USUARIO_SANCIONADO',
                      message: `Acción rechazada por el servidor (403): Su cuenta presenta una suspensión activa (${sancionAutor.sancion.nivel || 'Baneo'}). Motivo: ${sancionAutor.sancion.motivo || 'Infracción a las Reglas de Convivencia Cívica'}.`,
                      sancion: sancionAutor.sancion
                    })
                  );
                  return;
                }

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

                  // Validación 403 en servidor para votantes sancionados
                  const sancionVotante = tieneSancionVigente(db, cleanCedula);
                  if (sancionVotante) {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.end(
                      JSON.stringify({
                        success: false,
                        error: 'USUARIO_SANCIONADO',
                        message: 'Acción bloqueada (403): Su cuenta ciudadana presenta una sanción vigente y no puede emitir votos.',
                        sancion: sancionVotante.sancion
                      })
                    );
                    return;
                  }

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

                  // Validación 403 en servidor para comentarios de autores sancionados
                  const sancionComentador = tieneSancionVigente(db, c.autorCedula);
                  if (sancionComentador) {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.end(
                      JSON.stringify({
                        success: false,
                        error: 'USUARIO_SANCIONADO',
                        message: `Acción bloqueada por el servidor (403): Su cuenta presenta una suspensión activa (${sancionComentador.sancion.nivel || 'Baneo'}). Motivo: ${sancionComentador.sancion.motivo || 'Infracción a las Reglas de Convivencia Cívica'}.`,
                        sancion: sancionComentador.sancion
                      })
                    );
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

        // =====================================================================
        // RUTA 2.1: /api/sanciones_foro (Historial de Sanciones Graduales del Foro)
        // =====================================================================
        if (
          url === '/api/sanciones_foro' ||
          url === '/sanciones_foro' ||
          url.startsWith('/api/sanciones_foro/') ||
          url.startsWith('/sanciones_foro/')
        ) {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
            res.end();
            return;
          }

          if (req.method === 'GET') {
            const db = readDb();
            if (!Array.isArray(db.sanciones_foro)) db.sanciones_foro = [];
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(db.sanciones_foro));
            return;
          }

          if (req.method === 'POST') {
            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                const nuevaSancion = JSON.parse(bodyStr || '{}');
                const db = readDb();
                if (!Array.isArray(db.sanciones_foro)) db.sanciones_foro = [];
                nuevaSancion.id = nuevaSancion.id || `SANC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
                nuevaSancion.fecha = nuevaSancion.fecha || new Date().toISOString();
                db.sanciones_foro.unshift(nuevaSancion);
                writeDb(db);
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: true, data: nuevaSancion }));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Error registrando sanción.' }));
              }
            });
            return;
          }
        }

        // =====================================================================
        // RUTA 2.2: /api/moderacionContenido y /api/moderacion_contenido (Cola de incidentes IA)
        // =====================================================================
        if (
          url === '/api/moderacionContenido' ||
          url === '/moderacionContenido' ||
          url === '/api/moderacion_contenido' ||
          url === '/moderacion_contenido' ||
          url.startsWith('/api/moderacionContenido/') ||
          url.startsWith('/moderacionContenido/') ||
          url.startsWith('/api/moderacion_contenido/') ||
          url.startsWith('/moderacion_contenido/')
        ) {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
            res.end();
            return;
          }

          if (req.method === 'GET') {
            const db = readDb();
            if (!Array.isArray(db.moderacionContenido)) db.moderacionContenido = [];
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(db.moderacionContenido));
            return;
          }

          if (req.method === 'POST') {
            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                const nuevoItem = JSON.parse(bodyStr || '{}');
                const db = readDb();
                if (!Array.isArray(db.moderacionContenido)) db.moderacionContenido = [];
                nuevoItem.id = nuevoItem.id || `MOD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
                nuevoItem.fechaReporte = nuevoItem.fechaReporte || new Date().toISOString();
                db.moderacionContenido.unshift(nuevoItem);
                writeDb(db);
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: true, data: nuevoItem }));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Error registrando ítem de moderación.' }));
              }
            });
            return;
          }

          if (req.method === 'PATCH' || req.method === 'PUT') {
            const cleanPath = url.replace(/^\/api/, '');
            const segments = cleanPath.split('/').filter(Boolean);
            const idFromPath = segments.length > 1 ? decodeURIComponent(segments[1]) : null;

            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                const updatePayload = JSON.parse(bodyStr || '{}');
                const targetId = idFromPath || updatePayload.id;

                const db = readDb();
                if (!Array.isArray(db.moderacionContenido)) db.moderacionContenido = [];
                const idx = db.moderacionContenido.findIndex((m) => String(m.id) === String(targetId));

                if (idx !== -1) {
                  db.moderacionContenido[idx] = {
                    ...db.moderacionContenido[idx],
                    ...updatePayload,
                    fechaResolucion: new Date().toISOString()
                  };
                  writeDb(db);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ success: true, data: db.moderacionContenido[idx] }));
                  return;
                }

                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Ítem de moderación no encontrado.' }));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Error actualizando ítem de moderación.' }));
              }
            });
            return;
          }
        }

        // =====================================================================
        // RUTA 3: /api/noticias y /noticias (Módulo 01: Noticias Municipales)
        // Control de Acceso Basado en Roles (RBAC): Exclusivo Editor Municipal
        // =====================================================================
        if (
          url === '/api/noticias' ||
          url === '/noticias' ||
          url.startsWith('/api/noticias/') ||
          url.startsWith('/noticias/')
        ) {
          // Si el cliente solicita text/html (navegación del navegador a la SPA), permitir que Vite sirva la página
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return next();
          }

          const cleanPath = url.replace(/^\/api/, '');
          const pathSegments = cleanPath.split('/').filter(Boolean);
          const noticiaIdFromPath = pathSegments.length > 1 ? pathSegments[1] : null;

          // Helper RBAC para validar rol de Gestor Territorial y Editor Municipal
          const esEditorMunicipal = (rol) => {
            if (!rol) return false;
            const r = String(rol).toLowerCase().trim();
            return (
              r.includes('gestor territorial') ||
              r.includes('gestor_territorial') ||
              r.includes('territorial') ||
              r.includes('editor municipal') ||
              r === 'editor_muni' ||
              r === 'editormunicipal' ||
              r.includes('super administrador') ||
              r.includes('super_admin') ||
              r.includes('administrador provincial')
            );
          };

          // 1. Manejo de CORS Preflight (OPTIONS)
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-User-Role, X-User-Cedula');
            res.end();
            return;
          }

          // 2. GET: Listar o consultar noticias oficiales (Público para todos)
          if (req.method === 'GET') {
            const db = readDb();
            if (!Array.isArray(db.noticias)) db.noticias = [];

            const fullUrl = new URL(req.url, 'http://localhost');
            const targetId = fullUrl.searchParams.get('id') || noticiaIdFromPath;

            if (targetId) {
              const single = db.noticias.find((n) => String(n.id) === String(targetId));
              if (!single) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Comunicado municipal no encontrado.' }));
                return;
              }
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(JSON.stringify(single));
              return;
            }

            let resultado = [...db.noticias];

            // Filtro por Cantón
            const cantonParam = fullUrl.searchParams.get('canton');
            if (cantonParam && cantonParam !== 'todos' && cantonParam !== 'TODOS') {
              resultado = resultado.filter(
                (n) => String(n.canton || '').toLowerCase() === cantonParam.toLowerCase()
              );
            }

            // Filtro por Provincia
            const provParam = fullUrl.searchParams.get('provincia');
            if (provParam && provParam !== 'todas' && provParam !== 'TODAS') {
              resultado = resultado.filter(
                (n) => String(n.provincia || '').toLowerCase() === provParam.toLowerCase()
              );
            }

            // Filtro por Categoría
            const catParam = fullUrl.searchParams.get('categoria');
            if (catParam && catParam !== 'todas' && catParam !== 'TODAS') {
              resultado = resultado.filter(
                (n) => String(n.categoria || '').toLowerCase() === catParam.toLowerCase()
              );
            }

            // Filtro por búsqueda de texto libre
            const qParam = fullUrl.searchParams.get('q') || fullUrl.searchParams.get('busqueda');
            if (qParam && qParam.trim()) {
              const qLower = qParam.toLowerCase().trim();
              resultado = resultado.filter(
                (n) =>
                  String(n.titulo || '').toLowerCase().includes(qLower) ||
                  String(n.resumen || '').toLowerCase().includes(qLower) ||
                  String(n.contenido || '').toLowerCase().includes(qLower) ||
                  String(n.canton || '').toLowerCase().includes(qLower) ||
                  String(n.institucion || '').toLowerCase().includes(qLower)
              );
            }

            // Orden cronológico descendente (más recientes primero)
            resultado.sort((a, b) => new Date(b.fechaPublicacion || 0).getTime() - new Date(a.fechaPublicacion || 0).getTime());

            // Paginación por bloques si se envía _page y _limit
            const pageParam = parseInt(fullUrl.searchParams.get('_page') || fullUrl.searchParams.get('page') || '0', 10);
            const limitParam = parseInt(fullUrl.searchParams.get('_limit') || fullUrl.searchParams.get('limit') || '0', 10);

            if (pageParam > 0 && limitParam > 0) {
              const startIndex = (pageParam - 1) * limitParam;
              const paginated = resultado.slice(startIndex, startIndex + limitParam);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('X-Total-Count', resultado.length.toString());
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
              res.end(JSON.stringify(paginated));
              return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('X-Total-Count', resultado.length.toString());
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.end(JSON.stringify(resultado));
            return;
          }

          // 3. POST: Crear comunicado oficial (RBAC: Exclusivo Editor Municipal)
          if (req.method === 'POST') {
            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                let data = {};
                try {
                  data = JSON.parse(bodyStr || '{}');
                } catch (jsonErr) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ success: false, message: 'Formato JSON inválido.' }));
                  return;
                }

                const userRole = req.headers['x-user-role'] || data.autorRol || '';
                if (!esEditorMunicipal(userRole)) {
                  res.statusCode = 403;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(
                    JSON.stringify({
                      success: false,
                      message: 'Acceso Denegado (RBAC): Única y exclusivamente usuarios con rol de "Editor Municipal" tienen permisos para publicar comunicados oficiales.'
                    })
                  );
                  return;
                }

                if (!data.titulo || !data.contenido || !data.canton) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(
                    JSON.stringify({
                      success: false,
                      message: 'El título, contenido y cantón municipal son obligatorios.'
                    })
                  );
                  return;
                }

                const db = readDb();
                if (!Array.isArray(db.noticias)) db.noticias = [];

                const nuevaNoticia = {
                  id: data.id || `noticia-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
                  titulo: String(data.titulo).trim(),
                  resumen: String(data.resumen || data.titulo).trim(),
                  contenido: String(data.contenido).trim(),
                  categoria: data.categoria || 'Gobernanza Local',
                  provincia: data.provincia || 'San José',
                  canton: data.canton || 'San José',
                  autorNombre: data.autorNombre || 'Gestión Municipal',
                  autorRol: 'Editor Municipal',
                  autorCedula: String(data.autorCedula || '1-1155-0892'),
                  fechaPublicacion: data.fechaPublicacion || new Date().toISOString(),
                  imagenUrl: data.imagenUrl || '',
                  reacciones: data.reacciones || { apoyo: 0, interesante: 0, alerta: 0 },
                  comentarios: Array.isArray(data.comentarios) ? data.comentarios : []
                };

                db.noticias.unshift(nuevaNoticia);
                writeDb(db);

                console.log(`[jsonDbServer] Noticia municipal publicada: ${nuevaNoticia.id} (${nuevaNoticia.canton})`);

                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify(nuevaNoticia));
              } catch (err) {
                console.error('[jsonDbServer] Error en POST /api/noticias:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Error interno al persistir la noticia.' }));
              }
            });
            return;
          }

          // 4. PATCH / PUT: Reaccionar, comentar o editar comunicado
          if (req.method === 'PATCH' || req.method === 'PUT') {
            let bodyChunks = [];
            req.on('data', (chunk) => bodyChunks.push(chunk));
            req.on('end', () => {
              try {
                const bodyStr = Buffer.concat(bodyChunks).toString('utf-8');
                let updatePayload = {};
                try {
                  updatePayload = JSON.parse(bodyStr || '{}');
                } catch (jsonErr) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ success: false, message: 'Formato JSON inválido.' }));
                  return;
                }

                const targetId = noticiaIdFromPath || updatePayload.id;
                if (!targetId) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ success: false, message: 'ID de noticia no especificado.' }));
                  return;
                }

                const db = readDb();
                if (!Array.isArray(db.noticias)) db.noticias = [];

                const idx = db.noticias.findIndex((n) => String(n.id) === String(targetId));
                if (idx === -1) {
                  res.statusCode = 404;
                  res.setHeader('Content-Type', 'application/json');
                  res.setHeader('Access-Control-Allow-Origin', '*');
                  res.end(JSON.stringify({ success: false, message: 'Comunicado no encontrado.' }));
                  return;
                }

                const noticia = { ...db.noticias[idx] };

                // A. Reacción ciudadana (Público para ciudadanos autenticados)
                if (updatePayload.action === 'reaccionar') {
                  const tipo = updatePayload.tipoReaccion; // 'apoyo' | 'interesante' | 'alerta'
                  const reacciones = { ...(noticia.reacciones || { apoyo: 0, interesante: 0, alerta: 0 }) };
                  if (reacciones[tipo] !== undefined) {
                    reacciones[tipo] = (reacciones[tipo] || 0) + 1;
                  }
                  noticia.reacciones = reacciones;
                }
                // B. Comentario ciudadano (Público para ciudadanos autenticados)
                else if (updatePayload.action === 'comentar') {
                  const c = updatePayload.comentario || {};
                  if (!c.contenido) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.end(JSON.stringify({ success: false, message: 'El comentario no puede estar vacío.' }));
                    return;
                  }

                  const comentarios = Array.isArray(noticia.comentarios) ? [...noticia.comentarios] : [];
                  const nuevoComentario = {
                    id: `c-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
                    autorNombre: c.autorNombre || 'Ciudadano',
                    autorCedula: String(c.autorCedula || '1-1823-0456'),
                    contenido: String(c.contenido).trim(),
                    fecha: new Date().toISOString()
                  };
                  comentarios.push(nuevoComentario);
                  noticia.comentarios = comentarios;
                }
                // C. Modificación de contenido de la noticia (RBAC: Exclusivo Editor Municipal)
                else {
                  const callerRole = req.headers['x-user-role'] || updatePayload.solicitanteRol || '';
                  if (!esEditorMunicipal(callerRole)) {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.end(
                      JSON.stringify({
                        success: false,
                        message: 'Acceso Denegado (RBAC): Única y exclusivamente usuarios con rol de "Editor Municipal" tienen permisos para modificar comunicados oficiales.'
                      })
                    );
                    return;
                  }

                  if (updatePayload.titulo) noticia.titulo = String(updatePayload.titulo).trim();
                  if (updatePayload.resumen) noticia.resumen = String(updatePayload.resumen).trim();
                  if (updatePayload.contenido) noticia.contenido = String(updatePayload.contenido).trim();
                  if (updatePayload.categoria) noticia.categoria = updatePayload.categoria;
                  if (updatePayload.provincia) noticia.provincia = updatePayload.provincia;
                  if (updatePayload.canton) noticia.canton = updatePayload.canton;
                  if (updatePayload.imagenUrl !== undefined) noticia.imagenUrl = updatePayload.imagenUrl;
                  noticia.fechaModificacion = new Date().toISOString();
                }

                db.noticias[idx] = noticia;
                writeDb(db);

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify(noticia));
              } catch (err) {
                console.error('[jsonDbServer] Error en PATCH /api/noticias:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(JSON.stringify({ success: false, message: 'Error interno al actualizar la noticia.' }));
              }
            });
            return;
          }

          // 5. DELETE: Eliminar comunicado (RBAC: Exclusivo Editor Municipal)
          if (req.method === 'DELETE') {
            const targetId = noticiaIdFromPath;
            const fullUrl = new URL(req.url, 'http://localhost');
            const callerRole = req.headers['x-user-role'] || fullUrl.searchParams.get('rol') || '';

            if (!esEditorMunicipal(callerRole)) {
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.end(
                JSON.stringify({
                  success: false,
                  message: 'Acceso Denegado (RBAC): Única y exclusivamente usuarios con rol de "Editor Municipal" tienen permisos para eliminar comunicados oficiales.'
                })
              );
              return;
            }

            const db = readDb();
            if (!Array.isArray(db.noticias)) db.noticias = [];
            db.noticias = db.noticias.filter((n) => String(n.id) !== String(targetId));
            writeDb(db);

            console.log(`[jsonDbServer] Noticia municipal eliminada: ${targetId}`);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify({ success: true, message: 'Comunicado oficial eliminado exitosamente.' }));
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
    open: false,
    watch: {
      ignored: ['**/src/data/db.json', '**/db.json', '**/src/services/db.json']
    },
    proxy: {
      '/api/hacienda': {
        target: 'https://api.hacienda.go.cr/fe/ae',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/hacienda/, '')
      }
    }
  }
});
