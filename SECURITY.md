# Política de Seguridad y Protección de Datos — Costa Rica Unidos

En **Costa Rica Unidos**, la protección de los datos de la ciudadanía, la integridad de la infraestructura cívica digital y la resiliencia ante contingencias nacionales constituyen un compromiso de soberanía inquebrantable.

Este documento establece las políticas de seguridad de la información, el cumplimiento del marco legal de la República de Costa Rica y los protocolos para la divulgación coordinada y responsable de vulnerabilidades.

---

## 1. Marco Legal y Soberanía de Datos

El diseño, arquitectura e implementación de la plataforma se rigen estrictamente por la legislación costarricense y los más rigurosos estándares internacionales de privacidad:

- **Ley N° 8968**: *Protección de la Persona frente al Tratamiento de sus Datos Personales*. La plataforma garantiza el derecho fundamental a la autodeterminación informativa de todos los habitantes del territorio nacional.
- **Principio de Minimización de Datos**: Solo se solicitan y almacenan los datos estrictamente necesarios para la fiscalización ciudadana, el reporte de incidencias o la gestión de emergencias comunitarias.
- **Privacidad por Diseño y por Defecto (Privacy by Design & Default)**: Toda nueva funcionalidad se construye asumiendo que los datos del usuario no deben ser expuestos ni transferidos a terceros comerciales o entidades sin autorización legal explícita.

---

## 2. Mecanismos de Seguridad Implementados en la Plataforma

### 2.1. Sanitización de Multimedia y Eliminación Forzosa de EXIF / GPS
- En el módulo de reportes ciudadanos (`src/components/reports/imageCompressor.js`), las imágenes adjuntadas por los usuarios se decodifican y procesan en el cliente mediante un lienzo HTML5 Canvas (`2D Context`).
- Este procedimiento garantiza la **destrucción física e irreversible de todos los metadatos EXIF, IPTC y XMP**, impidiendo que coordenadas GPS de satélite, marcas de tiempo exactas del sensor o números de serie de dispositivos personales sean transmitidos a los servidores o visibles para otros usuarios.
- Las imágenes se recomprimen en formato moderno WebP con un límite estricto de tamaño (< 1 MB).

### 2.2. Geofencing Soberano y Delimitación Territorial
- El visor cartográfico 3D (`src/components/gis/MapaCartografico3D.jsx`) implementa un geocercado perimetral obligatorio a través de la propiedad `latLngBounds` de la Google Maps JavaScript API.
- La navegación, telemetría y consultas geoespaciales están matemáticamente acotadas a las coordenadas soberanas de Costa Rica (incluyendo la Isla del Coco: Lat 5.53°, Lng -87.07°), bloqueando la captura accidental de coordenadas transfronterizas ajenas a la jurisdicción nacional.

### 2.3. Gestión y Aislamiento de Claves de API
- Las credenciales sensibles se gestionan exclusivamente mediante variables de entorno con prefijo `VITE_` (`.env`), evitando su inclusión hardcodeada en el repositorio.
- Las API Keys de servicios cartográficos externos (Google Maps Platform) deben estar configuradas en la consola de Google Cloud Platform con restricciones estrictas de:
  * **HTTP Referrers (Sitios web)**: Limitadas a los dominios autorizados de la plataforma (ej. `https://costaricaunidos.cr/*`, `https://*.costaricaunidos.cr/*`) y `localhost` en entornos de desarrollo aislados.
  * **Restricciones de API**: Limitadas exclusivamente a *Maps JavaScript API* y *Geocoding API*.

### 2.4. Seguridad en Modo Offline y Sincronización PWA
- El Service Worker (`public/sw.js`) opera exclusivamente bajo conexiones seguras **HTTPS / TLS 1.3**.
- La persistencia de incidentes en el almacenamiento local (`offlineSyncService.js`) utiliza esquemas sanitizados y normalizados antes de su inserción, previniendo ataques de inyección y almacenamiento de cargas maliciosas.

