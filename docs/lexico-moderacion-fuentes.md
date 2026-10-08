# Registro Lingüístico y Fuentes Académicas del Léxico de Moderación
**Costa Rica Unidos — Plataforma Cívica Soberana**  
*Módulo de Moderación del Foro Tico (Capa 1 Determinista + Capa 2 Supervisión IA)*

---

## 1. Fuentes Académicas e Institucionales Consultadas

1. **Real Academia Española (RAE) y Asociación de Academias de la Lengua Española (ASALE)**:
   - *Diccionario de la lengua española (DLE)*, 23.ª edición, registros con marcas dialectales `Costa Rica` y etiquetas pragmáticas `malsonante`, `vulgar`, `despectivo`, `ofensivo`.
   - *Diccionario de americanismos (DA)*, ASALE (2010).
2. **Academia Costarricense de la Lengua (ACL)**:
   - *Diccionario de costarriqueñismos* y boletines lingüísticos sobre léxico popular, interjecciones y modismos malsonantes del Valle Central y zonas costeras.
3. **Universidad de Costa Rica (UCR)**:
   - Instituto de Investigaciones Lingüísticas (INIL): Corpus del español de Costa Rica, estudios sobre cortesía verbal, tabúes lingüísticos, léxico soez y tratamiento atenuado.
   - Revista *Káñina* de Artes y Letras / *Revista de Filología y Lingüística*.
4. **Universidad Nacional (UNA)**:
   - Escuela de Literatura y Ciencias del Lenguaje: Investigaciones sobre discriminación discursiva, xenofobia y lenguaje inclusivo en medios costarricenses.
5. **Legislación Costarricense**:
   - Ley N.º 8968 (*Protección de la Persona Frente al Tratamiento de sus Datos Personales*).
   - Código Penal de Costa Rica (Artículos sobre amenazas, difamación, injurias y calumnias).

---

## 2. Principios Lingüísticos y Prevención del "Efecto Scunthorpe"

1. **Coincidencia por Frontera de Palabra Completa (`\b`)**:
   - Ningún término se evalúa como subcadena libre para evitar falsos positivos con vocabulario cívico legítimo (ej. *computadora*, *Puntarenas*, *disputa*, *diputada*, *reputación*, *amputar*, *escupir*, *caput*, *bacheo*, *hueco*).
2. **Desofuscación y Normalización Profunda**:
   - Reducción de caracteres repetidos intencionales (ej. `puuuuuta` $\to$ `puta`).
   - Fusión de letras separadas por signos o espacios (ej. `p.u.t.a`, `p u t a`, `p-u-t-a` $\to$ `puta`).
   - Sustitución de leetspeak y números (0/o, 1/i, 3/e, 4/a, 5/s, 7/t, @/a, $/s).
   - Equivalencia de homóglifos Unicode (caracteres cirílicos o griegos visualmente idénticos a los latinos).
3. **Separación entre Bloqueo Directo y Términos Contextuales**:
   - **Bloqueo Directo (Capa 1)**: Términos cuya carga es inequívocamente soez, denigrante, amenazante o doxxing en cualquier contexto comunicativo civil.
   - **Contextual (Capa 2 - Gemini)**: Términos polisémicos que pueden ser coloquiales, cariñosos o peyorativos según la intención y sintaxis (ej. *perro*, *bestia*, *baboso*, *chapa*, *animal*, *polo*, *carebarro*).
   - **Jerga Inocua (Nunca bloqueada)**: *mae*, *pura vida*, *tuanis*, *diay*, *juepucha*, *hijole*, *que pereza*.

---

## 3. Matriz Exhaustiva del Léxico Auditado

### A. Vulgaridad y Obscenidad (Regla 3)

| Término / Expresión | Variantes Morfológicas | Ámbito | Gravedad | ¿Contextual? | Fuente Primaria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **picha** | pichas, pichazo, despiche, pichudo | Costarricense | Leve | No (bloqueo directo) | DLE / DA ("Costa Rica. malsonante. Miembro viril; cosa de mal gusto"). |
| **mierda** | mierdas, comamierda, come mierda | General | Leve | No (bloqueo directo) | DLE ("malsonante"). |
| **puta** | putas, putísima, la gran puta | General | Leve | No (bloqueo directo) | DLE ("malsonante"). |
| **verga** | vergas, vergazo, verguiza | General / CR | Leve | No (bloqueo directo) | DLE / DA ("malsonante"). |
| **culo** | culos, culazo, culamen | General | Leve | No (bloqueo directo) | DLE ("malsonante"). |
| **mamon** | mamones, mamona, mamapichas | General / CR | Media | No (bloqueo directo) | DLE / INIL-UCR ("insulto vulgar"). |
| **joderr** | jodes, jodan, jodanza | General | Leve | Sí (contextual) | DLE ("malsonante o coloquial según intensidad"). |
| **carebarro** | cara de barro, care'barro | Costarricense | Leve | Sí (contextual) | ACL / Diccionario de Costarriqueñismos ("descarado, sinvergüenza"). |

---

### B. Insultos Personales y Acoso (Regla 4)

