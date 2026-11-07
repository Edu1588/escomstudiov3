/**
 * ESCOM STUDIO — Linha de Scroll Geométrica & Fluida (Referência: dakshgajjar.com)
 * - Segue as retas reais da arquitetura do site (grids, bordas de cards e divisórias).
 * - Faz quinas perfeitamente arredondadas com cantos orgânicos.
 * - Passeia da esquerda para a direita, contornando cards e elementos reais da página.
 * - 100% contínua e sem tracejado prévio.
 */
(function () {
  const PONTA = 0.62;  // Altura da tela onde a ponta da linha acompanha o scroll
  const PASSO = 4;     // Amostragem fina em px para suavidade perfeita
  const DEMORA = 0.35; // Peso de rolagem para trechos horizontais e cantos

  function initFioDaPagina() {
    const main = document.getElementById('page-content');
    if (!main) return;

    if (getComputedStyle(main).position === 'static') {
      main.style.position = 'relative';
    }

    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const NS = 'http://www.w3.org/2000/svg';

    const antigo = document.getElementById('escom-fio-svg');
    if (antigo) antigo.remove();

    const svg = document.createElementNS(NS, 'svg');
    svg.id = 'escom-fio-svg';
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText =
      'position:absolute;top:0;left:0;width:100%;pointer-events:none;z-index:22;overflow:visible;';

    svg.innerHTML = `
      <defs>
        <linearGradient id="escom-fio-grad" x1="0" y1="0" x2="0" y2="10000" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#00E5FF" />
          <stop offset="60%" stop-color="#00E5FF" />
          <stop offset="100%" stop-color="#00D2F5" />
        </linearGradient>
        <filter id="escom-fio-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" flood-color="#00E5FF" flood-opacity="0.75" />
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#ffffff" flood-opacity="0.9" />
        </filter>
      </defs>
      <style>
        .escom-fio-caminho {
          fill: none;
          stroke: url(#escom-fio-grad);
          stroke-width: 2.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter: url(#escom-fio-glow);
        }
        .escom-fio-no {
          fill: #06090e;
          stroke: #00E5FF;
          stroke-width: 2.2;
          opacity: 0.85;
          transition: fill 0.25s ease, transform 0.25s ease, stroke 0.25s ease, opacity 0.25s ease;
          transform-box: fill-box;
          transform-origin: center;
        }
        .escom-fio-no.aceso {
          fill: #00E5FF;
          stroke: #ffffff;
          opacity: 1;
          transform: scale(1.45);
        }
      </style>
      <path id="escom-fio-caminho" class="escom-fio-caminho" />
      <g id="escom-fio-nos"></g>
      <g id="escom-fio-ponta" style="opacity:1;transition:opacity 0.2s">
        <circle id="escom-fio-ponta-anel" r="14" fill="rgba(0,229,255,0.18)" stroke="#00E5FF" stroke-width="1.8" opacity="0.95" />
        <circle id="escom-fio-ponta-miolo" r="5" fill="#ffffff" stroke="#00E5FF" stroke-width="2" />
      </g>
    `;

    main.appendChild(svg);

    const caminho = svg.querySelector('#escom-fio-caminho');
    const gNos = svg.querySelector('#escom-fio-nos');
    const ponta = svg.querySelector('#escom-fio-ponta');
    const grad = svg.querySelector('#escom-fio-grad');

    let total = 0;
    let fimY = 1;
    let fimChave = 1;
    let amostras = [];
    let marcas = [];

    function caixa(el) {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const b = main.getBoundingClientRect();
      const x = r.left - b.left;
      const y = r.top - b.top;
      return {
        x,
        y,
        w: r.width,
        h: r.height,
        dir: x + r.width,
        baixo: y + r.height,
        cx: x + r.width / 2,
        cy: y + r.height / 2
      };
    }

    function montar() {
      const scrollSalvo = window.scrollY;
      if (scrollSalvo !== 0) {
        window.scrollTo(0, 0);
      }

      const candidatosSticky = Array.from(
        main.querySelectorAll('.stack__item, .grid__column--sticky, .graph-morph__sticky')
      );
      const posicoesSalvas = candidatosSticky.map((el) => el.style.position);
      const topsSalvos = candidatosSticky.map((el) => el.style.top);
      candidatosSticky.forEach((el) => {
        el.style.position = 'static';
        el.style.top = 'auto';
      });

      const W = main.clientWidth;
      const H = main.offsetHeight;
      const celular = W < 768;

      const elHero = main.querySelector('#topo');
      const elHeroScroll = main.querySelector('.escom-hero-scroll');
      const elMetodo = main.querySelector('#metodo');
      const elBox0 = main.querySelector('#metodo .box__0');
      const elBox1 = main.querySelector('#metodo .box__1');
      const elArq = main.querySelector('#arquitetura');
      const elArqMorph = main.querySelector('#arquitetura .home-morph-wrp');
      const elArqData = main.querySelector('#arquitetura .graph__data');
      const elsStack = Array.from(main.querySelectorAll('#solucoes .stack__item'));
      const elProj = main.querySelector('#projetos');
      const elPilares = main.querySelector('#pilares');
      const elPilaresCol = main.querySelector('#pilares .toggle__column');
      const elJornadaMatrix = main.querySelector('#jornada .matrix__main');
      const elSobreBtn = main.querySelector('#sobre .button') || main.querySelector('#sobre .matrix__main');

      const cHero = caixa(elHero);
      const cHeroScroll = caixa(elHeroScroll);
      const cMetodo = caixa(elMetodo);
      const cBox0 = caixa(elBox0);
      const cBox1 = caixa(elBox1);
      const cArq = caixa(elArq);
      const cArqMorph = caixa(elArqMorph);
      const cArqData = caixa(elArqData);
      const cStacks = elsStack.map((el) => {
        const item = caixa(el);
        const bp = caixa(el.querySelector('.escom-service-blueprint'));
        return { item, bp };
      }).filter((s) => s.item);
      const cProj = caixa(elProj);
      const cPilaresCol = caixa(elPilaresCol);
      const cJornadaMatrix = caixa(elJornadaMatrix);
      const cSobreBtn = caixa(elSobreBtn);

      candidatosSticky.forEach((el, i) => {
        el.style.position = posicoesSalvas[i];
        el.style.top = topsSalvos[i];
      });

      if (scrollSalvo !== 0) {
        window.scrollTo(0, scrollSalvo);
      }

      svg.setAttribute('width', String(W));
      svg.setAttribute('height', String(H));
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      grad.setAttribute('y2', String(H));

      const d = [];
      const nosLista = [];

      // =========================================================================
      // 1. HERO (#topo)
      // Nasce no botão 'ROLE PARA EXPLORAR ↓' e desce suavemente até a divisória da grid
      // =========================================================================
      const startX = cHeroScroll ? cHeroScroll.cx : W * 0.5;
      const startY = cHeroScroll ? cHeroScroll.y - 10 : (cHero ? cHero.baixo - 60 : 600);

      let curX = startX;
      let curY = startY;

      d.push(`M ${startX.toFixed(1)} ${startY.toFixed(1)}`);
      nosLista.push({ x: startX, y: startY });

      // =========================================================================
      // 2. MÉTODO (#metodo): SEGUINDO A RETA DO GRID E AS BORDAS DOS CARDS
      // Linha vertical da divisória: xGrid (em cBox0.x)
      // Linha horizontal da base do grid: yBase (em cBox0.baixo)
      // =========================================================================
      if (cBox0 && cBox1) {
        const xGrid = cBox0.x;          // Reta vertical exata da divisória do grid
        const yBaseMetodo = cBox0.baixo; // Reta horizontal exata da base
        const yTopoMetodo = cMetodo ? cMetodo.y : cBox0.y - 120;
        const R = 24;                    // Raio de quina arredondada

        // Acopla suavemente na reta vertical divisória do grid
        d.push(`C ${startX.toFixed(1)} ${(startY + 100).toFixed(1)}, ${xGrid.toFixed(1)} ${(yTopoMetodo - 80).toFixed(1)}, ${xGrid.toFixed(1)} ${yTopoMetodo.toFixed(1)}`);
        nosLista.push({ x: xGrid, y: yTopoMetodo });

        // SEGUE A RETA VERTICAL EXATA da divisória até a quina inferior do card
        d.push(`L ${xGrid.toFixed(1)} ${(yBaseMetodo - R).toFixed(1)}`);

        // CANTO ARREDONDADO de 90° acoplando na RETA HORIZONTAL DA BASE
        d.push(`A ${R} ${R} 0 0 0 ${(xGrid + R).toFixed(1)} ${yBaseMetodo.toFixed(1)}`);
        nosLista.push({ x: xGrid + R, y: yBaseMetodo });

        // SEGUE A RETA HORIZONTAL EXATA da base ao longo de todo o comprimento dos cards 0 e 1
        const xFimBox1 = cBox1.dir;
        d.push(`L ${(xFimBox1 - R).toFixed(1)} ${yBaseMetodo.toFixed(1)}`);

        // CANTO ARREDONDADO virando para descer em #arquitetura
        d.push(`A ${R} ${R} 0 0 1 ${xFimBox1.toFixed(1)} ${(yBaseMetodo + R).toFixed(1)}`);
        nosLista.push({ x: xFimBox1, y: yBaseMetodo + R });

        // =========================================================================
        // 3. ARQUITETURA (#arquitetura): DESCE PELA RETA LATERAL, PASSA POR BAIXO DO 3D E VOLTA AO CENTRO
        // =========================================================================
        if (cArq) {
          const yBaseTecnica = cArqData ? cArqData.baixo + 20 : cArq.y + 700;

          // SEGUE A RETA VERTICAL da lateral direita contornando o modelo 3D por fora
          d.push(`L ${xFimBox1.toFixed(1)} ${(yBaseTecnica - R).toFixed(1)}`);

          // CANTO ARREDONDADO virando para a esquerda por baixo do edifício 3D
          d.push(`A ${R} ${R} 0 0 1 ${(xFimBox1 - R).toFixed(1)} ${yBaseTecnica.toFixed(1)}`);
          nosLista.push({ x: xFimBox1 - R, y: yBaseTecnica });

          // RETA HORIZONTAL por baixo do edifício 3D até a divisória central
          d.push(`L ${(xGrid + R).toFixed(1)} ${yBaseTecnica.toFixed(1)}`);

          // CANTO ARREDONDADO acoplando de volta na reta vertical da divisória central
          d.push(`A ${R} ${R} 0 0 0 ${xGrid.toFixed(1)} ${(yBaseTecnica + R).toFixed(1)}`);
          nosLista.push({ x: xGrid, y: yBaseTecnica + R });

          // Continua descendo em linha reta vertical exata pela divisória do grid, sem cruzar o cabeçalho
          const yFimArq = cArq.baixo;
          d.push(`L ${xGrid.toFixed(1)} ${yFimArq.toFixed(1)}`);
          nosLista.push({ x: xGrid, y: yFimArq });
          curX = xGrid;
          curY = yFimArq;
        }
      }

      // =========================================================================
      // 4. SOLUÇÕES (#solucoes — 01 a 06): SEGUINDO RETAS EXATAS DAS DIVISÓRIAS
      // Desce pela reta vertical da divisória até a borda horizontal do card,
      // depois corre pela reta horizontal da divisória até o blueprint, sem cortar nenhum texto!
      // =========================================================================
      if (cStacks.length > 0) {
        const R = 20; // Raio das quinas arredondadas

        cStacks.forEach((stackData, i) => {
          const cs = stackData.item;
          const bp = stackData.bp;
          const par = i % 2 === 0;

          const yTopo = cs.y;
          const yBase = cs.baixo;
          const xBlueprintEsq = bp ? bp.x : cs.x + 396;
          const xDir = Math.min(W - 24, cs.dir - 24);

          if (i === 0) {
            // SEGUE A RETA VERTICAL da divisória do grid descendo pelo cabeçalho até o topo dos cards
            d.push(`L ${curX.toFixed(1)} ${(yTopo - R).toFixed(1)}`);

            // CANTO ARREDONDADO de 90° virando para a esquerda sobre a linha divisória horizontal
            d.push(`A ${R} ${R} 0 0 1 ${(curX - R).toFixed(1)} ${yTopo.toFixed(1)}`);
            nosLista.push({ x: curX, y: yTopo });

            // RETA HORIZONTAL PERFEITA sobre a linha divisória até a quina do blueprint
            d.push(`L ${(xBlueprintEsq + R).toFixed(1)} ${yTopo.toFixed(1)}`);

            // CANTO ARREDONDADO de 90° virando para descer pelo blueprint
            d.push(`A ${R} ${R} 0 0 0 ${xBlueprintEsq.toFixed(1)} ${(yTopo + R).toFixed(1)}`);
            nosLista.push({ x: xBlueprintEsq, y: yTopo });
          } else if (par) {
            // RETA HORIZONTAL cravada na linha divisória superior do card
            d.push(`L ${(xBlueprintEsq - R).toFixed(1)} ${yTopo.toFixed(1)}`);
            // CANTO ARREDONDADO de 90° virando para descer pelo blueprint
            d.push(`A ${R} ${R} 0 0 1 ${xBlueprintEsq.toFixed(1)} ${(yTopo + R).toFixed(1)}`);
            nosLista.push({ x: xBlueprintEsq, y: yTopo });
          }

          if (par) {
            // RETA VERTICAL PERFEITA descendo pela borda do blueprint 3D
            d.push(`L ${xBlueprintEsq.toFixed(1)} ${(yBase - R).toFixed(1)}`);
            // CANTO ARREDONDADO de 90° virando para a direita na linha horizontal da base
            d.push(`A ${R} ${R} 0 0 0 ${(xBlueprintEsq + R).toFixed(1)} ${yBase.toFixed(1)}`);
            nosLista.push({ x: xBlueprintEsq, y: yBase });

            // RETA HORIZONTAL PERFEITA cravada na linha divisória da base do card até a direita
            d.push(`L ${(xDir - R).toFixed(1)} ${yBase.toFixed(1)}`);
            // CANTO ARREDONDADO virando para o próximo card
            d.push(`A ${R} ${R} 0 0 1 ${xDir.toFixed(1)} ${(yBase + R).toFixed(1)}`);
            nosLista.push({ x: xDir, y: yBase });

            curX = xDir;
            curY = yBase + R;
          } else {
            // RETA VERTICAL PERFEITA descendo pela borda direita
            d.push(`L ${xDir.toFixed(1)} ${(yBase - R).toFixed(1)}`);
            // CANTO ARREDONDADO virando para a esquerda na linha horizontal da base
            d.push(`A ${R} ${R} 0 0 1 ${(xDir - R).toFixed(1)} ${yBase.toFixed(1)}`);
            nosLista.push({ x: xDir, y: yBase });

            // RETA HORIZONTAL PERFEITA cravada na linha divisória da base do card até a borda do blueprint
            d.push(`L ${(xBlueprintEsq + R).toFixed(1)} ${yBase.toFixed(1)}`);
            // CANTO ARREDONDADO virando para o próximo card
            d.push(`A ${R} ${R} 0 0 0 ${xBlueprintEsq.toFixed(1)} ${(yBase + R).toFixed(1)}`);
            nosLista.push({ x: xBlueprintEsq, y: yBase });

            curX = xBlueprintEsq;
            curY = yBase + R;
          }
        });
      }

      // =========================================================================
      // 5. PILARES (#pilares): CONTORNO DA CAIXA RETANGULAR COM QUINAS ARREDONDADAS
      // =========================================================================
      if (cPilaresCol && !celular) {
        const R = 28;
        const x0 = cPilaresCol.x;
        const y0 = cPilaresCol.y;
        const x1 = cPilaresCol.dir;
        const y1 = cPilaresCol.baixo;

        const prevPt = nosLista[nosLista.length - 1];
        const px = prevPt ? prevPt.x : W * 0.5;
        const py = prevPt ? prevPt.y : y0 - 100;

        // Conecta suavemente até o topo da caixa
        d.push(`C ${px.toFixed(1)} ${(py + 100).toFixed(1)}, ${(x0 + R).toFixed(1)} ${(y0 - 80).toFixed(1)}, ${(x0 + R).toFixed(1)} ${y0.toFixed(1)}`);
        nosLista.push({ x: x0 + R, y: y0 });

        // RETA HORIZONTAL do topo
        d.push(`L ${(x1 - R).toFixed(1)} ${y0.toFixed(1)}`);
        // CANTO ARREDONDADO
        d.push(`A ${R} ${R} 0 0 1 ${x1.toFixed(1)} ${(y0 + R).toFixed(1)}`);
        // RETA VERTICAL da lateral
        d.push(`L ${x1.toFixed(1)} ${(y1 - R).toFixed(1)}`);
        // CANTO ARREDONDADO
        d.push(`A ${R} ${R} 0 0 1 ${(x1 - R).toFixed(1)} ${y1.toFixed(1)}`);
        nosLista.push({ x: x1 - R, y: y1 });
        // RETA HORIZONTAL da base
        d.push(`L ${(x0 + R).toFixed(1)} ${y1.toFixed(1)}`);
        d.push(`A ${R} ${R} 0 0 1 ${x0.toFixed(1)} ${(y1 + R).toFixed(1)}`);
      }

      // =========================================================================
      // 6. JORNADA (#jornada) & FINAL NO CTA (#sobre)
      // =========================================================================
      if (cJornadaMatrix) {
        const prevPt = nosLista[nosLista.length - 1];
        const px = prevPt ? prevPt.x : W * 0.5;
        const py = prevPt ? prevPt.y : cJornadaMatrix.y;

        const jX = cJornadaMatrix.dir - 30;
        const jY0 = cJornadaMatrix.y + 20;
        const jY1 = cJornadaMatrix.baixo - 20;

        d.push(`C ${px.toFixed(1)} ${(py + 90).toFixed(1)}, ${jX.toFixed(1)} ${(jY0 - 90).toFixed(1)}, ${jX.toFixed(1)} ${jY0.toFixed(1)}`);
        nosLista.push({ x: jX, y: jY0 });

        // RETA VERTICAL acompanhando a margem da jornada
        d.push(`L ${jX.toFixed(1)} ${jY1.toFixed(1)}`);
        nosLista.push({ x: jX, y: jY1 });

        // Deságua no botão CTA final
        if (cSobreBtn) {
          const endX = cSobreBtn.cx;
          const endY = cSobreBtn.cy;
          d.push(`C ${jX.toFixed(1)} ${(jY1 + 120).toFixed(1)}, ${endX.toFixed(1)} ${(endY - 120).toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`);
          nosLista.push({ x: endX, y: endY });
        }
      }

      // Aplica caminho
      const dFinal = d.join(' ');
      caminho.setAttribute('d', dFinal);
      total = caminho.getTotalLength();
      caminho.style.strokeDasharray = `${total}`;
      caminho.style.strokeDashoffset = `${total}`;

      // Monta nós circulares luminosos
      gNos.innerHTML = '';
      marcas = nosLista.map((n) => {
        const c = document.createElementNS(NS, 'circle');
        c.setAttribute('class', 'escom-fio-no');
        c.setAttribute('cx', n.x.toFixed(1));
        c.setAttribute('cy', n.y.toFixed(1));
        c.setAttribute('r', '5.5');
        gNos.appendChild(c);
        return { el: c, x: n.x, y: n.y, s: 0, aceso: false };
      });

      // Tabela comprimento -> chave de rolagem com peso extra em curvas e retas horizontais
      amostras = [];
      let maxY = -Infinity;
      let extra = 0;
      for (let s = 0; s <= total; s += PASSO) {
        const pt = caminho.getPointAtLength(s);
        if (pt.y > maxY) {
          maxY = pt.y;
        } else {
          extra += PASSO * DEMORA;
        }
        amostras.push({ s, chave: maxY + extra, pt });
      }
      fimY = maxY;
      fimChave = maxY + extra;

      marcas.forEach((m) => {
        let bestS = 0;
        let minDist = Infinity;
        for (let i = 0; i < amostras.length; i += 3) {
          const dx = amostras[i].pt.x - m.x;
          const dy = amostras[i].pt.y - m.y;
          const dist = dx * dx + dy * dy;
          if (dist < minDist) {
            minDist = dist;
            bestS = amostras[i].s;
          }
        }
        m.s = bestS;
      });

      desenhar();
    }

    function desenhar() {
      if (total <= 0 || amostras.length === 0) return;

      const rect = main.getBoundingClientRect();
      const scrollAtual = -rect.top + window.innerHeight * PONTA;

      if (reduzido) {
        caminho.style.strokeDashoffset = '0';
        ponta.style.opacity = '0';
        marcas.forEach((m) => m.el.classList.add('aceso'));
        return;
      }

      if (scrollAtual <= 0) {
        caminho.style.strokeDashoffset = `${total}`;
        ponta.style.opacity = '0';
        marcas.forEach((m) => m.el.classList.remove('aceso'));
        return;
      }

      ponta.style.opacity = '1';

      const proporcao = fimY > 0 ? fimChave / fimY : 1;
      const alvoChave = scrollAtual * proporcao;

      let lo = 0;
      let hi = amostras.length - 1;
      while (lo < hi) {
        const meio = (lo + hi) >> 1;
        if (amostras[meio].chave < alvoChave) {
          lo = meio + 1;
        } else {
          hi = meio;
        }
      }

      const compAtual = Math.min(total, amostras[lo].s);
      const offset = Math.max(0, total - compAtual);
      caminho.style.strokeDashoffset = `${offset}`;

      const p = caminho.getPointAtLength(compAtual);
      const anel = ponta.querySelector('#escom-fio-ponta-anel');
      const miolo = ponta.querySelector('#escom-fio-ponta-miolo');
      if (anel && miolo) {
        anel.setAttribute('cx', p.x.toFixed(1));
        anel.setAttribute('cy', p.y.toFixed(1));
        miolo.setAttribute('cx', p.x.toFixed(1));
        miolo.setAttribute('cy', p.y.toFixed(1));
      }

      marcas.forEach((m) => {
        if (compAtual >= m.s - 6) {
          if (!m.aceso) {
            m.aceso = true;
            m.el.classList.add('aceso');
          }
        } else {
          if (m.aceso) {
            m.aceso = false;
            m.el.classList.remove('aceso');
          }
        }
      });
    }

    let lenisInst = window.__lenis || (window.Lenis && window.lenis);
    if (!lenisInst && window.Lenis) {
      try {
        lenisInst = new window.Lenis();
      } catch (e) {}
    }

    if (lenisInst && typeof lenisInst.on === 'function') {
      lenisInst.on('scroll', desenhar);
    } else {
      window.addEventListener('scroll', desenhar, { passive: true });
    }

    let resizeTimeout;
    window.addEventListener(
      'resize',
      () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(montar, 150);
      },
      { passive: true }
    );

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(montar, 200));
    }

    setTimeout(montar, 300);
    setTimeout(montar, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFioDaPagina);
  } else {
    initFioDaPagina();
  }
})();