### 2.5. Privacidad en Marcado SOS de Emergencia
- La botonera de emergencia (`src/components/security/SosKeypadFullscreen.jsx`) utiliza el protocolo nativo `tel:` del sistema operativo del dispositivo para enlazar directamente con los cuerpos de auxilio (9-1-1, Bomberos, Cruz Roja, Fuerza Pública, OIJ).
- La plataforma **no rastrea, registra ni almacena el historial de llamadas de auxilio**, protegiendo la confidencialidad y seguridad de personas en situaciones de pánico o amenaza inminente.

### 2.6. Privacidad y Seguridad en el Motor de Internacionalización (i18n)
- El subsistema multilingüe (`src/context/LanguageContext.jsx`) procesa la totalidad de los diccionarios de traducción en memoria directamente en el cliente.
- **Sin Dependencias de APIs Externas de Traducción**: No se envían consultas, textos de interfaz ni preferencias de navegación a servicios externos de traducción en la nube (ej. Google Translate API, Microsoft Translator), garantizando soberanía de datos y eliminando vectores de exfiltración de metadatos de uso.
- **Inyección Segura de Cadenas**: Todas las claves de traducción se insertan en el Virtual DOM mediante React JSX, previniendo ataques de Cross-Site Scripting (XSS) derivados de inyecciones de código malicioso en strings localizados.

### 2.7. Soberanía y Almacenamiento Local No Identificable
- En estricto cumplimiento del principio de minimización de la **Ley N° 8968**, la plataforma restringe el uso del almacenamiento local (`localStorage`) exclusivamente a variables de estado funcional anónimas y no identificables:
  * `idioma_preferido`: Código de idioma/variante cívica (`CR`, `ES`, `US`, `CN`, `BR`, `FR`, `RU`, `JP`).
  * `cr_text_phase`: Fase de escala de accesibilidad tipográfica (1 a 4).
  * Contexto territorial seleccionado (Provincia, Cantón, Distrito).
- **Prohibición de Datos PII**: Se prohíbe explícitamente el almacenamiento en `localStorage` o `sessionStorage` de datos personales identificables (cédulas de identidad, nombres reales, números telefónicos o coordenadas de geolocalización continua).

### 2.8. Integridad y Control de Versión de Activos Estáticos
- La plataforma emplea estrategias de rompimiento de caché (*cache-busting*) mediante parámetros de versión explícitos (ej. `/logo.png?v=2`, `/favicon.ico?v=2`).
- Esta práctica mitiga el riesgo de ataques por envenenamiento de caché (*cache poisoning*) o retención de recursos desactualizados en redes de distribución de contenido (CDN) y proxies intermediarios, asegurando la autenticidad e integridad gráfica de la identidad visual oficial del Estado.

### 2.9. Blindaje Electoral Antifraude y Soberanía del Sufragio (Módulo 11)
- En el subsistema de Presupuesto Participativo (`src/components/participacion/ModalVotacionAntifraude.tsx`), se implementa una política inviolable de **un voto por cédula legal activa** validada ante el Ministerio de Hacienda:
  * **Verificación de Identidad Oficial**: Toda emisión de voto requiere la validación en tiempo real de la cédula física (9 dígitos), jurídica (10 dígitos) o DIMEX (11-12 dígitos) contra el endpoint oficial `https://api.hacienda.go.cr/fe/ae`. Si el estado tributario/legal no está activo, el sistema rechaza la postulación del voto.
  * **Prevención de Sufragio Duplicado**: El motor valida en memoria contra el registro seguro `VOTOS_REGISTRADOS_CEDULAS`. Si la cédula ya ejerció el derecho al voto en el período electoral comunal vigente, se emite una excepción de rechazo inmediato impidiendo el fraude por duplicación o manipulación de estado en cliente.
  * **Control de Acceso Basado en Roles (RBAC)**: Solo los usuarios acreditados con el rol *Ciudadano Verificado Nivel 2* tienen habilitada la interacción con la urna digital.
  * **Comprobante Criptocívico e Inmutabilidad**: Al consumarse el sufragio, se genera un identificador único con hash de recibo formal (`CRU-XXX-POA26`) para auditoría pública y trazabilidad en el Concejo Municipal, sin ligar el sentido del voto con datos que permitan la reidentificación del elector (secreto del sufragio cívico).

