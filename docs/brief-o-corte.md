# ESCOM STUDIO — Brief de Scroll Storytelling ("O Corte")

> Documento de instrução para o agente de código. Ler inteiro antes de mexer no site.
> Site em produção: https://escomstudio.com.br/
> Status: **GUARDADO — aguardando ordem do Eduardo para iniciar a Fase 1.**

## 0. Antes de começar (obrigatório)
- Ler o código atual e mapear as seções existentes da home (hero, serviços, cases, CTA, footer etc.). Os "atos" se encaixam nas seções existentes — **não recriar conteúdo/copy do zero**.
- **NÃO alterar o hero.** Robô agachado apreciando a borboleta, headline e layout ficam exatamente como estão. Permitido apenas: indicador de scroll e gatilhos de animação que começam depois que o usuário rola.
- Preservar identidade visual: dark tech, fundo `#030405`, acentos verde-neon, tipografia editorial atual.
- Trabalhar em fases (seção 7), entregando cada fase funcionando antes de seguir.

## 1. Conceito
O site inteiro conta uma única história com scroll: **força com sensibilidade**.
- **Robô**: máquina de precisão — corta o caos digital e constrói sistemas.
- **Borboleta**: contraponto frágil — o que ele persegue e protege.
- **Linha (o fio)**: inspirada no fio contínuo de https://dakshgajjar.com/. Nasce do corte da katana de luz e atravessa o site inteiro costurando as seções. Começa como corte, termina como conexão com o visitante.

Narrativa de negócio: presença digital caótica → ESCOM diagnostica → constrói (sites, marca, automação, IA, tráfego) → prova resultados → entrega ao cliente.

## 2. Roteiro por atos

### Ato 0 — Hero (INTACTO)
Robô agachado apreciando a borboleta. Sem mudanças. Apenas microcopy discreto de scroll ("role para continuar").

### Ato 1 — O Corte (hero → seção 2)
- Borboleta levanta voo e sai de quadro.
- Robô se ergue devagar, olha na direção dela e projeta uma katana de luz verde-neon.
- Corte diagonal divide a tela: as duas metades do hero deslizam em direções opostas, revelando a seção 2.
- A ponta do corte permanece brilhando e vira o início da linha.
- Sentido: não corta por agressão — corta o caos para alcançar algo delicado.

### Ato 2 — O Diagnóstico (problema/contexto)
- Robô emerge do solo (partículas/poeira digital) e transita lateralmente.
- Por onde passa, boxes de informação aparecem como escaneados (site lento, marca sem identidade, processos manuais, tráfego sem retorno — adaptar à copy existente).
- Contorno de cada box desenhado pela linha.
- Borboleta aparece de relance (pousa num box e sai).

### Ato 3 — A Construção (serviços)
Linha costura cada serviço em sequência (seguir ordem real do site): Sites → Marca → Automação → IA → Tráfego. Katana como ferramenta, micro-cena por serviço:
- **Sites**: corta um bloco bruto → revela layout limpo
- **Marca**: linha forma um monograma que se encaixa
- **Automação**: linha vira fluxo de nós conectados
- **IA**: olho do robô acende; linha pulsa como sinal neural
- **Tráfego**: linha vira gráfico subindo
- Borboleta cruza a linha em algum momento.

### Ato 4 — A Prova (cases/resultados)
- Robô em segundo plano, observando.
- Linha vira timeline conectando os cases; números com contadores animados.
- Tom: "missão cumprida, mas falta uma coisa".

### Ato 5 — A Catarse (CTA final)
- Tela escurece. Restam linha, robô e katana acesa.
- Borboleta volta e pousa na lâmina de luz (tensão).
- Robô desliga a katana com cuidado; borboleta passa para a mão dele.
- Pela primeira vez ele vira e olha para o usuário, na mesma pose agachada do hero (rima visual: mesmo enquadramento/escala) — agora oferecendo a borboleta.
- Borboleta voa da mão até o cursor e passa a segui-lo, puxando a ponta da linha.
- Texto: "Tecnologia de precisão. Feita com cuidado." (placeholder — confirmar)
- CTA "Puxe o fio": usuário arrasta a linha até o botão. Ao soltar, a linha fecha em loop formando o logo ESCOM e abre o contato (formulário/WhatsApp existentes).

**Por que funciona**: começa e termina com o robô agachado diante da borboleta. No início ele só observa; no final, entrega ao visitante.

## 3. Especificação técnica

### Stack de animação
- GSAP + ScrollTrigger (pin + scrub por ato), MotionPathPlugin para a ponta da linha.
- Lenis para smooth scroll.
- Se já houver lib equivalente no projeto, avaliar antes de trocar.

### Robô — sequências de imagem
- `<canvas>`, frame controlado pelo progresso do ScrollTrigger.
- Uma sequência por ato (60–120 frames cada). WebP/AVIF, fundo transparente ou idêntico ao do site.
- Pré-carregar a sequência do próximo ato; mostrar o primeiro frame imediatamente.
- Frames ainda serão gerados (vídeo IA → frames). Placeholders em `assets/robot/act-N/frame_0001.webp…`, componente aceita qualquer quantidade via config.

| Ato | Sequência |
|---|---|
| 1 | levantar + olhar + projetar katana + corte diagonal |
| 2 | emergir do solo + caminhada lateral (loopável) |
| 3 | micro-ações por serviço (clipes curtos) |
| 4 | idle observando |
| 5 | borboleta na lâmina → desligar katana → virar → agachar oferecendo |

### Borboleta
- Elemento separado do robô (sprite em canvas ou Lottie leve): voa livre, pousa em boxes, segue o cursor no Ato 5.
- Voo com path + leve ruído (não linear).

