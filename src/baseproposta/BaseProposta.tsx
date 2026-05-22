import React, { useEffect, useState, useRef } from "react";
import { ArrowDown, Users, Globe, Award, ArrowUpRight, CheckCircle2, Clock, Wallet, CreditCard, ChevronRight } from "lucide-react";
import { TextRotateEntrance } from "../components/ui/text-rotate-entrance";
import { InteractiveTiltCard } from "../components/ui/tilt-card";
import { getPortfolioProjects, PortfolioProject } from "../firebase";
import { toJpeg } from 'html-to-image';
import { jsPDF } from "jspdf";
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

const ScrambleTag = ({ text }: { text: string }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const originalText = useRef(text);
  const isAnimating = useRef(false);

  const handleHover = () => {
    if (isAnimating.current || !textRef.current) return;
    isAnimating.current = true;
    let step = 0;
    const steps = 15;
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    
    const interval = setInterval(() => {
      let scrambled = '';
      for (let i = 0; i < originalText.current.length; i++) {
        if (originalText.current[i] === ' ') {
          scrambled += ' ';
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      if (textRef.current) textRef.current.innerText = scrambled;
      step++;
      if (step > steps) { 
        clearInterval(interval); 
        if(textRef.current) textRef.current.innerText = originalText.current; 
        isAnimating.current = false; 
      }
    }, 40);
  };

  return (
    <div 
      className="system-tag relative z-20 mb-6 inline-flex items-center gap-2 font-mono text-sm tracking-widest uppercase cursor-default group"
      onMouseEnter={handleHover}
    >
      <span className="text-[#2EFF00] font-bold">&gt;_</span> 
      <span className="text-[#2EFF00] text-lg leading-none">●</span> 
      <span className="text-[#2EFF00] group-hover:opacity-80 transition-opacity" ref={textRef}>{text}</span>
    </div>
  );
};

export default function BaseProposta() {
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [projectsList, setProjectsList] = useState<PortfolioProject[]>([]);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const handleAcceptProposal = async () => {
    if (!proposal || !proposal.id) return;
    setIsAccepting(true);
    try {
      await fetch(`/api/proposals/${proposal.id}/accept`, { method: "POST" });
    } catch (err) {
      console.error(err);
    }
    // Redirect regardless of API success to not block user flow
    const wppText = encodeURIComponent(`Olá, sou da empresa ${proposal.company}. Acabamos de aceitar a proposta!`);
    window.location.href = `https://wa.me/5548998065099?text=${wppText}`;
  };

  useEffect(() => {
    document.title = "Proposta - ESCOM STUDIO";
    const path = window.location.pathname;
    const slug = path.split('/').pop();
    
    getPortfolioProjects().then(data => {
      const destaques = data.filter(p => p.destaque).slice(0, 3);
      if(destaques.length > 0) {
        setProjectsList(destaques);
      } else {
        // Fallback for visual
        setProjectsList([
          { id: "1", name: "Projeto 1", category: "WEB", desc: "", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop", score: "", destaque: true },
          { id: "2", name: "Projeto 2", category: "WEB", desc: "", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop", score: "", destaque: true },
          { id: "3", name: "Projeto 3", category: "WEB", desc: "", image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop", score: "", destaque: true }
        ]);
      }
    });

    if (slug && slug.startsWith("proposta-escom-")) {
      fetch(`/api/proposals/${slug}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setProposal(data.proposal);
          } else {
            setError(true);
          }
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    } else {
      // Just a preview state if accessed via /baseproposta directly
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="bg-black min-h-screen text-[#2EFF00] flex items-center justify-center font-mono text-sm">CARREGANDO PROPOSTA...</div>;
  }

  if (error) {
    return <div className="bg-black min-h-screen text-red-500 flex items-center justify-center font-mono text-sm">PROPOSTA NÃO ENCONTRADA OU EXPIRADA.</div>;
  }

  // Calculate generic total if not dynamic
  const calculateTotal = (servicesItems: any[], customBudget: string) => {
    if (customBudget) return `R$ ${customBudget}`;
    if (!servicesItems || servicesItems.length === 0) return "R$ 4.500,00";
    const total = servicesItems.reduce((acc, curr) => acc + parseFloat(curr.price.replace(".", "")), 0);
    return `R$ ${(total).toLocaleString('pt-BR')},00`;
  };

  const clientName = proposal?.clientName || "Sua Empresa";
  const company = proposal?.company || "Sua Empresa";
  const dateSent = proposal?.createdAt ? new Date(proposal.createdAt).toLocaleDateString('pt-BR') : "06/05/2026";
  const totalValueSplit = calculateTotal(proposal?.selectedServices, proposal?.budget).replace("R$ ", "").split(",");
  const phone = proposal?.phone ? `55${proposal.phone.replace(/\D/g, '')}` : "5548988626785";
  const wppText = encodeURIComponent(`Olá ESCOM STUDIO, vi a proposta da ${company} e gostaria de fechar o projeto!`);

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      const element = document.getElementById("pdf-capture-container");
      if (element) {
        // Temporarily modify element to allow capture if it's placed off-screen
        element.classList.add('pdf-exporting');
        
        // Wait for CSS to apply and layout to calculate width/height
        await new Promise(resolve => setTimeout(resolve, 200));

        const filter = (node: HTMLElement) => {
          return node.getAttribute ? node.getAttribute('data-html2canvas-ignore') !== 'true' : true;
        };

        const imgData = await toJpeg(element, { 
          pixelRatio: 2, 
          backgroundColor: '#050505',
          filter: filter
        });
        
        const width = element.offsetWidth;
        const height = element.offsetHeight;

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [width, height] // Use original element pixels
        });
        
        pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
        pdf.save(`proposta-escom-${company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`);
        
        element.classList.remove('pdf-exporting');
      }
    } catch (err: any) {
      console.error(err);
      alert('Erro ao exportar PDF: ' + err.message);
    }
    setIsDownloadingPDF(false);
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-[#2EFF00] selection:text-black">
      <style>{`
        @media print {
          .screen-only { display: none !important; }
          .print-only { display: block !important; }
          html, body, #root, .print-only-bg {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: #050505 !important;
            color: #ffffff !important;
          }
          @page { margin: 0; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
        @media screen {
          .print-only { 
            position: absolute !important;
            left: -9999px !important;
            top: -9999px !important;
            width: 800px !important;
            opacity: 0;
            pointer-events: none !important;
          }
          .pdf-exporting {
            opacity: 1 !important;
            left: 0 !important;
            top: 0 !important;
            z-index: -100 !important;
          }
        }
      `}</style>
      <div className="screen-only">
        {/* Top Bar */}
      <div className="w-full py-2 flex justify-center items-center text-xs font-mono text-gray-400 border-b border-white/5 bg-[#0a0a0a] z-50 relative">
        <span className="text-[#2EFF00]">Data de Envio: {dateSent}</span>
        <span className="mx-4">|</span>
        <span className="text-red-500 font-bold">Proposta válida por 15 dias</span>
      </div>

      {/* Header */}
      <header className="fixed top-12 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-8 py-4 flex items-center justify-between z-[60]">
        <div className="font-bold text-xl tracking-tight">
          ESCOM <span className="text-[#2EFF00] drop-shadow-[0_0_10px_rgba(46,255,0,0.5)]">STUDIO</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={handleDownloadPDF} disabled={isDownloadingPDF} className="text-sm font-medium hover:text-white text-gray-300 transition-colors disabled:opacity-50">
            {isDownloadingPDF ? 'Gerando...' : 'Baixar PDF'}
          </button>
          <a href="#investimento" className="bg-[#2EFF00] text-black px-6 py-2 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(46,255,0,0.3)] hover:bg-[#2EFF00]/90 transition-colors">
            Ver Investimento
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-48 pb-24 px-6 min-h-[90vh] flex flex-col items-center justify-center text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,255,0,0.05),transparent_50%)] pointer-events-none"></div>
        
        <h1 className="text-[60px] md:text-[100px] leading-none font-black tracking-tighter mb-8 font-tech bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 max-w-4xl">
          PROJETO<br/><span className="text-[#2EFF00] uppercase">{company}</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 leading-relaxed">
          Olá {clientName}, aqui você vai conhecer um pouco do meu trabalho e as informações para o projeto da sua empresa, como prazo, formas de pagamento e o valor do investimento.
        </p>
        
        <a href="#informacoes" className="inline-flex items-center gap-2 bg-[#2EFF00] text-black px-8 py-4 rounded-full font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(46,255,0,0.3)] hover:scale-105 transition-transform mb-24">
          VER AS INFORMAÇÕES <ArrowDown size={18} />
        </a>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 py-6 px-12 border border-white/10 rounded-full bg-black/50 backdrop-blur-sm mx-auto max-w-fit">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#2EFF00]/10 flex items-center justify-center text-[#2EFF00]">
              <Users size={18} />
            </div>
            <span className="text-sm text-gray-300">+200 Clientes Atendidos</span>
          </div>
          <div className="w-px h-8 bg-white/10 hidden md:block"></div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#2EFF00]/10 flex items-center justify-center text-[#2EFF00]">
              <Globe size={18} />
            </div>
            <span className="text-sm text-gray-300">Clientes em mais de 5 Países</span>
          </div>
          <div className="w-px h-8 bg-white/10 hidden md:block"></div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#2EFF00]/10 flex items-center justify-center text-[#2EFF00]">
              <Award size={18} />
            </div>
            <span className="text-sm text-gray-300">+15 Anos de experiência</span>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <ScrambleTag text="[ PORTFOLIO ]" />
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight font-tech group cursor-default">
            <span className="group-hover:text-[#2EFF00] transition-colors duration-500">Trabalhos que</span> <span className="text-gray-600 group-hover:text-white transition-colors duration-500">falam por si.</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mb-16 leading-relaxed">
            Alguns dos projetos mais recentes onde aplicamos design estratégico para gerar resultados reais.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectsList.map((proj, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden border border-white/5 relative aspect-[4/3] bg-[#111]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                <img src={proj.image} alt={proj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Maker */}
      <section className="py-24 px-6 relative overflow-hidden">
        <style>{`
          @keyframes floatImage {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(2deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
        `}</style>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 relative z-10">
          <div className="flex-[0.6] relative min-h-[500px]">
            <ScrambleTag text="[ BASTIDORES ]" />
            <div className="relative mb-12 flex justify-center md:justify-start">
              <div style={{ width: "100%", maxWidth: "350px", height: "450px" }} className="w-[300px] md:w-[350px] shadow-[0_0_30px_rgba(46,255,0,0.15)]">
                  <InteractiveTiltCard
                    image={{
                      src: "https://eionstudio.com.br/wp-content/uploads/2026/02/about-slide-2.jpg",
                      alt: "ESCOM STUDIO",
                    }}
                    tiltFactor={20}
                    hoverScale={1.05}
                    shadowIntensity={0.6}
                    glareEffect={true}
                    glareIntensity={0.4}
                  />
              </div>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight relative z-20 mix-blend-difference text-white pointer-events-none">
              <TextRotateEntrance text="Muito além" /><br /><span className="text-[#2EFF00]"><TextRotateEntrance text="do pixel." /></span>
            </h2>
          </div>
          
          <div className="flex-1 mt-12 md:mt-24 relative z-30">
            <p className="text-xl text-gray-400 leading-relaxed mb-6 max-w-lg">
              A senioridade não é sobre o tempo, mas sobre a capacidade de prever o que o mercado precisa antes mesmo de ser solicitado. Com 15 anos no ativo, a minha missão é eliminar o "ruído" visual para deixar apenas o que importa: a mensagem e a conversão.
            </p>
            <blockquote className="border-l-2 border-[#2EFF00] pl-6 py-3 my-8 text-gray-300 italic bg-[#2EFF00]/5 rounded-r-lg pr-6 max-w-lg leading-relaxed">
              "Sou casado com a melhor psicóloga do mundo, meu amor Ingrid. Temos um gatinho persa, o Oreo, e alguns peixinhos. Quando não estou criando designs, estou aproveitando a vida ao lado da minha família."
            </blockquote>
            <p className="text-lg text-gray-400 leading-relaxed mb-12 max-w-lg">
              Atualmente, como Diretor de Arte, integro tecnologia e emoção para criar jornadas digitais que ficam gravadas na memória — e no extrato bancário dos meus clientes.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto flex flex-col gap-16">
          <div className="w-full text-center mb-16">
            <ScrambleTag text="[ TIMELINE ]" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1] group cursor-default">
              <span className="group-hover:text-[#2EFF00] transition-colors duration-500">Entenda um pouco</span><br />
              <span className="group-hover:text-white transition-colors duration-500">do processo de</span><br />
              <span className="text-[#2EFF00] group-hover:text-white transition-colors duration-500">Criação</span>
            </h2>
          </div>
          
          <div className="relative w-full max-w-2xl mx-auto">
            <style>{`
              @keyframes timelineFlow {
                0% { top: -50px; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
              }
              .timeline-anim {
                animation: timelineFlow 5s linear infinite;
              }
            `}</style>
            {/* Timeline base track */}
            <div className="absolute left-[5px] top-0 bottom-0 w-px bg-[#2EFF00]/20"></div>
            
            {/* Flowing animated particle based on scroll */}
            <div className="absolute left-[4px] top-0 w-[3px] h-[150px] bg-gradient-to-b from-transparent via-[#2EFF00] to-transparent z-10 timeline-anim hidden md:block"></div>

            <div className="space-y-16 pt-4 pb-4 w-full">
              {/* Step 1 */}
              <div className="relative grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 pb-16 group">
                <div className="absolute left-0 top-1 w-[11px] h-[11px] rounded-full bg-black border-2 border-[#2EFF00] z-20 group-hover:bg-[#2EFF00] transition-colors duration-300"></div>
                <div className="pl-6 md:pl-8">
                  <div className="font-mono text-sm text-[#2EFF00] tracking-[0.2em] mb-2 font-bold">ETAPA 01</div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">Mapeamento</div>
                </div>
                <div className="pl-6 md:pl-0">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#2EFF00] transition-colors duration-300">Aplicação do Briefing</h3>
                  <p className="text-gray-400 text-[1.05rem] leading-relaxed max-w-2xl">
                    O primeiro passo é entender exatamente o que você quer e coletar as informações necessárias, como: Copy, arquivos de imagem, identidade visual, referências, etc...
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 pb-16 group">
                <div className="absolute left-0 top-1 w-[11px] h-[11px] rounded-full bg-black border-2 border-[#2EFF00] z-20 group-hover:bg-[#2EFF00] transition-colors duration-300"></div>
                <div className="pl-6 md:pl-8">
                  <div className="font-mono text-sm text-[#2EFF00] tracking-[0.2em] mb-2 font-bold">ETAPA 02</div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">Análise</div>
                </div>
                <div className="pl-6 md:pl-0">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#2EFF00] transition-colors duration-300">Pesquisa & Estratégia</h3>
                  <p className="text-gray-400 text-[1.05rem] leading-relaxed max-w-2xl">
                    Realizo uma análise do nicho para compreender profundamente as estratégias dos concorrentes, identificando as melhores práticas e referências do setor. Esse processo me permite absorver ideias inovadoras e eficazes.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 pb-16 group">
                <div className="absolute left-0 top-1 w-[11px] h-[11px] rounded-full bg-black border-2 border-[#2EFF00] z-20 group-hover:bg-[#2EFF00] transition-colors duration-300"></div>
                <div className="pl-6 md:pl-8">
                  <div className="font-mono text-sm text-[#2EFF00] tracking-[0.2em] mb-2 font-bold">ETAPA 03</div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">Direção</div>
                </div>
                <div className="pl-6 md:pl-0">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#2EFF00] transition-colors duration-300">Criação do Design</h3>
                  <p className="text-gray-400 text-[1.05rem] leading-relaxed max-w-2xl">
                    A partir disso, iniciarei o desenvolvimento da parte visual, garantindo que o resultado final seja não apenas atrativo, mas também altamente competitivo e alinhado com as tendências de mercado.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 pb-16 group">
                <div className="absolute left-0 top-1 w-[11px] h-[11px] rounded-full bg-black border-2 border-[#2EFF00] z-20 group-hover:bg-[#2EFF00] transition-colors duration-300"></div>
                <div className="pl-6 md:pl-8">
                  <div className="font-mono text-sm text-[#2EFF00] tracking-[0.2em] mb-2 font-bold">ETAPA 04</div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">Front-end</div>
                </div>
                <div className="pl-6 md:pl-0">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#2EFF00] transition-colors duration-300">Implementação</h3>
                  <p className="text-gray-400 text-[1.05rem] leading-relaxed max-w-2xl">
                    Após a completa aprovação do design pelo cliente, procedo com a implementação da página, assegurando a plena responsividade em todos os dispositivos e garantindo uma experiência de usuário fluida.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8 group">
                <div className="absolute left-0 top-1 w-[11px] h-[11px] rounded-full bg-black border-2 border-[#2EFF00] z-20 group-hover:bg-[#2EFF00] transition-colors duration-300"></div>
                <div className="pl-6 md:pl-8">
                  <div className="font-mono text-sm text-[#2EFF00] tracking-[0.2em] mb-2 font-bold">ETAPA 05</div>
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">Performance</div>
                </div>
                <div className="pl-6 md:pl-0">
                  <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-[#2EFF00] transition-colors duration-300">Otimização Extrema</h3>
                  <p className="text-gray-400 text-[1.05rem] leading-relaxed max-w-2xl mb-8">
                    Durante esta fase, dedico-me à otimização integral da página, visando assegurar um carregamento rápido e eficiente. Velocidade é crucial para as conversões e para evitar abandonos.
                  </p>
                  
                  <div className="bg-white border border-gray-200 p-6 md:p-8 md:pb-6 w-full max-w-[550px] relative overflow-hidden group-hover:border-[#2EFF00]/50 transition-colors duration-500 rounded-lg shadow-lg">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2EFF00] to-transparent opacity-100"></div>
                     <div className="flex justify-between items-center mb-6">
                       <span className="text-sm font-mono text-gray-400 tracking-[0.15em] uppercase leading-none">Performance Report</span>
                       <div className="flex gap-[6px] items-center">
                         <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-[#2EFF00]"></div>
                       </div>
                     </div>
                     <div className="grid grid-cols-3 gap-6 mb-6 pt-2">
                       <div className="flex flex-col">
                         <div className="text-5xl font-black text-[#2EFF00]">A</div>
                         <div className="text-xs text-gray-400 font-mono tracking-wider mt-2 uppercase">Grade</div>
                       </div>
                       <div className="flex flex-col">
                         <div className="text-5xl font-black text-black">100%</div>
                         <div className="text-xs text-gray-400 font-mono tracking-wider mt-2 uppercase">Perf.</div>
                       </div>
                       <div className="flex flex-col">
                         <div className="text-5xl font-black text-black">99%</div>
                         <div className="text-xs text-gray-400 font-mono tracking-wider mt-2 uppercase">Struct.</div>
                       </div>
                     </div>
                     <div className="text-sm text-gray-500 font-mono flex gap-6 pt-4 border-t border-gray-100">
                       <span>LCP: <strong className="text-[#2EFF00] font-bold">450ms</strong></span>
                       <span>TBT: <strong className="text-[#2EFF00] font-bold">12ms</strong></span>
                       <span>CLS: <strong className="text-[#2EFF00] font-bold">0.01</strong></span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section id="informacoes" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-12">
             <h2 className="text-3xl md:text-5xl font-black">Informações sobre a Proposta</h2>
             <span className="text-[10px] border border-[#2EFF00]/50 bg-[#2EFF00]/10 px-3 py-1 rounded font-mono text-[#2EFF00] shadow-[0_0_10px_rgba(46,255,0,0.2)]">AVISOS IMPORTANTES</span>
          </div>

          <div className="space-y-6">
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex items-center gap-6 w-full md:w-[40%] shrink-0">
                <span className="text-4xl font-black text-white/50">01</span>
                <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <div style={{ width: 80, height: 80 }}>
                    <DotLottiePlayer
                      src="https://fonts.gstatic.com/s/e/notoemoji/latest/23f0/lottie.json"
                      autoplay
                      loop
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold leading-tight">Prazo de<br />Entrega</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed border-l border-white/10 pl-6 border-l-0 md:border-l-solid">
                O prazo de entrega de uma página é de <strong className="text-white">10 a 15 dias úteis</strong>, podendo ser entregue antes dependendo do fluxo de demandas ou da necessidade do cliente.
              </p>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex items-center gap-6 w-full md:w-[40%] shrink-0">
                <span className="text-4xl font-black text-white/50">02</span>
                <div className="w-12 h-12 rounded-xl bg-[#2EFF00]/10 flex items-center justify-center text-[#2EFF00] shrink-0">
                   <Wallet size={20} />
                </div>
                <h3 className="text-xl font-bold leading-tight">Formas de<br />Pagamento</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed border-l border-white/10 pl-6 border-l-0 md:border-l-solid">
                A partir do pagamento de <strong className="text-white">50% do valor</strong> começamos o projeto e depois que o serviço for entregue e aprovado, os outros 50%.
              </p>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex items-center gap-6 w-full md:w-[40%] shrink-0">
                <span className="text-4xl font-black text-white/50">03</span>
                <div className="w-12 h-12 rounded-xl bg-[#2EFF00]/10 flex items-center justify-center text-[#2EFF00] shrink-0">
                   <CreditCard size={20} />
                </div>
                <h3 className="text-xl font-bold leading-tight">Meios de<br />Pagamento</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed border-l border-white/10 pl-6 border-l-0 md:border-l-solid">
                Você pode pagar através de PIX ou transferência bancária internacional. Se preferir, pode parcelar no cartão de crédito <span className="text-[10px] text-gray-500">(plataforma com taxas aplicáveis).</span>
              </p>
            </div>

            {proposal?.observations && (
              <div className="bg-[#111] border border-[#2EFF00]/20 rounded-2xl p-6 md:p-8 flex flex-col gap-4 items-start">
                <h3 className="text-xl font-bold leading-tight text-[#2EFF00]">Observações</h3>
                <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                  {proposal.observations}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing / Investment */}
      <section id="investimento" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#2EFF00]/5 pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse at bottom, black, transparent)' }}></div>
        <div className="max-w-3xl mx-auto border border-white/10 bg-[#050505] rounded-[40px] p-12 md:p-20 text-center relative z-10 shadow-2xl">
          <h2 className="text-4xl font-black text-[#2EFF00] mb-8">Investimento</h2>
          
          {proposal?.selectedServices?.length > 0 && (
            <div className="flex flex-col items-center mb-8 w-full max-w-sm mx-auto border border-[#333] bg-[#111] rounded-2xl p-6">
               <h4 className="text-[10px] text-gray-500 font-mono tracking-widest border-b border-[#333] pb-4 mb-4 w-full text-center">SERVIÇOS INCLUSOS</h4>
               {proposal.selectedServices.map((s: any) => (
                 <div key={s.id} className="flex justify-between w-full text-sm mb-3 font-mono last:mb-0">
                    <span className="text-gray-300">{s.name}</span>
                 </div>
               ))}
            </div>
          )}

          <div className="flex items-start justify-center gap-2 mb-8 mt-4">
            <span className="text-xl font-bold mt-2">R$</span>
            <span className="text-6xl md:text-8xl font-black tracking-tighter">{totalValueSplit[0]}</span>
            <span className="text-xl font-bold mt-2">,{totalValueSplit[1] || '00'}</span>
          </div>

          <p className="text-gray-400 text-sm mb-12">
            Essa Proposta com esse valor promocional é válida por <strong className="text-red-500 font-bold">15 dias</strong>.
          </p>

          <button onClick={handleAcceptProposal} disabled={isAccepting} className="inline-flex items-center justify-center gap-2 bg-[#2EFF00] text-black w-full md:w-auto px-12 py-5 rounded-full font-bold text-lg hover:bg-[#2EFF00]/90 transition-colors shadow-[0_0_30px_rgba(46,255,0,0.3)] hover:scale-105 transform duration-300 disabled:opacity-50">
            {isAccepting ? "AGUARDE..." : "QUERO FECHAR COM VOCÊ"} <ArrowUpRight size={20} />
          </button>

          <div className="mt-12 text-sm text-gray-500">
            Ainda Ficou com alguma dúvida?<br/>
            <a href={`https://wa.me/${phone}?text=${encodeURIComponent("Olá ESCOM STUDIO, tive uma dúvida sobre a proposta.")}`} target="_blank" rel="noreferrer" className="text-[#2EFF00] underline hover:text-white transition-colors mt-2 inline-block">Clique aqui para me chamar no WhatsApp</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-black">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-gray-600 font-mono">
            © 2026 Todos os direitos reservados.
          </div>
          
          <div className="font-bold text-xl tracking-tight">
             ESCOM <span className="text-[#2EFF00]">STUDIO</span>
          </div>

          <div className="text-xs text-gray-600 font-mono flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Políticas de Privacidade</a>
            <span>|</span>
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          </div>
        </div>
        <div className="text-center mt-8 text-[10px] text-gray-700 font-mono uppercase tracking-widest">
           ESCOM STUDIO LTDA | CNPJ: 48.298.795/0001-92
        </div>
      </footer>

      {/* Scroll to Top */}
      <button 
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        className="fixed bottom-8 right-8 w-12 h-12 bg-[#2EFF00] text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_15px_rgba(46,255,0,0.3)] z-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
      </button>
      </div>

      {/* Print View */}
      <div id="pdf-capture-container" className="print-only print-only-bg" style={{ padding: '20mm', backgroundColor: '#050505', color: '#fff', fontSize: '14px', lineHeight: '1.6', minHeight: '100vh' }}>
        <h1 className="text-center font-bold text-[#2EFF00] text-3xl mb-4" style={{ marginTop: '0' }}>Proposta Comercial - ESCOM STUDIO</h1>
        <div className="text-center mb-6 text-sm text-gray-400">
            Data de Envio: {dateSent} | <span className="text-red-500 font-bold">Proposta válida por 15 dias</span>
        </div>

        <p className="mb-4">OLÁ {clientName?.toUpperCase() || ''},</p>
        <p className="mb-6">Aqui você vai conhecer um pouco do meu trabalho e as informações para o projeto da sua empresa, como prazo, formas de pagamento e o valor do investimento.</p>

        <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#111', borderLeft: '5px solid #2EFF00' }}>
            <p className="font-bold">+200 Clientes Atendidos</p>
            <p className="font-bold">Clientes em mais de 5 Países</p>
            <p className="font-bold">+15 Anos de experiência</p>
        </div>

        <h2 className="text-[#2EFF00] text-2xl font-bold mb-4">Trabalhos que falam por si.</h2>
        <p className="mb-6">Alguns dos projetos mais recentes onde aplicamos design estratégico para gerar resultados reais.</p>

        <h3 className="text-[#2EFF00] text-xl font-bold mb-4">Muito além do pixel.</h3>
        <p className="mb-4">A senioridade não é sobre o tempo, mas sobre a capacidade de prever o que o mercado precisa antes mesmo de ser solicitado. Com 15 anos no ativo, a minha missão é eliminar o "ruído" visual para deixar apenas o que importa: a mensagem e a conversão.</p>
        <p className="mb-4 italic">"Sou casado com a melhor psicóloga do mundo, meu amor Ingrid. Temos um gatinho persa, o Oreo, e alguns peixinhos. Quando não estou criando designs, estou aproveitando a vida ao lado da minha família."</p>
        <p className="mb-8">Atualmente, como Diretor de Arte, integro tecnologia e emoção para criar jornadas digitais que ficam gravadas na memória — e no extrato bancário dos meus clientes.</p>

        <h2 className="text-[#2EFF00] text-2xl font-bold mb-4" style={{ pageBreakBefore: 'always', margintop: '20px' }}>Entenda um pouco do processo de Criação</h2>
        <div className="mb-8 p-6 rounded" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-start mb-4">
                <span className="text-[#2EFF00] font-bold text-2xl mr-4 leading-none">01</span>
                <div>
                    <h4 className="text-[#2EFF00] font-bold mb-1">Aplicação do Briefing</h4>
                    <p className="text-sm">O primeiro passo é entender exatamente o que você quer e coletar as informações necessárias, como: Copy, arquivos de imagem, identidade visual, referências, etc...</p>
                </div>
            </div>
            <div className="flex items-start mb-4">
                <span className="text-[#2EFF00] font-bold text-2xl mr-4 leading-none">02</span>
                <div>
                    <h4 className="text-[#2EFF00] font-bold mb-1">Pesquisa & Estratégia</h4>
                    <p className="text-sm">Realizo uma análise do nicho para compreender profundamente as estratégias dos concorrentes, identificando as melhores práticas e referências do setor. Esse processo me permite absorver ideias inovadoras e eficazes.</p>
                </div>
            </div>
            <div className="flex items-start mb-4">
                <span className="text-[#2EFF00] font-bold text-2xl mr-4 leading-none">03</span>
                <div>
                    <h4 className="text-[#2EFF00] font-bold mb-1">Criação do Design</h4>
                    <p className="text-sm">A partir disso, iniciarei o desenvolvimento da parte visual, garantindo que o resultado final seja não apenas atrativo, mas também altamente competitivo e alinhado com as tendências de mercado.</p>
                </div>
            </div>
            <div className="flex items-start mb-4">
                <span className="text-[#2EFF00] font-bold text-2xl mr-4 leading-none">04</span>
                <div>
                    <h4 className="text-[#2EFF00] font-bold mb-1">Implementação</h4>
                    <p className="text-sm">Após a completa aprovação do design pelo cliente, procedo com a implementação da página, assegurando a plena responsividade em todos os dispositivos e garantindo uma experiência de usuário fluida.</p>
                </div>
            </div>
            <div className="flex items-start">
                <span className="text-[#2EFF00] font-bold text-2xl mr-4 leading-none">05</span>
                <div>
                    <h4 className="text-[#2EFF00] font-bold mb-1">Otimização Extrema da Página</h4>
                    <p className="text-sm">Durante esta fase, dedico-me à otimização integral da página, visando assegurar um carregamento rápido e eficiente. Velocidade é crucial para as conversões e para evitar abandonos.</p>
                </div>
            </div>
        </div>

        <h2 className="text-[#2EFF00] text-2xl font-bold mb-4">Performance Report</h2>
        <div className="mb-8 p-6 rounded" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="mb-1">Grade: <strong>A</strong></p>
            <p className="mb-1">Performance: <strong>100%</strong></p>
            <p className="mb-1">Structure: <strong>99%</strong></p>
            <p className="mb-1">LCP: <strong>450ms</strong></p>
            <p className="mb-1">TBT: <strong>12ms</strong></p>
            <p>CLS: <strong>0.01</strong></p>
        </div>

        <h2 className="text-[#2EFF00] text-2xl font-bold mb-4" style={{ pageBreakBefore: 'always', margintop: '20px' }}>Informações sobre a Proposta</h2>
        <div className="mb-8 p-6 rounded" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 className="text-[#2EFF00] font-bold mb-1">01 Prazo de Entrega</h4>
            <p className="text-sm mb-4">O prazo de entrega de uma página é de <strong>10 a 15 dias úteis</strong>, podendo ser entregue antes dependendo do fluxo de demandas ou da necessidade do cliente.</p>

            <h4 className="text-[#2EFF00] font-bold mb-1">02 Formas de Pagamento</h4>
            <p className="text-sm mb-4">A partir do pagamento de <strong>50% do valor</strong> começamos o projeto e depois que o serviço for entregue e aprovado, os outros 50%.</p>

            <h4 className="text-[#2EFF00] font-bold mb-1">03 Meios de Pagamento</h4>
            <p className="text-sm">Você pode pagar através de PIX ou transferência bancária internacional. Se preferir, pode parcelar no cartão de crédito (plataforma com taxas aplicáveis).</p>
            
            {proposal?.observations && (
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <h4 className="text-[#2EFF00] font-bold mb-2">Observações</h4>
                <p className="text-sm whitespace-pre-wrap">{proposal.observations}</p>
              </div>
            )}
        </div>

        <div className="text-center rounded-xl p-8 mb-8" style={{ backgroundColor: 'rgba(46,255,0,0.1)', border: '1px solid #2EFF00' }}>
            <h3 className="text-2xl font-bold text-white mb-4">Investimento</h3>
            
            {proposal?.selectedServices?.length > 0 && (
              <div className="mb-6">
                 <h4 className="text-gray-400 font-bold mb-2 font-mono text-xs">SERVIÇOS INCLUSOS</h4>
                 {proposal.selectedServices.map((s: any) => (
                   <p key={s.id} className="text-sm text-gray-300 font-mono mb-1">{s.name}</p>
                 ))}
                 <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '16px auto' }}></div>
              </div>
            )}
            
            <p className="text-4xl text-[#2EFF00] font-black leading-none mb-2">R$ {totalValueSplit[0]},{totalValueSplit[1] || '00'}</p>
            <p className="text-sm text-gray-400 mt-2">Essa Proposta com esse valor promocional é válida por 15 dias.</p>
        </div>

        {/* Since it's a PDF, links might still be clickable on digital viewers */}
        <p className="text-center font-bold mb-4">Gostou? Clique abaixo para começarmos!</p>
        <a href={`https://wa.me/${phone}?text=${wppText}`} target="_blank" rel="noreferrer" className="block w-full text-center p-4 bg-[#2EFF00] text-black font-bold mb-4" style={{ textDecoration: 'none', borderRadius: '5px' }}>
            QUERO FECHAR COM VOCÊ
        </a>
        <p className="text-center mt-6 text-sm text-gray-400">Ainda Ficou com alguma dúvida?</p>
        <a href={`https://wa.me/${phone}?text=${encodeURIComponent("Olá ESCOM STUDIO, tive uma dúvida sobre a proposta.")}`} target="_blank" rel="noreferrer" className="block w-full text-center p-4 bg-[#111] text-[#2EFF00] font-bold" style={{ border: '1px solid #2EFF00', textDecoration: 'none', borderRadius: '5px' }}>
            Clique aqui para me chamar no WhatsApp
        </a>

        <div className="text-center mt-12 text-xs text-gray-500 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p>© 2026 Todos os direitos reservados.</p>
            <p className="mt-2">ESCOM STUDIO LTDA | CNPJ: 48.298.795/0001-92</p>
        </div>
      </div>
    </div>
  );
}