### 2.10. Tratamiento Efímero de Cédulas y Minimización Tributaria (Ley N° 8968)
- En cumplimiento estricto del Principio de Minimización de la **Ley N° 8968**, la plataforma prohíbe el almacenamiento permanente de cédulas de identidad o razones sociales de los ciudadanos en `localStorage`, cookies o encabezados de red:
  * El servicio de verificación de Hacienda (`src/services/haciendaService.ts`) procesa las consultas de forma transitoria en memoria volátil.
  * Los resultados de verificación tributaria se retienen en una capa de caché volátil SWR (`src/services/swrCache.ts`) con un tiempo de vida (TTL) máximo de 15 minutos, destruyéndose de forma automática al cerrar la sesión o pestaña del navegador.
  * No se envían números de cédula a ningún servicio analítico o servidor intermediario ajeno a la infraestructura soberana del Estado.

### 2.11. Certificación Topográfica de Seguridad y Prevención de Riesgos Viales (RF-12.2)
- El planificador de viajes inteligentes `Itinerario Pura Vida` (`src/services/itinerarioIAPlanner.ts` y `src/components/itinerario/PerfilElevacion3D.tsx`) integra un motor algorítmico de seguridad vial y topográfica preventiva:
  * **Verificación de Accesibilidad Ley N° 7600**: Analiza las pendientes continuas en el perfil de elevación 3D de cada ruta peatonal o urbana, certificando que no superen el **8%** de gradiente máximo establecido para tránsito seguro de personas usuarias de silla de ruedas o con movilidad reducida.
  * **Alerta Activa de Tracción 4x4**: Evalúa las cotas altimétricas y pendientes del terreno; si el gradiente de la vía supera el **16%** o discurre por tramos no pavimentados de alta montaña, el sistema bloquea itinerarios para vehículos convencionales (4x2) y emite una advertencia preventiva de seguridad vial exigiendo tracción 4x4 y equipo de contingencia.

### 2.12. Control de Acceso Basado en Roles (RBAC) y Sesiones
- La definición de roles y permisos de navegación se centraliza en `src/config/roles.ts` y `src/config/navigationRoles.ts`; las rutas protegidas se resuelven en `src/routes/PrivateRoutes.jsx` y redirigen a `AccessDenied.jsx` cuando el rol no es suficiente.
- `AuthContext` verifica la suspensión vigente del usuario en los tres caminos de autenticación (login con credenciales, login con usuario ya resuelto y restauración de sesión) y levanta automáticamente las suspensiones vencidas.
- Las acciones administrativas sensibles (sanciones, levantamiento de baneos, alta/baja de usuarios) quedan registradas en `bitacoraAuditoria`.

### 2.13. Moderación del Foro y Uso de Inteligencia Artificial (Gemini)
- La moderación pre-publicación opera en dos capas: filtro local determinista (`src/config/lexicoModeracion.js`) y clasificación opcional con Gemini (`src/services/geminiService.js`, `moderacionForoService.js`).
- **Minimización**: al servicio de IA solo se envía el texto a clasificar, sin cédula, nombre ni otros datos del autor (Ley N° 8968); el texto se declara como dato no ejecutable para mitigar *prompt injection*, con *timeout* de 5 s y degradación segura a la capa local.
- La clave `VITE_GEMINI_API_KEY` debe restringirse por *HTTP Referrer* y por API en Google Cloud, y nunca se versiona.

### 2.14. Alta y Baja de Usuarios con Validación de Hacienda
- El alta de usuarios desde el panel administrativo (`src/services/adminService.ts`, `userService.ts`) valida la cédula mediante `haciendaService.ts`; la baja es reactiva y queda auditada.
- Las consultas a Hacienda siguen el tratamiento efímero descrito en la sección 2.10.

### 2.15. Base de Datos Local de Desarrollo (`db.json` / json-server)
- `db.json` se sirve con `json-server` (`npm run server`, puerto 3001) y funciona como **base de datos de demostración y desarrollo**; no está pensada para producción.
- No exponga el puerto 3001 fuera de `localhost` ni use datos personales reales dentro de `db.json`. En producción debe sustituirse por un backend autenticado (JWT/OAuth2), según el plan del `CHANGELOG.md`.