| Término / Expresión | Variantes Morfológicas | Ámbito | Gravedad | ¿Contextual? | Fuente Primaria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **carepicha** | care picha, carepichas, care'picha | Costarricense | Media | No (bloqueo directo) | ACL / INIL-UCR ("Insulto soez degradante altamente ofensivo"). |
| **hijueputa** | jueputa, hijo de puta, hdp, h.d.p | General / CR | Media | No (bloqueo directo) | DLE / DA ("malsonante. Insulto grave"). |
| **malparido** | malparida, malparidos, malnacido | General / CR | Media | No (bloqueo directo) | DLE / DA ("insulto ofensivo"). |
| **careverga** | care verga, carevergas | General / CR | Media | No (bloqueo directo) | DA ("insulto dirigido"). |
| **idiota** | idiotas, idioteces | General | Leve/Media | No (si es dirigido) | DLE ("insulto descalificador"). |
| **imbécil** | imbecil, imbeciles, imbecilidad | General | Leve/Media | No (si es dirigido) | DLE ("persona tonta o que molesta"). |
| **estúpido** | estupido, estupida, estupidos | General | Leve/Media | No (si es dirigido) | DLE ("descalificación personal"). |
| **baboso** | babosa, babosos | General / CR | Leve | Sí (contextual) | DLE ("bobo, tonto; puede ser tono informal"). |
| **chapa** | chapas, chapita | Costarricense | Leve | Sí (contextual) | ACL ("torpe, inepto; uso coloquial frecuente"). |
| **inepto/corrupto** | incompetente, ladrón | General | Ninguna/Leve | Sí (contextual en fiscalización) | PERMITIDO si es crítica institucional sin denigración personal. |

---

### C. Amenazas e Intimidación (Regla 5)

| Expresión / Fórmula | Variantes Detectadas | Ámbito | Gravedad | ¿Contextual? | Fuente Primaria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **te voy a matar** | lo voy a matar, hay que matarlo | General | Grave | No (bloqueo directo) | Código Penal CR (Art. 195 - Amenazas personales). |
| **meter plomo** | dar plomo, balazos, tirotear | General / CR | Grave | No (bloqueo directo) | INIL-UCR (Léxico criminológico popular). |
| **partir la madre** | partirle el hocico, romperle la cara | General / CR | Grave | No (bloqueo directo) | DLE / DA (Agresión corporal directa). |
| **ya sé dónde vive** | ya se donde vives, sabemos donde vive | General / CR | Grave | No (amenaza velada) | Criterio jurisprudencial Sala Constitucional / OIJ. |
| **que se cuide** | cuídese la espalda, aténgase a consecuencias | General / CR | Grave | Sí (contextual / velada) | Criterio de intimidación velada analizada por Gemini. |
| **le va a costar caro** | se va a arrepentir | General | Grave | Sí (contextual / velada) | Criterio de intimidación evaluado por IA. |

---

### D. Discurso de Odio y Discriminación (Regla 5)

| Expresión / Término | Variantes Morfológicas | Tipo de Odio | Gravedad | Fuente Primaria |
| :--- | :--- | :--- | :--- | :--- |
| **playo de mierda / maricón** | playos asquerosos, maricas, tortillera | Homofobia / Orientación sexual | Grave | INIL-UCR / DLE ("peyorativo homofóbico"). |
| **nicas de mierda / plaga** | fuera nicas, nica asqueroso, limpieza social | Xenofobia (Antinicaragüense local) | Grave | Estudios sociolingüísticos UCR/UNA sobre xenofobia mediática. |
| **negro de mierda** | raza inferior, simios | Racismo | Grave | UNESCO / Normativa internacional de derechos humanos. |
| **retrasado mental** | mongolo, mongolito, anormal | Capacitismo / Discapacidad | Grave | Observatorio de Discapacidad / DLE. |

---

### E. Blindaje de Datos Personales (Regla 6 - Ley N.º 8968)

| Tipo de Dato Personal | Patrón Regex Específico | Gravedad | Justificación Legal |
| :--- | :--- | :--- | :--- |
| **Teléfono Celular / Fijo CR** | `(?:\+?506[\s-]?)?\b[25678]\d{3}[-\s]?\d{4}\b` | Grave | Ley N.º 8968 Art. 4: Datos de contacto privado. |
| **Cédula de Identidad Nacional** | `\b[1-9][-\s]?\d{4}[-\s]?\d{4}\b` o `\b[1-9]\d{8}\b` | Grave | Ley N.º 8968 Art. 9: Número identificador único. |
| **DIMEX Extranjería** | `\b\d{4}[-\s]?\d{4}[-\s]?\d{3,4}\b` | Grave | Ley N.º 8968 Art. 9: Documento migratorio. |
| **Correo Electrónico Privado** | `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}` | Grave | Ley N.º 8968 Art. 4: Datos personales automatizados. |
| **Dirección Residencial Exacta** | `\b(?:frente\s+(?:a|al|del)|contiguo\s+a|\d+\s*metros?\s+(?:al|del))\s+la\s+casa\s+de\b` | Grave | Ley N.º 8968: Doxxing y exposición de domicilio físico. |

---

## 4. Clasificación de Jerga Inocua (Lista Blanca Estricta)

Términos del habla popular costarricense garantizados con **0% de bloqueo**:
- **mae**: Tratamiento coloquial neutro generacional (aprobado en DLE como coloquial costarricense).
- **pura vida**: Símbolo identitario y saludo universal nacional.
- **tuanis**: Expresión de agrado y conformidad (*todo bien*).
- **diay / idiay**: Interjección comodín de sorpresa, transición o explicación.
- **juepucha / hijole**: Eufemismos populares exclamativos inocuos.
- **desmadre / vacilón**: Expresiones coloquiales festivas o de desorden leve sin connotación lesiva.
