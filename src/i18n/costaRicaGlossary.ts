/**
 * ============================================================================
 * COSTA RICA UNIDOS — GLOSARIO CONTEXTUAL DE COSTARRICHEÑISMOS Y TÉRMINOS CÍVICOS
 * Cobertura multilingüe para 8 idiomas oficiales
 * ============================================================================
 * 
 * Provee definiciones institucionales y notas explicativas culturales para
 * ciudadanos, residentes extranjeros y turistas internacionales.
 */

export type SupportedLanguage =
  | 'es-CR' // Español Latinoamérica / Costa Rica
  | 'es-ES' // Español España
  | 'en'    // Inglés
  | 'zh'    // Chino Mandarín
  | 'pt'    // Portugués
  | 'fr'    // Francés
  | 'ru'    // Ruso
  | 'ja';   // Japonés

export interface GlossaryDefinition {
  termino: string;
  pronunciacion?: string;
  traduccion: string;
  categoria: 'Civico-Institucional' | 'Salud' | 'Educacion' | 'Cultura' | 'Comercio' | 'Deporte';
  definicionCorta: string;
  contextoCultural: string;
}

export interface TermData {
  id: string;
  terminoOriginal: string;
  traducciones: Record<SupportedLanguage, GlossaryDefinition>;
}