### 2.16. Limitaciones Conocidas
- El control de acceso se aplica en el cliente y mediante `json-server`, sin autenticación del lado del servidor; no debe considerarse una barrera de seguridad suficiente para datos reales.
- El estado de sesión se conserva en `localStorage` (`cru_user_session` / `cr_sesion_activa`) para restaurar el inicio de sesión; en producción debe migrarse a cookies `HttpOnly` emitidas por el backend.
- Atajos de teclado: el cierre con `Escape` en diálogos críticos como la botonera SOS (`SosKeypadFullscreen.jsx`) está pendiente de revisión de seguridad, ya que salir de un teclado de emergencia con una sola tecla puede ser riesgoso.

---

## 3. Versiones con Soporte Activo de Seguridad

Actualmente, las versiones mayores y ramas de desarrollo activo reciben parches de seguridad y correcciones de vulnerabilidades:

| Versión | Rama de Desarrollo | Estado de Soporte | Soporte de Parches |
| :--- | :--- | :--- | :--- |
| **v2.3.x / Unreleased** | `main` / `feature/Eiker` / `feature/Alanie` | **Activo y Prioritario** | ✅ Parches inmediatos (Módulos cívicos, Hacienda, Votación, Foro y Theming) |
| **v2.2.x** | `develop` / `feature/Eiker` | **Activo y Prioritario** | ✅ Parches inmediatos (GIS 3D, Reportes y SOS) |
| **v2.1.x** | `release/v2.1.0` | **Soporte de Mantenimiento** | ✅ Parches de seguridad críticos |
| **v2.0.x** | `main` | **Soporte Extendido** | ✅ Parches de seguridad críticos |
| **< v2.0.0** | Varias | **Obsoleta** | ❌ Sin soporte |

---

## 4. Divulgación Coordinada y Reporte de Vulnerabilidades

Agradecemos profundamente la colaboración de la comunidad de ciberseguridad, investigadores éticos e ingenieros de software en la protección de esta infraestructura cívica.

### Canales de Contacto:
Si descubres una posible vulnerabilidad de seguridad o un fallo que comprometa datos personales, por favor envíanos un informe detallado a:

📧 **Correo Electrónico de Seguridad**: `seguridad@costaricaunidos.cr`

*Por favor, **NO** abras un issue público en GitHub para reportar vulnerabilidades de seguridad que aún no hayan sido mitigadas.*

### Contenido Recomendado del Reporte:
Para ayudarnos a reproducir y mitigar el hallazgo de forma ágil, incluye:
1. Descripción detallada de la vulnerabilidad y vector de ataque.
2. Módulo o componente afectado (ej. `src/components/reports/imageCompressor.js`).
3. Pasos precisos para reproducir el fallo o prueba de concepto (PoC).
4. Estimación de impacto según la métrica **CVSS v3.1** (Bajo, Medio, Alto, Crítico).
5. Sugerencias de remediación técnica si las tienes disponibles.

### Compromiso de Tiempos de Respuesta (SLA):
- **Acuse de Recibo Inicial**: Menos de 24 horas hábiles.
- **Evaluación y Triage de Severidad**: Menos de 72 horas.
- **Implementación y Despliegue de Mitigación**:
  * Vulnerabilidad Crítica (CVSS $\ge 9.0$): Menos de 48 horas.
  * Vulnerabilidad Alta/Media: Menos de 14 días naturales.

---

## 5. Política de Puerto Seguro (Safe Harbor)

Consideramos que la investigación de seguridad realizada de buena fe es una contribución patriótica indispensable para la ciberseguridad nacional.

Nos comprometemos a **no emprender acciones legales** contra investigadores de seguridad que:
1. Actúen dentro de los límites de la divulgación responsable y no hagan públicos los detalles del fallo antes de que hayamos emitido la corrección oficial.
2. No accedan indebidamente, alteren ni destruyan datos personales de terceros.
3. No lleven a cabo ataques de denegación de servicio (DoS/DDoS) contra los sistemas en producción.
4. Cumplan con las leyes vigentes y operen con un sentido ético orientado al bien público.

---

*La seguridad de la información es soberanía nacional al servicio de cada costarricense.*
