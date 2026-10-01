export interface PortfolioItem {
  id: string;
  client: string;
  title: string;
  category: string;
  tagType: string;
  deliverables: string;
  year: string;
  badges: string[];
  video: string;
  image: string;
  link: string;
  destaque: boolean;
  score?: string;
  desc?: string;
}

export const INITIAL_PORTFOLIO_PROJECTS: PortfolioItem[] = [
  {
    id: "gavioes",
    client: "Academia Gaviões",
    title: "Plataforma & Web App de Alta Conversão",
    category: "FRANQUIAS & ECOSSISTEMA",
    tagType: "WEB APP",
    deliverables: "UI/UX · WEB APP · CRO",
    year: "2025",
    badges: ["DEV", "SOTD"],
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374497/b3ecccbe43103abe5da4f3b610af3a37.mp4",
    image: "/portfolio-thumbs/gavioes.webp",
    link: "https://escomstudio.com.br",
    destaque: true,
    score: "99%",
    desc: "Plataforma digital completa para rede de academias com mais de 40 unidades.",
  },
  {
    id: "ubah",
    client: "Ubah Design",
    title: "Experiência 3D Brand & Mobiliário High-End",
    category: "HIGH-END DESIGN & MÓVEIS",
    tagType: "3D BRAND",
    deliverables: "CATÁLOGO DIGITAL · BRANDING",
    year: "2025",
    badges: ["SOTD", "PRO"],
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374497/044516c3efd6b312e96495faa8d4f9ef.mp4",
    image: "/portfolio-thumbs/ubah.webp",
    link: "https://escomstudio.com.br",
    destaque: true,
    score: "98%",
    desc: "Experiência visual 3D interativa e catálogo digital para mobiliário de luxo.",
  },
  {
    id: "vivant",
    client: "Vivant",
    title: "Identidade Visual & Experiência Digital",
    category: "BRANDING & DIGITAL",
    tagType: "BRANDING",
    deliverables: "IDENTIDADE VISUAL · DIGITAL",
    year: "2024",
    badges: ["DEV", "HM"],
    video: "https://pub-1e5b4001b36b47e28e6a2fb775966a79.r2.dev/previews/vivant.mp4",
    image: "/portfolio-thumbs/vivant.webp",
    link: "https://escomstudio.com.br",
    destaque: true,
    score: "96%",
    desc: "Projeto de identidade visual e experiência digital para a marca Vivant.",
  },
  {
    id: "escola-cera",
    client: "Escola Cera",
    title: "Portal de Matrículas & Captação Escolar",
    category: "EDUCAÇÃO INFANTIL",
    tagType: "PORTAL",
    deliverables: "PORTAL MATRÍCULAS · CAPTAÇÃO",
    year: "2024",
    badges: ["DEV", "SOTD"],
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374502/043a2a2d03caf1f8adc4e143b2f976c4.mp4",
    image: "/portfolio-thumbs/escola-cera.webp",
    link: "https://escomstudio.com.br",
    destaque: true,
    score: "97%",
    desc: "Plataforma focada em matrícula digital e captação de novos alunos.",
  },
  {
    id: "fabrica",
    client: "Fábrica Publicidade",
    title: "Hub Institucional 2026 & Engenharia Web",
    category: "POSICIONAMENTO DIGITAL",
    tagType: "WEBSITE",
    deliverables: "ENGENHARIA WEB · IDENTIDADE",
    year: "2024",
    badges: ["HM", "DEV"],
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374501/dk5kshrywj6gti0f816w.mp4",
    image: "/portfolio-thumbs/fabrica.webp",
    link: "https://escomstudio.com.br",
    destaque: true,
    score: "95%",
    desc: "Hub institucional moderno com microinterações e alta velocidade de resposta.",
  },
  {
    id: "parrot",
    client: "Parrot",
    title: "Plataforma Digital & Comunicação Visual",
    category: "COMUNICAÇÃO & DESIGN",
    tagType: "WEBSITE",
    deliverables: "PLATAFORMA DIGITAL · DESIGN",
    year: "2024",
    badges: ["DEV", "SOTD"],
    video: "https://pub-1e5b4001b36b47e28e6a2fb775966a79.r2.dev/previews/parrot.mp4",
    image: "/portfolio-thumbs/parrot.webp",
    link: "https://escomstudio.com.br",
    destaque: true,
    score: "98%",
    desc: "Plataforma digital e comunicação visual para a marca Parrot.",
  },
  {
    id: "proge",
    client: "Proge Fitness",
    title: "Sistema de Compra de Usados & E-Commerce",
    category: "EQUIPAMENTOS DE ACADEMIA",
    tagType: "E-COMMERCE",
    deliverables: "PORTAL USADOS · E-COMMERCE",
    year: "2024",
    badges: ["HM", "PRO"],
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374497/450e2001cc633e92a38d435f6f4c232b.mp4",
    image: "/portfolio-thumbs/proge.webp",
    link: "https://escomstudio.com.br",
    destaque: true,
    score: "94%",
    desc: "Portal de compra e venda de equipamentos fitness seminovos com checkout ágil.",
  },
];
