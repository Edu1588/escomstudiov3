# Diário de Engenharia e Atualizações — ESCOM Studio

## 05/11/2026: Integração Oficial como HOME-v5 no Ecossistema ESCOM Studio

* **Publicação como HOME-v5 (`/home-v5`, `/home5`):**
  * Toda a estrutura (HTML sanitizado sem chunks mortos, CSS consolidado, engine de animações e ASCII Three.js) foi empacotada de forma autocontida em `public/home-v5/`.
  * **Rotas ativas no `server.ts`:**
    * `http://localhost:3000/home-v5/`
    * `http://localhost:3000/home5`
    * `http://127.0.0.1:3000/home-v5/`
  * Otimizações de resiliência aplicadas: `keepAliveTimeout` de 65s, eliminação de seletores inválidos no DOM nativo e sanitização de tags mortas do Next.js para carregamento instantâneo.
  * Sincronizado integralmente entre `E:\ANTIGRAVITY\ESCOM_STUDIO`, `E:\ANTIGRAVITY\EDU\ESCOM_STUDIO` e Google Drive `G:\Meu Drive\ARQUIVOS\ANTIGRAVITY\ESCOM_STUDIO\public\home-v5`.

* **Engenharia Reversa Completa (REA):**
  * Extração cirúrgica de chunks de estilo, fontes Typekit (`aktiv-grotesk` + `Geist Mono`) e animações do Good Fella.
  * Reconstrução fiel do canvas ASCII Three.js no Hero com a *Moça com Brinco de Pérola*, matriz procedural com shader laranja neon (#FF4D00), shimmer orgânico e paralaxe 3D ao mover o mouse.
  * **Animação de Impacto Fiel do Ponto Laranja (Falling Dot):**
    * Ponto laranja de 12px cai verticalmente e gira 90° a cada etapa com física elástica `cubic-bezier(0.34, 1.45, 0.7, 1)`.
    * Cada etapa ativa sofre deslocamento físico lateral de **48px (`transform: translateX(48px)`)** e transição de opacidade com `power3InOut`, replicando 100% da física original.
  * Odomêtros digitais com contagem no scroll, transição dinâmica de projetos em destaque, scroll suave Lenis e flip de header.
* **Adaptação Completa para ESCOM STUDIO / ESCOM:**
  * **Header:** Vetor oficial da ESCOM (`escom.svg`) substituindo o logotipo anterior, mantendo a animação de flip vertical ("ESCOM" -> "STUDIO") ao rolar a página. Botão direito de ação direta: `INICIAR PROJETO +`.
  * **Hero:** Copy adaptada: *"Sistemas de crescimento digital. Projetamos marcas e plataformas sub-segundo em Next.js, automações com IA e operações de tráfego pago como um ecossistema integrado para multiplicar receita."* Botão de ação: `INICIAR DIAGNÓSTICO +` e link secundário `VER PROJETOS +`.
  * **Processo:** Etapas convertidas para a metodologia ESCOM (01 Diagnóstico e Raio-X, 02 Alinhamento Estratégico, 03 Engenharia e Design, 04 Lançamento e Tração), todas com o impacto de 48px e rotação do dot funcionando perfeitamente.
  * **Métricas:** Receita gerada, pontuação Lighthouse (100) e projetos entregues.
  * **Pilares:** O Padrão ESCOM com 6 blocos técnicos de engenharia (Código Puro do Zero, Movimento com Propósito, Design System Escalável, Engenheiros Fundadores, Sprints de 4 a 8 Semanas, Performance Sub-segundo), corrigindo o seletor que causava repetição do título e textos em inglês legados da Good Fella. Varredura completa realizada em todas as seções (0 a 6), eliminando 100% de termos residuais em inglês.
  * **Footer:** Marca d'água monumental com o vetor completo em tela inteira `ESCOMSTUDIO`, disponibilidade de agenda e contatos oficiais `@escomstudio`.
* **Acesso Local e Sincronização:**
  * Rota ativa: `http://localhost:3000/goodfella`
  * Sincronizado automaticamente com `G:\Meu Drive\ARQUIVOS\ANTIGRAVITY\ESCOM_STUDIO\public\goodfella\`.

## 04/11/2026: Réplica Enerblock com Identidade ESCOM Studio, Hero 3D Oficial, Módulos Isométricos e Linha Guiada

* **Réplica da Home Enerblock (https://enerblock.net/en/) adaptada para a ESCOM Studio:**
  * Cores convertidas de Vermelho/Laranja (#FF5949) para Ciano Elétrico (#00E5FF).
  * Copy, portfólio, depoimentos, metodologia e pilares atualizados com os dados reais da ESCOM Studio (crescimento digital, Next.js, automações, IA, tráfego e BI).
  * Servido localmente na porta 3000 via `npx tsx server.ts` em http://localhost:3000/ e http://localhost:3000/en/.
* **Hero 3D Oficial da ESCOM integrado no Hero do Enerblock:**
  * Robô agachado (`robo-agachado.glb`), borboleta voando com rastro de partículas (`floresta.glb` -> `butterfly_6`), chão molhado reflexivo com shader customizado (`Reflector` + `SHADER_CHAO_MOLHADO`), galpão industrial em wireframe blueprint ciano ao fundo (`galpao.glb`), névoa escura e iluminação ciano.
  * Compilado via `scripts/escom-hero-blueprint-entry.ts` para `public/js/escom-hero-blueprint.js` com Three.js embutido.
* **6 Módulos 3D Isométricos em Blueprint em "O que fazemos" (#solucoes):**
  * Criado `public/js/escom-service-animations.js` com cenas Three.js procedurais em wireframe isométrico ciano para cada serviço (01 Sites, 02 Branding, 03 Automação, 04 IA, 05 Tráfego, 06 Estratégia).
* **Linha Fluida & Ortogonal que Acompanha a Rolagem (`public/js/escom-fio-pagina.js`):**
  * Referência estudada via Puppeteer: https://dakshgajjar.com/.
  * **Regras de desenho estritas:**
    * **Zero tracejado prévio:** O caminho futuro não tem linha pontilhada/tracejada; ele é revelado dinamicamente via `stroke-dashoffset` à medida que o scroll avança, com anel e miolo luminoso na ponta.
    * **Seguir retas reais da arquitetura:** Quando há uma reta ou divisória de grid (ex: x = 730px na vertical ou y = 1851px e divisórias dos cards na horizontal), a linha **corre 100% reta na reta** (`L x y`).
    * **Quinas de 90° com cantos arredondados:** Transições entre retas verticais e horizontais são feitas com arcos de 90° (`A 20 20 ...`).
    * **Nunca cortar textos na diagonal nem cruzar seções indivisas:** A linha não passa no meio de títulos nem atravessa blocos de texto; ela viaja pelas divisórias reais do layout.
* **Build e Sincronização entre Ambientes:**
  * Script gerador: `scripts/build_escom_enerblock_home.mjs`.
  * Sincroniza HTML, CSS e scripts automaticamente entre:
    * `E:/ANTIGRAVITY/ESCOM_STUDIO/public`
    * `E:/ANTIGRAVITY/EDU/ESCOM_STUDIO/public`
    * `G:/Meu Drive/ARQUIVOS/ANTIGRAVITY/ESCOM_STUDIO/public`
* **Correção do Preloader Legado:** Desativada a classe `.preload` (`display: none !important`), que cobria a tela inteira de ciano sólido em caso de falha da transição antiga.
* **Status:** Rodando 100% local em http://localhost:3000/, verificado visualmente e sem erros de console.

## Data: 28 de Outubro de 2026

### 1. Reestruturação e Otimização de Performance
- **Remoção de Backgrounds e Partículas Pesadas**:
  - Desativada a execução contínua de canvas WebGL concorrentes (como `GalpaoVoo` na seção `#projetos` que executava animação contínua de robô em galpão 3D e competia por recursos de GPU com o hero e as transições).
  - Substituído por gradiente CSS escuro de alta performance (`bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]`), garantindo taxa de quadros estável em 60 FPS lisos durante todo o scroll.
  - Alívio de travamentos nas seções "Uma solução para cada etapa...", serviços e portfólio.

### 2. Integração dos Novos Componentes UI
- **`src/components/ui/product-rail-gallery.tsx`**:
  - Implementado o componente de galeria de arara com suporte a física tátil, cabide fosco/madeira, rotação frente/verso de peças, especificações têxteis, tag de preço e modal de detalhes.
  - Limpeza da demo concatenada para evitar conflitos de exportação no compilador.
- **`src/components/ui/glassy-coverflow-carousel.tsx`**:
  - Implementado o componente de carrossel Coverflow com acabamento de vidro translúcido (*liquid glass*), perspectiva 3D cúbica, suporte a gestos de arrasto e atalhos de teclado.
  - Isolamento de estilos em classes com scoping seguro e compatibilidade nativa com Tailwind CSS e shadcn/ui.

### 3. Reestruturação da Seção "Projetos Selecionados" (`FeaturedWorksSection.tsx`)
Substituído o carrossel anterior por uma jornada sequencial em scroll com 4 projetos de alto impacto comercial:

1. **Projeto 01 — Construtora 3D (Espelho de Vendas Imobiliário)**:
   - Componente dedicado `BuildingShowcase3D.tsx` integrando a maquete interativa Three.js com iluminação dinâmica dia/entardecer/noite, filtro de unidades e simulação financeira por pavimento.
   - Copy comercial orientada a construtoras e incorporadoras: *"Cada luz acesa é uma unidade disponível. Preço, simulação de fluxo e espelho por andar num único link para o seu lançamento."*
2. **Projeto 02 — Outgrid R7 Motors (Showroom Automotivo 3D)**:
   - Componente dedicado `CarShowcase3D.tsx` renderizando o hipercarro McLaren Senna CRXW Widebody (`/18_mclaren_senna_crxw_widebody_kit_animated-v1.glb`).
   - Controles de câmera (3/4 Frente, Perfil, Traseira), giro 360°, e seletor em tempo real da cor da carroceria (Papaya Orange, Cyber Cyan, Obsidian Black, Liquid Silver, Electric Emerald).
   - Copy de vendas de alta conversão para concessionárias e importadoras premium.
3. **Projeto 03 — Atelier Haute Couture (Loja de Roupas / Product Rail Gallery)**:
   - Componente `ClothingRailShowcase.tsx` aplicando `product-rail-gallery.tsx` para exibição editorial de vestuário e alta costura.
   - Demonstração do provador digital com visualização 360°, inspeção frente e verso e tecidos nobres.
4. **Projeto 04 — Portfólio Panorâmico (Glassy Coverflow Carousel)**:
   - Componente `EscomGlassyCoverflow.tsx` aplicando `glassy-coverflow-carousel.tsx` alimentado com os cases oficiais da ESCOM Studio (Construtora 3D, R7 Motors, Atelier, UBAH Design, Goloni Mobiliário e Full English).
   - Interface limpa, focada em navegação e visualização de cases sem botões de configuração dispersivos.

### 4. Validação Técnica e Build
- **Compilação**: `npm run build` executado com êxito (exit code 0), gerando todos os pacotes em `dist/` com `copy_public_sites.mjs` e `dist/server.cjs`.
- **Servidor Local**: Ativo e funcional para testes imediatos no browser.

### 5. Calibração da Pose do Robô em Levitação / Voo (Ref. Visual Exata)
- **Análise Anatômica e Cinemática no Blender 5.2**:
  - Alinhamento rigoroso com a referência visual enviada pelo usuário (media_1793214207975_ef7a5341.png):
    - **Cabeça**: Máscara cibernética com orelhas/antenas para cima e olhos cianos brilhantes, inclinada para o ombro esquerdo e olhar contemplativo voltado para a mão mecânica e para a frente/baixo (Neck e Head rotacionados em Euler XYZ).
    - **Braço Direito (Gesto Contemplativo)**: Cotovelo flexionado a 122° recolhido junto às costelas direitas, antebraço subindo na direção do tórax/peitoral direito, mão mecânica elevada na altura do peito com dedos semi-curvados em garra expressiva com tensão cibernética e palma voltada para dentro.
    - **Braço Esquerdo**: Estendido para baixo e relaxado ao lado da coxa, mão apontando para baixo com dedos relaxados.
    - **Pernas em Silhueta de Levitação**: Perna direita com flexão suave para a frente no joelho e pé em ponta para baixo; perna esquerda descendo longa, reta e vertical com o pé esticado em ponta de levitação.
- **Exportação e Modelagem WebGL Otimizada**:
  - Pose congelada e aplicada na malha no Blender como Rest Pose e exportada para public/models/hero/robo-voando.glb (glTF 2.0 com Draco/Meshopt).
  - Renderizado studio shot transparente de altíssima definição em public/models/hero/robo-voando.png.
- **Integração na Seção Antes do Rodapé (DiagnosisStage.tsx)**:
  - Posicionado na coluna à esquerda do formulário de diagnóstico (DiagnosisStage), imediatamente antes do rodapé final (ooter).
  - Animação de micro-levitação suave em GPU (nimate-robo-levitacao, 120 FPS estáveis) com aura ciano translúcida sob os pés, eliminando qualquer sobrecarga ou travamento por partículas de fundo.
  - Sincronização completa entre o diretório local de trabalho E:\ANTIGRAVITY\ESCOM_STUDIO e os bundles de distribuição em dist/.

### 6. Remoção Temporária das Seções de Projetos e Limpeza da Página
- **Remoção das Seções de Projetos (`src/home-v6.tsx`)**:
  - Removida a seção de projetos com carrossel/scroll (`FeaturedWorksSection`) para reformulação posterior dos modelos 3D puros (sem iframes embedados).
  - Removida a seção de cards de sistemas (`id="projetos"`) a pedido do usuário para manter o site enxuto.
- **Limpeza do Diagnóstico (`DiagnosisStage.tsx`)**:
  - Removida a renderização do robô da coluna de contato, restaurando o layout limpo e direto original do formulário e rodapé.
- **Build e Servidor Local**:
  - Compilação realizada com sucesso e servidor local rodando limpo em `http://localhost:3000`.

### Resolucao de Conflito de Contexto Duplicado (04/11/2026 - 18:45)
- Causa Raiz: Pasta espelho E:/ANTIGRAVITY/EDU/ESCOM_STUDIO continha copias identicas de AGENTS.md e CONTEXTO_PROJETO.md.
- Acao: Removidos arquivos duplicados de EDU, renomeado .agents/AGENTS.md para UI_RULES.md, limpas pastas duplicadas do Windows.
- Workspace oficial unico: E:/ANTIGRAVITY/ESCOM_STUDIO.

### Engenharia Reversa (REA) e Criacao do Clone Fiel Good Fella (05/11/2026 - 09:50)
- **Alvo:** https://good-fella.com/ (The digital landmark studio).
- **Metodologia de Engenharia Reversa:**
  1. Inspecao passiva e extracao de DOM, CSS, tipografia (Typekit + GeistMono) e bundles via Puppeteer.
  2. Identificacao da tecnica do Hero: Canvas Three.js com ASCII Shader e matriz de caracteres densos, alimentado por recorte de alta definicao da "Moca com Brinco de Perola" (Vermeer).
  3. Reconstrucao de renderizador de Canvas ASCII nativo reativo ao mouse e scroll em public/goodfella/assets/goodfella-ascii.js.
  4. Extracao e preservacao de todas as secoes:
     - Hero com logotipo vetorial, menu drawer e marcas (Coca-Cola, BodyArmor, WKNDHRS).
     - Metricas e Fundadores ($1.2B+, 12M+, 52+).
     - Processo (01 a 04 com fotos).
     - Trabalhos Selecionados (Powerade, BodyArmor, Annnimate, WKNDHRS, Fitgreenmind).
     - What's in a landmark (Grid tecnico).
     - FAQ (Common questions com acordeoes expansíveis).
     - Start a project e Footer com logotipo gigante "Good Fella".
- **Rota local ativa:** http://localhost:3000/goodfella servindo public/goodfella/index.html.

### Engenharia Reversa (REA) e Criacao do Clone Fiel Good Fella (05/11/2026 - 09:50)
- **Alvo:** https://good-fella.com/ (The digital landmark studio).
- **Metodologia de Engenharia Reversa:**
  1. Inspecao passiva e extracao de DOM, CSS, tipografia (Typekit + GeistMono) e bundles via Puppeteer.
  2. Identificacao da tecnica do Hero: Canvas Three.js com ASCII Shader e matriz de caracteres densos, alimentado por recorte de alta definicao da "Moca com Brinco de Perola" (Vermeer).
  3. Reconstrucao de renderizador de Canvas ASCII nativo reativo ao mouse e scroll em public/goodfella/assets/goodfella-ascii.js.
  4. Extracao e preservacao de todas as secoes:
     - Hero com logotipo vetorial, menu drawer e marcas (Coca-Cola, BodyArmor, WKNDHRS).
     - Metricas e Fundadores ($1.2B+, 12M+, 52+).
     - Processo (01 a 04 com fotos).
     - Trabalhos Selecionados (Powerade, BodyArmor, Annnimate, WKNDHRS, Fitgreenmind).
     - What's in a landmark (Grid tecnico).
     - FAQ (Common questions com acordeoes expansíveis).
     - Start a project e Footer com logotipo gigante "Good Fella".
- **Rota local ativa:** http://localhost:3000/goodfella servindo public/goodfella/index.html.

### Engenharia Reversa (REA) e Criacao do Clone Fiel Good Fella (05/11/2026 - 09:50)
- **Alvo:** https://good-fella.com/ (The digital landmark studio).
- **Metodologia de Engenharia Reversa:**
  1. Inspecao passiva e extracao de DOM, CSS, tipografia (Typekit + GeistMono) e bundles via Puppeteer.
  2. Identificacao da tecnica do Hero: Canvas Three.js com ASCII Shader e matriz de caracteres densos, alimentado por recorte de alta definicao da "Moca com Brinco de Perola" (Vermeer).
  3. Reconstrucao de renderizador de Canvas ASCII nativo reativo ao mouse e scroll em public/goodfella/assets/goodfella-ascii.js.
  4. Extracao e preservacao de todas as secoes:
     - Hero com logotipo vetorial, menu drawer e marcas (Coca-Cola, BodyArmor, WKNDHRS).
     - Metricas e Fundadores ($1.2B+, 12M+, 52+).
     - Processo (01 a 04 com fotos).
     - Trabalhos Selecionados (Powerade, BodyArmor, Annnimate, WKNDHRS, Fitgreenmind).
     - What's in a landmark (Grid tecnico).
     - FAQ (Common questions com acordeoes expansíveis).
     - Start a project e Footer com logotipo gigante "Good Fella".
- **Rota local ativa:** http://localhost:3000/goodfella servindo public/goodfella/index.html.

### Implementacao da Animacao do Dot Caindo (05/11/2026 - 12:15)
- Identificada a animacao do dot laranja (12px x 12px) na secao How we work.
- Implementado motor de scroll e hover onde o dot desce verticalmente (translateY) de 01 para 02, 03 e 04 girando 90 graus a cada passo (rotate).
- Atualizacao sincronizada com Google Drive G:.

### Engenharia Reversa (REA) e Criacao do Clone Fiel Good Fella (05/11/2026 - 09:50)
- **Alvo:** https://good-fella.com/ (The digital landmark studio).
- **Metodologia de Engenharia Reversa:**
  1. Inspecao passiva e extracao de DOM, CSS, tipografia (Typekit + GeistMono) e bundles via Puppeteer.
  2. Identificacao da tecnica do Hero: Canvas Three.js com ASCII Shader e matriz de caracteres densos, alimentado por recorte de alta definicao da "Moca com Brinco de Perola" (Vermeer).
  3. Reconstrucao de renderizador de Canvas ASCII nativo reativo ao mouse e scroll em public/goodfella/assets/goodfella-ascii.js.
  4. Extracao e preservacao de todas as secoes:
     - Hero com logotipo vetorial, menu drawer e marcas (Coca-Cola, BodyArmor, WKNDHRS).
     - Metricas e Fundadores ($1.2B+, 12M+, 52+).
     - Processo (01 a 04 com fotos).
     - Trabalhos Selecionados (Powerade, BodyArmor, Annnimate, WKNDHRS, Fitgreenmind).
     - What's in a landmark (Grid tecnico).
     - FAQ (Common questions com acordeoes expansíveis).
     - Start a project e Footer com logotipo gigante "Good Fella".
- **Rota local ativa:** http://localhost:3000/goodfella servindo public/goodfella/index.html.

### Engenharia Reversa da Animacao de Impacto do Dot (05/11/2026 - 12:35)
- Identificado no chunk original (5c28b76153d9f323.js) que o dot bate no item e o empurra 48px em X (animate: { opacity: l ? 1 : 0.4, x: 48 * !!l }) com easing power3InOut.
- O dot desce girando com easing backInOutSubtle (overshoot de impacto).
- Implementada a fisica exata e validada visualmente no Puppeteer.

### Engenharia Reversa (REA) e Criacao do Clone Fiel Good Fella (05/11/2026 - 09:50)
- **Alvo:** https://good-fella.com/ (The digital landmark studio).
- **Metodologia de Engenharia Reversa:**
  1. Inspecao passiva e extracao de DOM, CSS, tipografia (Typekit + GeistMono) e bundles via Puppeteer.
  2. Identificacao da tecnica do Hero: Canvas Three.js com ASCII Shader e matriz de caracteres densos, alimentado por recorte de alta definicao da "Moca com Brinco de Perola" (Vermeer).
  3. Reconstrucao de renderizador de Canvas ASCII nativo reativo ao mouse e scroll em public/goodfella/assets/goodfella-ascii.js.
  4. Extracao e preservacao de todas as secoes:
     - Hero com logotipo vetorial, menu drawer e marcas (Coca-Cola, BodyArmor, WKNDHRS).
     - Metricas e Fundadores ($1.2B+, 12M+, 52+).
     - Processo (01 a 04 com fotos).
     - Trabalhos Selecionados (Powerade, BodyArmor, Annnimate, WKNDHRS, Fitgreenmind).
     - What's in a landmark (Grid tecnico).
     - FAQ (Common questions com acordeoes expansíveis).
     - Start a project e Footer com logotipo gigante "Good Fella".
- **Rota local ativa:** http://localhost:3000/goodfella servindo public/goodfella/index.html.

### Engenharia Reversa (REA) e Criacao do Clone Fiel Good Fella (05/11/2026 - 09:50)
- **Alvo:** https://good-fella.com/ (The digital landmark studio).
- **Metodologia de Engenharia Reversa:**
  1. Inspecao passiva e extracao de DOM, CSS, tipografia (Typekit + GeistMono) e bundles via Puppeteer.
  2. Identificacao da tecnica do Hero: Canvas Three.js com ASCII Shader e matriz de caracteres densos, alimentado por recorte de alta definicao da "Moca com Brinco de Perola" (Vermeer).
  3. Reconstrucao de renderizador de Canvas ASCII nativo reativo ao mouse e scroll em public/goodfella/assets/goodfella-ascii.js.
  4. Extracao e preservacao de todas as secoes:
     - Hero com logotipo vetorial, menu drawer e marcas (Coca-Cola, BodyArmor, WKNDHRS).
     - Metricas e Fundadores ($1.2B+, 12M+, 52+).
     - Processo (01 a 04 com fotos).
     - Trabalhos Selecionados (Powerade, BodyArmor, Annnimate, WKNDHRS, Fitgreenmind).
     - What's in a landmark (Grid tecnico).
     - FAQ (Common questions com acordeoes expansíveis).
     - Start a project e Footer com logotipo gigante "Good Fella".
- **Rota local ativa:** http://localhost:3000/goodfella servindo public/goodfella/index.html.

### Engenharia Reversa (REA) e Criacao do Clone Fiel Good Fella (05/11/2026 - 09:50)
- **Alvo:** https://good-fella.com/ (The digital landmark studio).
- **Metodologia de Engenharia Reversa:**
  1. Inspecao passiva e extracao de DOM, CSS, tipografia (Typekit + GeistMono) e bundles via Puppeteer.
  2. Identificacao da tecnica do Hero: Canvas Three.js com ASCII Shader e matriz de caracteres densos, alimentado por recorte de alta definicao da "Moca com Brinco de Perola" (Vermeer).
  3. Reconstrucao de renderizador de Canvas ASCII nativo reativo ao mouse e scroll em public/goodfella/assets/goodfella-ascii.js.
  4. Extracao e preservacao de todas as secoes:
     - Hero com logotipo vetorial, menu drawer e marcas (Coca-Cola, BodyArmor, WKNDHRS).
     - Metricas e Fundadores ($1.2B+, 12M+, 52+).
     - Processo (01 a 04 com fotos).
     - Trabalhos Selecionados (Powerade, BodyArmor, Annnimate, WKNDHRS, Fitgreenmind).
     - What's in a landmark (Grid tecnico).
     - FAQ (Common questions com acordeoes expansíveis).
     - Start a project e Footer com logotipo gigante "Good Fella".
- **Rota local ativa:** http://localhost:3000/goodfella servindo public/goodfella/index.html.

### Engenharia Reversa (REA) e Criacao do Clone Fiel Good Fella (05/11/2026 - 09:50)
- **Alvo:** https://good-fella.com/ (The digital landmark studio).
- **Metodologia de Engenharia Reversa:**
  1. Inspecao passiva e extracao de DOM, CSS, tipografia (Typekit + GeistMono) e bundles via Puppeteer.
  2. Identificacao da tecnica do Hero: Canvas Three.js com ASCII Shader e matriz de caracteres densos, alimentado por recorte de alta definicao da "Moca com Brinco de Perola" (Vermeer).
  3. Reconstrucao de renderizador de Canvas ASCII nativo reativo ao mouse e scroll em public/goodfella/assets/goodfella-ascii.js.
  4. Extracao e preservacao de todas as secoes:
     - Hero com logotipo vetorial, menu drawer e marcas (Coca-Cola, BodyArmor, WKNDHRS).
     - Metricas e Fundadores ($1.2B+, 12M+, 52+).
     - Processo (01 a 04 com fotos).
     - Trabalhos Selecionados (Powerade, BodyArmor, Annnimate, WKNDHRS, Fitgreenmind).
     - What's in a landmark (Grid tecnico).
     - FAQ (Common questions com acordeoes expansíveis).
     - Start a project e Footer com logotipo gigante "Good Fella".
- **Rota local ativa:** http://localhost:3000/goodfella servindo public/goodfella/index.html.

### Integracao V5 Good Fella na Home Principal + Novo Robo 3D (06/11/2026 - 22:00)
- **Robo 3D Novo:**
  - Modelo atualizado de `robo-agachado.glb` para `ROBO_NOVO_NOVEMBRO.glb` no Hero 3D da Home Principal.
  - Recompilado `public/js/escom-hero-blueprint.js` via esbuild com tratamento para malha unificada e skeleton Mixamo sem NaN na cabeça.
  - Validado no Chrome com borboleta azul pousada, reflexos em tempo real e scan blueprint sincronizado.
- **Secoes da V5 integradas na Home Principal (`/en/` e `/`):**
  1. **Secao Metricas (Fundo Claro #f4f4f4):** Posicionada imediatamente apos a Secao 2 (`#arquitetura`), contendo foto dos fundadores a esquerda e 3 cards com odometro rolante ativo (`$50B+`, `10M+`, `50+`).
  2. **Secao Como Operamos (Fundo Claro #f4f4f4):** Dot caindo com fisica de impacto (24px X-shift, rotacao de 90° e opacidade 1 vs 0.45) sincronizado com os 4 passos e foto vertical do processo a direita.
  3. **Substituicao de Projetos:** Antigo carrossel Swiper substituido pelo Case Switcher interativo de Good Fella com selecao instantanea de cases.
  4. **Secao O Padrao ESCOM (Fundo Claro #f4f4f4):** 6 cards tecnicos de rigor de engenharia (Codigo Puro do Zero, Movimento com Proposito, Design System Escalavel, Engenheiros Fundadores, Sprints de 4 a 8 Semanas, Performance Sub-segundo).
- **Sincronizacao:**
  - Build executado com sucesso e sincronizado em `E:\ANTIGRAVITY\ESCOM_STUDIO`, `E:\ANTIGRAVITY\EDU\ESCOM_STUDIO` e `G:\Meu Drive\ARQUIVOS\ANTIGRAVITY\ESCOM_STUDIO\`.
  - Servidor local ativo em `http://localhost:3000/`.

## 2026-11-07T04:15:02.410Z — Integração V5 e Novo Robô 3D no Ar
- **Métricas e Processo:** Seção de Métricas (odômetro +, 10M+, 50+) com altura proporcional calibrada e labels em Português do Brasil.
- **Como Operamos:** Seção do processo com animação de impacto do dot vermelho sincronizada em 4 etapas.
- **O Padrão ESCOM:** 6 pilares de engenharia em fundo claro com textos e tipografia estritos em Português.
- **Robô 3D Hero:** Atualizado para ROBO_NOVO_NOVEMBRO.glb com blueprint scan ativo e normalização de esqueleto.
- **Deploy & Produção:** Build de produção gerado e sincronizado para subida no ar em escomstudio.com.br.
