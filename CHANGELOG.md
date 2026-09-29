# Changelog

Todos los cambios notables en la plataforma cívica **Costa Rica Unidos** se documentan en este archivo.

El formato de este registro se basa estrictamente en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/), y este proyecto se adhiere a [Semantic Versioning (SemVer 2.0.0)](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- **Backend API Persistente**: Reemplazo de mocks en memoria y `localStorage` por API RESTful institucional autenticada con JWT/OAuth2.
- **Integración SICOP y ATV**: Enlace con expedientes de contratación administrativa y declaraciones tributarias.

---

## [2.3.0] - 2026-09-29

### Added
- **Core Design System Sovereign Civic Glass v2.1**:
  - Tokens dinámicos y Theming Engine Provincial en `src/styles/themeEngine.ts` e `src/index.css`.
  - Biblioteca de componentes atómicos soberanos en `src/components/common/`:
    - `CivicButton.tsx`: Botones con micro-interacciones, focus ring accesible y soporte WCAG 2.1 AA.
    - `CivicCard.tsx`: Tarjetas con 3 niveles de glassmorphism esmerilado y resplandor provincial.
    - `CivicBadge.tsx`: Badges de estatus y categorías.
    - `CivicModal.tsx`: Diálogos modales accesibles con trampa de foco (`focus-trap`) y tecla Escape.
    - `StatusPill.tsx`: Semáforo dinámico de estatus operativo.
    - `AccessibilityBadge.tsx`: Badges normados para Ley 7600, Tracción 4x4 y Pet-Friendly.
- **Servicios Transversales e Integración con Ministerio de Hacienda**:
  - Consumo directo del endpoint oficial `https://api.hacienda.go.cr/fe/ae` en `src/services/haciendaService.ts` para validación de cédulas físicas, jurídicas y DIMEX con autocompletado de razón social.
  - Motor de internacionalización enriquecido con glosario cultural costarricense (`src/i18n/costaRicaGlossary.ts`, `src/i18n/index.ts`).
  - Capa de caché nativo SWR (`src/services/swrCache.ts`) y hooks `useDirectoryData.ts` y `useHaciendaValidation.ts`.
- **Módulo 02 — Espacio Administrativo Cantonal y Actas (`/gobernanza`)**:
  - Organigrama institucional colapsable e interactivo (`OrganigramaMunicipal.tsx`).
  - Tabla paginada de actas con filtros por año, tipo de sesión ordinaria/extraordinaria y búsqueda (`TablaActas.tsx`).
  - Visor modal embebido de actas oficiales en PDF con descarga directa (`VisorActaModal.tsx`).
- **Módulo 03 — Identidad Cultural, Tradiciones e Himnos (`/cultura`)**:
  - Línea de tiempo histórica interactiva (`TimelineHistorico.tsx`).
  - Galería de escudos y banderas con heráldica (`GaleriaSimbolos.tsx`).
  - Reproductor multimedia de himnos cantonales con visualizador de audio y letras sincronizadas (`HimnoPlayer.tsx`).
  - Lightbox de patrimonio cultural tangible e inmaterial (`PatrimonioLightbox.tsx`).
- **Módulo 04 — Deportes y CCDR (`/deportes`)**:
  - Catálogo de escuelas formativas del Comité Cantonal de Deportes y Recreación.
  - Fichas de recintos (`FichaInstalacion.tsx`) con semáforo dinámico de disponibilidad y aforo.
  - Feed comunitario participativo y muro "Orgullo Cantonal".
- **Módulo 06 — Directorio de Infraestructura Educativa y CTPs (`/educacion`)**:
  - Directorio de centros educativos con coordenadas WGS84 e indicadores de accesibilidad Ley 7600 y comedor escolar (`FichaCentroEducativo.tsx`).
  - Malla curricular técnica de especialidades CTP (Software, Ciberseguridad, Contabilidad).
- **Módulo 08 — Comercio Local y Feria del Agricultor (`/comercio`, `/feria-agricultor`)**:
  - Catálogo de PYMEs con sello de verificación tributaria de Hacienda y CTAs a WhatsApp y Waze (`FichaComercio.tsx`).
  - Croquis interactivo SVG de la feria comunal con distribución de sectores y calendario estacional de cosechas (`CroquisFeria.tsx`).
- **Módulo 09 — Guía de Turismo Cantonal Sostenible (`/turismo`)**:
  - Galerías fotográficas de alto rendimiento visual con visor modal (lightbox) (`FichaDestinoTuristico.tsx`).
  - Rutas e itinerarios sugeridos oficiales de 1 Día (patrimonial accesible Ley 7600) y 2 Días (alta montaña 4x4) (`RutasPreconfiguradas.tsx`).
  - Generador y exportador de dataset GeoJSON de puntos de interés para el visor cartográfico.
- **Módulo 11 — Participación Ciudadana y Presupuesto Participativo (`/participacion`, `/participacion/votar`)**:
  - Banco interactivo de proyectos vecinales comunitarios.
  - Sistema de votación blindado antifraude (`ModalVotacionAntifraude.tsx`) restringido a rol *Ciudadano Verificado Nivel 2* con validación de 1 voto por cédula legal activa y emisión de comprobante de auditoría.
  - Gráficos reactivos SVG a 60fps para escrutinio en vivo y distribución presupuestaria de ₡ 307 Millones (`GraficoPresupuestoParticipativo.tsx`).
  - Buzón formal de audiencias ciudadanas ante el Concejo Municipal (`BuzonAudienciaModal.tsx`).
- **Módulo 12 / RF-12.2 — Planificador Generativo 'Itinerario Pura Vida' (`/itinerario-ia`)**:
  - Formulario multivariable (presupuesto en colones, tracción 4x2/4x4, Ley 7600, ferias activas) (`FormularioItinerarioIA.tsx`).
  - Algoritmo de optimización y perfil altimétrico 3D en `itinerarioIAPlanner.ts`.
  - Visualizador de curvas de elevación y pendientes 3D (`PerfilElevacion3D.tsx`) con dictamen de accesibilidad universal (≤ 8%) o alerta de tracción 4x4 (> 16%).
  - Cronograma diario interactivo con exportación de paradas a Waze y Google Maps (`VisorItinerarioGenerado.tsx`).
- **Consolidación de Datasets GIS (`src/data/poiDatasets.ts`)**:
  - Unificación de puntos de interés bajo el formato `{ id, name, category, lat, lng, details }` y `toGeoJSONFeatureCollection()` para capas vectoriales de Leaflet / MapLibre de Eiker.

### Changed
- `src/routes/Routing.jsx`: Registro oficial de las rutas públicas y protegidas de Alanie.
- `src/components/FullScreenMenu.jsx`: Conexión de todos los ítems del menú a sus rutas de módulo reales.
- `src/pages/Dashboard.jsx`: Actualización de la consola operativa con enlaces funcionales a todos los módulos.
- `src/pages/Inicio.jsx`: Incorporación de la sección interactiva "Módulos Ciudadanos Activos" con tarjetas glassmórficas y sugerencias de búsqueda automática.
- Inclusión del componente `<Navbar />` en `TurismoPage.tsx`, `ParticipacionPage.tsx` e `ItinerarioIAPage.tsx`.

### Security
- **Blindaje Electoral Antifraude**: Garantía de voto único inmutable por cédula física o jurídica activa verificada ante Hacienda (`VOTOS_REGISTRADOS_CEDULAS`), evitando duplicidad en elecciones vecinales de presupuesto participativo.
- **Minimización de Datos Personales (Ley N° 8968)**: Las validaciones de cédula son efímeras y no persisten información personal sensible en almacenamiento local.
- **Certificación Topográfica de Seguridad**: Advertencias automáticas de pendientes pronunciadas para salvaguardar la integridad de usuarios en silla de ruedas o vehículos no 4x4.

---

## [2.2.0] - 2026-09-28

### Added
- **Sistema Global de Internacionalización Reactiva (i18n)**:
  - Contexto y Diccionario Multilingüe (`src/context/LanguageContext.jsx`): Diccionario nativo para 8 idiomas oficiales (`CR`, `ES`, `US`, `CN`, `BR`, `FR`, `RU`, `JP`), hook `useLanguage` y función de traducción reactiva `t()` con fallback automático a `CR`.
  - Persistencia en almacenamiento local (`localStorage`) mediante la clave `'idioma_preferido'`.
  - Integración en la raíz de la aplicación (`src/App.jsx`) envolviendo el árbol de rutas en `<LanguageProvider>`.
  - Conmutador reactivo de 8 idiomas en el menú a pantalla completa (`src/components/FullScreenMenu.jsx`), traduciendo los 11 módulos, accesos de identidad, títulos y metadatos.
  - Sincronización en tiempo real entre la selección de idioma y el motor de síntesis de voz Web Speech API (`VoiceReaderFloatingButton.jsx` y `useAccessibility`).
  - Traducción dinámica del Hero, buscador semántico, botón de exploración y contadores cívicos (`07 Provincias`, `84 Cantones`, `492 Distritos`) en `src/pages/Inicio.jsx`.
- **Identidad Gráfica y Favicon Oficial**:
  - Activo oficial de alta resolución con fondo transparente en `public/logo.png` (isotipo de corazón y manos con mano interior blanca preservada).
  - Favicon estándar multiplataforma `public/favicon.ico`.
  - Enlaces con control de versión de caché (`/logo.png?v=2`) y soporte `apple-touch-icon` en `index.html`.

### Changed
- `src/components/common/Logo.jsx`: Sustitución de trazados SVG deformados por la imagen oficial, aplicando restricciones estrictas de altura (`height: 40px`, `maxHeight: 40px`, `width: 'auto'`, `objectFit: 'contain'`) para prevenir desbordamientos en la barra de navegación.
- `src/components/Navbar.jsx`: Integración de traducción del botón `MENÚ` y normalización de proporciones del logo.
- `src/components/FullScreenMenu.jsx`: Adaptación de estilos para el selector de banderas y soporte de traducción de todos los módulos.
- `index.html`: Actualización del título a `Costa Rica Unidos — Plataforma Territorial Soberana`.
- `public/favicon.svg`: Eliminación del fondo circular negro para garantizar compatibilidad con temas claros y oscuros del navegador.

---

## [2.1.0] - 2026-09-26

### Added
- **Módulo 01 — Portal Nacional y Theming Soberano**:
  - Motor de Theming Provincial (`src/components/ProvincialThemeEngine.jsx`): Inyección dinámica de tokens CSS `--province-primary` y `--glow-provincial` correspondientes a las tríadas cromáticas oficiales de las 7 provincias (San José, Alajuela, Cartago, Heredia, Guanacaste, Puntarenas y Limón).
  - Selector Territorial en Cascada (`src/components/TerritorialSelector.jsx`): Navegación multinivel oficial (Provincia ➔ Cantón ➔ Distrito) con soporte para los 84 cantones del país (incluyendo Río Cuarto, Monteverde y Puerto Jiménez) y 492 distritos, con persistencia automática en `localStorage`.
  - Hero Carousel Tricolor Institucional (`src/components/HeroCarousel.jsx`): Carrusel accesible con controles de pausa/reproducción, indicadores de diapositiva ARIA y telemetría cívica en vivo.
  - Cajón Desplegable Territorial (`src/components/TerritorialDrawer.jsx`): Interfaz flotante de consulta rápida de subdivisiones distritales y códigos postales.
  - Búsqueda Predictiva Territorial (`src/components/PredictiveSearch.jsx`): Búsqueda con autocompletado y atajo global `Ctrl + K`.

- **Módulo 05 — Sistema GIS y Visor Cartográfico 3D**:
  - Visor Cartográfico 3D Soberano (`src/components/gis/MapaCartografico3D.jsx`): Integración con Google Maps JavaScript API v3 y plataforma de renderizado WebGL/3D Tiles.
  - Geofencing Soberano Estricto: Restricción absoluta de navegación de cámara mediante `latLngBounds` confinada a las fronteras terrestres y aguas soberanas de la República de Costa Rica (incluyendo la delimitación insular de la Isla del Coco).
  - Controles de Cámara 3D y Vuelos Órbita (`src/components/gis/CameraFlyControls.jsx`): Inclinación volumétrica (tilt 45°-60°), rotación tridimensional y animación suave (*fly-to*) hacia cualquier provincia seleccionada.
  - Panel Selector Multicapa Flotante (`src/components/gis/LayerControlPanel.jsx`): Conmutación en tiempo real de 5 capas cívicas vectoriales (`src/components/gis/gisLayersData.js`):
    - *Salud y Bienestar*: EBAIS, Clínicas Integradas y Hospitales de la CCSS.
    - *Seguridad Ciudadana*: Delegaciones policiales de la Fuerza Pública.
    - *Gestión del Riesgo*: Albergues oficiales de la Comisión Nacional de Emergencias (CNE).
    - *Educación Pública*: Colegios Técnicos, Escuelas y Liceos del MEP.
    - *Infraestructura Vial*: Proyectos de obra y rutas nacionales MOPT / CONAVI.
  - Tarjetas de Detalle Modal (`src/components/gis/PointDetailCard.jsx`): Telemetría en tipografía `JetBrains Mono`, estado operativo y enlaces profundos (*deep-linking*) a Google Maps y Waze.

- **Módulo 07 — Sistema de Reportes Ciudadanos e Incidencias Viales**:
  - Asistente Guiado de 4 Pasos (*Stepper*) en `src/pages/ReportarIncidencia.jsx`:
    - *Paso 1 (Tipología del Daño)*: Tarjetas visuales interactivas para hueco vial/bache en asfalto, luminaria pública dañada, fuga de agua potable y basurero clandestino (`Step1DamageType.jsx`).
    - *Paso 2 (Evidencia Fotográfica y Privacidad)*: Captura de fotos con selector de archivo o cámara, previsualización interactiva y consentimiento de protección de datos (`Step2PhotoPrivacy.jsx`).
    - *Paso 3 (Georreferenciación Exacta)*: Selección de ubicación interactiva con pin GPS sobre mapa cartográfico y selector distrital (`Step3Georeferencing.jsx`).
    - *Paso 4 (Confirmación y Radicado)*: Resumen formal, emisión de identificador cívico `CR-2026-XXXX` y generación de comprobante (`Step4Confirmation.jsx`).
  - Motor de Preprocesamiento de Multimedia (`src/components/reports/imageCompressor.js`): Compresión automática en cliente a formato WebP optimizado (< 1 MB) y despojo forzoso de metadatos EXIF / GPS para cumplimiento de la **Ley N° 8968**.
  - Tablero de Trazabilidad de Tickets (`src/components/reports/TicketTraceabilityBoard.jsx`): Tablero tipo Kanban con estados (*En Revisión*, *Asignado*, *En Cuadrilla*, *Resuelto*), filtros por categoría/provincia, búsqueda por radicado y exportación de comprobante en formato PDF/JSON.

- **Módulo 10 — Seguridad Ciudadana, Gestión del Riesgo y Modo Resiliencia Offline**:
  - Centro de Emergencias y Resiliencia (`src/pages/SeguridadEmergencias.jsx`).
  - Botonera Táctil SOS a Pantalla Completa (`src/components/security/SosKeypadFullscreen.jsx`): Botones de emergencia táctiles de gran formato ($\ge 54\text{px}$) con contraste ultra-alto y marcado directo mediante enlaces `tel:` a:
    - 9-1-1 (Emergencias Generales).
    - Fuerza Pública / Ministerio de Seguridad Pública.
    - Benemérito Cuerpo de Bomberos de Costa Rica.
    - Cruz Roja Costarricense.
    - Organismo de Investigación Judicial (OIJ).
  - Cintillo Oficial de Alertas CNE (`src/components/security/CneAlertRibbon.jsx`): Telemetría en vivo con los cuatro niveles oficiales de alerta de la Comisión Nacional de Emergencias: Verde (Informativa), Amarilla (Precaución), Naranja (Peligro Inminente) y Roja (Evacuación Obligatoria).
  - Directorio Cartográfico de Albergues Temporales (`src/components/security/AlberguesListMap.jsx`): Catálogo de albergues CNE con indicador de capacidad total, ocupación actual y barra visual de aforo.
  - Arquitectura PWA Offline-First (`public/sw.js`, `src/serviceWorkerRegistration.js`, `src/services/offlineSyncService.js`):
    - Service Worker con estrategia Cache-First para recursos estáticos y assets de mapas.
    - Gestor de sincronización offline con cola de incidentes en `localStorage` para transmisión diferida automática al restablecerse la conectividad.

- **Módulo 12 / RF-12.1 — Motor de Búsqueda Semántica Geoespacial con NLP**:
  - Motor NLP en Cliente (`src/services/geoSemanticNlpService.js`): Pipeline de procesamiento léxico y semántico capaz de interpretar consultas cívicas en español costarricense (ej. *"clínicas cerca de colegios en San Carlos"*, *"albergues habilitados por inundación"*), extrayendo entidades geográficas (84 cantones, 7 provincias) e intenciones de capas.
  - Barra de Búsqueda Inteligente (`src/components/gis/SemanticGeoSearchBar.jsx`): Entrada de texto con sugerencias rápidas e integración con Web Speech API (`webkitSpeechRecognition` en `es-CR`) para dictado por voz.
  - Respuesta Visual Reactiva: Vuelo automático tridimensional (*fly-to*) hacia la coordenada resultante con resplandor pulsante (`--glow-provincial`).
  - Panel Lateral Desplegable de Resultados (`src/components/gis/NlpResultsDrawer.jsx`): Listado de puntos de interés filtrados por la búsqueda semántica con distancias y acciones directas de navegación.

- **Motor de Accesibilidad Universal (RNF-05 / Ley N° 7600 y WCAG 2.1 AA)**:
  - Contexto de Accesibilidad Global (`src/components/accessibility/AccessibilityContext.jsx`).
  - Selector de Escala Tipográfica en 4 Fases (`src/components/accessibility/TypographicScaleSelector.jsx`):
    - *Fase 1*: 100% (Estándar).
    - *Fase 2*: 125% (Lectura cómoda).
    - *Fase 3*: 150% (Baja visión leve / Adultos mayores).
    - *Fase 4*: 200% (Máxima accesibilidad visual, áreas táctiles adaptadas a $\ge 64\text{px}$).
    - Inyección reactiva de la variable CSS global `--text-scale` sin provocar desbordamientos horizontales en dispositivos móviles de 360px.
  - Motor de Lectura en Voz Alta y Lector de Pantalla Flotante (`src/components/accessibility/VoiceReaderFloatingButton.jsx`): Sintetizador de voz Web Speech API (`SpeechSynthesis`) con soporte para 8 idiomas oficiales y lenguas indígenas costarricenses (Español, Bribri, Cabécar, Maleku, Guaymí, Inglés, Francés, Mandarín) y alternancia entre voces femenina y masculina.
  - Inducción Interactiva Guiada por Voz (`src/components/accessibility/VoiceGuidedOnboardingModal.jsx`): Asistente de bienvenida en 3 pasos con locución automatizada y panel de subtítulos sincronizados en pantalla.

### Changed
- `src/components/Navbar.jsx`: Incorporación de controles directos para el selector de escala tipográfica, botón directo al modo SOS de emergencias y conmutación de estado de conexión online/offline.
- `src/routes/index.jsx` y `src/App.jsx`: Configuración de enrutamiento con soporte para las nuevas páginas (`/mapa-gis`, `/reportar-incidencia`, `/seguridad-emergencias`) e integración del `AccessibilityProvider`.
- `src/index.css`: Inclusión de tokens tipográficos universales basados en `--text-scale`, clases de ocultamiento para lectores de pantalla (`.sr-only`), animaciones de pulso y adaptabilidad de modo de contraste.

### Security
- **Protección de Datos Personales (Ley N° 8968)**: Sanitización forzosa en Canvas del cliente que destruye las etiquetas EXIF / GPS de las fotos adjuntadas por los ciudadanos antes de su procesamiento.
- **Geofencing Cívico Estricto**: Restricción matemática de coordenadas de navegación cartográfica que previene filtraciones o consultas geográficas no pertinentes fuera del territorio de Costa Rica.
- **Aislamiento Seguro de API Keys**: Manejo de credenciales de Google Maps y servicios externos mediante variables de entorno `VITE_` con validación en tiempo de ejecución.
- **Marcado de Emergencia Soberano**: Ejecución de llamadas telefónicas a través de la URI nativa `tel:` del sistema operativo, eliminando la recolección innecesaria de telemetría de telecomunicaciones del usuario.

---

## [1.0.0] - 2026-09-25

### Added
- Andamiaje base de la plataforma con React 18 y Vite SPA.
- Definición e implementación de tokens de diseño **Sovereign Civic Glass v2.1**.
- Estructura de carpetas modular (`components`, `pages`, `routes`, `services`, `data`).
- Definición de directrices de gobernanza cívica y flujo GitFlow en `README.md`.