export const COSTA_RICA_GLOSSARY: Record<string, TermData> = {
  ebais: {
    id: 'ebais',
    terminoOriginal: 'EBAIS',
    traducciones: {
      'es-CR': {
        termino: 'EBAIS',
        traduccion: 'Equipo Básico de Atención Integral en Salud',
        categoria: 'Salud',
        definicionCorta: 'Centro de salud primario comunitario de la Caja Costarricense de Seguro Social (CCSS).',
        contextoCultural: 'Es el primer punto de contacto médico para cualquier ciudadano o residente en su distrito.'
      },
      'es-ES': {
        termino: 'EBAIS',
        traduccion: 'Centro de Salud Primaria / Consultorio Local',
        categoria: 'Salud',
        definicionCorta: 'Unidad médica ambulatoria comunitaria de la seguridad social costarricense.',
        contextoCultural: 'Equivalente al centro de atención primaria o ambulatorio de barrio en España.'
      },
      en: {
        termino: 'EBAIS',
        traduccion: 'Basic Integrated Healthcare Team (Community Clinic)',
        categoria: 'Salud',
        definicionCorta: 'Primary healthcare outpatient center run by the Costa Rican Social Security Fund (CCSS).',
        contextoCultural: 'Every district in Costa Rica has an assigned EBAIS providing free or universal basic medical and preventive care.'
      },
      zh: {
        termino: 'EBAIS',
        traduccion: '基本综合卫生保健小组 (社区全科诊所)',
        categoria: 'Salud',
        definicionCorta: '哥斯达黎加国家社会保障局 (CCSS) 设立的基层社区医疗中心。',
        contextoCultural: '为当地居民提供初级诊疗、家庭医生服务和疫苗接种的基本公立医疗机构。'
      },
      pt: {
        termino: 'EBAIS',
        traduccion: 'Equipe Básica de Atenção Integral à Saúde (UBS)',
        categoria: 'Salud',
        definicionCorta: 'Unidade básica de saúde pública comunitária da previdência costarriquenha (CCSS).',
        contextoCultural: 'Equivalente às Unidades Básicas de Saúde (UBS / Posto de Saúde) no Brasil.'
      },
      fr: {
        termino: 'EBAIS',
        traduccion: 'Équipe de Soins de Santé Primaires (Dispensaire Local)',
        categoria: 'Salud',
        definicionCorta: 'Centre de soins ambulatoires de proximité géré par la Sécurité Sociale du Costa Rica.',
        contextoCultural: 'Point de contact médical de base présent dans chaque district pour les consultations et soins préventifs.'
      },
      ru: {
        termino: 'EBAIS',
        traduccion: 'Группа первичной медико-санитарной помощи (Участковая поликлиника)',
        categoria: 'Salud',
        definicionCorta: 'Районное отделение первичной медицинской помощи государственной системы соцстрахования (CCSS).',
        contextoCultural: 'Аналог районной поликлиники или ФАП, обеспечивающий бесплатный базовый осмотр жителей дистрикта.'
      },
      ja: {
        termino: 'EBAIS',
        traduccion: '地域総合保健基本チーム (地区診療所)',
        categoria: 'Salud',
        definicionCorta: 'コスタリカ社会保険公社 (CCSS) が運営する地域密着型の一次医療センター。',
        contextoCultural: '各行政区（ディストリクト）に配置され、住民の初期診療や予防接種を担う拠点です。'
      }
    }
  },

  ctp: {
    id: 'ctp',
    terminoOriginal: 'CTP',
    traducciones: {
      'es-CR': {
        termino: 'CTP',
        traduccion: 'Colegio Técnico Profesional',
        categoria: 'Educacion',
        definicionCorta: 'Institución de educación secundaria pública orientada a carreras técnicas vocacionales.',
        contextoCultural: 'Ofrece carreras con alta demanda como Informática, Electrónica, Agroindustria y Turismo con pasantías.'
      },
      'es-ES': {
        termino: 'CTP',
        traduccion: 'Instituto de Formación Profesional (FP)',
        categoria: 'Educacion',
        definicionCorta: 'Centro de enseñanza secundaria con especialidades técnicas de grado medio.',
        contextoCultural: 'Combina el bachillerato secundario con titulación de técnico medio para el mercado laboral.'
      },
      en: {
        termino: 'CTP',
        traduccion: 'Professional Technical High School (Vocational School)',
        categoria: 'Educacion',
        definicionCorta: 'Public high school focused on specialized vocational and technical degrees.',
        contextoCultural: 'Graduates obtain a secondary diploma and a technical degree in IT, tourism, mechanics, or business.'
      },
      zh: {
        termino: 'CTP',
        traduccion: '专业技术高中 (职业技术学院)',
        categoria: 'Educacion',
        definicionCorta: '提供职业高中教育并颁发专业技术证书的公立中等教育学校。',
        contextoCultural: '注重软件开发、机电一体化、可持续旅游和农业科技等实践技能培养。'
      },
      pt: {
        termino: 'CTP',
        traduccion: 'Escola Técnica Estadual / Profissionalizante',
        categoria: 'Educacion',
        definicionCorta: 'Escola pública de ensino médio integrado à formação técnica e profissional.',
        contextoCultural: 'Semelhante às ETECs e Institutos Federais, capacita jovens em áreas de alta empregabilidade.'
      },
      fr: {
        termino: 'CTP',
        traduccion: 'Lycée d’Enseignement Professionnel et Technique',
        categoria: 'Educacion',
        definicionCorta: 'Établissement public secondaire préparant à des diplômes techniques spécialisés.',
        contextoCultural: 'Forme les jeunes à des métiers qualifiés en informatique, mécatronique ou hôtellerie.'
      },
      ru: {
        termino: 'CTP',
        traduccion: 'Профессионально-технический лицей / колледж',
        categoria: 'Educacion',
        definicionCorta: 'Государственное среднее профессиональное учебное заведение.',
        contextoCultural: 'Дает диплом о полном среднем образовании вместе с рабочей специальностью (IT, агротехника, туризм).'
      },
      ja: {
        termino: 'CTP',
        traduccion: '専門技術高校 (高専・実業高校)',
        categoria: 'Educacion',
        definicionCorta: '情報技術や観光、農産業などの実務資格を習得できる公立専門高校。',
        contextoCultural: '通常の中等教育修了証に加え、即戦力となる技術者資格を取得できます。'
      }
    }
  },

  feria_agricultor: {
    id: 'feria_agricultor',
    terminoOriginal: 'Feria del Agricultor',
    traducciones: {
      'es-CR': {
        termino: 'Feria del Agricultor',
        traduccion: 'Feria Semanal del Agricultor y Productor',
        categoria: 'Comercio',
        definicionCorta: 'Mercado comunal abierto los fines de semana donde campesinos venden directamente al consumidor.',
        contextoCultural: 'Pilar de la economía popular, soberanía alimentaria y tradición social en cada cantón del país.'
      },
      'es-ES': {
        termino: 'Feria del Agricultor',
        traduccion: 'Mercadillo de Productores Agrícolas',
        categoria: 'Comercio',
        definicionCorta: 'Mercado tradicional de fin de semana con productos frescos directos de la huerta.',
        contextoCultural: 'Venta directa sin intermediarios de frutas tropicales, quesos artesanales y verduras de proximidad.'
      },
      en: {
        termino: 'Feria del Agricultor',
        traduccion: "Farmers' Market",
        categoria: 'Comercio',
        definicionCorta: 'Weekend open-air community market where local farmers sell directly to citizens.',
        contextoCultural: 'A cultural and economic staple across all Costa Rican cantons featuring exotic fruits, vegetables, artisan cheeses, and prepared local foods.'
      },
      zh: {
        termino: 'Feria del Agricultor',
        traduccion: '农夫市集 (周末生鲜早市)',
        categoria: 'Comercio',
        definicionCorta: '周末在各县城定期举办的农户直销生鲜蔬菜水果露天集市。',
        contextoCultural: '哥斯达黎加最具生活气息的传统，无中间商直售热带水果、新鲜奶酪和地道民间美食。'
      },
      pt: {
        termino: 'Feria del Agricultor',
        traduccion: 'Feira Livre do Produtor Rural',
        categoria: 'Comercio',
        definicionCorta: 'Feira de rua de fim de semana com venda direta do produtor ao consumidor.',
        contextoCultural: 'Encontro comunitário com frutas frescas, queijos caseiros e alimentos artesanais de agricultura familiar.'
      },
      fr: {
        termino: 'Feria del Agricultor',
        traduccion: 'Marché des Producteurs Locaux',
        categoria: 'Comercio',
        definicionCorta: 'Marché de plein air du week-end réunissant maraîchers et artisans locaux.',
        contextoCultural: 'Rendez-vous dominical incontournable pour déguster et acheter des fruits exotiques et produits du terroir.'
      },
      ru: {
        termino: 'Feria del Agricultor',
        traduccion: 'Фермерская ярмарка выходного дня',
        categoria: 'Comercio',
        definicionCorta: 'Муниципальный открытый рынок выходных дней с прямыми продажами от местных фермеров.',
        contextoCultural: 'Главное место покупки свежих тропических фруктов, овощей и ремесленных сыров напрямую от производителей.'
      },
      ja: {
        termino: 'Feria del Agricultor',
        traduccion: '農民朝市 (ファーマーズマーケット)',
        categoria: 'Comercio',
        definicionCorta: '週末に各地の広場で開かれる、地元農家直売の青空市。',
        contextoCultural: '新鮮な熱帯果物や無農薬野菜、手作りチーズが手に入る、住民の交流と食文化の中心地です。'
      }
    }
  },

  pura_vida: {
    id: 'pura_vida',
    terminoOriginal: 'Pura Vida',
    traducciones: {
      'es-CR': {
        termino: 'Pura Vida',
        traduccion: 'Pura Vida',
        categoria: 'Cultura',
        definicionCorta: 'Máxima expresión de identidad costarricense: saludo, despedida, gratitud y actitud optimista ante la vida.',
        contextoCultural: 'Sintetiza la paz, la fraternidad ciudadana y la armonía con la naturaleza que define a Costa Rica.'
      },
      'es-ES': {
        termino: 'Pura Vida',
        traduccion: 'Pura Vida (Todo bien / Estupendo)',
        categoria: 'Cultura',
        definicionCorta: 'Lema nacional de bienestar, tranquilidad y optimismo.',
        contextoCultural: 'Se emplea indistintamente como "hola", "adiós", "de nada" o confirmación de que todo marcha de maravilla.'
      },
      en: {
        termino: 'Pura Vida',
        traduccion: 'Pure Life (Full of Life / All Good)',
        categoria: 'Cultura',
        definicionCorta: 'The quintessence of Costa Rican ethos: a greeting, farewell, expression of gratitude, and peaceful lifestyle.',
        contextoCultural: 'Reflects the nation’s commitment to peace, environmental harmony, community warmth, and resilience without stress.'
      },
      zh: {
        termino: 'Pura Vida',
        traduccion: '纯正生活 (悠然生活 / 万事美好)',
        categoria: 'Cultura',
        definicionCorta: '哥斯达黎加国民精神信条：意为问候、告别、感谢和积极豁达的生活态度。',
        contextoCultural: '代表着无军队国家崇尚和平、亲近自然、人际温情和知足常乐的精神哲学。'
      },
      pt: {
        termino: 'Pura Vida',
        traduccion: 'Pura Vida (Tudo Ótimo / Viver em Paz)',
        categoria: 'Cultura',
        definicionCorta: 'Filosofia de vida e cumprimento nacional sinônimo de serenidade, gratidão e bem-estar.',
        contextoCultural: 'Expressa o calor humano costarriquenho, o respeito à biodiversidade e a tranquilidade social.'
      },
      fr: {
        termino: 'Pura Vida',
        traduccion: 'Pure Vie (La Belle Vie / Tout va bien)',
        categoria: 'Cultura',
        definicionCorta: 'Expression emblématique de l’art de vivre costaricien : salutation, gratitude et harmonie.',
        contextoCultural: 'Incarne l’optimisme, la paix sociale, la bienveillance et la symbiose avec la nature.'
      },
      ru: {
        termino: 'Pura Vida',
        traduccion: 'Пура Вида (Чистая жизнь / Всё отлично)',
        categoria: 'Cultura',
        definicionCorta: 'Главный девиз и символ Коста-Рики: приветствие, прощание, благодарность и образ жизни.',
        contextoCultural: 'Отражает миролюбие, радость бытия, душевное спокойствие и гармонию с природой.'
      },
      ja: {
        termino: 'Pura Vida',
        traduccion: 'プラ・ビダ (素晴らしい人生 / 感謝と調和)',
        categoria: 'Cultura',
        definicionCorta: 'コスタリカ人の生き方を表す合言葉：挨拶、感謝、前向きな生き方のすべてを含みます。',
        contextoCultural: '平和憲法、豊かな大自然、そして人々への温かい敬意が込められた国民的アイデンティティです。'
      }
    }
  },

  canton: {
    id: 'canton',
    terminoOriginal: 'Cantón',
    traducciones: {
      'es-CR': {
        termino: 'Cantón',
        traduccion: 'Cantón (Gobierno Local Municipal)',
        categoria: 'Civico-Institucional',
        definicionCorta: 'Subdivisión territorial intermedia de Costa Rica (84 en total), regida por una Municipalidad autónoma.',
        contextoCultural: 'Cada cantón cuenta con Alcaldía y Concejo Municipal electos cada 4 años con presupuesto propio.'
      },
      'es-ES': {
        termino: 'Cantón',
        traduccion: 'Municipio / Término Municipal',
        categoria: 'Civico-Institucional',
        definicionCorta: 'Entidad territorial local con gobierno municipal autónomo (Ayuntamiento).',
        contextoCultural: 'Costa Rica cuenta con 84 cantones divididos en sus 7 provincias.'
      },
      en: {
        termino: 'Canton',
        traduccion: 'Canton (Municipality / County)',
        categoria: 'Civico-Institucional',
        definicionCorta: 'Local administrative subdivision of Costa Rica (84 total), governed by an autonomous municipal government.',
        contextoCultural: 'Led by a popularly elected Mayor and Municipal Council responsible for local governance and infrastructure.'
      },
      zh: {
        termino: 'Canton',
        traduccion: '州 / 市 (地方自治市)',
        categoria: 'Civico-Institucional',
        definicionCorta: '哥斯达黎加二级行政区划（全国共84个），由地方自治政府管理。',
        contextoCultural: '由市民普选产生的市长和市议会负责本地公共工程、税收和社区治理。'
      },
      pt: {
        termino: 'Canton',
        traduccion: 'Cantão (Município)',
        categoria: 'Civico-Institucional',
        definicionCorta: 'Subdivisão administrativa correspondente a um município autônomo (84 no total).',
        contextoCultural: 'Administrado por uma Prefeitura (Alcaldía) e Câmara de Vereadores (Concejo Municipal).'
      },
      fr: {
        termino: 'Canton',
        traduccion: 'Canton (Commune / Municipalité)',
        categoria: 'Civico-Institucional',
        definicionCorta: 'Subdivision territoriale locale autonome dotée d’une mairie (84 cantons au total).',
        contextoCultural: 'Dirigé par un maire et un conseil municipal élus démocratiquement au suffrage universel.'
      },
      ru: {
        termino: 'Canton',
        traduccion: 'Кантон (Муниципальный район / Округ)',
        categoria: 'Civico-Institucional',
        definicionCorta: 'Муниципальная единица самоуправления Коста-Рики (всего 84 кантона).',
        contextoCultural: 'Каждый кантон управляется выборным мэром (алькальдом) и муниципальным советом.'
      },
      ja: {
        termino: 'Canton',
        traduccion: 'カントン (基礎自治体・市)',
        categoria: 'Civico-Institucional',
        definicionCorta: 'コスタリカの基礎自治体（全国に84カントン存在）。市庁舎が管轄。',
        contextoCultural: '市民から選出された市長と市議会が、地域のインフラや市民サービスを独自に運営します。'
      }
    }
  },

  ccdr: {
    id: 'ccdr',
    terminoOriginal: 'CCDR',
    traducciones: {
      'es-CR': {
        termino: 'CCDR',
        traduccion: 'Comité Cantonal de Deportes y Recreación',
        categoria: 'Deporte',
        definicionCorta: 'Órgano municipal adscrito que administra polideportivos, canchas comunales y escuelas formativas.',
        contextoCultural: 'Canaliza los Juegos Deportivos Nacionales y promueve la salud pública física y el talento juvenil local.'
      },
      'es-ES': {
        termino: 'CCDR',
        traduccion: 'Patronato Municipal de Deportes',
        categoria: 'Deporte',
        definicionCorta: 'Entidad municipal encargada de las instalaciones deportivas públicas y el deporte base.',
        contextoCultural: 'Gestiona la disponibilidad y mantenimiento de piscinas, pistas y polideportivos públicos.'
      },
      en: {
        termino: 'CCDR',
        traduccion: 'Cantonal Sports and Recreation Committee',
        categoria: 'Deporte',
        definicionCorta: 'Municipal athletic authority overseeing sports facilities, recreational complexes, and youth sports academies.',
        contextoCultural: 'Responsible for public fields, sports complexes, and athletic community programs in each canton.'
      },
      zh: {
        termino: 'CCDR',
        traduccion: '县体育与休闲委员会',
        categoria: 'Deporte',
        definicionCorta: '负责管理各县公共体育场馆、社区运动设施和青少年运动学校的市政专门机构。',
        contextoCultural: '推动全民健身、维护社区球场设施并选拔青少年参加全国运动会。'
      },
      pt: {
        termino: 'CCDR',
        traduccion: 'Comitê Municipal de Esportes e Lazer',
        categoria: 'Deporte',
        definicionCorta: 'Autarquia municipal que administra ginásios, quadras e escolas esportivas.',
        contextoCultural: 'Fomenta o esporte de base, atletas da comunidade e preservação dos centros esportivos.'
      },
      fr: {
        termino: 'CCDR',
        traduccion: 'Comité Municipal des Sports et Loisirs',
        categoria: 'Deporte',
        definicionCorta: 'Organisme municipal responsable des infrastructures sportives et des clubs pour la jeunesse.',
        contextoCultural: 'Organise les tournois locaux et assure l’entretien des gymnases et terrains omnisports.'
      },
      ru: {
        termino: 'CCDR',
        traduccion: 'Муниципальный комитет по спорту и отдыху',
        categoria: 'Deporte',
        definicionCorta: 'Муниципальный орган, заведующий общественными стадионами, спорткомплексами и детскими секциями.',
        contextoCultural: 'Организует спортивные турниры, следит за состоянием площадок и развивает массовый спорт.'
      },
      ja: {
        termino: 'CCDR',
        traduccion: 'カントン体育・レクリエーション委員会',
        categoria: 'Deporte',
        definicionCorta: '公共スポーツ施設、総合運動場、ジュニア育成クラブを統括する自治体組織。',
        contextoCultural: '市民の健康維持、運動場予約の管理、全国競技大会への選手派遣を担っています。'
      }
    }
  }
};

/**
 * Consulta un término específico en el glosario según el idioma seleccionado
 */
export function getGlossaryTerm(termKey: string, lang: SupportedLanguage = 'es-CR'): GlossaryDefinition | null {
  const normalizedKey = termKey.toLowerCase().replace(/[\s-]/g, '_');
  const termData = COSTA_RICA_GLOSSARY[normalizedKey];
  if (!termData) return null;
  return termData.traducciones[lang] || termData.traducciones['es-CR'];
}

/**
 * Retorna todos los términos del glosario en el idioma solicitado
 */
export function getAllGlossaryTerms(lang: SupportedLanguage = 'es-CR'): GlossaryDefinition[] {
  return Object.values(COSTA_RICA_GLOSSARY).map(
    (term) => term.traducciones[lang] || term.traducciones['es-CR']
  );
}
