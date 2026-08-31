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

  // Estados de iluminação do capítulo 8
  const [lightState, setLightState] = useState<'ember' | 'moon' | 'dawn'>('ember');

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

        {/* CAPÍTULO 08 — TECNOLOGIAS EM DESTAQUE */}
        <section className="panel panel--light" id="light" data-chapter="08" data-name="TECNOLOGIAS">
          <div className="light-intro">
            <p className="chapter-index">第八章 / 08</p>
            <h2>
              Tecnologias que operam<br />
              em cada <em>frente.</em>
            </h2>
            <p>Sistemas proprietários desenvolvidos para eliminar processos manuais, acelerar o tempo de resposta e maximizar a taxa de conversão do seu negócio.</p>
          </div>

          {/* Grid Editorial Enriquecida de 4 Tecnologias */}
          <div className="tech-steps-grid">
            {/* Card 01: AutoCarrossel */}
            <article className="tech-step-item">
              <span>車</span>
              <div className="tech-step-top">
                <small>01 / CONCESSIONÁRIAS</small>
                <div className="tech-step-badge">PROPRIETÁRIO</div>
              </div>
              <h3>AutoCarrossel.</h3>
              <p>
                O sistema consulta a base oficial FIPE com a placa do veículo, extrai dados técnicos e gera instantaneamente posts em carrossel para o Instagram com fotos e parcelas calculadas.
              </p>
              
              <div className="tech-step-specs">
                <div className="tech-spec-row">
                  <span className="spec-label">Entrada</span>
                  <span className="spec-val">Placa do Veículo</span>
                </div>
                <div className="tech-spec-row">
                  <span className="spec-label">Geração</span>
                  <span className="spec-val">3 Slides Instagram</span>
                </div>
                <div className="tech-spec-row">
                  <span className="spec-label">Integração</span>
                  <span className="spec-val">FIPE + Detran API</span>
                </div>
              </div>

              <div className="tech-step-highlight">
                <b>0%</b>
                <span>Retrabalho operacional na criação de criativos</span>
              </div>
              <i></i>
            </article>

            {/* Card 02: Agente IA */}
            <article className="tech-step-item">
              <span>智</span>
              <div className="tech-step-top">
                <small>02 / ATENDIMENTO IA</small>
                <div className="tech-step-badge">24/7 ONLINE</div>
              </div>
              <h3>Agente IA 24/7.</h3>
              <p>
                Primeiro atendimento automatizado no WhatsApp. Entende o que o lead procura, qualifica por faturamento, responde dúvidas com precisão humana e agenda direto na pauta comercial.
              </p>
              
              <div className="tech-step-specs">
                <div className="tech-spec-row">
                  <span className="spec-label">Canal</span>
                  <span className="spec-val">WhatsApp API Oficial</span>
                </div>
                <div className="tech-spec-row">
                  <span className="spec-label">Função</span>
                  <span className="spec-val">Qualificação & Agenda</span>
                </div>
                <div className="tech-spec-row">
                  <span className="spec-label">Velocidade</span>
                  <span className="spec-val">&lt; 3s Resposta</span>
                </div>
              </div>

              <div className="tech-step-highlight">
                <b>100%</b>
                <span>Dos leads atendidos nos primeiros 30 segundos</span>
              </div>
              <i></i>
            </article>

            {/* Card 03: Máquina Google */}
            <article className="tech-step-item">
              <span>網</span>
              <div className="tech-step-top">
                <small>03 / GOOGLE & SEO</small>
                <div className="tech-step-badge">TOP 1 RANK</div>
              </div>
              <h3>Máquina de Ranqueamento.</h3>
              <p>
                Estrutura digital super otimizada para o Google. Construída com semântica avançada, SEO local, Nota 100 no PageSpeed, Google Analytics 4 e Google Meu Negócio integrados.
              </p>
              
              <div className="tech-step-specs">
                <div className="tech-spec-row">
                  <span className="spec-label">PageSpeed</span>
                  <span className="spec-val">100 / 100 Score</span>
                </div>
                <div className="tech-spec-row">
                  <span className="spec-label">LCP</span>
                  <span className="spec-val">0.4s Instantâneo</span>
                </div>
                <div className="tech-spec-row">
                  <span className="spec-label">Tracking</span>
                  <span className="spec-val">GA4 + Search Console</span>
                </div>
              </div>

              <div className="tech-step-highlight">
                <b>1º</b>
                <span>Posicionamento orgânico para buscas de alta intenção</span>
              </div>
              <i></i>
            </article>

            {/* Card 04: Minerador de Leads */}
            <article className="tech-step-item">
              <span>探</span>
              <div className="tech-step-top">
                <small>04 / PROSPECÇÃO B2B</small>
                <div className="tech-step-badge">OUTBOUND</div>
              </div>
              <h3>Minerador de Leads.</h3>
              <p>
                Radar inteligente que varre empresas por nicho e cidade, identifica negócios sem presença digital moderna e entrega contatos diretos e WhatsApp de decisores com um clique.
              </p>
              
              <div className="tech-step-specs">
                <div className="tech-spec-row">
                  <span className="spec-label">Varredura</span>
                  <span className="spec-val">Nicho + Geolocalização</span>
                </div>
                <div className="tech-spec-row">
                  <span className="spec-label">Filtro</span>
                  <span className="spec-val">Score de Oportunidade</span>
                </div>
                <div className="tech-spec-row">
                  <span className="spec-label">Saída</span>
                  <span className="spec-val">WhatsApp de Decisores</span>
                </div>
              </div>

              <div className="tech-step-highlight">
                <b>1-Click</b>
                <span>Para encontrar o lead perfeito pronto para abordagem</span>
              </div>
              <i></i>
            </article>
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

// Mount if direct entry
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<HomeV2 />);
}

export default HomeV2;
