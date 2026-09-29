/**
 * ============================================================================
 * COSTA RICA UNIDOS — MÓDULO 02: DATOS DE GOBERNANZA Y ACTAS MUNICIPALES
 * Base de datos representativa para los gobiernos locales cantonales
 * ============================================================================
 */

export interface AutoridadLocal {
  id: string;
  nombre: string;
  cargo: 'Alcalde Municipal' | 'Vicealcaldesa Primera' | 'Vicealcalde Segundo' | 'Presidente del Concejo' | 'Vicepresidenta del Concejo';
  partido: string;
  periodo: string;
  correo: string;
  telefono: string;
  fotoUrl?: string;
}

export interface NodoOrganigrama {
  id: string;
  nombre: string;
  titular: string;
  cargo: string;
  categoria: 'deliberativo' | 'ejecutivo' | 'control' | 'operativo' | 'social';
  descripcion: string;
  extension: string;
  correo: string;
  hijos?: NodoOrganigrama[];
}

export interface ActaMunicipal {
  id: string;
  numeroActa: string;
  tipo: 'Ordinaria' | 'Extraordinaria' | 'Solemne';
  fecha: string;
  hora: string;
  anno: number;
  periodo: string;
  presidenteSesion: string;
  secretarioConcejo: string;
  quorun: string;
  estado: 'Aprobada y Firme' | 'Aprobada' | 'En Revisión';
  temasClave: string[];
  pdfUrl: string;
  resumenEjecutivo: string;
  acuerdosDestacados: {
    numeroAcuerdo: string;
    descripcion: string;
    votacion: string;
  }[];
}

