---
name: web-design-guidelines
description: Diretrizes de Web Design e Validação Final para Landing Pages de Alta Conversão da ESCOM Studio. Inclui checklist de responsividade, contraste, acessibilidade, animações GSAP e heurísticas de UX.
---

# Web Design Guidelines & QA Framework

## 1. Princípios de Visual Design High-End
- **Color Palette & HSL Curated Tokens:** Evitar cores genéricas. Utilizar paletasTailwind customizadas com suporte a Dark Mode premium (Fundo `#0B1120` ou `#0A0A0A`, acentos Teal `#0284C7`, Gold `#F59E0B` e Cyan `#00D1FF`).
- **Modern Typography:** Títulos em fontes serifadas/elegantes como `Playfair Display` ou `Anton`, corpo do texto em `Plus Jakarta Sans` ou `Inter`.
- **Glassmorphism & Micro-interações:** Navegação com `backdrop-filter: blur(16px)`, botões com efeitos shimmer de brilho em CSS (`btn-pdf-shimmer`), hover com elevação de cards em 3D.
- **Zero Dash Rule:** É proibido usar travessões ou meia-riscas (`—` ou `-`) na copy em português.

## 2. Checklist de Validação Final (QA de UX & Performance)
1. **Responsividade Total:** Testar breakpoints Mobile (375px), Tablet (768px) e Desktop (1280px+).
2. **SEO & Metadados:**
   - Tag `<title>` única e descritiva.
   - Tag `<meta name="description">` persuasiva.
   - JSON-LD Schema.org (`Dentist`, `LocalBusiness`, etc.).
   - Metatags OpenGraph completos (`og:title`, `og:description`, `og:image`).
3. **Arquitetura de 15 Seções Estritas:**
   - **Bloco A:** Banner Fixo de Urgência / Proposta no topo.
   - **Bloco B (9+ seções do cliente):** Header, Hero High-End, Agitação da Dor, Solução, Diferenciais, Como Funciona, Prova Social/Depoimentos, FAQ Interativo, CTA Principal.
   - **Bloco C (3 seções ESCOM no rodapé):** Visualizador de Dossiê Estratégico, Oferta R$ 990 + Upsells e Footer Institucional de Aceite/Confidencialidade.
4. **Chrome DevTools & Performance Audit:**
   - Verificar ausência de erros no console JavaScript.
   - Garantir carregamento rápido com CDNs estáticas (Tailwind, FontAwesome 6, Google Fonts).
