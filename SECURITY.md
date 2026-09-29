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

---

## 3. Versiones con Soporte Activo de Seguridad

Actualmente, solo la rama principal y las versiones mayores recientes reciben parches de seguridad y correcciones de vulnerabilidades:

| Versión | Rama de Desarrollo | Estado de Soporte | Soporte de Parches |
| :--- | :--- | :--- | :--- |
| **v2.2.x** | `develop` / `feature/Eiker` | **Activo y Prioritario** | ✅ Parches inmediatos |
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
