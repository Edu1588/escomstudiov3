import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { toPng } from 'html-to-image';
import { jsPDF } from "jspdf";
import { db } from "../../lib/firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import {
  Upload,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  Download,
  X,
  History,
  Trash,
  Globe,
  Check,
  Sparkles,
  Loader,
  Send,
  FileText,
  Copy,
  Edit3,
  Wand2,
  RefreshCw,
  Layout,
  ArrowRight
} from "lucide-react";

const currentYear = new Date().getFullYear();

// Formatação do destaque nos títulos do slide (*palavra*)
const formatHighlight = (text: string, highlightColor: string) => {
  if (!text) return null;
  if (text.includes('*')) {
    const parts = text.split(/\*(.*?)\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <span key={i} className="font-serif italic normal-case tracking-normal" style={{ color: highlightColor }}>{part}</span>;
      }
      return part;
    });
  }
  const words = text.split(' ');
  if (words.length > 1) {
    const lastWord = words.pop();
    return (
      <>{words.join(' ')} <span className="font-serif italic normal-case tracking-normal" style={{ color: highlightColor }}>{lastWord}</span></>
    );
  }
  return text;
};

// Componente de Renderização do Slide (Preview Fiel)
const SlidePreview = ({ slide, image, index, onClick, small = false, id, selectedTemplate, cardTheme = "dark" }: any) => {
  const isCover = index === 0;
  const isLast = slide?.isLast;
  const isSlide4 = slide?.slide === 4;

  const isWhiteBg = cardTheme === "light" || isSlide4;
  
  // Cores dinâmicas por tema e modelo
  let bgColor = isWhiteBg ? 'bg-white text-black' : 'bg-black text-white';
  if (selectedTemplate === 2 && isCover) bgColor = 'bg-[#F4F3EE] text-black';
  if (selectedTemplate === 3 && isCover) bgColor = 'bg-[#0c0c0c] text-white';
  if (selectedTemplate === 4) bgColor = isWhiteBg ? 'bg-slate-50 text-slate-900' : 'bg-[#090d16] text-white';

  let titleColor = isWhiteBg ? '#000000' : '#00d1ff';
  if (selectedTemplate === 2) titleColor = '#000000';
  if (selectedTemplate === 3 && isCover) titleColor = '#ffffff';
  if (selectedTemplate === 4) titleColor = isWhiteBg ? '#2563eb' : '#38bdf8';

  const titleSize = small ? 'text-[10px]' : (isCover ? 'text-2xl font-black' : 'text-xl font-bold');
  const bodySize = small ? 'text-[7px]' : 'text-sm font-normal';
  const headerSize = small ? 'text-[5px]' : 'text-[10px]';

  const imgStyle = {
    objectPosition: `${slide?.imgX || 50}% ${slide?.imgY || 50}%`,
    transform: `scale(${slide?.imgScale || 1})`,
    transformOrigin: `${slide?.imgX || 50}% ${slide?.imgY || 50}%`
  };

  return (
    <div 
      id={id} 
      onClick={onClick} 
      className={`relative ${bgColor} shrink-0 overflow-hidden shadow-2xl transition-all border border-[#222]/30 flex flex-col ${
        small ? 'w-full aspect-[4/5] cursor-pointer hover:border-[#2563eb] rounded-lg' : 'w-[360px] md:w-[400px] aspect-[4/5] rounded-2xl'
      }`}
    >
      {/* Header Superior */}
      <div className={`absolute top-0 left-0 w-full p-5 flex justify-between items-start z-40 font-mono tracking-wider uppercase opacity-75 ${headerSize}`}>
        <span>ESCOM STUDIO</span>
        <span>© {currentYear}</span>
      </div>

      {/* Background Image / Overlay */}
      {!isSlide4 && (
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#111] flex items-center justify-center">
          {image ? (
            <img src={image} className="w-full h-full object-cover transition-transform duration-75" style={imgStyle} alt="Slide background" />
          ) : (
            <div className="w-full h-full bg-[#111] flex items-center justify-center opacity-30">
              <ImageIcon className="w-12 h-12 text-gray-500" />
            </div>
          )}
          <div className={`absolute inset-0 z-10 pointer-events-none ${
            isWhiteBg ? 'bg-gradient-to-t from-white via-white/80 to-transparent' : 'bg-gradient-to-t from-black via-black/80 to-transparent'
          }`} />
        </div>
      )}

      {/* Conteúdo Principal do Slide */}
      <div className={`flex-1 flex flex-col justify-end p-8 md:p-10 relative z-20`}>
        {isCover ? (
          <div className="space-y-3 text-left">
            <span className="inline-block bg-[#2563eb] text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {slide?.badge || "DESTAQUE DA SEMANA"}
            </span>
            <h1 className={`font-extrabold uppercase leading-[0.95] tracking-tight ${titleSize}`} style={{ color: slide?.customTitleColor || titleColor }}>
              {formatHighlight(slide?.titulo || "Título Principal do Carrossel", "#2563eb")}
            </h1>
            <p className={`opacity-90 leading-relaxed ${bodySize}`}>
              {slide?.texto || "Descubra os passos estratégicos para transformar seus resultados."}
            </p>
          </div>
        ) : isLast ? (
          <div className="space-y-4 text-center items-center flex flex-col justify-center h-full">
            <h2 className="text-2xl font-black uppercase text-[#2563eb]">
              {slide?.titulo || "GOSTOU DESTE CONTEÚDO?"}
            </h2>
            <p className="text-sm opacity-90">
              {slide?.texto || "Salve para consultar mais tarde e compartilhe com quem precisa ver isso!"}
            </p>
            <div className="inline-flex items-center gap-2 bg-[#2563eb]/20 border border-[#2563eb]/40 px-4 py-2 rounded-full text-xs font-bold mt-4 text-[#2563eb]">
              <span>@escomstudio</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-left">
            <span className="text-[11px] font-mono opacity-60 font-bold block">
              SLIDE 0{index + 1}
            </span>
            <h2 className={`font-bold leading-snug ${titleSize}`} style={{ color: slide?.customTitleColor || titleColor }}>
              {slide?.titulo}
            </h2>
            <p className={`opacity-90 leading-relaxed ${bodySize}`}>
              {slide?.texto}
            </p>
          </div>
        )}
      </div>

      {/* Footer do Slide */}
      {!isLast && (
        <div className="relative z-30 p-4 border-t border-white/10 flex justify-between items-center text-[10px] opacity-75">
          <span>Arraste para o lado &rarr;</span>
          <span className="font-mono">0{index + 1} / 05</span>
        </div>
      )}
    </div>
  );
};

