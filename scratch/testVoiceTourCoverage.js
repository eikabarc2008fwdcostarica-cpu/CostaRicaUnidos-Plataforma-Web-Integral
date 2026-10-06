/**
 * Test de Verificación de Cobertura Total y Eliminación del Límite de 4 Pasos
 * Plataforma Costa Rica Unidos - Guía Asistida por Voz
 */

import { ROUTE_KNOWLEDGE_BASE, normalizePath } from '../src/services/pageAnalyzerService.js';
import { getGeminiApiKey } from '../src/services/geminiService.js';

console.log('================================================================');
console.log('VERIFICACIÓN DEL SISTEMA DE GUÍA POR VOZ Y COBERTURA TOTAL');
console.log('================================================================\n');

let allPassed = true;

// 1. Verificación de Rutas Críticas
const seccionesCriticas = [
  {
    ruta: '/',
    nombre: 'Pantalla Principal (Hero, Barra Superior y Hub Provincial)',
    minPasos: 8,
    elementosEsperados: [
      'Navegación Superior',
      'Panel Cívico',
      'Sede Electrónica',
      'Gobierno Local',
      'Buscador Cívico',
      '7 Provincias',
      'Indicadores Provinciales',
      'Submódulos'
    ]
  },
  {
    ruta: '/seguridad-emergencias',
    nombre: 'Centro de Operaciones de Emergencia (COE - Ley 8488)',
    minPasos: 7,
    elementosEsperados: [
      'Centro de Operaciones',
      'Alerta Activa',
      'Botonera Táctil',
      'Albergues',
      'Aforo',
      'Suministros',
      'GPS'
    ]
  },
  {
    ruta: '/participacion',
    nombre: 'Métricas Electorales y Presupuestos Participativos',
    minPasos: 5,
    elementosEsperados: [
      'Presupuesto Participativo 2026',
      'Conteo de Votos',
      'Distribución Presupuestaria',
      'Fiscalización Ciudadana',
      'Banco de Proyectos'
    ]
  },
  {
    ruta: '/login',
    nombre: 'Formulario de Acceso Soberano / Registro y Login',
    minPasos: 5,
    elementosEsperados: [
      'Acceso Soberano',
      'Selector de Modalidad',
      'Validación de Cédula',
      'Datos Personales',
      'Correo Ciudadano'
    ]
  }
];

seccionesCriticas.forEach((sec, idx) => {
  const norm = normalizePath(sec.ruta);
  const kb = ROUTE_KNOWLEDGE_BASE[norm];

  console.log(`[Test ${idx + 1}/4] Verificando: ${sec.nombre}`);
  console.log(`  - Ruta: ${sec.ruta} (Normalizada: ${norm})`);

  if (!kb) {
    console.error(`  ❌ FALLO: No existe entrada en ROUTE_KNOWLEDGE_BASE para ${norm}`);
    allPassed = false;
    return;
  }

  const pasos = kb.pasosDefault;
  console.log(`  - Cantidad de pasos configurados: ${pasos.length} (Mínimo exigido: ${sec.minPasos})`);

  if (pasos.length < sec.minPasos) {
    console.error(`  ❌ FALLO: Cantidad de pasos (${pasos.length}) es menor al mínimo exigido (${sec.minPasos})`);
    allPassed = false;
  } else if (pasos.length === 4) {
    console.error(`  ❌ FALLO: El recorrido sigue artificialmente limitado a 4 pasos`);
    allPassed = false;
  } else {
    console.log(`  ✔ Correcto: Se eliminó el límite de 4 pasos (Total real: ${pasos.length} pasos)`);
  }

  // Verificar elementos esperados
  sec.elementosEsperados.forEach((esperado) => {
    const encontrado = pasos.some(p => 
      (p.title && p.title.toLowerCase().includes(esperado.toLowerCase())) ||
      (p.speechText && p.speechText.toLowerCase().includes(esperado.toLowerCase()))
    );
    if (encontrado) {
      console.log(`    ✔ Componente detectado y explicado: "${esperado}"`);
    } else {
      console.warn(`    ⚠️ Advertencia: No se encontró mención exacta de "${esperado}"`);
    }
  });

  console.log('');
});

// 2. Verificación de Conexión de API Key
console.log('[Test 5] Verificación de Configuración de API Key de Gemini:');
const testKey = getGeminiApiKey();
console.log(`  - getGeminiApiKey() ejecutado correctamente (Valor: ${testKey ? 'CONFIGURADA' : 'NO DEFINIDA EN ENTORNO (FALLBACK ACTIVO)'})`);

// 3. Resultado Final
console.log('================================================================');
if (allPassed) {
  console.log('✔ TODAS LAS PRUEBAS DE COBERTURA Y RECORRIDO EXTENDIDO PASARON CON ÉXITO');
} else {
  console.error('❌ SE ENCONTRARON FALLOS EN LA VERIFICACIÓN');
}
console.log('================================================================');