export const GOBERNANZA_MOCK_DATA: {
  autoridades: Record<number, AutoridadLocal[]>;
  organigrama: Record<number, NodoOrganigrama>;
  actas: Record<number, ActaMunicipal[]>;
} = {
  autoridades: {
    1: [ // San José
      {
        id: 'sj-1',
        nombre: 'Diego Miranda Méndez',
        cargo: 'Alcalde Municipal',
        partido: 'Juntos San José',
        periodo: '2024 - 2028',
        correo: 'alcaldia@msj.go.cr',
        telefono: '(506) 2547-6000'
      },
      {
        id: 'sj-2',
        nombre: 'Yariela Quirós Álvarez',
        cargo: 'Vicealcaldesa Primera',
        partido: 'Juntos San José',
        periodo: '2024 - 2028',
        correo: 'vicealcaldia1@msj.go.cr',
        telefono: '(506) 2547-6005'
      },
      {
        id: 'sj-3',
        nombre: 'Alexander Cano Castro',
        cargo: 'Presidente del Concejo',
        partido: 'Concejo Municipal SJ',
        periodo: '2024 - 2026',
        correo: 'presidencia.concejo@msj.go.cr',
        telefono: '(506) 2547-6100'
      }
    ]
  },

  organigrama: {
    1: {
      id: 'org-1',
      nombre: 'Concejo Municipal de San José',
      titular: 'Cuerpo Colegiado (11 Regidores Propietarios)',
      cargo: 'Máxima Autoridad Deliberativa Cantonal',
      categoria: 'deliberativo',
      descripcion: 'Órgano de representación popular soberana que dicta políticas y aprueba presupuestos cantonales.',
      extension: 'Ext. 101',
      correo: 'secretaria.concejo@msj.go.cr',
      hijos: [
        {
          id: 'org-auditoria',
          nombre: 'Auditoría Interna Municipal',
          titular: 'Lic. Rodrigo Fallas Monge',
          cargo: 'Auditor General Cantonal',
          categoria: 'control',
          descripcion: 'Fiscalización y control de legalidad financiera y presupuestaria independiente.',
          extension: 'Ext. 105',
          correo: 'auditoria@msj.go.cr'
        },
        {
          id: 'org-alcaldia',
          nombre: 'Despacho de la Alcaldía Municipal',
          titular: 'Diego Miranda Méndez',
          cargo: 'Alcalde Ejecutivo Municipal',
          categoria: 'ejecutivo',
          descripcion: 'Administración ejecutiva superior del gobierno local y ejecución de acuerdos cívicos.',
          extension: 'Ext. 200',
          correo: 'alcaldia@msj.go.cr',
          hijos: [
            {
              id: 'org-dir-admin',
              nombre: 'Dirección General de Gestión Financiera y Tributaria',
              titular: 'MSc. Elena Carvajal Solano',
              cargo: 'Directora Financiera',
              categoria: 'operativo',
              descripcion: 'Recaudación de bienes inmuebles, patentes comerciales y presupuesto cantonal.',
              extension: 'Ext. 310',
              correo: 'finanzas@msj.go.cr',
              hijos: [
                {
                  id: 'org-depto-patentes',
                  nombre: 'Departamento de Patentes y PYMES',
                  titular: 'Licda. Karen Brenes Arroyo',
                  cargo: 'Jefa de Patentes',
                  categoria: 'operativo',
                  descripcion: 'Emisión de permisos comerciales en coordinación con Ministerio de Hacienda.',
                  extension: 'Ext. 315',
                  correo: 'patentes@msj.go.cr'
                },
                {
                  id: 'org-depto-tesoreria',
                  nombre: 'Tesorería Municipal',
                  titular: 'Lic. Mauricio Chaves Castro',
                  cargo: 'Tesorero General',
                  categoria: 'operativo',
                  descripcion: 'Custodia de fondos cívicos y pagos a proveedores e infraestructura.',
                  extension: 'Ext. 318',
                  correo: 'tesoreria@msj.go.cr'
                }
              ]
            },
            {
              id: 'org-dir-obras',
              nombre: 'Dirección de Desarrollo Urbano e Infraestructura',
              titular: 'Ing. Carlos Vindas Morales',
              cargo: 'Director de Obras',
              categoria: 'operativo',
              descripcion: 'Planificación territorial, Unidad Técnica de Gestión Vial y licitaciones públicas.',
              extension: 'Ext. 400',
              correo: 'obras@msj.go.cr',
              hijos: [
                {
                  id: 'org-utgv',
                  nombre: 'Unidad Técnica de Gestión Vial (UTGV)',
                  titular: 'Inga. Natalia Zúñiga Mora',
                  cargo: 'Coordinadora de Red Vial Cantonal',
                  categoria: 'operativo',
                  descripcion: 'Mantenimiento de calles, aceras accesibles Ley 7600 y puentes distritales.',
                  extension: 'Ext. 420',
                  correo: 'utgv@msj.go.cr'
                }
              ]
            },
            {
              id: 'org-dir-social',
              nombre: 'Dirección de Servicios Sociales y Culturales',
              titular: 'Dra. Marcela Mora Porras',
              cargo: 'Directora de Bienestar Social',
              categoria: 'social',
              descripcion: 'Oficina de la Mujer (OFIM), becas juveniles y programas con CCDR y cultura.',
              extension: 'Ext. 500',
              correo: 'social@msj.go.cr'
            }
          ]
        }
      ]
    }
  },

  actas: {
    1: [
      {
        id: 'acta-2026-038',
        numeroActa: 'Acta N° 038-2026',
        tipo: 'Ordinaria',
        fecha: '2026-09-22',
        hora: '17:30 hrs',
        anno: 2026,
        periodo: '2024-2028',
        presidenteSesion: 'Alexander Cano Castro',
        secretarioConcejo: 'Licda. Silvia Gómez Navarro',
        quorun: '11 Regidores Propietarios, 11 Suplentes y Alcalde Municipal',
        estado: 'Aprobada y Firme',
        temasClave: ['Presupuesto Extraordinario 2', 'Ciclovías Conectadas', 'Sello Pyme Hacienda', 'Ley 7600 en Aceras'],
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumenEjecutivo: 'Sesión ordinaria donde se aprueba unánimemente el plan de accesibilidad peatonal y la integración con la plataforma Costa Rica Unidos.',
        acuerdosDestacados: [
          {
            numeroAcuerdo: 'ACU-38-01-2026',
            descripcion: 'Aprobación definitiva de ₡ 450 millones para rampas universales Ley 7600 en distritos centrales.',
            votacion: 'Unánime (11 votos a favor)'
          },
          {
            numeroAcuerdo: 'ACU-38-02-2026',
            descripcion: 'Convenio de interoperabilidad con Ministerio de Hacienda para validación digital de patentes.',
            votacion: 'Mayoría calificada (10 a favor, 1 abstención)'
          }
        ]
      },
      {
        id: 'acta-2026-037',
        numeroActa: 'Acta N° 037-2026',
        tipo: 'Extraordinaria',
        fecha: '2026-09-15',
        hora: '10:00 hrs',
        anno: 2026,
        periodo: '2024-2028',
        presidenteSesion: 'Alexander Cano Castro',
        secretarioConcejo: 'Licda. Silvia Gómez Navarro',
        quorun: '10 Regidores Propietarios y Alcalde Municipal',
        estado: 'Aprobada y Firme',
        temasClave: ['Conmemoración Independencia 205 Años', 'Himno Cantonal', 'Premio Cívico San José'],
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumenEjecutivo: 'Sesión solemne en honor a los 205 años de la Independencia Patria con entrega de reconocimientos al mérito ciudadano.',
        acuerdosDestacados: [
          {
            numeroAcuerdo: 'ACU-37-01-2026',
            descripcion: 'Declaración de Ciudadana Distinguida a la educadora emérita doña Carmen Lyra de Barrio Amón.',
            votacion: 'Unánime (11 votos a favor)'
          }
        ]
      },
      {
        id: 'acta-2026-036',
        numeroActa: 'Acta N° 036-2026',
        tipo: 'Ordinaria',
        fecha: '2026-09-08',
        hora: '17:30 hrs',
        anno: 2026,
        periodo: '2024-2028',
        presidenteSesion: 'Alexander Cano Castro',
        secretarioConcejo: 'Licda. Silvia Gómez Navarro',
        quorun: '11 Regidores Propietarios',
        estado: 'Aprobada y Firme',
        temasClave: ['Plan Regulador 2026-2036', 'Zona Protectora Cerros de Escazú', 'Feria del Agricultor Plaza Víquez'],
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumenEjecutivo: 'Avance en las consultas ciudadanas para la modernización del Plan Regulador y mejoras sanitarias en ferias.',
        acuerdosDestacados: [
          {
            numeroAcuerdo: 'ACU-36-04-2026',
            descripcion: 'Habilitación de croquis digital interactivo para los 145 puestos de la Feria del Agricultor Plaza Víquez.',
            votacion: 'Unánime (11 votos a favor)'
          }
        ]
      },
      {
        id: 'acta-2025-052',
        numeroActa: 'Acta N° 052-2025',
        tipo: 'Ordinaria',
        fecha: '2025-12-16',
        hora: '17:00 hrs',
        anno: 2025,
        periodo: '2024-2028',
        presidenteSesion: 'Alexander Cano Castro',
        secretarioConcejo: 'Licda. Silvia Gómez Navarro',
        quorun: '11 Regidores Propietarios',
        estado: 'Aprobada',
        temasClave: ['Presupuesto Ordinario 2026', 'Alumbrado Público LED', 'Comité Cantonal de Deportes'],
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumenEjecutivo: 'Aprobación definitiva del presupuesto cantonal ordinario correspondiente al ejercicio económico 2026.',
        acuerdosDestacados: [
          {
            numeroAcuerdo: 'ACU-52-01-2025',
            descripcion: 'Aprobación del Presupuesto Municipal Ordinario 2026 por ₡ 148,250 millones de colones.',
            votacion: 'Aprobado (9 votos a favor, 2 en contra)'
          }
        ]
      }
    ]
  }
};

export function getAutoridadesCanton(cantonId: number = 1): AutoridadLocal[] {
  return GOBERNANZA_MOCK_DATA.autoridades[cantonId] || GOBERNANZA_MOCK_DATA.autoridades[1];
}

export function getOrganigramaCanton(cantonId: number = 1): NodoOrganigrama {
  return GOBERNANZA_MOCK_DATA.organigrama[cantonId] || GOBERNANZA_MOCK_DATA.organigrama[1];
}

export function getActasCanton(cantonId: number = 1): ActaMunicipal[] {
  return GOBERNANZA_MOCK_DATA.actas[cantonId] || GOBERNANZA_MOCK_DATA.actas[1];
}
