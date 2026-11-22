export const LANGUAGES = [
  { code: "uk", label: "UA", name: "🇺🇦 Українська" },
  { code: "en", label: "EN", name: "🇬🇧 English" },
  { code: "pl", label: "PL", name: "🇵🇱 Polski" },
  { code: "fr", label: "FR", name: "🇫🇷 Français" },
  { code: "pt", label: "PT", name: "🇵🇹 Português" },
  { code: "es", label: "ES", name: "🇪🇸 Español" },
  { code: "zh", label: "ZH", name: "🇨🇳 中文" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

export const DICTIONARY: Record<
  LangCode,
  {
    all: string;
    searchPlaceholder: string;
    admin: string;
    freshNews: string;
    categoryMaterials: string;
    notFound: string;
    backHome: string;
    popular: string;
    socials: string;
    communityBadge: string;
    communityTitle: string;
    communityDesc: string;
    addPost: string;
    share: string;
    comments: string;
    prev: string;
    next: string;
    pageOf: string;
  }
> = {
  uk: {
    all: "Усі",
    searchPlaceholder: "Пошук...",
    admin: "Адмінка",
    freshNews: "Свіжі новини та статті",
    categoryMaterials: "Матеріали рубрики",
    notFound: "Публікацій цією мовою поки що немає.",
    backHome: "← Повернутися на головну",
    popular: "Популярне",
    socials: "Ми у соцмережах",
    communityBadge: "Спільнота",
    communityTitle: "Живи, твори, грай!",
    communityDesc: "Читайте свіжі новини ігрової індустрії, огляди та кіберспорт.",
    addPost: "Додати матеріал",
    share: "Поділитися новиною:",
    comments: "Коментарі",
    prev: "← Попередня",
    next: "Наступна →",
    pageOf: "Сторінка",
  },
  en: {
    all: "All",
    searchPlaceholder: "Search...",
    admin: "Admin",
    freshNews: "Latest News & Articles",
    categoryMaterials: "Category Posts",
    notFound: "No articles found in this language yet.",
    backHome: "← Back to Home",
    popular: "Popular",
    socials: "Follow Us",
    communityBadge: "Community",
    communityTitle: "Live, Create, Play!",
    communityDesc: "Read the latest gaming industry news, reviews, and esports.",
    addPost: "Add Article",
    share: "Share this article:",
    comments: "Comments",
    prev: "← Previous",
    next: "Next →",
    pageOf: "Page",
  },
  pl: {
    all: "Wszystkie",
    searchPlaceholder: "Szukaj...",
    admin: "Panel",
    freshNews: "Najnowsze wiadomości i artykuły",
    categoryMaterials: "Materiały z kategorii",
    notFound: "Brak publikacji w tym języku.",
    backHome: "← Powrót na stronę główną",
    popular: "Popularne",
    socials: "Social media",
    communityBadge: "Społeczność",
    communityTitle: "Żyj, twórz, graj!",
    communityDesc: "Czytaj najnowsze wiadomości ze świata gier, recenzje i e-sport.",
    addPost: "Dodaj materiał",
    share: "Udostępnij artykuł:",
    comments: "Komentarze",
    prev: "← Poprzednia",
    next: "Następna →",
    pageOf: "Strona",
  },
  fr: {
    all: "Tout",
    searchPlaceholder: "Rechercher...",
    admin: "Admin",
    freshNews: "Dernières actualités et articles",
    categoryMaterials: "Articles de la rubrique",
    notFound: "Aucune publication dans cette langue pour le moment.",
    backHome: "← Retour à l'accueil",
    popular: "Populaire",
    socials: "Réseaux sociaux",
    communityBadge: "Communauté",
    communityTitle: "Vivez, créez, jouez !",
    communityDesc: "Lisez les dernières actualités du jeu vidéo, tests et e-sport.",
    addPost: "Ajouter un article",
    share: "Partager cet article :",
    comments: "Commentaires",
    prev: "← Précédent",
    next: "Suivant →",
    pageOf: "Page",
  },
  pt: {
    all: "Todos",
    searchPlaceholder: "Pesquisar...",
    admin: "Admin",
    freshNews: "Últimas notícias e artigos",
    categoryMaterials: "Materiais da categoria",
    notFound: "Ainda não há publicações neste idioma.",
    backHome: "← Voltar ao início",
    popular: "Popular",
    socials: "Redes sociais",
    communityBadge: "Comunidade",
    communityTitle: "Viva, crie, jogue!",
    communityDesc: "Leia as últimas notícias da indústria de jogos, análises e e-sports.",
    addPost: "Adicionar artigo",
    share: "Compartilhar notícia:",
    comments: "Comentários",
    prev: "← Anterior",
    next: "Próxima →",
    pageOf: "Página",
  },
  es: {
    all: "Todo",
    searchPlaceholder: "Buscar...",
    admin: "Admin",
    freshNews: "Últimas noticias y artículos",
    categoryMaterials: "Materiales de la categoría",
    notFound: "Aún no hay publicaciones en este idioma.",
    backHome: "← Volver al inicio",
    popular: "Popular",
    socials: "Redes sociales",
    communityBadge: "Comunidad",
    communityTitle: "¡Vive, crea, juega!",
    communityDesc: "Lee las últimas noticias de videojuegos, reseñas y esports.",
    addPost: "Añadir artículo",
    share: "Compartir noticia:",
    comments: "Comentarios",
    prev: "← Anterior",
    next: "Siguiente →",
    pageOf: "Página",
  },
  zh: {
    all: "全部",
    searchPlaceholder: "搜索...",
    admin: "管理后台",
    freshNews: "最新资讯与文章",
    categoryMaterials: "分类文章",
    notFound: "暂无该语言的文章。",
    backHome: "← 返回首页",
    popular: "热门文章",
    socials: "社交媒体",
    communityBadge: "社区",
    communityTitle: "生活、创造、游戏！",
    communityDesc: "阅读最新的游戏行业新闻、评测与电子竞技资讯。",
    addPost: "发布文章",
    share: "分享文章：",
    comments: "评论",
    prev: "← 上一页",
    next: "下一页 →",
    pageOf: "第",
  },
};

export function getDict(lang?: string) {
  const valid = LANGUAGES.find((l) => l.code === lang)?.code || "uk";
  return { lang: valid, t: DICTIONARY[valid] };
}

const CATEGORY_TRANSLATIONS: Record<string, Record<LangCode, string>> = {
  igry: { uk: "Ігри", en: "Games", pl: "Gry", fr: "Jeux", pt: "Jogos", es: "Juegos", zh: "游戏" },
  cybersport: { uk: "Кіберспорт", en: "Esports", pl: "E-sport", fr: "E-sport", pt: "E-sports", es: "Esports", zh: "电子竞技" },
  kino: { uk: "Кіно", en: "Movies", pl: "Kino", fr: "Cinéma", pt: "Cinema", es: "Cine", zh: "电影" },
  novyny: { uk: "Новини", en: "News", pl: "Wiadomości", fr: "Actualités", pt: "Notícias", es: "Noticias", zh: "新闻" },
  oglyady: { uk: "Огляди", en: "Reviews", pl: "Recenzje", fr: "Tests", pt: "Análises", es: "Reseñas", zh: "评测" },
};

export function translateCategory(slug: string, fallbackName: string, lang: LangCode) {
  return CATEGORY_TRANSLATIONS[slug]?.[lang] || fallbackName;
}
