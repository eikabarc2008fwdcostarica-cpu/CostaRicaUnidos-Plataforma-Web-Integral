# AGENT.md - Memoria del Agente (Referencia Principal)
 
## 1. Contexto
 
**Proyecto:** Costa Rica Unidos
**Integrantes:** Eiker Abarca Murillo y Alanie Castillo Ruíz
**Versión de referencia (SRS):** 2.1 Consolidada
 
**Propósito del producto:** Plataforma ciudadana soberana que centraliza la información ciudadana, turística y administrativa de la República de Costa Rica, resolviendo la fragmentación de datos entre los niveles central y local, y facilitando la navegación del ciudadano a través de la estructura territorial del país.
 
**Dominio del negocio:** Gobierno digital / gobierno electrónico (e-government) — trámites públicos, participación ciudadana, gestión de desastres, turismo, comercio local y datos geoespaciales (GIS) a nivel nacional.
 
**Alcance territorial:** El sistema gestiona y visualiza la totalidad del territorio costarricense:
- 7 provincias: San José, Alajuela, Cartago, Heredia, Guanacaste, Puntarenas y Limón.
- 84 cantones (incluyendo las incorporaciones administrativas más recientes).
- 492 distritos (base mínima de segmentación de servicios y datos GIS).
**Usuarios / actores (RBAC):**
- **Ciudadano/Turista:** consultas, mapas, itinerarios de IA y trámites públicos.
- **Editor Municipal:** gestión de contenidos de su cantón y distrito.
- **Administrador Provincial:** supervisión de nodos cantonales y estadísticas regionales.
- **Super Administrador Nacional:** control total del sistema, configuración de módulos de IA y gestión de infraestructura.
**Pila tecnológica (stack) — Frontend:**
- Framework: React / Next.js (renderizado híbrido SSR/SSG).
- Gestión de estado: Redux Toolkit (persistencia del contexto territorial del usuario).
- Motores de mapa: MapLibre GL o Leaflet (renderización de capas vectoriales GeoJSON), además de Google Maps 3D para el renderizado cartográfico soberano.
- Estilos: Tailwind CSS integrado con el Provincial Theming Engine (variables CSS en tiempo real).
- Conectividad IA: WebSockets para streaming de respuestas de lenguaje natural.
- Almacenamiento offline: IndexedDB (caché local de ubicaciones y datos GIS).
**Identidad visual (resumen — ver sección 7 para el detalle):** Sistema "Sovereign Civic Glass": glassmorphism sobre fondo obsidiana profundo (#00040D), jerarquía tricolor (azul institucional, blanco, rojo nacional) y un Theming Engine provincial que activa una tríada cromática distinta por provincia según los escudos deportivos/históricos emblemáticos de cada una.
 
> Permite a la IA razonar sobre la realidad concreta en lugar de adivinar.
 
---
 
## 2. Requerimientos
 
### 2.1 Requerimientos funcionales — Módulos base (M01–M11)
 
| ID | Módulo | Descripción principal |
|----|--------|------------------------|
| M01 | Portal Nacional | Nodo central de noticias, alertas y acceso global. |
| M02 | Directorio Institucional | Listado de entidades públicas con contactos y horarios. |
| M03 | Sistema de Trámites | Digitalización de formularios y seguimiento de estados. |
| M04 | Participación Ciudadana | Foros de consulta y presupuestos participativos. |
| M05 | Visor Cartográfico GIS | Mapas con capas GeoJSON de servicios y riesgos. |
| M06 | Gestión de Desastres | Alertas en tiempo real coordinadas con entes de emergencia. |
| M07 | Patrimonio Cultural | Registro interactivo de museos, tradiciones y sitios históricos. |
| M08 | Feria del Agricultor | Calendario y ubicación de ferias y productos locales. |
| M09 | Guía de Turismo Cantonal | Puntos de interés, hospedaje y rutas de aventura. |
| M10 | Observatorio Económico | Datos de empleo, comercio y desarrollo regional. |
| M11 | Buzón de Sugerencias | Sistema de tickets para quejas y mejoras municipales. |
 
### 2.2 Requerimientos funcionales específicos
 
- **RF-01.5 — Integración API Ubicaciones de Costa Rica:** carga dinámica y en cascada de provincias, cantones y distritos desde `https://ubicaciones.paginasweb.cr/`, con caché local en IndexedDB para alta velocidad y modo offline.
- **RF-01.6 — Google Maps 3D Soberano:** renderizado cartográfico tridimensional con relieve topográfico real, geofencing estricto a los límites de Costa Rica (incluye Isla del Coco), vuelos de cámara (fly-to) al seleccionar provincia, y visualización 3D de zonas de riesgo/albergues.
- **RF-01.7 — Onboarding interactivo asistido por voz:** recorrido guiado con animación cívica y locución sintetizada en el idioma seleccionado, con subtítulos sincronizados.
- **RF-03.5 — Motor Multilingüe Extendido:** soporte nativo para 8 idiomas/variantes (español LatAm, español España, inglés, chino mandarín, portugués, francés, ruso y japonés), con glosario contextual de términos costarricenses (Ebais, CTP, Feria, Pura Vida).
- **RF-08.4 / RF-11.5 — Integración API Hacienda** (`https://api.hacienda.go.cr/fe/ae`): login con autocompletado por cédula, sello "Comercio Verificado por Hacienda" y blindaje antifraude electoral (1 voto único por ciudadano).
- **RF-12.1 — Búsqueda Semántica y Navegación GIS en Lenguaje Natural:** integra M01 (Portal Nacional) con M05 (Visor GIS). El usuario consulta en lenguaje natural (ej. "clínicas cerca de colegios técnicos en San Carlos"); la IA interpreta la intención geográfica/temática, activa las capas GeoJSON pertinentes y centra el mapa con marcadores.
- **RF-12.2 — Planificador Generativo de Rutas "Itinerario Pura Vida":** integra M08 (Feria del Agricultor) y M09 (Turismo). Genera itinerarios personalizados según presupuesto, tipo de vehículo (4x2/4x4), accesibilidad (Ley 7600), días de la semana (coincidencia con ferias) y preferencias de comercio local. Salida: plan diario con ruteo interactivo, paradas estratégicas y tiempos de traslado estimados.
### 2.3 Módulo 12 — Motor de IA Contextual (Costa Rica Unidos AI)
 
Módulo que integra capacidades generativas y de NLP; agrupa RF-12.1 y RF-12.2 descritos arriba. Representa la capa de inteligencia que conecta transversalmente el resto de los módulos.
 
### 2.4 Requerimientos no funcionales (RNF)
 
| ID | Requisito |
|----|-----------|
| RNF-01 | Disponibilidad: 99.9% del tiempo operativo. |
| RNF-02 | Rendimiento: respuesta de consultas de IA ≤ 3 segundos. |
| RNF-03 | Seguridad: cifrado en tránsito (TLS 1.3) y en reposo (AES-256). |
| RNF-04 | Escalabilidad: hasta 100,000 usuarios concurrentes en emergencias. |
| RNF-05 | Accesibilidad universal: cumplimiento WCAG 2.1 AA y Ley 7600. |
| RNF-05.1 | Escala tipográfica en 4 fases (100%, 125%, 150%, 200%); botones mínimo 64px en fase 4, sin desbordamientos horizontales. |
| RNF-05.2 | Motor de lectura en voz alta (TTS) vía Web Speech API, voz masculina/femenina en los 8 idiomas soportados. |
| RNF-06 | Interoperabilidad: RESTful APIs en JSON/GeoJSON. |
| RNF-07 | Responsividad: adaptable a móvil, tablet y escritorio. |
| RNF-08 | Motor multilingüe extendido (ver RF-03.5). |
| RNF-09 | Mantenibilidad: documentación técnica completa de modelos de IA y arquitectura de microservicios. |
| RNF-10 | Privacidad: cumplimiento con la Ley de Protección de la Persona frente al Tratamiento de sus Datos Personales (Costa Rica). |
 
> Permite a la IA verificar si su trabajo cumple lo esperado.
 
---
 
## 3. Reglas
 
**Arquitectura y stack (obligatorio, según SRS sección 7):**
- Frontend en React / Next.js con SSR/SSG.
- Estado global con Redux Toolkit; el contexto territorial del usuario (provincia/cantón/distrito activo) debe persistir vía este mecanismo.
- Mapas con MapLibre GL o Leaflet para capas vectoriales GeoJSON (uso complementario a Google Maps 3D para RF-01.6).
- Estilos con Tailwind CSS, integrados al Provincial Theming Engine mediante variables CSS (tokens `--province-primary`, `--glow-provincial`, etc.) que cambian en tiempo real según la provincia activa.
- Comunicación con el motor de IA vía WebSockets (streaming de respuestas NLP).
- Caché offline obligatorio en IndexedDB para datos de ubicaciones (RF-01.5).
**Identidad visual (obligatorio, según Libro de Marca):**
- Usar exclusivamente la paleta primaria y los tokens de color por provincia definidos en la sección 7 de este documento.
- Aplicar el sistema de glassmorphism con los 3 niveles de superficie especificados (blur, opacidad y bordes exactos).
- Tipografía: Mistical Spring para titulares/Estado, Paloseco para cuerpo de texto/UI, JetBrains Mono para telemetría (coordenadas GIS, timestamps, IDs de tickets).
- Radios de curvatura estándar: 8px (controles), 16px (tarjetas), 24px (modales), 9999px (píldoras de estado).
**Accesibilidad (obligatorio):**
- Toda interfaz nueva debe soportar la escala tipográfica de 4 fases (RNF-05.1) sin romper el layout.
- Toda funcionalidad de contenido leíble (actas, noticias, alertas) debe exponer lectura en voz alta vía Web Speech API en los 8 idiomas soportados.
- Cumplimiento WCAG 2.1 AA y Ley 7600 es criterio de aceptación, no opcional.
**Internacionalización:**
- Todo texto de interfaz debe pasar por el motor multilingüe (8 idiomas/variantes) y respetar el glosario contextual de términos costarricenses (Ebais, CTP, Feria, Pura Vida).
**Seguridad y datos:**
- Cifrado obligatorio: TLS 1.3 en tránsito, AES-256 en reposo (RNF-03).
- Integraciones con API Hacienda deben implementar el blindaje antifraude electoral (1 voto único por ciudadano) descrito en RF-08.4/RF-11.5.
> Garantiza coherencia con el resto del equipo.
 
---
 
## 4. Restricciones
 
- **No modificar el logo bajo ninguna circunstancia.** Prohibido explícitamente por el Libro de Marca:
  1. Aplicar versiones monocromáticas no autorizadas.
  2. Agregar sombras paralelas difusas (drop-shadow) ajenas al sistema de vidrio.
  3. Alterar la composición o escala relativa.
  4. Invadir el área segura (equivalente a la altura de la letra "C" del wordmark).
  5. Agregar degradados lineales o radiales sobre los trazos.
  6. Distorsionar o estirar las proporciones.
- **Tamaños mínimos del logo:** no reducir por debajo de 120px (horizontal) / 64px (vertical) / 24×24px (isotipo) en digital; 38mm / 22mm / 12mm en impresión.
- **No usar colores fuera de la paleta autorizada** (primaria + tríadas provinciales) ni combinaciones de logo no listadas en la sección 2 del Libro de Marca.
- **Geofencing estricto:** el renderizado 3D (RF-01.6) debe restringirse a los límites geográficos de Costa Rica, incluyendo Isla del Coco; no se debe permitir navegación libre fuera de esos límites.
- **No se debe permitir más de un voto por ciudadano** en los mecanismos de participación/votación ligados a la API de Hacienda (blindaje antifraude electoral).
- **No usar `<form>` HTML nativo en componentes React con integración de IA/artifacts** (regla estándar de la arquitectura basada en estado; usar manejadores de eventos `onClick`/`onChange`).
- _Librerías específicas vetadas, zonas de código intocables y otras restricciones técnicas de bajo nivel: pendiente de definir — no especificadas en el SRS ni en el Libro de Marca._
> Evita que la IA tome caminos costosos o inseguros.
 
---
 
## 5. Objetivos
 
**Dirección general:** transformar la interacción ciudadano-Estado de estática a predictiva y contextual, mediante la integración de IA generativa/NLP sobre la base de datos territorial y de trámites ya centralizada.
 
**Objetivos de negocio por requerimiento (Matriz de Trazabilidad del SRS):**
- Facilitar la ubicación de servicios complejos mediante voz o texto (RF-05.1 → RF-12.1).
- Aumentar el gasto turístico en comercios locales mediante rutas inteligentes (RF-09.2 → RF-12.2).
- Integrar la economía agrícola (ferias del agricultor) en los planes de viaje del usuario (RF-08.1 → RF-12.2).
- Proporcionar navegación segura hacia albergues en situaciones de crisis (RF-06.3 → RF-12.1).
- Validar identidades, verificar comercios PYME y garantizar blindaje antifraude electoral en votaciones (RF-08.4/RF-11.5 → API Hacienda).
- Garantizar accesibilidad universal bajo WCAG 2.1 AA y Ley 7600 mediante lectura de voz y escala tipográfica (RNF-05.1/RNF-05.2).
**Criterios de éxito / Definición de Terminado (DoD)** — una funcionalidad se considera completa cuando cumple:
1. Código limpio: verificado con linters y revisión de pares (Peer Review).
2. Pruebas: cobertura de pruebas unitarias > 80% e integración exitosa para el motor de IA.
3. Accesibilidad: verificación exitosa con lectores de pantalla y validadores WCAG.
4. Documentación: manual de usuario y documentación de API actualizados en Swagger/OpenAPI.
5. Desempeño: validación de latencia en carga de capas GIS y generación de itinerarios.
6. Integración de APIs y accesibilidad: validación completa de contratos de API (Hacienda, Ubicaciones Costa Rica, Google Maps 3D), caché offline (IndexedDB), soporte multilingüe en 8 idiomas y pruebas de accesibilidad RNF-05.1/05.2.
**Prioridades actuales:** _pendiente de definir — el SRS no especifica un orden de implementación por fases/sprints; preguntar al equipo antes de asumir una secuencia de módulos._
 
> Ayuda a la IA a decidir cuando hay que elegir entre opciones.
 
---
 
## 6. Memoria del Proyecto
 
- **2026-09-25:** Se crea este `AGENT.md` a partir de dos documentos fuente entregados por el equipo:
  - `Especificación de Requerimientos de Software (SRS) v2.1 Consolidada` — define módulos M01–M12, RF/RNF, actores RBAC, arquitectura frontend y matriz de trazabilidad.
  - `Libro de Marca — Costa Rica Unidos (Sistema Sovereign Civic Glass), Edición Especial: Identidad Territorial por Escudos v2.1` — define sistema de marca, logo, paleta de color (nacional + 7 provincias), glassmorphism, tipografía y aplicaciones de UI.
  - No se han registrado aún decisiones técnicas, incidentes ni callejones sin salida posteriores a la fase de especificación: el proyecto se encuentra en etapa de documentación/diseño, no de implementación activa.
> Evita repetir errores y rediscutir lo acordado. Esta sección se actualiza de forma acumulativa, nunca se sobrescribe.
 
---
 
## 7. Buenas Prácticas
 
**Sistema de color — Paleta primaria (Obsidiana Soberana):**
 
| Nombre | HEX | RGB | Pantone |
|--------|-----|-----|---------|
| Obsidiana Soberana | #00040D | 0, 4, 13 | Black 6 C |
| Azul Institucional | #001489 | 0, 20, 137 | 280 C |
| Rojo Nacional | #DA291C | 218, 41, 28 | 186 C |
| Blanco Radiante | #FFFFFF | 255, 255, 255 | Safe White |
 
**Tríadas cromáticas provinciales (tokens CSS `--province-primary` / `--glow-provincial`):**
 
| Provincia | Identidad de referencia | Color principal | Color secundario | Color acento |
|-----------|--------------------------|------------------|-------------------|---------------|
| San José | Saprissa | #601438 | #FFFFFF | #1A1F36 |
| Alajuela | Alajuelense (LDA) | #D31424 | #111111 | #FFFFFF |
| Heredia | Herediano (CSH) | #FFC700 | #D61B23 | #181818 |
| Cartago | Cartaginés (CSC) | #0A3282 | #FFFFFF | #3572C6 |
| Guanacaste | Guanacasteca (ADG) | #05853B | #DE1C24 | #FFFFFF |
| Puntarenas | Puntarenas F.C. (PFC) | #F36717 | #121212 | #FFFFFF |
| Limón | Limón F.C. / La Tromba del Caribe | #349E35 | #FFFFFF | #D89F18 |
 
**Niveles de vidrio esmerilado (Glassmorphism):**
- Nivel 1 (Base): `rgba(0, 16, 102, 0.65)` | blur(16px) | borde 1px (12%).
- Nivel 2 (Flotante): `rgba(0, 20, 137, 0.55)` | blur(24px) | borde 1px (20%).
- Nivel 3 (Modales): `rgba(0, 8, 30, 0.85)` | blur(32px) | borde 1px (28%).
**Tipografía:**
- Titulares/Estado: Mistical Spring (declaraciones de Estado, nombres cantonales, títulos de módulos).
- Cuerpo/UI: Paloseco, pesos Regular (400), Medium (500), SemiBold (600).
- Telemetría técnica: JetBrains Mono, pesos Regular (400), Medium (500) — usar para coordenadas GIS, timestamps CST e IDs de tickets.
**Botonería y controles:**
- Botón primario soberano: fondo sólido `#DA291C`, texto Paloseco SemiBold 14px.
- Botón secundario glass: relleno `rgba(255,255,255,0.08)`, borde 1px al 20%, texto blanco.
- Botonera SOS (M10): botones táctiles de mínimo 54px para 911, Fuerza Pública, Bomberos y Cruz Roja.
**Patrones recomendados:**
- Cambiar la tríada de color provincial mediante variables CSS a nivel de `:root` o contenedor de sección, no mediante clases duplicadas por provincia — facilita el Theming Engine dinámico.
- Reutilizar los tokens `--province-primary` y `--glow-provincial` para cualquier nuevo componente que necesite adaptarse automáticamente a la provincia activa.
- Validar cualquier nueva superficie de UI contra los 3 niveles de glassmorphism antes de introducir valores de blur/opacidad ad-hoc.
- Mantener las cápsulas de telemetría (ej. "LAT: 9.7489° N | ACTUALIZADO: 14:32 CST | SISTEMAS: 99.98% OPERATIVOS") en JetBrains Mono para reforzar la estética de "consola cívica de alta tecnología".
> Eleva la calidad del trabajo hacia el estándar del equipo. Son consejos, no prohibiciones (las prohibiciones están en la sección 4).