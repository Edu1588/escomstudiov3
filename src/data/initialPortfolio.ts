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
    image: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(8).webp",
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
    image: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(38).webp",
    link: "https://escomstudio.com.br",
    destaque: true,
    score: "98%",
    desc: "Experiência visual 3D interativa e catálogo digital para mobiliário de luxo.",
  },
  {
    id: "autosim",
    client: "Autosim Franquias",
    title: "Expansão de Rede & Dashboard B2B",
    category: "EXPANSÃO DE REDE",
    tagType: "DASHBOARD",
    deliverables: "SISTEMA FRANQUIA · PORTAL B2B",
    year: "2024",
    badges: ["DEV", "HM"],
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374496/0263c8292333293669f42df6e2782ea6.mp4",
    image: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/animated%20(63).webp",
    link: "https://escomstudio.com.br",
    destaque: true,
    score: "96%",
    desc: "Portal B2B de expansão de franquias com dashboards analíticos em tempo real.",
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
    image: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(8).webp",
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
    image: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(38).webp",
    link: "https://escomstudio.com.br",
    destaque: true,
    score: "95%",
    desc: "Hub institucional moderno com microinterações e alta velocidade de resposta.",
  },
  {
    id: "rilucci",
    client: "Rilucci Iluminação",
    title: "Catálogo Digital & Produtos LED de Precisão",
    category: "ILUMINAÇÃO TÉCNICA & LED",
    tagType: "CATÁLOGO B2B",
    deliverables: "ARQUITETURA DE CATÁLOGO · B2B",
    year: "2024",
    badges: ["DEV", "SOTD"],
    video: "https://res.cloudinary.com/djw0tqmiw/video/upload/v1790374732/c1a0adede9aafa4edb54d55eff51287b.mp4",
    image: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/animated%20(63).webp",
    link: "https://escomstudio.com.br",
    destaque: true,
    score: "98%",
    desc: "Arquitetura técnica para catálogo B2B de iluminação com filtros de especificação.",
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
    image: "https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(8).webp",
    link: "https://escomstudio.com.br",
    destaque: true,
    score: "94%",
    desc: "Portal de compra e venda de equipamentos fitness seminovos com checkout ágil.",
  },
];