### Linha (o fio)
- Um único SVG path contínuo em `absolute` sobre a página inteira, recalculado no resize a partir das posições reais das seções.
- Desenho atrelado ao progresso global do scroll via `stroke-dasharray`/`stroke-dashoffset`.
- Ponta brilhante seguindo o path + glow (`feGaussianBlur` ou path duplicado com blur). Cor: verde-neon da marca.
- No Ato 5 a ponta se desprende e vira corda com física simples (verlet/spring), segue o cursor e pode ser arrastada.

### Corte do hero
Duplicar o hero em duas camadas com `clip-path: polygon()` diagonal complementar e animar cada metade para lados opostos.

## 3.1 Animação da linha (detalhamento)

**a) Tracejado do tamanho da linha**
```js
const path = document.querySelector('#fio');
const len = path.getTotalLength();
path.style.strokeDasharray = len;
path.style.strokeDashoffset = len; // 0 = 100% desenhada
```

**b) Amarrar ao scroll** (rolar para trás "desdesenha")
```js
gsap.to(path, {
  strokeDashoffset: 0, ease: 'none',
  scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: true }
});
```

**c) Path gerado das seções reais** — marcar pontos com `data-fio`:
```js
function buildPath() {
  const pts = [...document.querySelectorAll('[data-fio]')].map(el => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + scrollY + r.height / 2 };
  });
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], my = (a.y + b.y) / 2;
    d += ` C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
  }
  path.setAttribute('d', d);
}
```
- Recalcular no resize e após fontes/imagens carregarem; recalcular `len` e `ScrollTrigger.refresh()`.
- Trechos figurativos (monograma, gráfico, logo final) desenhados em vetor e concatenados; o código só faz as conexões.

**d) Ponta brilhante**
```js
ScrollTrigger.create({
  trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: true,
  onUpdate: s => {
    const p = path.getPointAtLength(len * s.progress);
    gsap.set('#ponta', { x: p.x, y: p.y });
  }
});
```
```html
<filter id="glow">
  <feGaussianBlur stdDeviation="6" result="b"/>
  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
```

**e) Efeito "tecer"** (ref. dakshgajjar.com): duas cópias do path com o mesmo offset — A atrás do conteúdo; B na frente, recortada por mask/clip-path só nos trechos que passam por cima.

**f) Sincronização com os atos**
- Uma timeline GSAP por ato animando só o intervalo de comprimento daquele ato (ex.: Ato 1 = 0–8% de `len`).
- Durante pins, a linha pode segurar ou acelerar junto com a cena.
- Boxes/serviços aparecem quando a ponta chega ao respectivo `data-fio`.

**g) Final: linha vira corda (Ato 5)**
- Último trecho vira corda simulada: ~20–30 pontos com restrição de distância (Verlet), em `requestAnimationFrame`.
- Último ponto segue cursor/borboleta; `d` redesenhado a cada frame.
- Ao soltar perto do CTA: interpolar pontos para o contorno do logo ESCOM (amostrado com `getPointAtLength`) → corda fecha no logo → abre contato.
- Reduced motion: pular física, mostrar logo formado e botão.

## 4. Mobile
- Menos frames / resolução menor.
- Linha simplificada, predominantemente vertical.
- Ato 5: toque longo / arrastar curto; borboleta segue o toque.
- Testar em celular intermediário.

## 5. Acessibilidade e performance
- `prefers-reduced-motion`: sem scrub de sequências e sem física; frames-chave estáticos e linha já desenhada. Conteúdo e CTA acessíveis.
- CTA final com botão normal clicável como alternativa ao "puxe o fio".
- Texto sempre no HTML (SEO); animação só como camada visual.
- Lazy-load das sequências; não bloquear o LCP do hero.

## 6. Arquitetura sugerida
- Um módulo por ato (`act1-cut`, `act2-diagnosis`, …) + compartilhados: `thread`, `butterfly`, `frameSequence`.
- Config central com nº de frames, caminhos e pontos de pin por ato (trocar placeholders sem mexer em lógica).

## 7. Fases de implementação
1. Mapear seções existentes e propor encaixe dos atos (**mostrar antes de codar**).
2. Linha contínua atravessando o site com scroll (sem robô).
3. Ato 1: corte do hero com clip-path + nascimento da linha (placeholder do robô).
4. Componente de sequência de frames + placeholders de todos os atos.
5. Borboleta (voo, pousos, seguir cursor).
6. Atos 2–4 com boxes, costura dos serviços e timeline.
7. Ato 5 completo (física da linha, CTA, formação do logo).
8. Mobile, reduced-motion, performance.

## 8. Pendências (decidir com o Eduardo)
- Copy final da frase do Ato 5 e do CTA.
- Destino do CTA (formulário existente, WhatsApp ou ambos).
- Arquivo vetorial do logo para o loop final.
- Frames definitivos do robô e da borboleta.

## 9. Observações do agente (contexto do código atual)
- O hero atual **não é imagem estática**: é cena Three.js (`cenaGalpao.ts`) com robô GLB + borboleta + galpão/blueprint, com `setViewOffset` empurrando o robô para a direita. O Ato 1 (corte com `clip-path` em duas camadas) precisa decidir entre: duplicar o canvas WebGL (caro), capturar um frame do canvas como imagem no início do scroll, ou fazer o corte via shader/2 render targets.
- Robô e borboleta já existem em 3D. Alternativa às sequências de frames: animar o próprio GLB no Three.js via scroll (mais leve, sem 60–120 imagens por ato). Decidir antes da Fase 4.
- As seções de projetos/cases foram **removidas temporariamente** a pedido do Eduardo — o Ato 4 depende da volta delas.
- Já há `gsap` e `@gsap/react` no `package.json`; checar se Lenis já está instalado antes de adicionar.
