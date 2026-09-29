# Guía de Contribución — Costa Rica Unidos

¡Gracias por tu interés en contribuir a **Costa Rica Unidos**! Esta plataforma es una iniciativa de ingeniería cívica y soberanía digital concebida para fortalecer la transparencia institucional, la fiscalización ciudadana y la resiliencia comunitaria en la República de Costa Rica.

Para garantizar que el software mantenga los más altos estándares de calidad arquitectónica, accesibilidad universal y protección de datos, todos los colaboradores deben adherirse a las directrices de este documento.

---

## Índice

1. [Código de Conducta y Ética Cívica](#1-código-de-conducta-y-ética-cívica)
2. [Flujo de Ramas (GitFlow Adaptado)](#2-flujo-de-ramas-gitflow-adaptado)
3. [Estándar de Commits (Conventional Commits v1.0.0)](#3-estándar-de-commits-conventional-commits-v100)
4. [Ciclo de Vida de los Pull Requests](#4-ciclo-de-vida-de-los-pull-requests)
5. [Estándares de Código y Diseño (Sovereign Civic Glass v2.1)](#5-estándares-de-código-y-diseño-sovereign-civic-glass-v21)
6. [Normativas Legales y Accesibilidad Obligatoria](#6-normativas-legales-y-accesibilidad-obligatoria)
7. [Entorno de Desarrollo y Comandos](#7-entorno-de-desarrollo-y-comandos)

---

## 1. Código de Conducta y Ética Cívica

Como plataforma de carácter nacional y cívico:
- **Neutralidad Política y No Partidismo**: El código, datos y contenidos deben permanecer estrictamente imparciales y al servicio del bienestar colectivo.
- **Inclusión Absoluta**: Toda funcionalidad debe ser accesible para todas las personas sin distinción de capacidades, edad, dialecto o territorio de residencia.
- **Soberanía y Privacidad de Datos**: Bajo ninguna circunstancia se admitirá código que introduzca rastreadores comerciales, cookies invasivas de terceros o telemetría que vulnere la **Ley N° 8968**.

---

## 2. Flujo de Ramas (GitFlow Adaptado)

El repositorio sigue un modelo de bifurcación riguroso para asegurar la estabilidad del producto en todo momento:

```text
main (Producción estable, solo releases y hotfixes etiquetados)
  │
  └── develop (Integración continua, base para nuevas características)
        │
        ├── feature/Eiker (Módulos 01, 05, 07, 10, 12.1, Accesibilidad y Layout Global)
        ├── feature/Alanie (Módulos 02, 03, 04, 06, 08, 09, 11, 12.2, Hacienda y Datasets POI)
        ├── feature/<modulo>-<descripcion> (Nuevas funcionalidades cívicas)
        ├── release/vX.Y.Z (Fase de estabilización y control de calidad previo a producción)
        └── hotfix/vX.Y.Z (Parches urgentes dirigidos a corregir incidencias en main)
```

### Reglas de Ramas:
1. **Nunca realizar commits directos en `main` ni en `develop`**: Todos los cambios deben ingresar a través de Pull Requests revisados.
2. **Nomenclatura de ramas de características**:
   - `feature/<id-o-rol>-<descripcion-corta>` (ejemplo: `feature/Eiker`, `feature/Alanie`, `feature/m05-gis-3d-tiles`).
   - `fix/<modulo>-<descripcion-corta>` (ejemplo: `fix/m07-exif-stripper-leak`, `fix/m11-voto-duplicado`).
   - `docs/<tema>` (ejemplo: `docs/actualizacion-arquitectura-srs`).

---

## 3. Estándar de Commits (Conventional Commits v1.0.0)

Cada commit debe describir con precisión atómica la modificación introducida siguiendo el estándar internacional:

```text
<tipo>(<alcance opcional>): <descripción concisa en modo imperativo>

[cuerpo explicativo detallado opcional]

[referencias a requerimientos o issues opcionales]
```

### Tipos Permitidos:
- `feat`: Nueva capacidad o módulo cívico para el usuario (ej. `feat(gis): incorporar geofencing estricto de Costa Rica`, `feat(hacienda): validar cedulas en tiempo real`).
- `fix`: Corrección de un defecto o error de lógica (ej. `fix(reports): sanitizar metadatos EXIF en canvas`, `fix(votacion): impedir doble sufragio por cedula`).
- `docs`: Modificaciones exclusivas en documentación (ej. `docs: actualizar CHANGELOG y guías de contribución`).
- `style`: Ajustes estéticos, espaciados o CSS sin alteración de comportamiento (ej. `style(glass): ajustar blur nivel 2 en CivicCard`).
- `refactor`: Refactorización de código sin alterar la API pública ni añadir funciones (ej. `refactor(nlp): modularizar diccionario cantonal`).
- `perf`: Optimización de rendimiento, tiempos de carga o consumo de memoria (ej. `perf(sw): afinar estrategia cache-first`).
- `test`: Incorporación o actualización de pruebas unitarias o de integración.
- `chore`: Tareas de mantenimiento de build, configuración o dependencias (ej. `chore: actualizar configuración de vite`).

---

## 4. Ciclo de Vida de los Pull Requests

### Pasos para enviar un Pull Request (PR):
1. Asegurarse de tener la última versión de `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. Crear o actualizar la rama de trabajo (`feature/...`):
   ```bash
   git checkout feature/Alanie
   git merge develop
   ```
3. Ejecutar la compilación de producción y verificar que termine sin errores:
   ```bash
   npm run build
   ```
4. Abrir el Pull Request hacia la rama `develop` utilizando la siguiente plantilla:

```markdown
### 📋 Resumen del Cambio
- Breve descripción técnica de lo implementado o corregido.

### 🎯 Módulos o Requerimientos Asociados
- [x] Módulo MXX / Requerimiento RF-XX.X o RNF-XX.X (SRS v2.1).

### ♿ Checklist de Calidad y Accesibilidad (Ley 7600)
- [ ] No genera desbordamiento horizontal en pantallas móviles (360px).
- [ ] Mantiene contraste de color WCAG 2.1 AA (mínimo 4.5:1 en textos).
- [ ] Botones interactivos poseen tamaño mínimo de 54px (o 64px en modo 200%).
- [ ] Componentes interactivos usan la biblioteca atómica Sovereign Civic Glass (`src/components/common/`).
- [ ] Cumple con la sanitización de metadatos EXIF (Ley N° 8968).
- [ ] En votaciones cívicas (M11), se garantiza el principio de 1 voto por cédula legal activa validada ante Hacienda.
- [ ] Destinos e itinerarios turísticos incluyen badges normados (Ley 7600, 4x4, Pet-friendly) y análisis de pendientes.
- [ ] Puntos de interés geográficos se registran bajo el esquema estándar POI (`src/data/poiDatasets.ts`).
- [ ] Textos de interfaz integrados al sistema de traducción multilingüe en los 8 idiomas oficiales (`src/context/LanguageContext.jsx` y glosario tico).
- [ ] Logotipo implementado a través de `src/components/common/Logo.jsx` respetando la altura máxima de 40px.
- [ ] `npm run build` ejecuta en 0 errores.
```

5. **Criterios de Merge**:
   - Aprobación requerida de al menos dos revisores del equipo.
   - Todos los checks automáticos de integración continua en estado verde.
   - Merge realizado sin *fast-forward* (`--no-ff`) para salvaguardar la historia del commit.

---

## 5. Estándares de Código y Diseño (Sovereign Civic Glass v2.1)

El frontend está construido sobre **React 18**, **TypeScript**, **Vite** y CSS Vanilla modular gobernado por el sistema de diseño **Sovereign Civic Glass v2.1**.

### Biblioteca de Componentes Atómicos Soberanos (`src/components/common/`):
Para asegurar coherencia visual y cumplimiento accesible en todos los módulos, se debe utilizar la suite de componentes atómicos:
- **`CivicButton.tsx`**: Botón táctil estándar con variantes (`primary`, `secondary`, `danger`, `ghost`), soporte de carga `isLoading`, micro-interacciones a 60fps y altura mínima táctil accesible de 48px a 54px.
- **`CivicCard.tsx`**: Contenedor con 3 niveles de vidrio esmerilado (`level: 1 | 2 | 3`), soporte de resplandor provincial (`provincialGlow`) y bordes adaptativos.
- **`CivicBadge.tsx`**: Etiqueta de categorización con variantes semánticas (`default`, `accent`, `success`, `warning`, `danger`, `outline`).
- **`CivicModal.tsx`**: Diálogo modal accesible con trampa de foco (`focus-trap`), bloqueo de scroll en el `body`, cierre por tecla `Escape` y accesibilidad WAI-ARIA (`role="dialog"`, `aria-modal="true"`).
- **`StatusPill.tsx`**: Semáforo dinámico de estatus operativo (Verde = Abierto/Disponible, Amarillo = Mantenimiento/Cupo Limitado, Rojo = Cerrado/Alquiler).
- **`AccessibilityBadge.tsx`**: Indicadores normalizados de accesibilidad universal:
  * Ley 7600 (Acceso para personas con discapacidad motriz/visual).
  * Tracción 4x4 (Acceso en caminos rurales de lastre o alta pendiente).
  * Pet-Friendly (Acceso con animales de compañía).

### Integración con el Ministerio de Hacienda (`src/services/haciendaService.ts`):
- Toda validación de identidad ciudadana o verificación tributaria comercial debe canalizarse a través de `haciendaService.ts`.
- Consume el endpoint oficial: `https://api.hacienda.go.cr/fe/ae?identificacion={cedula}`.
- Sanitiza automáticamente cédulas físicas (9 dígitos), jurídicas (10 dígitos) y DIMEX (11-12 dígitos).
- Dispone de caché en memoria con TTL de 15 minutos para prevenir saturación de la API estatal.
- Garantiza la minimización de datos: no almacena datos PII de forma permanente en `localStorage` o cookies (Ley N° 8968).

### Esquema Estándar de Datasets POI para GIS (`src/data/poiDatasets.ts`):
Para integrar puntos de interés en el visor cartográfico de Eiker (M05 / M12), los módulos deben suministrar datasets compatibles con el esquema:
```typescript
export interface POIItem {
  id: string;
  name: string;
  category: 'educacion' | 'comercio' | 'turismo' | 'deportes' | 'salud' | 'seguridad';
  canton?: string;
  lat: number;
  lng: number;
  details?: Record<string, any>;
}
```
Y exportar la colección con la utilidad `toGeoJSONFeatureCollection(items)`.

### Directrices Estéticas:
1. **Tokens Dinámicos Provinciales**:
   - Todo componente contextualizado territorialmente debe respetar las variables CSS inyectadas por el `ProvincialThemeEngine` y `src/styles/themeEngine.ts`:
     * `--province-primary` (Color representativo provincial).
     * `--glow-provincial` (Efecto de resplandor sombreado con difusión).
2. **Niveles de Vidrio Esmerilado (Glassmorphism)**:
   - **Nivel 1 (Superficies Base)**: `rgba(0, 16, 102, 0.65)` con `backdrop-filter: blur(16px)` y borde `rgba(255,255,255,0.12)`.
   - **Nivel 2 (Paneles Flotantes y Drawers)**: `rgba(0, 20, 137, 0.55)` con `backdrop-filter: blur(24px)` y borde `rgba(255,255,255,0.20)`.
   - **Nivel 3 (Modales Críticos y Diálogos SOS)**: `rgba(0, 8, 30, 0.85)` con `backdrop-filter: blur(32px)` y borde `rgba(255,255,255,0.28)`.
3. **Jerarquía Tipográfica**:
   - **Mistical Spring**: Encabezados patrios, declaraciones de Estado y títulos cantonales.
   - **Paloseco**: Textos de lectura, botones, navegación e interfaz general.
   - **JetBrains Mono**: Telemetría técnica, coordenadas cartográficas (latitud/longitud), marcas temporales CST e identificadores de tickets (`CR-2026-XXXX`).
4. **Sistema de Internacionalización Reactiva (i18n)**:
   - Ningún texto visible debe dejarse codificado de forma estática (hardcoded).
   - Toda etiqueta debe consumirse a través del hook `useLanguage` y la función `t('clave')`.
   - Si se introducen nuevas cadenas de texto, deben agregarse sus equivalentes en los 8 idiomas oficiales (`CR`, `ES`, `US`, `CN`, `BR`, `FR`, `RU`, `JP`) en el diccionario de `src/context/LanguageContext.jsx` o en `src/i18n/index.ts`.
5. **Uso y Dimensionamiento del Logotipo Oficial**:
   - Todo componente que requiera mostrar el logotipo de Costa Rica Unidos debe importar el componente `<Logo />` de `src/components/common/Logo.jsx`.
   - Se debe utilizar el activo oficial `public/logo.png` con transparencia limpia.
   - La altura máxima de la imagen está estrictamente acotada a 40px (`maxHeight: 40px`) para salvaguardar la compacidad y alineación de la barra de navegación superior.

---

## 6. Normativas Legales y Accesibilidad Obligatoria

El cumplimiento de las siguientes leyes de la República de Costa Rica es de carácter obligatorio y vinculante en cada línea de código:

### Ley N° 7600 (Igualdad de Oportunidades para Personas con Discapacidad):
- **Escalabilidad Tipográfica**: Todos los contenedores de texto deben respetar la variable `--text-scale` (100% a 200%) sin truncamiento destructivo de contenido.
- **Áreas Táctiles Mínimas**:
  * Modo estándar: Mínimo 54px de altura.
  * Modo Accesibilidad Máxima (Fase 4 - 200%): Mínimo 64px de altura.
- **Lectura Asistida por Voz**: Los elementos semánticos deben incluir textos alternativos explícitos y atributos ARIA (`aria-label`, `aria-live="polite"` para alertas, `role="region"`).

### Ley N° 8968 (Protección de la Persona frente al Tratamiento de sus Datos Personales):
- **Privacidad Fotográfica por Diseño**:
  * Toda imagen subida por la ciudadanía en reportes debe ser procesada en el cliente mediante Canvas para eliminar de forma irreversible la cabecera EXIF (coordenadas GPS ocultas, hora exacta, número de serie del sensor).
  * No se almacenarán direcciones IP completas ni registros de llamadas generadas desde la botonera SOS.

---

## 7. Entorno de Desarrollo y Comandos

### Prerrequisitos:
- **Node.js**: Versión 18.x LTS o superior.
- **npm**: Versión 9.x o superior.
- **Navegador Moderno**: Google Chrome, Mozilla Firefox, Microsoft Edge o Safari con soporte para WebGL y Web Speech API.

### Puesta en Marcha:
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-organizacion/CostaRicaUnidos-Plataforma-Web-Integral.git
   cd CostaRicaUnidos-Plataforma-Web-Integral
   ```
2. Instalar dependencias del proyecto:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   Copiar `.env.example` a `.env` y configurar la clave de Google Maps:
   ```bash
   cp .env.example .env
   ```
   *Edite `.env` y asegúrese de que `VITE_GOOGLE_MAPS_API_KEY` contenga una clave válida con las APIs de Maps JavaScript y 3D habilitadas.*

4. Iniciar el servidor local de desarrollo:
   ```bash
   npm run dev
   ```

5. Compilar para producción y verificar empaquetado:
   ```bash
   npm run build
   ```

6. Previsualizar la compilación de producción localmente:
   ```bash
   npm run preview
   ```

---

*¡Gracias por construir con nosotros una Costa Rica más unida, transparente, solidaria y soberana!*
