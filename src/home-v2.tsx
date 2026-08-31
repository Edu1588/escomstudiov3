import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import './home-v2.css';

export function HomeV2() {
  const [loading, setLoading] = useState(true);
  const [inspectOpen, setInspectOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const anatomyTrackRef = useRef<HTMLDivElement | null>(null);
  const anatomyBarRef = useRef<HTMLElement | null>(null);
  const lightBarRef = useRef<HTMLElement | null>(null);
  const heroLeftDoorRef = useRef<HTMLElement | null>(null);
  const heroRightDoorRef = useRef<HTMLElement | null>(null);

  // Estados de iluminação e simulação ativa do capítulo 8
  const [lightState, setLightState] = useState<'ember' | 'moon' | 'dawn'>('ember');
  const [activeTechTab, setActiveTechTab] = useState<'autocarrossel' | 'agente' | 'google' | 'minerador'>('autocarrossel');

  // Three.js Scene Setup — Robô Busto 3D Oficial da ESCOM Studio
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.1, 4.2);

    // Iluminação PBR de Alta Definição (Prata com acento Neon Ciano)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x09090b, 2.4);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00d1ff, 2.4);
    fillLight.position.set(-4, 2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x00d1ff, 4.8, 16);
    rimLight.position.set(3, -2, 3);
    scene.add(rimLight);

    const goldLight = new THREE.PointLight(0xc5a86a, 2.4, 12);
    goldLight.position.set(-3, 3, -2);
    scene.add(goldLight);

    // Luzes de Neon Ciano nos Olhos do Robô
    const eyeLightL = new THREE.PointLight(0x00f0ff, 2.6, 2.0);
    eyeLightL.position.set(-0.13, 0.41, 0.38);

    const eyeLightR = new THREE.PointLight(0x00f0ff, 2.6, 2.0);
    eyeLightR.position.set(0.13, 0.41, 0.38);

    // Grupo do Robô
    const robotWrapper = new THREE.Group();
    scene.add(robotWrapper);

    let headPivotRef: THREE.Group | null = null;
    let isRobotLoaded = false;

    // Partículas de Fogo & Energia no Espaço
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x00d1ff);
    const color2 = new THREE.Color(0x00f0ff);
    const color3 = new THREE.Color(0xc5a86a);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const rand = Math.random();
      const chosenColor = rand < 0.5 ? color1 : (rand < 0.8 ? color2 : color3);
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.032,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Carregamento com GLTFLoader + DracoLoader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/models/3Dmodelrobot-v1.glb',
      (gltf) => {
        const rawModel = gltf.scene;

        const box = new THREE.Box3().setFromObject(rawModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.4 / (maxDim || 1);
        robotWrapper.scale.set(scale, scale, scale);
        robotWrapper.position.set(0, -0.2, 0);

        rawModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = 0.36;
              mat.metalness = 0.72;
              mat.needsUpdate = true;
            }
          }
        });

        const chestGroup = new THREE.Group();
        const headPivot = new THREE.Group();
        const headGroup = new THREE.Group();

        const neckPivotY = 0.25 - center.y;
        const neckPivotZ = 0.00 - center.z;

        headPivot.position.set(0, neckPivotY, neckPivotZ);
        headGroup.position.set(0, -neckPivotY, -neckPivotZ);
        headPivot.add(headGroup);

        const allNodes: THREE.Object3D[] = [];
        rawModel.traverse((child) => {
          if (child.name.startsWith('tripo_part_')) {
            allNodes.push(child);
          }
        });

        allNodes.forEach((node) => {
          node.position.x -= center.x;
          node.position.y -= center.y;
          node.position.z -= center.z;

          if (node.name === 'tripo_part_0') {
            chestGroup.add(node);
          } else {
            headGroup.add(node);
          }
        });

        headPivot.add(eyeLightL);
        headPivot.add(eyeLightR);

        robotWrapper.add(chestGroup);
        robotWrapper.add(headPivot);

        headPivotRef = headPivot;
        isRobotLoaded = true;
      },
      undefined,
      (err) => {
        console.error('Erro ao carregar modelo GLB do robô:', err);
      }
    );

    // Mouse Tracking & Scroll Animation Loop
    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    let targetHeadRotX = 0;
    let targetHeadRotY = 0;
    let currentHeadRotX = 0;
    let currentHeadRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const scrollY = window.scrollY || window.pageYOffset;
      const totalScroll = document.body.scrollHeight - window.innerHeight || 1;
      const scrollProgress = scrollY / totalScroll;

      // Animação da cabeça e corpo com mouse e scroll
      targetHeadRotY = mouseX * 0.55;
      targetHeadRotX = mouseY * 0.35;

      currentHeadRotY += (targetHeadRotY - currentHeadRotY) * 0.06;
      currentHeadRotX += (targetHeadRotX - currentHeadRotX) * 0.06;

      if (headPivotRef) {
        headPivotRef.rotation.y = currentHeadRotY;
        headPivotRef.rotation.x = currentHeadRotX;
      }

      // Rotação suave do robô conforme o visitante rola a página
      robotWrapper.rotation.y = Math.sin(scrollProgress * Math.PI * 4) * 0.45 + mouseX * 0.15;
      robotWrapper.rotation.x = Math.cos(scrollProgress * Math.PI * 2) * 0.12 + mouseY * 0.08;
      robotWrapper.position.y = -0.2 - Math.sin(scrollProgress * Math.PI * 2) * 0.3;

      // Pulsação suave dos olhos neon
      const time = Date.now() * 0.003;
      const pulseIntensity = 1.8 + Math.sin(time) * 0.5;
      eyeLightL.intensity = pulseIntensity;
      eyeLightR.intensity = pulseIntensity;

      // Movimento sutil das partículas
      particles.rotation.y += 0.0008;
      particles.rotation.x = Math.sin(time * 0.2) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  // Cursor Customizado e Interações
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, .discover, .cta, .blade-card, .footer__inquiry, .site-nav a')) {
        cursor.classList.add('is-hover');
      } else {
        cursor.classList.remove('is-hover');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    // Loader timeout
    const loaderTimer = setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      clearTimeout(loaderTimer);
    };
  }, []);

  // Scroll Animations (Portas, Anatomy Track, Spectrum de Luz, Progress Bar)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;

      // Hero Doors Parallax / Open
      const heroSection = document.getElementById('origin');
      if (heroSection && heroLeftDoorRef.current && heroRightDoorRef.current) {
        const heroRect = heroSection.getBoundingClientRect();
        const heroProgress = Math.min(Math.max(-heroRect.top / (heroRect.height - windowH), 0), 1);
        heroLeftDoorRef.current.style.transform = `translateX(-${heroProgress * 100}%)`;
        heroRightDoorRef.current.style.transform = `translateX(${heroProgress * 100}%)`;
      }

      // Anatomy Horizontal Track Scroll
      const anatomySection = document.getElementById('anatomy');
      if (anatomySection && anatomyTrackRef.current && anatomyBarRef.current) {
        const rect = anatomySection.getBoundingClientRect();
        const maxScroll = rect.height - windowH;
        const progress = Math.min(Math.max(-rect.top / maxScroll, 0), 1);

        const trackWidth = anatomyTrackRef.current.scrollWidth - window.innerWidth * 0.5;
        anatomyTrackRef.current.style.transform = `translateX(-${progress * trackWidth}px)`;
        anatomyBarRef.current.style.transform = `scaleX(${progress})`;
      }

      // Spectrum / Light Section State Machine
      const lightSection = document.getElementById('light');
      if (lightSection && lightBarRef.current) {
        const rect = lightSection.getBoundingClientRect();
        const maxScroll = rect.height - windowH;
        const progress = Math.min(Math.max(-rect.top / maxScroll, 0), 1);

        lightBarRef.current.style.transform = `scaleX(${progress})`;

        if (progress < 0.33) {
          setLightState('ember');
        } else if (progress < 0.66) {
          setLightState('moon');
        } else {
          setLightState('dawn');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Disparo de Flash de Energia
  const triggerFlash = () => {
    if (flashRef.current) {
      flashRef.current.style.opacity = '1';
      setTimeout(() => {
        if (flashRef.current) flashRef.current.style.opacity = '0';
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-[#080706] text-[#e9e2d4]">
      {/* Loader Inicial */}
      <div className={`loader ${!loading ? 'is-hidden' : ''}`} aria-label="Carregando ESCOM ATELIER">
        <div className="loader__mark">
          <span>創</span>
        </div>
        <p>FORJANDO O SISTEMA</p>
        <div className="loader__line">
          <i></i>
        </div>
      </div>

      {/* WebGL Canvas & Vinheta */}
      <canvas ref={canvasRef} id="webgl" aria-label="Interactive Three.js Core"></canvas>
      <div className="vignette"></div>
      <div ref={flashRef} className="energy-flash" aria-hidden="true"></div>
      <div ref={cursorRef} className="cursor">
        <span></span>
      </div>

      {/* Header Navigation */}
      <header className="nav">
        <a className="brand" href="#origin" aria-label="ESCOM STUDIO, Início">
          <svg className="brand__crest" viewBox="0 0 44 44" aria-hidden="true">
            <circle cx="22" cy="22" r="17.5"></circle>
            <path d="M12 30 28 10M17 34 33 14"></path>
            <path d="M10 22h24"></path>
          </svg>
          <span className="brand__name">
            ESCOM<small>ATELIER · 2026</small>
          </span>
        </a>
        <div className="nav__actions">
          <nav className="site-nav" aria-label="Primary navigation">
            <a href="#steel">Engenharia</a>
            <a href="#anatomy">Anatomia</a>
            <a href="#light">Tecnologias</a>
            <a href="#collection">Cases</a>
            <a href="#legacy">Contato</a>
          </nav>
        </div>
      </header>

      {/* Main Story (11 Capítulos) */}
      <main className="story">
        {/* CAPÍTULO 01 — ORIGEM */}
        <section className="panel panel--hero" id="origin" data-chapter="01" data-name="ORIGEM">
          <div className="hero-stage">
            <div className="eyebrow reveal">
              <span></span> SÃO PAULO & DIGITAL · 2026
            </div>
            <div className="hero-title" aria-label="ESCOM">
              <span className="title-left">ES</span>
              <span className="title-kanji">創</span>
              <span className="title-right">COM</span>
            </div>
            <div className="hero-doors" aria-hidden="true">
              <i ref={heroLeftDoorRef}></i>
              <i ref={heroRightDoorRef}></i>
              <b>ENTRAR / 始</b>
            </div>
            <div className="hero-copy reveal">
              <p>A ENGENHARIA REMEMBERS</p>
              <small>Um ecossistema digital onde código, inteligência artificial e conversão se tornam um só organismo.</small>
            </div>
            <button
              className="discover"
              type="button"
              onClick={() => {
                triggerFlash();
                document.getElementById('steel')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>EXPLORAR ATELIER</span>
              <i>↓</i>
            </button>
            <div className="scroll-cue">
              <span>SCROLL PARA REVELAR</span>
              <i></i>
            </div>
          </div>
        </section>

        {/* CAPÍTULO 02 — A ENGENHARIA */}
        <section className="panel panel--steel" id="steel" data-chapter="02" data-name="A ENGENHARIA">
          <div className="chapter-copy chapter-copy--left">
            <p className="chapter-index">第二章 / 02</p>
            <h2>
              Nascido dos<br />
              <em>extremos.</em>
            </h2>
            <p className="body-copy">
              Design que atrai os olhos. Engenharia de backend que converte no checkout. Na forja da ESCOM, tráfego pago e automação de ponta deixam de resistir — e tornam-se uma única máquina de receita.
            </p>
            <div className="stat-line">
              <span>LIGHTHOUSE SCORE</span>
              <b>100 / 100</b>
            </div>
          </div>
          <div className="annotation annotation--steel">
            <i></i>
            <span>CÓDIGO PROPRIETÁRIO<br />玉鋼 · SOBERANIA</span>
          </div>
        </section>

        {/* CAPÍTULO 03 — A CONVERSÃO CIRÚRGICA */}
        <section className="panel panel--edge" id="edge" data-chapter="03" data-name="A CONVERSÃO">
          <div className="chapter-copy chapter-copy--right">
            <p className="chapter-index">第三章 / 03</p>
            <h2>
              A linha entre o clique<br />
              e o <em>faturamento.</em>
            </h2>
            <p className="body-copy">
              Páginas construídas com fricção zero e carregamento sub-segundo. O lead nunca espera. Cada milissegundo economizado é conversão capturada antes do concorrente sequer carregar.
            </p>
            <div className="detail-grid">
              <div>
                <span>LCP</span>
                <b>0.4s</b>
              </div>
              <div>
                <span>CONVERSÃO</span>
                <b>+240%</b>
              </div>
              <div>
                <span>BOUNCE RATE</span>
                <b>&lt; 18%</b>
              </div>
            </div>
          </div>
          <div className="annotation annotation--hamon">
            <i></i>
            <span>ENGENHARIA DE CONVERSÃO<br />刃文 · ZERO FRICTION</span>
          </div>
        </section>

        {/* CAPÍTULO 04 — ANATOMIA DO SISTEMA */}
        <section className="panel panel--anatomy" id="anatomy" data-chapter="04" data-name="ANATOMIA">
          <div className="anatomy-sticky">
            <div className="anatomy-heading">
              <p className="chapter-index">第四章 / 04</p>
              <h2>
                Nada é<br />
                <em>ornamental.</em>
              </h2>
              <p>Cada componente é uma decisão sobre velocidade, retenção de leads e geração de lucro líquido.</p>
            </div>
            <div ref={anatomyTrackRef} className="anatomy-track">
              <article className="anatomy-card" data-part="01">
                <span className="anatomy-card__kanji">鍔</span>
                <div>
                  <small>01 / CRM NATIVO BLINDADO</small>
                  <h3>O Ponto de Controle.</h3>
                  <p>Centralize 100% dos seus leads, propostas e histórico em um único painel, eliminando mensalidades de SaaS fragmentados.</p>
                </div>
              </article>
              <article className="anatomy-card" data-part="02">
                <span className="anatomy-card__kanji">柄</span>
                <div>
                  <small>02 / AGENTE IA 24/7</small>
                  <h3>A Memória Operacional.</h3>
                  <p>Atendimento no WhatsApp com qualificação automática por faturamento e agendamento direto na agenda do seu time.</p>
                </div>
              </article>
              <article className="anatomy-card" data-part="03">
                <span className="anatomy-card__kanji">刃</span>
                <div>
                  <small>03 / AUTOCARROSSEL</small>
                  <h3>A Decisão Instantânea.</h3>
                  <p>Digite a placa do veículo ou SKU e o sistema gera na hora o carrossel completo com dados FIPE e design pronto para postar.</p>
                </div>
              </article>
              <article className="anatomy-card" data-part="04">
                <span className="anatomy-card__kanji">鞘</span>
                <div>
                  <small>04 / MÁQUINA GOOGLE</small>
                  <h3>A Presença Silenciosa.</h3>
                  <p>SEO técnico mobile-first, Google Analytics 4 com rastreamento avançado e Google Meu Negócio dominando as buscas locais.</p>
                </div>
              </article>
            </div>
            <div className="anatomy-progress">
              <i><b ref={anatomyBarRef}></b></i>
              <span>ARRASTE COM O SCROLL</span>
            </div>
          </div>
        </section>

        {/* CAPÍTULO 05 — O EQUILÍBRIO */}
        <section className="panel panel--balance" id="balance" data-chapter="05" data-name="EQUILÍBRIO">
          <div className="balance-orbit" aria-hidden="true">
            <i></i><i></i><i></i><b>重</b>
          </div>
          <div className="balance-copy">
            <p className="chapter-index">第五章 / 05</p>
            <h2>
              Valor não se mede.<br />
              Se <em>sente.</em>
            </h2>
            <p>
              O equilíbrio exato entre sofisticação visual de marca e brutalidade de conversão — o ponto onde o usuário não sente atrito e o ticket médio se multiplica.
            </p>
            <div className="balance-scale">
              <span>BRANDING</span>
              <i><b></b></i>
              <strong>SISTEMA BLINDADO</strong>
              <i></i>
              <span>CONVERSÃO</span>
            </div>
          </div>
          <div className="balance-word" aria-hidden="true">EQUILIBRIUM</div>
        </section>

        {/* CAPÍTULO 06 — O COMPROMISSO */}
        <section className="panel panel--oath" id="oath" data-chapter="06" data-name="O COMPROMISSO">
          <div className="oath-copy">
            <p className="chapter-index">第六章 / 06</p>
            <blockquote>
              “Não construímos apenas sites bonitos.<br />
              Forjamos máquinas de faturamento.<br />
              <em>O código revela a ambição do seu negócio.</em>”
            </blockquote>
            <p className="signature">— ESCOM STUDIO <span>無名</span></p>
          </div>
          <div className="seal">
            守<br /><small>BLINDADO</small>
          </div>
        </section>

        {/* CAPÍTULO 07 — O MÉTODO */}
        <section className="panel panel--ritual" id="ritual" data-chapter="07" data-name="O MÉTODO">
          <div className="ritual-head">
            <p className="chapter-index">第七章 / 07</p>
            <h2>
              O método após o<br />
              <em>diagnóstico.</em>
            </h2>
            <p>Três etapas consolidadas para erguer uma operação digital que não quebra.</p>
          </div>
          <div className="ritual-steps">
            <article>
              <span>一</span>
              <small>01 / MAPEAMENTO</small>
              <h3>Diagnóstico de ICP.</h3>
              <p>Mapeamos seu público de maior LTV, eliminamos gargalos de fricção e definimos os fluxos de automação nativos.</p>
              <i></i>
            </article>
            <article>
              <span>二</span>
              <small>02 / ENGENHARIA</small>
              <h3>Desenvolvimento Puro.</h3>
              <p>Código limpo em React e Next.js, arquitetura escalável e webhooks conectando tráfego pago ao seu WhatsApp.</p>
              <i></i>
            </article>
            <article>
              <span>三</span>
              <small>03 / ESCALA</small>
              <h3>Lançamento & ROI.</h3>
              <p>Testes de stress, indexação no Google, ativação de agentes IA e acompanhamento contínuo dos indicadores de venda.</p>
              <i></i>
            </article>
          </div>
          <div className="ritual-ring" aria-hidden="true">
            <span>VELOCIDADE · CONVERSÃO · PRECISÃO · ESCALA ·</span>
          </div>
        </section>

        {/* CAPÍTULO 08 — TECNOLOGIAS EM AÇÃO & SIMULAÇÕES INTERATIVAS */}
        <section className="panel panel--light" id="light" data-chapter="08" data-name="TECNOLOGIAS">
          <div className="light-intro">
            <p className="chapter-index">第八章 / 08</p>
            <h2>
              Tecnologias que operam<br />
              em cada <em>frente.</em>
            </h2>
            <p>Selecione uma tecnologia abaixo e teste a simulação interativa em tempo real da nossa engenharia proprietária.</p>
          </div>

          {/* Grid Editorial de 4 Tecnologias */}
          <div className="tech-steps-grid">
            {/* Card 01: AutoCarrossel */}
            <article 
              className={`tech-step-item ${activeTechTab === 'autocarrossel' ? 'is-active' : ''}`}
              onClick={() => { setActiveTechTab('autocarrossel'); setLightState('ember'); }}
            >
              <span>車</span>
              <small>01 / CONCESSIONÁRIAS</small>
              <h3>AutoCarrossel.</h3>
              <p>
                O sistema consulta a base oficial FIPE com a placa do veículo, puxa ficha técnica e monta instantaneamente o carrossel do Instagram com parcelas calculadas.
              </p>
              <i></i>
            </article>

            {/* Card 02: Agente IA */}
            <article 
              className={`tech-step-item ${activeTechTab === 'agente' ? 'is-active' : ''}`}
              onClick={() => { setActiveTechTab('agente'); setLightState('moon'); }}
            >
              <span>智</span>
              <small>02 / ATENDIMENTO IA</small>
              <h3>Agente IA 24/7.</h3>
              <p>
                Atendimento inteligente no WhatsApp que entende a dor do cliente, qualifica o lead por faturamento e agenda direto na pauta da equipe comercial.
              </p>
              <i></i>
            </article>

            {/* Card 03: Máquina Google */}
            <article 
              className={`tech-step-item ${activeTechTab === 'google' ? 'is-active' : ''}`}
              onClick={() => { setActiveTechTab('google'); setLightState('dawn'); }}
            >
              <span>網</span>
              <small>03 / GOOGLE & SEO</small>
              <h3>Máquina de Ranqueamento.</h3>
              <p>
                Páginas com Nota 100 no Google PageSpeed, estrutura semântica avançada para buscas locais e painel com GA4 nativo em tempo real.
              </p>
              <i></i>
            </article>

            {/* Card 04: Minerador de Leads */}
            <article 
              className={`tech-step-item ${activeTechTab === 'minerador' ? 'is-active' : ''}`}
              onClick={() => { setActiveTechTab('minerador'); setLightState('ember'); }}
            >
              <span>探</span>
              <small>04 / PROSPECÇÃO B2B</small>
              <h3>Minerador de Leads.</h3>
              <p>
                Encontra empresas no seu nicho e cidade que não possuem presença digital moderna, entregando contatos dos tomadores de decisão para abordagem.
              </p>
              <i></i>
            </article>
          </div>

          {/* Viewport da Simulação Interativa ao Vivo */}
          <div className="tech-simulation-viewport">
            <div className="sim-header">
              <div className="sim-header__dots">
                <i></i><i></i><i></i>
              </div>
              <div className="sim-header__title">
                {activeTechTab === 'autocarrossel' && 'ESCOM // AUTOCARROSSEL ENGINE v2.4'}
                {activeTechTab === 'agente' && 'ESCOM // WHATSAPP AGENT SIMULATOR v4.1'}
                {activeTechTab === 'google' && 'ESCOM // GOOGLE SEO & ANALYTICS MONITOR'}
                {activeTechTab === 'minerador' && 'ESCOM // B2B LEAD MINER RADAR'}
              </div>
              <div className="sim-header__status">
                <b></b> LIVE SIMULATION
              </div>
            </div>

            <div className="sim-body">
              {activeTechTab === 'autocarrossel' && <AutoCarrosselSimV2 />}
              {activeTechTab === 'agente' && <AgenteIASimV2 />}
              {activeTechTab === 'google' && <MaquinaGoogleSimV2 />}
              {activeTechTab === 'minerador' && <MineradorLeadsSimV2 />}
            </div>
          </div>
        </section>

        {/* CAPÍTULO 09 — PERFORMANCE & ESCALA */}
        <section className="panel panel--motion" id="motion" data-chapter="09" data-name="PERFORMANCE">
          <div className="motion-copy">
            <p className="chapter-index">第九章 / 09</p>
            <h2>
              Três cortes.<br />
              Um <em>resultado.</em>
            </h2>
            <p>A estratégia desenha o caminho. A tecnologia da ESCOM executa com precisão militar.</p>
          </div>
          <div className="cut-lines" aria-hidden="true">
            <i></i><i></i><i></i>
          </div>
          <div className="motion-marquee" aria-hidden="true">
            <div>
              <span>FORJAR</span><b>創</b><span>CONVERTER</span><b>技</b><span>ESCALAR</span><b>昇</b><span>AUTOMATIZAR</span><b>放</b>
            </div>
            <div>
              <span>FORJAR</span><b>創</b><span>CONVERTER</span><b>技</b><span>ESCALAR</span><b>昇</b><span>AUTOMATIZAR</span><b>放</b>
            </div>
          </div>
          <div className="cut-count">
            <article>
              <b>壱</b>
              <span>0.4s LCP<br />VELOCIDADE MÁXIMA</span>
            </article>
            <article>
              <b>弐</b>
              <span>+240% ROAS<br />EFICIÊNCIA DE TRÁFEGO</span>
            </article>
            <article>
              <b>参</b>
              <span>99.9% UPTIME<br />INFRAESTRUTURA BLINDADA</span>
            </article>
          </div>
        </section>

        {/* CAPÍTULO 10 — O RETORNO */}
        <section className="panel panel--echo" id="echo" data-chapter="10" data-name="O RETORNO">
          <div className="echo-rings" aria-hidden="true">
            <i></i><i></i><i></i><i></i><b>響</b>
          </div>
          <div className="echo-copy">
            <p className="chapter-index">第十章 / 10</p>
            <h2>
              Após o lançamento,<br />
              ouça os <em>resultados.</em>
            </h2>
            <p>
              O verdadeiro impacto não está nas promessas. Está no dashboard ao vivo marcando vendas, leads qualificados e novos contratos todos os dias.
            </p>
          </div>
          <div className="echo-poem" aria-hidden="true">
            <span>CÓDIGO</span><i></i><span>AUTOMAÇÃO</span><i></i><span>LUCRO LÍQUIDO</span>
          </div>
        </section>

        {/* CAPÍTULO 11 — O FUTURO & CONTATO (SEM SOBREPOSIÇÃO) */}
        <section className="panel panel--legacy" id="legacy" data-chapter="11" data-name="CONTATO">
          <div className="legacy-copy">
            <p className="chapter-index">最終章 / 11</p>
            <h2>
              Construa apenas<br />
              o que gera <em>lucro.</em>
            </h2>
            <p>
              A ESCOM STUDIO não é um fornecedor comum. Somos seu braço de engenharia, automação e inteligência de vendas para consolidar sua soberania no mercado.
            </p>
            <a
              className="cta"
              href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20um%20diagn%C3%B3stico%20da%20ESCOM%20Studio."
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerFlash}
            >
              <span>
                <small>DIAGNÓSTICO PERSONALIZADO 2026</small>
                INICIAR PROJETO ESCOM
              </span>
              <i><b>↗</b></i>
            </a>
          </div>

          <div className="sheath-text" aria-hidden="true">
            <span>DOMÍNIO DA OPERAÇÃO</span>
            <small>SOBERANIA DIGITAL · ESCOM ATELIER</small>
            <b>納刀</b>
          </div>
        </section>
      </main>

      {/* SEÇÃO COLLECTION (CASES & TECNOLOGIAS EM DESTAQUE) */}
      <section className="collection" id="collection" aria-labelledby="collectionTitle">
        <div className="collection__stage">
          <div className="collection__head">
            <small>PRODUTOS EM PRODUÇÃO / 三振</small>
            <h2 id="collectionTitle">
              Uma disciplina.<br />
              <em>Três ecossistemas.</em>
            </h2>
            <p>Explore as tecnologias proprietárias desenvolvidas para nossos clientes.</p>
          </div>
          <div className="collection__cards">
            {/* Card 01 */}
            <article className="blade-card">
              <div className="blade-card__inner">
                <img
                  src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop"
                  alt="AutoCarrossel Concessionárias"
                />
                <div className="blade-card__shade"></div>
                <header>
                  <small>01 / CONCESSIONÁRIAS</small>
                  <span>車</span>
                </header>
                <footer>
                  <h3>AUTOCARROSSEL</h3>
                  <p>Consulta FIPE automática · Carrossel 100% pronto</p>
                </footer>
              </div>
            </article>

            {/* Card 02 */}
            <article className="blade-card">
              <div className="blade-card__inner">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
                  alt="Agente IA de Atendimento"
                />
                <div className="blade-card__shade"></div>
                <header>
                  <small>02 / ATENDIMENTO IA</small>
                  <span>智</span>
                </header>
                <footer>
                  <h3>AGENTE 24/7</h3>
                  <p>Qualificação no WhatsApp · Integração direta ao CRM</p>
                </footer>
              </div>
            </article>

            {/* Card 03 */}
            <article className="blade-card">
              <div className="blade-card__inner">
                <img
                  src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop"
                  alt="Máquina de Ranqueamento Google"
                />
                <div className="blade-card__shade"></div>
                <header>
                  <small>03 / GOOGLE & SEO</small>
                  <span>網</span>
                </header>
                <footer>
                  <h3>RANQUEAMENTO</h3>
                  <p>Lighthouse 100 · Google Meu Negócio & GA4</p>
                </footer>
              </div>
            </article>
          </div>
          <div className="collection__hint">
            <span>SISTEMAS OPERANDO EM PRODUÇÃO</span>
            <i></i>
            <span>ESCOM ATELIER</span>
          </div>
        </div>
      </section>

      {/* FOOTER EDITORIAL COMPLETO */}
      <footer className="site-footer">
        <div className="footer__eyebrow">
          <span>ESCOM STUDIO · ENGENHARIA DE CRESCIMENTO</span>
          <i></i>
          <span>SÃO PAULO · BRASIL</span>
        </div>

        <div className="footer__top">
          <svg className="footer__crest" viewBox="0 0 44 44" aria-hidden="true">
            <circle cx="22" cy="22" r="17.5"></circle>
            <path d="M12 30 28 10M17 34 33 14"></path>
            <path d="M10 22h24"></path>
          </svg>
          <p>
            Construa um ecossistema digital que domina o seu mercado.
          </p>
          <a
            className="footer__inquiry"
            href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20um%20projeto."
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>
              <small>FALE COM UM ENGENHEIRO</small>
              SOLICITAR PROPOSTA
            </span>
            <i>↗</i>
          </a>
        </div>

        <div className="footer__word" aria-hidden="true">
          <span>E</span>
          <span>S</span>
          <span>C</span>
          <span>O</span>
          <span>M</span>
          <span>·</span>
          <span>S</span>
          <span>T</span>
          <span>U</span>
          <span>D</span>
          <span>I</span>
          <span>O</span>
        </div>

        <div className="footer__ticker">
          <div>
            ENGENHARIA DE CONVERSÃO ◆ AGENTES DE ATENDIMENTO IA ◆ AUTOCARROSSEL INTELIGENTE ◆ SEO & GOOGLE MEU NEGÓCIO ◆ CRM PROPRIETÁRIO ◆ NEXT.JS & REACT ◆ DASHBOARDS DE ROI ◆&nbsp;
            ENGENHARIA DE CONVERSÃO ◆ AGENTES DE ATENDIMENTO IA ◆ AUTOCARROSSEL INTELIGENTE ◆ SEO & GOOGLE MEU NEGÓCIO ◆ CRM PROPRIETÁRIO ◆ NEXT.JS & REACT ◆ DASHBOARDS DE ROI ◆&nbsp;
          </div>
        </div>

        <div className="footer__grid">
          <div>
            <small>SERVIÇOS</small>
            <a href="#steel">Identidade Visual</a>
            <a href="#steel">Produtos Digitais</a>
            <a href="#steel">Landing Pages Brutalistas</a>
            <a href="#steel">E-commerce de Alta Conversão</a>
          </div>
          <div>
            <small>TECNOLOGIAS</small>
            <a href="#light">AutoCarrossel</a>
            <a href="#light">Agentes Inteligentes de IA</a>
            <a href="#light">Máquina de Ranqueamento Google</a>
            <a href="#light">Minerador de Leads B2B</a>
          </div>
          <div>
            <small>METODOLOGIA</small>
            <a href="#ritual">Mapeamento & ICP</a>
            <a href="#ritual">Engenharia Blindada</a>
            <a href="#ritual">Lançamento & Escala</a>
            <a href="#anatomy">Infraestrutura 24/7</a>
          </div>
          <div>
            <small>ESCOM STUDIO</small>
            <p>São Paulo, SP · Brasil</p>
            <p>contato@escomstudio.com.br</p>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">Atendimento WhatsApp</a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 ESCOM STUDIO. TODOS OS DIREITOS RESERVADOS.</span>
          <span>CÓDIGO PROPRIETÁRIO BLINDADO.</span>
          <a href="#">VOLTAR AO TOPO ↑</a>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   AS 4 SIMULAÇÕES INTERATIVAS AO VIVO DE ENGENHARIA REAL DA ESCOM STUDIO
   ═══════════════════════════════════════════════════════════════════════════════ */

/* 01. SIMULAÇÃO DO AUTOCARROSSEL */
function AutoCarrosselSimV2() {
  const [placa, setPlaca] = useState('');
  const [stage, setStage] = useState<'idle' | 'loading' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  const fakeCar = {
    marca: 'BMW',
    modelo: '320i M Sport GP',
    ano: '2024/2024',
    km: '8.900 km',
    preco: 'R$ 329.900',
    motor: '2.0 TwinPower Turbo 184cv',
    cambio: 'Automático 8M',
    cor: 'Cinza Dravit Metálico',
    parcela: 'Entrada + R$ 3.890/mês',
    itens: ['Teto Solar Elétrico', 'Painel BMW Curved Display', 'Som Harman Kardon', 'Faróis Full LED Adaptativos']
  };

  const handleGenerate = () => {
    if (placa.length < 7) return;
    setStage('loading');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStage('done');
          return 100;
        }
        return prev + Math.random() * 22 + 8;
      });
    }, 160);
  };

  const reset = () => {
    setStage('idle');
    setPlaca('');
    setProgress(0);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-center">
      {stage === 'idle' && (
        <div className="flex flex-col items-center justify-center gap-6 py-6 text-center">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#00d1ff] uppercase tracking-widest font-bold">● CONSULTA NATIVO FIPE & DETRAN</span>
            <h4 className="text-xl font-serif text-[#e9e2d4]">Digite a placa para consultar o veículo</h4>
            <p className="text-xs font-mono text-[#e9e2d4]/60 max-w-md">O sistema busca a ficha técnica oficial e monta na hora o carrossel do Instagram.</p>
          </div>

          <div className="flex items-center gap-3 w-full max-w-sm">
            <input
              type="text"
              maxLength={7}
              placeholder="BRA2E19"
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7))}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-[#e9e2d4] font-mono text-center text-lg tracking-[0.25em] uppercase focus:border-[#00d1ff] focus:outline-none transition-colors"
            />
            <button
              onClick={handleGenerate}
              disabled={placa.length < 7}
              className="px-6 py-3 bg-[#00d1ff] text-[#080706] font-mono text-xs font-bold rounded-lg uppercase tracking-wider hover:bg-[#00f0ff] disabled:opacity-40 transition-colors cursor-pointer"
            >
              Gerar →
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-white/40">Placas de teste:</span>
            {['BRA2E19', 'ABC1D23', 'RIO2A18'].map((p) => (
              <button
                key={p}
                onClick={() => setPlaca(p)}
                className="px-2.5 py-1 text-[9px] font-mono text-white/60 bg-white/5 border border-white/10 rounded hover:border-[#00d1ff] hover:text-[#00d1ff] transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'loading' && (
        <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
          <div className="w-8 h-8 border-2 border-[#00d1ff]/30 border-t-[#00d1ff] rounded-full animate-spin"></div>
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-white/70">
              <span>Buscando base FIPE & especificações...</span>
              <span className="text-[#00d1ff]">{Math.min(100, Math.round(progress))}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#00d1ff] transition-all duration-150" style={{ width: `${Math.min(100, progress)}%` }}></div>
            </div>
          </div>
          <p className="text-[10px] font-mono text-white/40 animate-pulse">Cruzando dados de chassi, fotos e calculando parcelamento...</p>
        </div>
      )}

      {stage === 'done' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#00d1ff] font-bold">✓ CARROSSEL GERADO COM SUCESSO</span>
              <span className="text-[10px] font-mono text-white/40">· Placa: {placa}</span>
            </div>
            <button onClick={reset} className="text-[10px] font-mono text-white/50 hover:text-white underline transition-colors cursor-pointer">
              Nova consulta ↺
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Slide 1 - Capa */}
            <div className="bg-black/60 border border-white/15 rounded-xl p-4 flex flex-col justify-between aspect-[4/5] relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-[8px] font-mono text-[#00d1ff] font-bold">SLIDE 01 / CAPA</span>
                <span className="text-[8px] font-mono text-white/40">{fakeCar.ano}</span>
              </div>
              <div className="my-auto text-center space-y-1">
                <div className="text-xs font-mono text-white/50">{fakeCar.marca}</div>
                <div className="text-base font-serif font-bold text-white leading-tight">{fakeCar.modelo}</div>
                <div className="text-sm font-mono text-[#00d1ff] font-bold mt-2">{fakeCar.preco}</div>
              </div>
              <div className="text-[8px] font-mono text-white/40 text-center border-t border-white/10 pt-2">
                {fakeCar.km} · {fakeCar.cor}
              </div>
            </div>

            {/* Slide 2 - Ficha Técnica */}
            <div className="bg-black/60 border border-white/15 rounded-xl p-4 flex flex-col justify-between aspect-[4/5] relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-[8px] font-mono text-[#00d1ff] font-bold">SLIDE 02 / ESPECIFICAÇÕES</span>
                <span className="text-[8px] font-mono text-white/40">FIPE OFICIAL</span>
              </div>
              <div className="space-y-2 my-auto text-left text-[10px] font-mono">
                <div className="flex justify-between border-b border-white/5 py-1 text-white/70">
                  <span>Motorização:</span> <b className="text-white">{fakeCar.motor}</b>
                </div>
                <div className="flex justify-between border-b border-white/5 py-1 text-white/70">
                  <span>Câmbio:</span> <b className="text-white">{fakeCar.cambio}</b>
                </div>
                <div className="flex justify-between border-b border-white/5 py-1 text-white/70">
                  <span>Quilometragem:</span> <b className="text-white">{fakeCar.km}</b>
                </div>
                <div className="flex justify-between border-b border-white/5 py-1 text-white/70">
                  <span>Combustível:</span> <b className="text-white">Gasolina Turbo</b>
                </div>
              </div>
              <div className="text-[8px] font-mono text-white/40 text-center border-t border-white/10 pt-2">
                100% periciado com laudo cautelar
              </div>
            </div>

            {/* Slide 3 - Opcionais & CTA */}
            <div className="bg-black/60 border border-white/15 rounded-xl p-4 flex flex-col justify-between aspect-[4/5] relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-[8px] font-mono text-[#00d1ff] font-bold">SLIDE 03 / CONDIÇÕES</span>
                <span className="text-[8px] font-mono text-white/40">1-CLICK</span>
              </div>
              <div className="space-y-1.5 my-auto text-[9.5px] font-mono">
                <div className="text-white/50 text-[8px] mb-1">DESTAQUES:</div>
                {fakeCar.itens.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-white/80">
                    <span className="text-[#00d1ff]">✔</span> {item}
                  </div>
                ))}
                <div className="mt-3 p-2 bg-white/5 rounded border border-[#00d1ff]/30 text-center">
                  <span className="text-[9px] text-[#00d1ff] font-bold">{fakeCar.parcela}</span>
                </div>
              </div>
              <div className="text-[8px] font-mono text-[#080706] font-bold bg-[#00d1ff] text-center py-1.5 rounded">
                CHAMAR NO WHATSAPP →
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* 02. SIMULAÇÃO DO AGENTE DE IA */
function AgenteIASimV2() {
  const [messages, setMessages] = useState<{ sender: 'lead' | 'ia'; text: string; time: string }[]>([
    { sender: 'lead', text: 'Boa tarde, queria saber o valor do implante dentário completo.', time: '14:20' },
    { sender: 'ia', text: 'Olá! Seja bem-vindo à Clínica Odonto Prime. Sou o assistente virtual da Dra. Mariana.', time: '14:20' },
    { sender: 'ia', text: 'Os valores de implantes dependem da avaliação óssea e tomografia, mas trabalhamos com condições a partir de 12x sem juros. Você já possui alguma tomografia recente?', time: '14:21' }
  ]);
  const [typing, setTyping] = useState(false);

  const simulateNext = (leadResponse: string, iaReply: string) => {
    if (typing) return;
    setMessages((prev) => [...prev, { sender: 'lead', text: leadResponse, time: '14:22' }]);
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'ia', text: iaReply, time: '14:22' }]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between">
      {/* Header do WhatsApp */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00d1ff]/20 border border-[#00d1ff] flex items-center justify-center text-[#00d1ff] text-xs font-bold font-mono">
            IA
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-white">Agente ESCOM 24/7 (Qualificação Ativa)</div>
            <div className="text-[9px] font-mono text-[#00d1ff]">● Online · Resposta em &lt; 3 segundos</div>
          </div>
        </div>
        <div className="text-[9px] font-mono text-white/40 border border-white/10 px-2 py-1 rounded">
          CRM INTEGRADO
        </div>
      </div>

      {/* Janela de Mensagens */}
      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.sender === 'lead' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[78%] px-3.5 py-2 rounded-xl text-[10.5px] font-mono leading-relaxed ${
                m.sender === 'lead' ? 'bg-[#00d1ff]/15 border border-[#00d1ff]/30 text-white' : 'bg-white/5 border border-white/10 text-white/90'
              }`}
            >
              <p className="m-0">{m.text}</p>
              <span className="block text-[7.5px] text-white/40 text-right mt-1">{m.time}</span>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-[10px] font-mono text-white/50 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00d1ff] rounded-full animate-ping"></span>
              Agente IA digitando e qualificando lead...
            </div>
          </div>
        )}
      </div>

      {/* Botões Rápidos de Simulação */}
      <div className="border-t border-white/10 pt-3 mt-3">
        <div className="text-[9px] font-mono text-white/40 mb-2">Simule respostas do cliente:</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => simulateNext('Não tenho tomografia, gostaria de agendar uma avaliação.', 'Perfeito! Temos horários disponíveis nesta quinta às 10h ou sexta às 14h. Qual fica melhor para você? Já reservo no sistema.')}
            disabled={typing}
            className="px-3 py-1.5 bg-white/5 border border-white/15 rounded-lg text-[9px] font-mono text-white/80 hover:border-[#00d1ff] hover:text-[#00d1ff] transition-colors cursor-pointer disabled:opacity-30"
          >
            "Não tenho tomografia, quero agendar" →
          </button>
          <button
            onClick={() => simulateNext('Vocês aceitam convênio Bradesco ou Amil?', 'Atendemos por reembolso facilitado, onde nossa equipe cuida de 100% da burocracia para você. Deseja falar com nosso especialista?')}
            disabled={typing}
            className="px-3 py-1.5 bg-white/5 border border-white/15 rounded-lg text-[9px] font-mono text-white/80 hover:border-[#00d1ff] hover:text-[#00d1ff] transition-colors cursor-pointer disabled:opacity-30"
          >
            "Vocês aceitam convênio?" →
          </button>
        </div>
      </div>
    </div>
  );
}

/* 03. SIMULAÇÃO DA MÁQUINA GOOGLE */
function MaquinaGoogleSimV2() {
  const [tab, setTab] = useState<'seo' | 'ga4' | 'gmn'>('seo');

  return (
    <div className="w-full flex-1 flex flex-col justify-between">
      {/* Abas */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex gap-2">
          {(
            [
              ['seo', 'SEO & LIGHTHOUSE 100'],
              ['ga4', 'GOOGLE ANALYTICS 4'],
              ['gmn', 'GOOGLE MEU NEGÓCIO']
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-3 py-1.5 rounded text-[9.5px] font-mono font-bold tracking-wider transition-colors cursor-pointer ${
                tab === key ? 'bg-[#00d1ff] text-[#080706]' : 'bg-white/5 text-white/50 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-[9px] font-mono text-[#00d1ff] hidden sm:block">ESTRUTURA SEMÂNTICA 2026</span>
      </div>

      {tab === 'seo' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 my-auto">
          {[
            ['PERFORMANCE', '99/100', '0.4s LCP', '#00d1ff'],
            ['SEO SCORE', '100/100', 'Schema.org Ok', '#00f0ff'],
            ['ACESSIBILIDADE', '100/100', 'WCAG AAA', '#00d1ff'],
            ['BEST PRACTICES', '100/100', 'HTTPS / CSP', '#c5a86a']
          ].map(([title, score, desc, color], idx) => (
            <div key={idx} className="bg-black/50 border border-white/10 rounded-xl p-4 text-center space-y-1">
              <div className="text-[8.5px] font-mono text-white/50">{title}</div>
              <div className="text-2xl font-mono font-bold" style={{ color }}>{score}</div>
              <div className="text-[9px] font-mono text-white/40">{desc}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'ga4' && (
        <div className="space-y-3 my-auto">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-[8px] font-mono text-white/40">SESSÕES MENSAIS</span>
              <div className="text-lg font-mono font-bold text-white">24.580</div>
              <span className="text-[8.5px] font-mono text-[#00d1ff]">+38% orgânico</span>
            </div>
            <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-[8px] font-mono text-white/40">LEADS CAPTADOS</span>
              <div className="text-lg font-mono font-bold text-[#00d1ff]">1.120</div>
              <span className="text-[8.5px] font-mono text-[#00d1ff]">4.55% conv.</span>
            </div>
            <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-[8px] font-mono text-white/40">ROAS MÉDIO</span>
              <div className="text-lg font-mono font-bold text-[#c5a86a]">6.8x</div>
              <span className="text-[8.5px] font-mono text-white/40">tráfego pago</span>
            </div>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between text-[10px] font-mono text-white/70">
            <span>Rastreamento Server-Side GTM + Meta CAPI ativo</span>
            <span className="text-[#00d1ff] font-bold">100% PRECISÃO</span>
          </div>
        </div>
      )}

      {tab === 'gmn' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-auto">
          <div className="bg-black/50 border border-white/10 rounded-xl p-4 space-y-2">
            <div className="text-xs font-serif font-bold text-white">Google Maps & Busca Local</div>
            <div className="flex items-center gap-1 text-xs text-[#c5a86a]">
              <span>★★★★★</span> <b className="text-white font-mono">4.9</b> <span className="text-white/40 text-[9px] font-mono">(340 avaliações)</span>
            </div>
            <p className="text-[9.5px] font-mono text-white/60">Posicionado no TOP 3 do Google Maps para o seu nicho e cidade.</p>
          </div>
          <div className="bg-black/50 border border-white/10 rounded-xl p-4 space-y-1.5 text-[10px] font-mono">
            <div className="flex justify-between border-b border-white/5 pb-1 text-white/70">
              <span>Rotas no Maps:</span> <b className="text-[#00d1ff]">+840/mês</b>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1 text-white/70">
              <span>Ligações diretas:</span> <b className="text-[#00d1ff]">+320/mês</b>
            </div>
            <div className="flex justify-between text-white/70 pt-0.5">
              <span>Cliques no Site:</span> <b className="text-[#00d1ff]">+1.450/mês</b>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-white/10 pt-2 text-[9px] font-mono text-white/40 text-center">
        Otimização Contínua · Rastreamento Avançado de Eventos GA4
      </div>
    </div>
  );
}

/* 04. SIMULAÇÃO DO MINERADOR DE LEADS B2B */
function MineradorLeadsSimV2() {
  const [nicho, setNicho] = useState('Concessionárias & Lojas de Carro');
  const [cidade, setCidade] = useState('São Paulo, SP');
  const [mining, setMining] = useState(false);
  const [results, setResults] = useState<{ nome: string; decisor: string; zap: string; score: string }[]>([
    { nome: 'AutoPrime Imports', decisor: 'Carlos Eduardo (Sócio)', zap: '(11) 98452-9981', score: 'OPORTUNIDADE ALTA (Sem site mobile)' },
    { nome: 'Motors Sul Veículos', decisor: 'Ricardo Mendes (Diretor)', zap: '(11) 97120-4412', score: 'OPORTUNIDADE ALTA (Nota baixa no GMN)' },
    { nome: 'Elite Motors Jardins', decisor: 'Fabiana Costa (Gerente)', zap: '(11) 99182-7734', score: 'OPORTUNIDADE MÉDIA (Sem tráfego pago)' }
  ]);

  const handleMine = () => {
    setMining(true);
    setTimeout(() => {
      setResults([
        { nome: 'Alpha Motors Moema', decisor: 'Bruno Silveira (CEO)', zap: '(11) 97781-2290', score: 'ALTO POTENCIAL (Zero presença Google)' },
        { nome: 'Titanium Motors', decisor: 'Marcos Vinicius (Sócio)', zap: '(11) 98841-0021', score: 'OPORTUNIDADE ALTA (Site fora do ar)' },
        { nome: 'Vanguard Veículos', decisor: 'Juliana Prado (Marketing)', zap: '(11) 99231-8845', score: 'OPORTUNIDADE ALTA (Sem CRM)' }
      ]);
      setMining(false);
    }, 1400);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between">
      {/* Controles de Busca */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-white/10 pb-3 mb-3">
        <div>
          <span className="text-[8px] font-mono text-white/40 uppercase">Nicho Alvo</span>
          <select
            value={nicho}
            onChange={(e) => setNicho(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded px-2.5 py-1.5 text-[10px] font-mono text-white focus:outline-none focus:border-[#00d1ff]"
          >
            <option>Concessionárias & Lojas de Carro</option>
            <option>Clínicas Médicas & Odontologia</option>
            <option>Escritórios de Advocacia</option>
            <option>Indústrias & B2B</option>
          </select>
        </div>
        <div>
          <span className="text-[8px] font-mono text-white/40 uppercase">Cidade / Região</span>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded px-2.5 py-1.5 text-[10px] font-mono text-white focus:outline-none focus:border-[#00d1ff]"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleMine}
            disabled={mining}
            className="w-full py-2 bg-[#00d1ff] text-[#080706] font-mono text-[10px] font-bold rounded uppercase tracking-wider hover:bg-[#00f0ff] transition-colors cursor-pointer disabled:opacity-40"
          >
            {mining ? 'Minerando...' : '🔍 Minerar Empresas'}
          </button>
        </div>
      </div>

      {/* Lista de Resultados */}
      <div className="space-y-2 max-h-[220px] overflow-y-auto">
        {results.map((r, idx) => (
          <div key={idx} className="bg-black/50 border border-white/10 rounded-lg p-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-white">{r.nome}</div>
              <div className="text-[9px] font-mono text-white/60 mt-0.5">
                Decisor: <span className="text-[#e9e2d4]">{r.decisor}</span> · WhatsApp: <span className="text-[#00d1ff]">{r.zap}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block text-[8px] font-mono text-[#00d1ff] bg-[#00d1ff]/10 border border-[#00d1ff]/30 px-2 py-0.5 rounded">
                {r.score}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[9px] font-mono text-white/40">
        <span>Filtro de oportunidades ativas</span>
        <span className="text-[#00d1ff]">1-CLICK EXPORT TO CRM</span>
      </div>
    </div>
  );
}

// Mount if direct entry
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<HomeV2 />);
}

export default HomeV2;
