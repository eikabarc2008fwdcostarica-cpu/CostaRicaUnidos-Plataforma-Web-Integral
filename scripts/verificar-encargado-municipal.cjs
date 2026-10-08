/**
 * Suite de Verificación Automatizada: Rol "Encargado Municipal"
 * Pruebas a-j según especificación oficial del proyecto Costa Rica Unidos
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.VITE_URL || 'http://localhost:5173';

async function fetchJson(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {})
    }
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }
  return { status: res.status, ok: res.ok, data };
}

const resultados = [];

function registrarResultado(id, nombre, esperado, obtenido, paso, detalles = '') {
  resultados.push({ id, nombre, esperado, obtenido, paso, detalles });
  const icono = paso ? '✅ PASS' : '❌ FAIL';
  console.log(`[${icono}] ${id}: ${nombre}`);
  if (!paso || detalles) {
    console.log(`   Esperado: ${esperado}`);
    console.log(`   Obtenido: ${obtenido}`);
    if (detalles) console.log(`   Detalle: ${detalles}`);
  }
}

async function ejecutarPruebas() {
  console.log('================================================================');
  console.log('INICIANDO SUITE DE PRUEBAS AUTOMATIZADAS - ENCARGADO MUNICIPAL');
  console.log('Costa Rica Unidos · Plataforma Cívica Soberana');
  console.log('================================================================\n');

  let idNoticiaHeredia = null;
  let idComunicadoHeredia = null;
  let idForoHeredia = null;
  let idNoticiaSanJose = null;
  let idPostCiudadano = null;

  // -------------------------------------------------------------------------
  // PRUEBA A: Publicación de Noticia, Comunicado y Foro por Encargado Heredia
  // -------------------------------------------------------------------------
  try {
    // 1. Noticia
    const resNoticia = await fetchJson('/api/noticias', {
      method: 'POST',
      headers: {
        'x-user-id': 'USR-MUNI-001',
        'x-user-role': 'Encargado Municipal',
        'x-user-canton': 'Heredia',
        'x-user-name': 'Encargado Municipal de Heredia'
      },
      body: JSON.stringify({
        titulo: 'Inauguración de Parque Ambiental Heredia',
        resumen: 'Nuevo parque cantonal para recreación ciudadana',
        contenido: 'La Municipalidad de Heredia anuncia apertura este fin de semana.',
        tipo: 'noticia',
        categoria: 'Gobernanza Local',
        canton: 'Heredia'
      })
    });

    const notOk = resNoticia.status === 201 &&
      resNoticia.data?.esOficial === true &&
      resNoticia.data?.distintivo === 'Cuenta oficial · Municipalidad de Heredia' &&
      resNoticia.data?.canton === 'Heredia';
    
    if (resNoticia.data?.id) idNoticiaHeredia = resNoticia.data.id;

    // 2. Comunicado Oficial
    const resComunicado = await fetchJson('/api/noticias', {
      method: 'POST',
      headers: {
        'x-user-id': 'USR-MUNI-001',
        'x-user-role': 'Encargado Municipal',
        'x-user-canton': 'Heredia'
      },
      body: JSON.stringify({
        titulo: 'Aviso Oficial: Cierre Preventivo por Mantenimiento Vial',
        resumen: 'Trabajos de recarpeteo en avenida central de Heredia',
        contenido: 'Se realizarán desvíos entre las 8:00 y las 16:00 horas.',
        tipo: 'comunicado',
        categoria: 'Gobernanza Local',
        canton: 'Heredia'
      })
    });

    const comOk = resComunicado.status === 201 &&
      resComunicado.data?.esOficial === true &&
      resComunicado.data?.tipo === 'comunicado' &&
      resComunicado.data?.distintivo === 'Cuenta oficial · Municipalidad de Heredia';
    
    if (resComunicado.data?.id) idComunicadoHeredia = resComunicado.data.id;

    // 3. Foro Tico
    const resForo = await fetchJson('/api/foro_posts', {
      method: 'POST',
      headers: {
        'x-user-id': 'USR-MUNI-001',
        'x-user-role': 'Encargado Municipal',
        'x-user-canton': 'Heredia'
      },
      body: JSON.stringify({
        titulo: 'Consulta Cantonal sobre Presupuesto Participativo 2026',
        contenido: 'Invitamos a los vecinos de Heredia a priorizar proyectos comunales.',
        provinciaId: 'heredia',
        canton: 'Heredia'
      })
    });

    const foroOk = resForo.status === 201 &&
      resForo.data?.esOficial === true &&
      resForo.data?.distintivo === 'Cuenta oficial · Municipalidad de Heredia' &&
      resForo.data?.canton === 'Heredia';
    
    if (resForo.data?.id) idForoHeredia = resForo.data.id;

    const pruebaAPaso = notOk && comOk && foroOk;
    registrarResultado(
      'Prueba a',
      'Publicación de Noticia, Comunicado Oficial y Post Foro por Encargado Municipal (Heredia)',
      'Status 201, esOficial: true, distintivo oficial de Heredia en las 3 publicaciones',
      `Noticia: ${resNoticia.status}, Comunicado: ${resComunicado.status}, Foro: ${resForo.status}, esOficial: ${resNoticia.data?.esOficial}`,
      pruebaAPaso,
      `IDs creados: Noticia=${idNoticiaHeredia}, Comunicado=${idComunicadoHeredia}, Foro=${idForoHeredia}`
    );
  } catch (err) {
    registrarResultado('Prueba a', 'Publicación de Noticia, Comunicado y Foro', 'Status 201', err.message, false);
  }

  // -------------------------------------------------------------------------
  // PRUEBA B: Edición y Ocultamiento de Publicación Propia de Heredia
  // -------------------------------------------------------------------------
  try {
    const resEditarOcultar = await fetchJson(`/api/noticias/${idNoticiaHeredia}`, {
      method: 'PATCH',
      headers: {
        'x-user-id': 'USR-MUNI-001',
        'x-user-role': 'Encargado Municipal',
        'x-user-canton': 'Heredia'
      },
      body: JSON.stringify({
        titulo: 'Inauguración de Parque Ambiental Heredia (Reprogramado)',
        estado: 'oculto'
      })
    });

    const pruebaBPaso = resEditarOcultar.status === 200 &&
      resEditarOcultar.data?.estado === 'oculto' &&
      resEditarOcultar.data?.titulo?.includes('Reprogramado');

    registrarResultado(
      'Prueba b',
      'Edición y Ocultamiento de Publicación Propia de su Municipalidad',
      'Status 200, estado: oculto, título actualizado',
      `Status ${resEditarOcultar.status}, estado: ${resEditarOcultar.data?.estado}`,
      pruebaBPaso
    );
  } catch (err) {
    registrarResultado('Prueba b', 'Edición y Ocultamiento de Publicación Propia', 'Status 200', err.message, false);
  }

  // -------------------------------------------------------------------------
  // PRUEBA C: Intento de Gestionar Publicación de OTRA Municipalidad (San José)
  // -------------------------------------------------------------------------
  try {
    // 1. Crear publicación en San José (usando rol Super Admin)
    const resSJ = await fetchJson('/api/noticias', {
      method: 'POST',
      headers: {
        'x-user-id': 'USR-NAC-001',
        'x-user-role': 'Super Administrador Nacional',
        'x-user-canton': 'San José'
      },
      body: JSON.stringify({
        titulo: 'Proyecto Ciclovías San José Centro',
        resumen: 'Expansión de ciclovías en el cantón central',
        contenido: 'Rutas seguras para ciclistas en San José.',
        canton: 'San José'
      })
    });
    idNoticiaSanJose = resSJ.data?.id;

    // 2. Encargado de Heredia intenta editar publicación de San José
    const resEdicionIlegitima = await fetchJson(`/api/noticias/${idNoticiaSanJose}`, {
      method: 'PATCH',
      headers: {
        'x-user-id': 'USR-MUNI-001',
        'x-user-role': 'Encargado Municipal',
        'x-user-canton': 'Heredia'
      },
      body: JSON.stringify({
        titulo: 'Hack de título desde Heredia'
      })
    });

    // 3. Encargado de Heredia intenta eliminar publicación de San José
    const resEliminacionIlegitima = await fetchJson(`/api/noticias/${idNoticiaSanJose}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': 'USR-MUNI-001',
        'x-user-role': 'Encargado Municipal',
        'x-user-canton': 'Heredia'
      }
    });

    const pruebaCPaso = resEdicionIlegitima.status === 403 &&
      resEliminacionIlegitima.status === 403 &&
      (resEdicionIlegitima.data?.error === 'MUNICIPALIDAD_NO_AUTORIZADA' || resEdicionIlegitima.data?.error === 'ACCESO_DENEGADO');

    registrarResultado(
      'Prueba c',
      'Bloqueo de Modificación/Eliminación en Otra Municipalidad (Jurisdicción Territorial)',
      'Status 403 Forbidden en PATCH y DELETE',
      `PATCH: ${resEdicionIlegitima.status} (${resEdicionIlegitima.data?.error}), DELETE: ${resEliminacionIlegitima.status} (${resEliminacionIlegitima.data?.error})`,
      pruebaCPaso
    );
  } catch (err) {
    registrarResultado('Prueba c', 'Bloqueo Jurisdiccional Territorial', 'Status 403', err.message, false);
  }

  // -------------------------------------------------------------------------
  // PRUEBA D: Intento de Modificar o Eliminar Publicación de un Ciudadano
  // -------------------------------------------------------------------------
  try {
    // 1. Crear post de ciudadano
    const resPostCiud = await fetchJson('/api/foro_posts', {
      method: 'POST',
      headers: {
        'x-user-id': 'USR-CIUD-2241',
        'x-user-role': 'CIUDADANO',
        'x-user-canton': 'Heredia'
      },
      body: JSON.stringify({
        titulo: 'Opinión de Vecino: Huecos en calle principal',
        contenido: 'Solicito a la muni arreglar la calle de mi barrio.',
        provinciaId: 'heredia',
        canton: 'Heredia',
        esOficial: false,
        autorRol: 'CIUDADANO'
      })
    });
    idPostCiudadano = resPostCiud.data?.id;

    // 2. Encargado Municipal intenta editar post del ciudadano
    const resEditCiud = await fetchJson(`/api/foro_posts/${idPostCiudadano}`, {
      method: 'PATCH',
      headers: {
        'x-user-id': 'USR-MUNI-001',
        'x-user-role': 'Encargado Municipal',
        'x-user-canton': 'Heredia'
      },
      body: JSON.stringify({
        titulo: 'Post alterado por encargado municipal',
        contenido: 'Contenido censurado'
      })
    });

    // 3. Encargado Municipal intenta eliminar post del ciudadano
    const resDeleteCiud = await fetchJson(`/api/foro_posts/${idPostCiudadano}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': 'USR-MUNI-001',
        'x-user-role': 'Encargado Municipal',
        'x-user-canton': 'Heredia'
      }
    });

    const pruebaDPaso = resEditCiud.status === 403 &&
      resDeleteCiud.status === 403 &&
      resEditCiud.data?.error === 'ACCESO_DENEGADO';

    registrarResultado(
      'Prueba d',
      'Bloqueo de Modificación/Eliminación sobre Contenido Ciudadano',
      'Status 403 Forbidden (ACCESO_DENEGADO)',
      `PATCH: ${resEditCiud.status} (${resEditCiud.data?.error}), DELETE: ${resDeleteCiud.status} (${resDeleteCiud.data?.error})`,
      pruebaDPaso
    );
  } catch (err) {
    registrarResultado('Prueba d', 'Bloqueo de Edición Ciudadana', 'Status 403', err.message, false);
  }

  // -------------------------------------------------------------------------
  // PRUEBA E: Intento de Aprobar Comercios o Sancionar Usuarios (Prohibiciones)
  // -------------------------------------------------------------------------
  try {
    // 1. Intento de aprobar comercio en /api/solicitudesComercio
    const resAprobarComercio = await fetchJson('/api/solicitudesComercio/SOL-EMP-1790954594154-217', {
      method: 'PATCH',
      headers: {
        'x-user-id': 'USR-MUNI-001',
        'x-user-role': 'Encargado Municipal',
        'x-user-canton': 'Heredia'
      },
      body: JSON.stringify({
        estado: 'aprobado'
      })
    });

    // 2. Intento de sancionar usuario en /api/sanciones_foro
    const resSancionar = await fetchJson('/api/sanciones_foro', {
      method: 'POST',
      headers: {
        'x-user-id': 'USR-MUNI-001',
        'x-user-role': 'Encargado Municipal',
        'x-user-canton': 'Heredia'
      },
      body: JSON.stringify({
        cedula: '1-1823-0456',
        motivo: 'Intento de sanción arbitraria'
      })
    });

    const pruebaEPaso = resAprobarComercio.status === 403 &&
      resSancionar.status === 403 &&
      resAprobarComercio.data?.error === 'ACCESO_DENEGADO' &&
      resSancionar.data?.error === 'ACCESO_DENEGADO';

    registrarResultado(
      'Prueba e',
      'Prohibición Estricta: Aprobar Comercios o Sancionar Usuarios del Foro',
      'Status 403 Forbidden en ambas rutas reservadas',
      `Comercio PATCH: ${resAprobarComercio.status}, Sanción POST: ${resSancionar.status}`,
      pruebaEPaso
    );
  } catch (err) {
    registrarResultado('Prueba e', 'Prohibición de Comercios y Sanciones', 'Status 403', err.message, false);
  }

  // -------------------------------------------------------------------------
  // PRUEBA F: Encargado Sin Cantón Asignado (USR-MUNI-PENDIENTE) Intenta Publicar
  // -------------------------------------------------------------------------
  try {
    const resPendienteNoticia = await fetchJson('/api/noticias', {
      method: 'POST',
      headers: {
        'x-user-id': 'USR-MUNI-PENDIENTE',
        'x-user-role': 'Encargado Municipal',
        'x-user-canton': ''
      },
      body: JSON.stringify({
        titulo: 'Publicación huérfana no autorizada',
        contenido: 'No debería publicarse sin cantón asignado'
      })
    });

    const resPendienteForo = await fetchJson('/api/foro_posts', {
      method: 'POST',
      headers: {
        'x-user-id': 'USR-MUNI-PENDIENTE',
        'x-user-role': 'Encargado Municipal',
        'x-user-canton': ''
      },
      body: JSON.stringify({
        titulo: 'Post de foro huérfano',
        contenido: 'No debería publicarse sin cantón asignado'
      })
    });

    const pruebaFPaso = resPendienteNoticia.status === 403 &&
      resPendienteForo.status === 403 &&
      resPendienteNoticia.data?.error === 'SIN_MUNICIPALIDAD' &&
      resPendienteForo.data?.error === 'SIN_MUNICIPALIDAD';

    registrarResultado(
      'Prueba f',
      'Bloqueo a Encargado Municipal sin Cantón Asignado (USR-MUNI-PENDIENTE)',
      'Status 403 Forbidden (SIN_MUNICIPALIDAD) en Noticias y Foro',
      `Noticias: ${resPendienteNoticia.status} (${resPendienteNoticia.data?.error}), Foro: ${resPendienteForo.status} (${resPendienteForo.data?.error})`,
      pruebaFPaso
    );
  } catch (err) {
    registrarResultado('Prueba f', 'Bloqueo sin Cantón Asignado', 'Status 403', err.message, false);
  }

  // -------------------------------------------------------------------------
  // PRUEBA G: Publicaciones del Encargado en Foro Sometidas a Moderación
  // -------------------------------------------------------------------------
  try {
    // Las publicaciones del Encargado no gozan de inmunidad; se pueden reportar y moderar
    // Verificamos que el post oficial de Heredia existe y es sujeto al flujo ordinario de moderación
    const resGetPost = await fetchJson(`/api/foro_posts/${idForoHeredia}`);
    const postExiste = resGetPost.status === 200;
    
    // Verificamos que no posea campos de excepción o bypass de moderación
    const sinInmunidad = resGetPost.data?.inmuneAModeracion !== true &&
      resGetPost.data?.exentoModeracion !== true;

    const pruebaGPaso = postExiste && sinInmunidad;

    registrarResultado(
      'Prueba g',
      'Sujeción de Publicaciones Municipales a Moderación Comunitaria Ordinaria (Sin Inmunidad)',
      'Post accesible en Foro Tico y sujeto a reglas sin banderas de excepción',
      `Status: ${resGetPost.status}, Inmunidad: ${resGetPost.data?.inmuneAModeracion || false}`,
      pruebaGPaso
    );
  } catch (err) {
    registrarResultado('Prueba g', 'Sujeción a Moderación Comunitaria', 'Sin Inmunidad', err.message, false);
  }

  // -------------------------------------------------------------------------
  // PRUEBA H: Super Admin Asigna Cantón y se Registra en Auditoría Inmutable
  // -------------------------------------------------------------------------
  try {
    // 1. Super Admin asigna cantón Cartago a USR-MUNI-PENDIENTE
    const resAsignar = await fetchJson('/api/usuarios/USR-MUNI-PENDIENTE', {
      method: 'PATCH',
      headers: {
        'x-user-id': 'USR-NAC-001',
        'x-user-role': 'Super Administrador Nacional',
        'x-user-canton': 'Todas las Municipalidades'
      },
      body: JSON.stringify({
        canton: 'Cartago',
        provincia: 'Cartago',
        municipalidadId: 'muni-cartago',
        asignadoPor: 'Super Administrador Nacional',
        fechaAsignacion: new Date().toISOString()
      })
    });

    const userActualizado = resAsignar.status === 200 && resAsignar.data?.user?.canton === 'Cartago';

    // 2. Verificar que se haya registrado en la bitácora
    const dbPath = path.resolve(__dirname, '../db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const auditoriaMuni = (dbData.bitacoraAuditoria || []).find(
      (a) => a.entidadAfectada === 'USR-MUNI-PENDIENTE' && (a.accion === 'ASIGNACION_ROL_MUNICIPAL' || a.accion === 'ACTUALIZACION_USUARIO')
    );

    const auditoriaValida = Boolean(auditoriaMuni);

    // 3. Restaurar USR-MUNI-PENDIENTE para mantener consistencia de pruebas
    await fetchJson('/api/usuarios/USR-MUNI-PENDIENTE', {
      method: 'PATCH',
      headers: {
        'x-user-id': 'USR-NAC-001',
        'x-user-role': 'Super Administrador Nacional'
      },
      body: JSON.stringify({
        canton: '',
        provincia: '',
        municipalidadId: ''
      })
    });

    const pruebaHPaso = userActualizado && auditoriaValida;

    registrarResultado(
      'Prueba h',
      'Asignación Exclusiva de Cantón por Super Admin y Registro en Bitácora de Auditoría',
      'Status 200, cantón actualizado inmediatamente, registro en bitacoraAuditoria',
      `Update: ${resAsignar.status}, Cantón asignado: ${resAsignar.data?.user?.canton}, Entrada auditoría ID: ${auditoriaMuni?.id}`,
      pruebaHPaso
    );
  } catch (err) {
    registrarResultado('Prueba h', 'Asignación de Cantón y Auditoría', 'Status 200 + Log', err.message, false);
  }

  // -------------------------------------------------------------------------
  // PRUEBA I: Coexistencia con Ciudadano y Super Administrador
  // -------------------------------------------------------------------------
  try {
    // 1. Ciudadano publica en el foro normalmente (sin distintivo oficial)
    const resPostCiudI = await fetchJson('/api/foro_posts', {
      method: 'POST',
      headers: {
        'x-user-id': 'USR-CIUD-1969',
        'x-user-role': 'CIUDADANO',
        'x-user-canton': 'Puntarenas'
      },
      body: JSON.stringify({
        titulo: 'Consulta de Transporte en Puntarenas',
        contenido: 'Vecinos de Puntarenas, ¿a qué hora sale el último ferry?',
        provinciaId: 'puntarenas',
        canton: 'Puntarenas'
      })
    });

    const ciudOk = resPostCiudI.status === 201 &&
      resPostCiudI.data?.esOficial === false &&
      !resPostCiudI.data?.distintivo;

    // 2. Super Admin gestiona sin bloqueos de cantón
    const resSuperAdminGet = await fetchJson('/api/usuarios', {
      headers: {
        'x-user-id': 'USR-NAC-001',
        'x-user-role': 'Super Administrador Nacional'
      }
    });

    const adminOk = resSuperAdminGet.status === 200 && Array.isArray(resSuperAdminGet.data);

    const pruebaIPaso = ciudOk && adminOk;

    registrarResultado(
      'Prueba i',
      'Flujos de Ciudadano Ordinario y Super Administrador Coexisten sin Alteración',
      'Ciudadano publica sin badge; Super Admin opera a nivel nacional sin restricciones',
      `Ciudadano status: ${resPostCiudI.status} (esOficial: ${resPostCiudI.data?.esOficial}), Super Admin status: ${resSuperAdminGet.status}`,
      pruebaIPaso
    );
  } catch (err) {
    registrarResultado('Prueba i', 'Coexistencia Ciudadano y Super Admin', 'Operación normal', err.message, false);
  }

  // -------------------------------------------------------------------------
  // PRUEBA J: Verificación de CERO Ocurrencias del Rol Anterior en el Código
  // -------------------------------------------------------------------------
  try {
    const srcDir = path.resolve(__dirname, '../src');
    let ocurrencias = [];

    function escanearDirectorio(dir) {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const full = path.join(dir, item);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          escanearDirectorio(full);
        } else if (/\.(js|jsx|ts|tsx|json)$/.test(item)) {
          const content = fs.readFileSync(full, 'utf-8');
          if (/editor\s*municipal/i.test(content) || /editor_municipal/i.test(content)) {
            ocurrencias.push(full);
          }
        }
      }
    }

    escanearDirectorio(srcDir);

    // Revisar vite.config.js y db.json
    const viteContent = fs.readFileSync(path.resolve(__dirname, '../vite.config.js'), 'utf-8');
    if (/editor\s*municipal/i.test(viteContent)) ocurrencias.push('vite.config.js');

    const dbContent = fs.readFileSync(path.resolve(__dirname, '../db.json'), 'utf-8');
    if (/editor\s*municipal/i.test(dbContent)) ocurrencias.push('db.json');

    const pruebaJPaso = ocurrencias.length === 0;

    registrarResultado(
      'Prueba j',
      'Eliminación Total del Rol Obsoleto "Editor Municipal" en Toda la Base de Código',
      '0 ocurrencias en src/, vite.config.js y db.json',
      `${ocurrencias.length} ocurrencias encontradas`,
      pruebaJPaso,
      ocurrencias.length > 0 ? `Archivos: ${ocurrencias.join(', ')}` : 'Código 100% limpio y migrado al rol Encargado Municipal'
    );
  } catch (err) {
    registrarResultado('Prueba j', 'Búsqueda de Rol Anterior', '0 ocurrencias', err.message, false);
  }

  console.log('\n================================================================');
  console.log('RESUMEN DE PRUEBAS AUTOMATIZADAS (a - j)');
  console.log('================================================================');
  const total = resultados.length;
  const pasadas = resultados.filter((r) => r.paso).length;
  const fallidas = total - pasadas;

  console.log(`Total Pruebas: ${total}`);
  console.log(`Aprobadas:    ${pasadas} ✅`);
  console.log(`Fallidas:     ${fallidas} ${fallidas === 0 ? '' : '❌'}`);
  console.log('================================================================');

  if (fallidas === 0) {
    console.log('🎉 TODAS LAS PRUEBAS (a - j) PASARON EXITOSAMENTE.');
    process.exit(0);
  } else {
    console.error('❌ SE DETECTARON FALLOS EN LA SUITE DE VERIFICACIÓN.');
    process.exit(1);
  }
}

ejecutarPruebas();