export default function InstagramGEM() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [cardTheme, setCardTheme] = useState<"dark" | "light">("dark");
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);

  const [tema, setTema] = useState<string>("");
  const [linkMateria, setLinkMateria] = useState<string>("");
  const [tomDeVoz, setTomDeVoz] = useState<string>("Educacional & Direto");

  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState<boolean>(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [selectedIdeaIndex, setSelectedIdeaIndex] = useState<number | null>(null);

  const [slides, setSlides] = useState<any[]>([
    { titulo: "VOCÊ ESTÁ COMETENDO ESSE ERRO SEM PERCEBER?", texto: "Descubra como a maioria das marcas perde engajamento e como corrigir no mesmo dia.", badge: "INSIDER" },
    { titulo: "O Diagnóstico Inicial", texto: "Publicar sem estratégia visual faz seu conteúdo ser ignorado na primeira fração de segundo." },
    { titulo: "A Solução Prática", texto: "Use templates estruturados com contraste alto e chamadas claras de ação." },
    { titulo: "Exemplo Real de Sucesso", texto: "Carrosséis bem formatados aumentam a retenção de leitura em até 300%." },
    { titulo: "Salve este post!", texto: "Compartilhe com sua equipe e aplique no seu próximo carrossel.", isLast: true }
  ]);
  const [legenda, setLegenda] = useState<string>("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [uploadedImages, setUploadedImages] = useState<Record<number, string>>({
    0: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
  });
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [history, setHistory] = useState<any[]>([]);

  const templates = [
    {
      id: 1,
      name: "Cyber Neon Glass",
      desc: "Modelo futurista com vidro fosco e detalhes azul neon de alto impacto.",
      tag: "Mais Usado",
      badgeBg: "bg-blue-100 text-[#2563eb] border-blue-200",
      sampleTitle: "VOCÊ ESTÁ COMETENDO ESSE ERRO SEM PERCEBER?",
      coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      theme: "dark"
    },
    {
      id: 2,
      name: "Minimalist Editorial",
      desc: "Estilo sofisticado bege e creme com tipografia em contraste.",
      tag: "Editorial",
      badgeBg: "bg-slate-100 text-slate-800 border-slate-200",
      sampleTitle: "O MÉTODO QUE PERMITE PUBLICAR 30 POSTS POR SEMANA.",
      coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      theme: "light"
    },
    {
      id: 3,
      name: "Insider Impact",
      desc: "Visual focado em imagens imersivas com vinhetas e botões de chamada.",
      tag: "Engajamento",
      badgeBg: "bg-blue-100 text-blue-800 border-blue-200",
      sampleTitle: "A ESTRATÉGIA SECRETA POR TRÁS DAS MARCAS QUE VENDEM.",
      coverImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      theme: "dark"
    },
    {
      id: 4,
      name: "Futuristic Glow",
      desc: "Gradientes azul e ciano perfeitos para nichos de tecnologia e IA.",
      tag: "Tech & IA",
      badgeBg: "bg-cyan-100 text-cyan-800 border-cyan-200",
      sampleTitle: "5 FERRAMENTAS DE IA INDISPENSÁVEIS PARA 2026.",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      theme: "dark"
    },
    {
      id: 5,
      name: "Dark Mode Clean",
      desc: "Visual escuro limpo focado em tipografia serifada e leitura direta.",
      tag: "Minimal",
      badgeBg: "bg-indigo-100 text-indigo-800 border-indigo-200",
      sampleTitle: "COMO CONSTRUIR UMA AUDIÊNCIA QUALIFICADA.",
      coverImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
      theme: "dark"
    }
  ];

  useEffect(() => {
    async function loadHistory() {
      try {
        const q = query(collection(db, "instagram_history"), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        const list: any[] = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        setHistory(list);
      } catch (e) {
        console.warn("Erro ao carregar histórico:", e);
      }
    }
    loadHistory();
  }, []);

  const handleSelectTemplate = (tpl: any) => {
    setSelectedTemplate(tpl.id);
    setCardTheme(tpl.theme);
    setUploadedImages((prev: any) => ({ 0: tpl.coverImage, ...prev }));
    setPreviewModalOpen(true);
  };

  const handleConfirmTemplate = () => {
    setPreviewModalOpen(false);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGenerateIdeas = async () => {
    if (!tema) {
      alert("Por favor, digite o tema ou assunto do carrossel.");
      return;
    }
    setIsGeneratingIdeas(true);
    try {
      const res = await fetch("/api/generate-pautas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "suggest", suggestion: `${tema} | Link: ${linkMateria} | Tom: ${tomDeVoz}` }),
      });
      const data = await res.json();
      if (data.success && data.pautas) {
        setIdeas(data.pautas);
      } else {
        setIdeas([
          {
            titulo: `${tema}: Os 3 Segredos Mais Guardados`,
            descricao: `Uma abordagem direta sobre ${tema} revelando práticas testadas.`
          },
          {
            titulo: `Por que 90% falham em ${tema}?`,
            descricao: `Análise dos principais erros comuns e como evitá-los imediatamente.`
          },
          {
            titulo: `O Guia Definitivo de ${tema} para Este Ano`,
            descricao: `Passo a passo acionável com plano prático de aplicação.`
          }
        ]);
      }
      setCurrentStep(3);
    } catch (e) {
      console.error(e);
      setIdeas([
        {
          titulo: `${tema}: Os 3 Segredos Mais Guardados`,
          descricao: `Uma abordagem direta sobre ${tema} revelando práticas testadas.`
        },
        {
          titulo: `Por que a maioria erra em ${tema}?`,
          descricao: `Análise dos principais erros comuns e como evitá-los imediatamente.`
        }
      ]);
      setCurrentStep(3);
    } finally {
      setIsGeneratingIdeas(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleApproveIdea = async (idea: any, index: number) => {
    setSelectedIdeaIndex(index);
    setIsGeneratingIdeas(true);
    try {
      const res = await fetch("/api/generate-carrossel-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pauta: { titulo: idea.titulo, descricao: idea.descricao } }),
      });
      const data = await res.json();
      if (data.success && data.slides) {
        const rawSlides = data.slides;
        const newSlides = [
          { titulo: rawSlides.titulo01 || idea.titulo, texto: rawSlides.texto01 || idea.descricao, badge: "EXCLUSIVO" },
          { titulo: rawSlides.titulo02 || "O Grande Erro", texto: rawSlides.texto02 || "A maioria das pessoas falha por não ajustar a estratégia inicial." },
          { titulo: rawSlides.titulo03 || "A Mudança de Chave", texto: rawSlides.texto03 || "Ao aplicar a metodologia correta, os resultados se multiplicam." },
          { titulo: rawSlides.titulo04 || "Estudo Prático", texto: rawSlides.texto04 || "Resultados reais mensurados no primeiro ciclo de testes." },
          { titulo: rawSlides.titulo05 || "Conclusão & CTA", texto: rawSlides.textofinal || "Salve este post e compartilhe com sua equipe!", isLast: true }
        ];
        setSlides(newSlides);
        setLegenda(data.legenda_texto || `🔥 ${idea.titulo}\n\nConfira todos os detalhes no carrossel acima e comente com suas dúvidas!\n\n#escomstudio #marketing #design #branding`);
      } else {
        setLegenda(`🔥 ${idea.titulo}\n\nConfira todos os detalhes no carrossel acima e salve para consultar mais tarde!\n\n#escomstudio #instagram #design`);
      }
      setCurrentStep(4);
    } catch (e) {
      console.error(e);
      setCurrentStep(4);
    } finally {
      setIsGeneratingIdeas(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGenerateAIImage = async () => {
    setIsGeneratingImage(true);
    try {
      const slide = slides[currentSlideIndex];
      const queryText = slide?.titulo || tema || "technology design abstract";
      const res = await fetch("/api/search-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText })
      });
      const data = await res.json();
      if (data.success && data.results?.length > 0) {
        const randomImg = data.results[Math.floor(Math.random() * Math.min(5, data.results.length))].url;
        setUploadedImages(prev => ({ ...prev, [currentSlideIndex]: randomImg }));
      } else {
        alert("Nenhuma imagem encontrada para este conceito.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao buscar imagem por IA.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages(prev => ({ ...prev, [currentSlideIndex]: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPNG = async () => {
    setIsDownloading(true);
    try {
      for (let i = 0; i < slides.length; i++) {
        const el = document.getElementById(`slide-target-${i}`);
        if (el) {
          const dataUrl = await toPng(el, { pixelRatio: 2 });
          const link = document.createElement("a");
          link.download = `carrossel-slide-0${i + 1}.png`;
          link.href = dataUrl;
          link.click();
        }
      }
    } catch (e) {
      console.error("Erro ao gerar PNG:", e);
      alert("Erro ao exportar PNG.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [1080, 1350] });
      for (let i = 0; i < slides.length; i++) {
        const el = document.getElementById(`slide-target-${i}`);
        if (el) {
          const dataUrl = await toPng(el, { pixelRatio: 2 });
          if (i > 0) pdf.addPage([1080, 1350], "portrait");
          pdf.addImage(dataUrl, "PNG", 0, 0, 1080, 1350);
        }
      }
      pdf.save("carrossel-escom-studio.pdf");
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
      alert("Erro ao exportar PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#070c18] text-white pb-20 font-sans">
      <Header 
        title="Instagram GEM ✦ Carrossel Studio" 
        subtitle="Crie carrosséis de alto engajamento em 4 passos simples alimentados por IA." 
      />

      <div className="p-4 md:p-8 max-w-[1400px] mx-auto space-y-8">
        
        {/* WIZARD STEP INDICATOR - CARD BRANCO SOBRE FUNDO ESCURO DO ADMIN */}
        <div className="bg-white text-slate-900 border-2 border-slate-900 rounded-xl p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { num: 1, label: "Escolha um Template" },
              { num: 2, label: "Sobre o Carrossel" },
              { num: 3, label: "Aprovação do Roteiro" },
              { num: 4, label: "Imagens & Download" }
            ].map((s) => {
              const isActive = currentStep === s.num;
              const isDone = currentStep > s.num;
              return (
                <div 
                  key={s.num} 
                  onClick={() => isDone && setCurrentStep(s.num)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? "bg-[#2563eb] text-white border-slate-900 font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                      : isDone 
                      ? "bg-blue-50 text-[#2563eb] font-bold border-blue-300" 
                      : "bg-slate-100 text-slate-400 border-slate-200 font-medium"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive ? "bg-white text-[#2563eb]" : isDone ? "bg-[#2563eb] text-white" : "bg-slate-200 text-slate-500"
                  }`}>
                    {isDone ? "✓" : s.num}
                  </div>
                  <span className="text-xs uppercase tracking-wider">
                    PASSO {s.num} DE 4 &bull; {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------- PASSO 1: ESCOLHA UM TEMPLATE ------------------- */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#2563eb]/20 border border-[#2563eb]/40 px-3.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span>
                <span className="text-xs font-bold text-[#00d1ff] uppercase tracking-wider">
                  PASSO 1 DE 4
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Escolha um template
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-3xl leading-relaxed">
                É o visual do seu carrossel. A IA escreve o conteúdo em cima do template que você escolher. Alguns têm capa gerada por IA.
              </p>
            </div>

            {/* Grid de 5 Templates em Cards Brancos sobre fundo escuro */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {templates.map((tpl) => (
                <div 
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`bg-white text-slate-900 border-2 border-slate-900 rounded-2xl p-4 space-y-4 hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] transition-all cursor-pointer group flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] ${
                    selectedTemplate === tpl.id ? "ring-4 ring-[#2563eb]" : ""
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${tpl.badgeBg}`}>
                        {tpl.tag}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">v{tpl.id}.0</span>
                    </div>

                    {/* Preview Miniatura do Card */}
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-black p-4 flex flex-col justify-end group-hover:scale-[1.02] transition-transform border border-slate-900 shadow-md">
                      <img 
                        src={tpl.coverImage} 
                        className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-300 group-hover:scale-105" 
                        alt={tpl.name} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 z-10 pointer-events-none"></div>
                      <div className="relative z-20 space-y-1">
                        <div className="text-[7px] font-mono text-[#00d1ff] font-bold uppercase tracking-wider">ESCOM STUDIO</div>
                        <h4 className="text-[10px] font-extrabold text-white leading-tight uppercase drop-shadow-md">
                          {tpl.sampleTitle}
                        </h4>
                        <div className="w-full bg-[#2563eb] h-1 rounded-full mt-2 shadow-sm shadow-blue-400/50"></div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-[#2563eb] transition-colors">
                        {tpl.name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {tpl.desc}
                      </p>
                    </div>
                  </div>

                  {/* BOTÃO AZUL QUADRADO COM BORDA PRETA E SOMBRA DESLOCADA */}
                  <button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-extrabold py-3.5 px-4 rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5 uppercase tracking-wide">
                    <span>Ver Opções</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL / PAINEL DE CONFIGURAÇÃO ADICIONAL DO TEMPLATE (CARD BRANCO) */}
        {previewModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 border-2 border-slate-900 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative animate-in zoom-in-95 duration-200">
              
              <button 
                onClick={() => setPreviewModalOpen(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-2">
                <span className="text-xs font-mono text-[#2563eb] font-bold uppercase tracking-widest">
                  VISUAL DO TEMPLATE {selectedTemplate}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {templates.find(t => t.id === selectedTemplate)?.name}
                </h3>
              </div>

              {/* Preview do Slide do Template */}
              <div className="flex justify-center py-4">
                <SlidePreview 
                  slide={{ 
                    titulo: templates.find(t => t.id === selectedTemplate)?.sampleTitle || "O MÉTODO QUE PERMITE PUBLICAR 30 POSTS POR SEMANA EN MENOS DE 2 HORAS.", 
                    texto: "Descubra como a IA acelera sua produção de conteúdo sem perder a qualidade." 
                  }}
                  image={templates.find(t => t.id === selectedTemplate)?.coverImage}
                  index={0}
                  selectedTemplate={selectedTemplate}
                  cardTheme={cardTheme}
                />
              </div>

              {/* Opção de Configuração Adicional: Fundo dos Cards */}
              <div className="space-y-3 pt-4 border-t-2 border-slate-200">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block text-center">
                  Fundo dos cards (escolha um pra continuar)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* BOTÃO Fundo Preto */}
                  <button
                    onClick={() => setCardTheme("dark")}
                    className={`py-3.5 px-6 rounded-lg font-extrabold text-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${
                      cardTheme === "dark" 
                        ? "bg-[#2563eb] text-white" 
                        : "bg-white text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Fundo preto
                  </button>

                  {/* BOTÃO Fundo Branco */}
                  <button
                    onClick={() => setCardTheme("light")}
                    className={`py-3.5 px-6 rounded-lg font-extrabold text-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${
                      cardTheme === "light" 
                        ? "bg-[#2563eb] text-white" 
                        : "bg-white text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    Fundo branco
                  </button>
                </div>
              </div>

              {/* BOTÃO PRINCIPAL "Usar esse template" */}
              <button 
                onClick={handleConfirmTemplate}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-base py-4 px-6 rounded-lg border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <span>Usar esse template</span>
                <Check size={18} />
              </button>

            </div>
          </div>
        )}

        {/* ------------------- PASSO 2: SOBRE O QUE É O CARROSSEL ------------------- */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#2563eb]/20 border border-[#2563eb]/40 px-3.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span>
                <span className="text-xs font-bold text-[#00d1ff] uppercase tracking-wider">
                  PASSO 2 DE 4
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Sobre o que é o carrossel?
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Escreva o tema, cole um texto ou o link de uma matéria, a IA lê o conteúdo e desenvolve o roteiro no visual do template.
              </p>
            </div>

            {/* Badge do Template Selecionado em Card Branco */}
            <div className="bg-white text-slate-900 border-2 border-slate-900 rounded-xl p-4 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563eb] flex items-center justify-center font-bold">
                  <Layout size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-mono uppercase">Template Selecionado:</span>
                  <div className="text-sm font-extrabold text-slate-900">
                    {templates.find(t => t.id === selectedTemplate)?.name} ({cardTheme === "dark" ? "Fundo Escuro" : "Fundo Claro"})
                  </div>
                </div>
              </div>
              <button onClick={() => setCurrentStep(1)} className="text-xs text-[#2563eb] hover:underline font-extrabold">
                Alterar Template
              </button>
            </div>

            {/* Formulário Principal em Card Branco */}
            <div className="bg-white text-slate-900 border-2 border-slate-900 rounded-2xl p-6 md:p-8 space-y-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,0.9)]">
              
              {/* Tema do Carrossel */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  TEMA DO CARROSSEL
                </label>
                <textarea
                  rows={4}
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  placeholder="Ex.: A importância de beber água ao longo do dia, benefícios, quantidade ideal..."
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl p-4 text-slate-900 text-sm focus:border-[#2563eb] focus:bg-white outline-none transition-colors leading-relaxed"
                />
              </div>

              {/* Link de Matéria Opcional */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  LINK DE MATÉRIA <span className="text-slate-500 font-normal lowercase">(opcional, a IA lê a página e usa como base)</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="url"
                    value={linkMateria}
                    onChange={(e) => setLinkMateria(e.target.value)}
                    placeholder="https://exemplo.com/materia"
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl pl-12 pr-4 py-3.5 text-slate-900 text-sm focus:border-[#2563eb] focus:bg-white outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Tom de Voz */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  TOM DE VOZ DO CONTEÚDO
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "Educacional & Direto",
                    "Provocativo & Viral",
                    "Vendas & Oferta",
                    "Storytelling"
                  ].map((tom) => (
                    <button
                      key={tom}
                      type="button"
                      onClick={() => setTomDeVoz(tom)}
                      className={`p-3 rounded-lg text-xs font-extrabold border-2 transition-all ${
                        tomDeVoz === tom 
                          ? "bg-[#2563eb] text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                          : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {tom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ações */}
              <div className="pt-4 flex items-center justify-between gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3.5 rounded-lg border-2 border-slate-900 bg-white text-slate-800 font-extrabold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  &larr; Voltar ao Passo 1
                </button>
                
                <button
                  onClick={handleGenerateIdeas}
                  disabled={isGeneratingIdeas}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-sm px-8 py-3.5 rounded-lg border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 uppercase tracking-wide"
                >
                  {isGeneratingIdeas ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      <span>Gerando Ideias com IA...</span>
                    </>
                  ) : (
                    <>
                      <span>Gerar Ideias de Texto</span>
                      <Sparkles size={16} />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ------------------- PASSO 3: APROVAÇÃO DO ROTEIRO ------------------- */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#2563eb]/20 border border-[#2563eb]/40 px-3.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span>
                <span className="text-xs font-bold text-[#00d1ff] uppercase tracking-wider">
                  PASSO 3 DE 4
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Escolha o Ângulo do Carrossel
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Selecione a ideia aprovada para estruturar os 5 slides em alta definição.
              </p>
            </div>

            {/* Lista de Ideias Geradas em Cards Brancos */}
            <div className="space-y-4">
              {ideas.map((idea, idx) => (
                <div 
                  key={idx}
                  className={`bg-white text-slate-900 border-2 border-slate-900 rounded-2xl p-6 transition-all space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] ${
                    selectedIdeaIndex === idx ? "ring-4 ring-[#2563eb]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold text-[#2563eb] uppercase">
                      OPÇÃO 0{idx + 1}
                    </span>
                    <span className="text-[10px] bg-blue-100 text-[#2563eb] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                      Ângulo Recomendado
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900">
                    {idea.titulo}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {idea.descricao}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleApproveIdea(idea, idx)}
                      className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs px-6 py-3 rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 uppercase"
                    >
                      <span>Aprovar essa ideia & Gerar Slides</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-lg border-2 border-slate-900 bg-white text-slate-800 font-extrabold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                &larr; Voltar ao Passo 2
              </button>
            </div>
          </div>
        )}

        {/* ------------------- PASSO 4: IMAGENS & DOWNLOAD ------------------- */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#2563eb]/20 border border-[#2563eb]/40 px-3.5 py-1 rounded-full mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#2563eb]"></span>
                  <span className="text-xs font-bold text-[#00d1ff] uppercase tracking-wider">
                    PASSO 4 DE 4
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  Edição Visual & Download Final
                </h2>
              </div>

              {/* Botões de Download */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleDownloadPNG}
                  disabled={isDownloading}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs md:text-sm px-6 py-3.5 rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 uppercase tracking-wide"
                >
                  <Download size={16} />
                  <span>{isDownloading ? "Gerando PNG..." : "Baixar em PNG"}</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs md:text-sm px-6 py-3.5 rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 uppercase tracking-wide"
                >
                  <FileText size={16} />
                  <span>{isDownloading ? "Gerando PDF..." : "Baixar em PDF"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Coluna Esquerda: Edição dos Slides */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Miniaturas dos Slides */}
                <div className="bg-white text-slate-900 border-2 border-slate-900 rounded-xl p-4 space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                    SELECIONE O SLIDE PARA EDITAR (SLIDE 0{currentSlideIndex + 1})
                  </span>
                  <div className="grid grid-cols-5 gap-3">
                    {slides.map((s, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`aspect-[4/5] rounded-xl bg-slate-900 border-2 cursor-pointer overflow-hidden p-2 flex flex-col justify-end transition-all ${
                          currentSlideIndex === idx ? "border-[#2563eb] ring-2 ring-[#2563eb]/50 scale-105" : "border-slate-800 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <span className="text-[7px] font-mono text-slate-400">0{idx + 1}</span>
                        <div className="text-[7px] font-bold text-white truncate">{s.titulo}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Painel de Edição do Slide Selecionado em Card Branco */}
                <div className="bg-white text-slate-900 border-2 border-slate-900 rounded-2xl p-6 space-y-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
                    <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <Edit3 size={16} className="text-[#2563eb]" />
                      <span>Editar Conteúdo do Slide 0{currentSlideIndex + 1}</span>
                    </h3>
                  </div>

                  {/* Edição do Título */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      TÍTULO DO SLIDE
                    </label>
                    <input
                      type="text"
                      value={slides[currentSlideIndex]?.titulo || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSlides(prev => prev.map((s, i) => i === currentSlideIndex ? { ...s, titulo: val } : s));
                      }}
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl px-4 py-3 text-slate-900 text-sm focus:border-[#2563eb] focus:bg-white outline-none"
                    />
                  </div>

                  {/* Edição do Texto */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      TEXTO DO SLIDE
                    </label>
                    <textarea
                      rows={3}
                      value={slides[currentSlideIndex]?.texto || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSlides(prev => prev.map((s, i) => i === currentSlideIndex ? { ...s, texto: val } : s));
                      }}
                      className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl p-4 text-slate-900 text-sm focus:border-[#2563eb] focus:bg-white outline-none leading-relaxed"
                    />
                  </div>

                  {/* Opções de Imagem do Slide */}
                  <div className="space-y-3 pt-2 border-t-2 border-slate-200">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                      IMAGEM DE FUNDO DO SLIDE
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex-1 bg-white hover:bg-slate-50 text-slate-900 text-xs font-extrabold px-4 py-3 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all flex items-center justify-center gap-2">
                        <Upload size={14} />
                        <span>Subir Imagem Própria</span>
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>

                      <button
                        onClick={handleGenerateAIImage}
                        disabled={isGeneratingImage}
                        className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-extrabold px-4 py-3 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                      >
                        {isGeneratingImage ? <Loader size={14} className="animate-spin" /> : <Wand2 size={14} />}
                        <span>Gerar Imagem com IA</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Legenda Pronta do Instagram em Card Branco */}
                <div className="bg-white text-slate-900 border-2 border-slate-900 rounded-2xl p-6 space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <FileText size={16} className="text-[#2563eb]" />
                      LEGENDA E HASHTAGS DO POST
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(legenda);
                        alert("Legenda copiada para a área de transferência!");
                      }}
                      className="text-xs text-[#2563eb] hover:underline font-extrabold flex items-center gap-1"
                    >
                      <Copy size={12} />
                      <span>Copiar Legenda</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={legenda}
                    onChange={(e) => setLegenda(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl p-4 text-slate-900 text-xs leading-relaxed focus:border-[#2563eb] focus:bg-white outline-none"
                  />
                </div>

              </div>

              {/* Coluna Direita: Preview Interativo do Slide */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center sticky top-24 space-y-4">
                <div className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <span>PREVIEW INTERATIVO</span>
                  <span className="text-[#00d1ff] font-bold">SLIDE 0{currentSlideIndex + 1} DE 05</span>
                </div>

                <div className="relative">
                  <div id={`slide-target-${currentSlideIndex}`}>
                    <SlidePreview 
                      slide={slides[currentSlideIndex]} 
                      image={uploadedImages[currentSlideIndex]} 
                      index={currentSlideIndex} 
                      selectedTemplate={selectedTemplate}
                      cardTheme={cardTheme}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentSlideIndex === 0}
                    className="p-3 rounded-full bg-white border-2 border-slate-900 text-slate-900 hover:bg-[#2563eb] hover:text-white disabled:opacity-30 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-xs font-mono font-bold text-gray-300">
                    0{currentSlideIndex + 1} / 05
                  </span>
                  <button
                    onClick={() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
                    disabled={currentSlideIndex === slides.length - 1}
                    className="p-3 rounded-full bg-white border-2 border-slate-900 text-slate-900 hover:bg-[#2563eb] hover:text-white disabled:opacity-30 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}