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
  const isLast = slide.isLast;
  const isSlide4 = slide.slide === 4;

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
    objectPosition: `${slide.imgX || 50}% ${slide.imgY || 50}%`,
    transform: `scale(${slide.imgScale || 1})`,
    transformOrigin: `${slide.imgX || 50}% ${slide.imgY || 50}%`
  };

  return (
    <div 
      id={id} 
      onClick={onClick} 
      className={`relative ${bgColor} shrink-0 overflow-hidden shadow-2xl transition-all border border-[#222]/30 flex flex-col ${
        small ? 'w-full aspect-[4/5] cursor-pointer hover:border-[#00d1ff] rounded-lg' : 'w-[360px] md:w-[400px] aspect-[4/5] rounded-2xl'
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
          {/* Sombreamento degradê para leitura perfeita do texto */}
          <div className={`absolute inset-0 z-10 pointer-events-none ${
            isWhiteBg ? 'bg-gradient-to-t from-white via-white/80 to-transparent' : 'bg-gradient-to-t from-black via-black/80 to-transparent'
          }`} />
        </div>
      )}

      {/* Conteúdo Principal do Slide */}
      <div className={`flex-1 flex flex-col justify-end p-8 md:p-10 relative z-20`}>
        {isCover ? (
          <div className="space-y-3 text-left">
            <span className="inline-block bg-[#00d1ff] text-black font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
              {slide.badge || "DESTAQUE DA SEMANA"}
            </span>
            <h1 className={`font-extrabold uppercase leading-[0.95] tracking-tight ${titleSize}`} style={{ color: slide.customTitleColor || titleColor }}>
              {formatHighlight(slide.titulo || "Título Principal do Carrossel", "#00d1ff")}
            </h1>
            <p className={`opacity-90 leading-relaxed ${bodySize}`}>
              {slide.texto || "Descubra os passos estratégicos para transformar seus resultados."}
            </p>
          </div>
        ) : isLast ? (
          <div className="space-y-4 text-center items-center flex flex-col justify-center h-full">
            <h2 className="text-2xl font-black uppercase text-[#00d1ff]">
              {slide.titulo || "GOSTOU DESTE CONTEÚDO?"}
            </h2>
            <p className="text-sm opacity-90">
              {slide.texto || "Salve para consultar mais tarde e compartilhe com quem precisa ver isso!"}
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs font-bold mt-4">
              <span>@escomstudio</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-left">
            <span className="text-[11px] font-mono opacity-60 font-bold block">
              SLIDE 0{index + 1}
            </span>
            <h2 className={`font-bold leading-snug ${titleSize}`} style={{ color: slide.customTitleColor || titleColor }}>
              {slide.titulo}
            </h2>
            <p className={`opacity-90 leading-relaxed ${bodySize}`}>
              {slide.texto}
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
  // Passos do Wizard: 1 (Template), 2 (Sobre/Tema), 3 (Aprovação Roteiro), 4 (Imagens e Download)
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Configurações do Template
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [cardTheme, setCardTheme] = useState<"dark" | "light">("dark");
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);

  // Passo 2: Formulário sobre o Carrossel
  const [tema, setTema] = useState<string>("");
  const [linkMateria, setLinkMateria] = useState<string>("");
  const [tomDeVoz, setTomDeVoz] = useState<string>("Educacional & Direto");

  // Passo 3: Ideias de Conteúdo e Slides
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState<boolean>(false);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [selectedIdeaIndex, setSelectedIdeaIndex] = useState<number | null>(null);

  // Passo 4: Slides Gerados & Edição
  const [slides, setSlides] = useState<any[]>([
    { titulo: "Você está cometendo esse erro sem perceber?", texto: "Descubra como a maioria das marcas perde engajamento e como corrigir no mesmo dia.", badge: "INSIDER" },
    { titulo: "O Diagnóstico Inicial", texto: "Publicar sem estratégia visual faz seu conteúdo ser ignorado na primeira fração de segundo." },
    { titulo: "A Solução Prática", texto: "Use templates estruturados com contraste alto e chamadas claras de ação." },
    { titulo: "Exemplo Real de Sucesso", texto: "Carrosséis bem formatados aumentam a retenção de leitura em até 300%." },
    { titulo: "Salve este post!", texto: "Compartilhe com sua equipe e aplique no seu próximo carrossel.", isLast: true }
  ]);
  const [legenda, setLegenda] = useState<string>("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [uploadedImages, setUploadedImages] = useState<Record<number, string>>({});
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [history, setHistory] = useState<any[]>([]);

  // 5 Templates Disponíveis
  const templates = [
    {
      id: 1,
      name: "Cyber Neon Glass",
      desc: "Modelo futurista com vidro fosco e detalhes neon de alto impacto.",
      tag: "Mais Usado",
      badgeBg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      sampleTitle: "Você está cometendo esse erro sem perceber?",
      theme: "dark"
    },
    {
      id: 2,
      name: "Minimalist Editorial",
      desc: "Estilo sofisticado bege e creme com tipografia em contraste.",
      tag: "Editorial",
      badgeBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      sampleTitle: "O método que permite publicar 30 posts por semana.",
      theme: "light"
    },
    {
      id: 3,
      name: "Insider Impact",
      desc: "Visual focado em imagens imersivas com vinhetas e botões de chamada.",
      tag: "Engajamento",
      badgeBg: "bg-red-500/20 text-red-400 border-red-500/30",
      sampleTitle: "A estratégia secreta por trás das marcas que vendem diariamente.",
      theme: "dark"
    },
    {
      id: 4,
      name: "Futuristic Glow",
      desc: "Gradientes azul e roxo perfeitos para nichos de tecnologia e IA.",
      tag: "Tech & IA",
      badgeBg: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      sampleTitle: "5 Ferramentas de Inteligência Artificial indispensáveis.",
      theme: "dark"
    },
    {
      id: 5,
      name: "Dark Mode Clean",
      desc: "Visual escuro limpo focado em tipografia serifada e leitura direta.",
      tag: "Minimal",
      badgeBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      sampleTitle: "Como construir uma audiência altamente qualificada.",
      theme: "dark"
    }
  ];

  // Buscar Histórico do Firestore
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

  // Handler: Selecionar Template
  const handleSelectTemplate = (tpl: any) => {
    setSelectedTemplate(tpl.id);
    setCardTheme(tpl.theme);
    setPreviewModalOpen(true);
  };

  // Handler: Confirmar Template e Ir para Passo 2
  const handleConfirmTemplate = () => {
    setPreviewModalOpen(false);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handler: Gerar Ideias via IA (Passo 2 -> 3)
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
        // Fallback de ideias geradas
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
      // Fallback
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

  // Handler: Aprovar Ideia e Gerar Slides (Passo 3 -> 4)
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
        // Manter slides prévios editados
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

  // Handler: Gerar Imagem com IA / Unsplash para o Slide Ativo
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

  // Handler: Upload de Imagem Local
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

  // Handler: Exportar em PNG (Zip/Download)
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

  // Handler: Exportar em PDF
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
        
        {/* WIZARD STEP INDICATOR */}
        <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-2xl p-4 md:p-6 shadow-xl">
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
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? "bg-[#2563eb] text-white font-bold shadow-lg shadow-blue-500/20" 
                      : isDone 
                      ? "bg-[#142340] text-blue-400 font-semibold" 
                      : "bg-[#091020] text-gray-500 font-medium"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive ? "bg-white text-blue-600" : isDone ? "bg-blue-500 text-white" : "bg-[#182642] text-gray-400"
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
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">
                ● PASSO 1 DE 4
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Escolha um template
              </h2>
              <p className="text-gray-400 text-sm md:text-base max-w-3xl leading-relaxed">
                É o visual do seu carrossel. A IA escreve o conteúdo em cima do template que você escolher. Alguns têm capa gerada por IA.
              </p>
            </div>

            {/* Grid de 5 Templates */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {templates.map((tpl) => (
                <div 
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`bg-[#0e172a] border rounded-2xl p-5 space-y-4 hover:border-blue-500 transition-all cursor-pointer group flex flex-col justify-between shadow-xl ${
                    selectedTemplate === tpl.id ? "border-blue-500 ring-2 ring-blue-500/50 bg-[#12203d]" : "border-[#1e2e4a]"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Badge do Template */}
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${tpl.badgeBg}`}>
                        {tpl.tag}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">v{tpl.id}.0</span>
                    </div>

                    {/* Preview Miniatura do Card */}
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-black p-4 flex flex-col justify-end group-hover:scale-[1.02] transition-transform border border-white/10">
                      <div className="absolute top-2 left-2 text-[6px] font-mono text-white/50">ESCOM STUDIO</div>
                      <h4 className="text-[10px] font-bold text-white leading-tight uppercase mb-1">
                        {tpl.sampleTitle}
                      </h4>
                      <div className="w-full bg-[#00d1ff] h-1 rounded-full mt-2"></div>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">
                        {tpl.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {tpl.desc}
                      </p>
                    </div>
                  </div>

                  <button className="w-full bg-[#18294a] group-hover:bg-[#2563eb] text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1">
                    <span>Ver Opções</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL / PAINEL DE CONFIGURAÇÃO ADICIONAL DO TEMPLATE (IMAGEM 2 DO USUÁRIO) */}
        {previewModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
              
              <button 
                onClick={() => setPreviewModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-2">
                <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-widest">
                  VISUAL DO TEMPLATE {selectedTemplate}
                </span>
                <h3 className="text-2xl font-bold text-white">
                  {templates.find(t => t.id === selectedTemplate)?.name}
                </h3>
              </div>

              {/* Preview do Slide do Template */}
              <div className="flex justify-center py-4">
                <SlidePreview 
                  slide={{ titulo: "O MÉTODO QUE PERMITE PUBLICAR 30 POSTS POR SEMANA EM MENOS DE 2 HORAS.", texto: "Descubra como a IA acelera sua produção de conteúdo sem perder a qualidade." }}
                  image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  index={0}
                  selectedTemplate={selectedTemplate}
                  cardTheme={cardTheme}
                />
              </div>

              {/* Opção de Configuração Adicional: Fundo dos Cards (Imagem 2) */}
              <div className="space-y-3 pt-4 border-t border-[#1e2e4a]">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block text-center">
                  Fundo dos cards (escolha um pra continuar)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setCardTheme("dark")}
                    className={`py-3.5 px-4 rounded-xl font-bold text-xs transition-all border ${
                      cardTheme === "dark" 
                        ? "bg-[#2563eb] text-white border-blue-400 shadow-lg shadow-blue-500/30" 
                        : "bg-[#121f38] text-gray-400 border-[#1e2e4a] hover:text-white"
                    }`}
                  >
                    Fundo preto
                  </button>
                  <button
                    onClick={() => setCardTheme("light")}
                    className={`py-3.5 px-4 rounded-xl font-bold text-xs transition-all border ${
                      cardTheme === "light" 
                        ? "bg-[#2563eb] text-white border-blue-400 shadow-lg shadow-blue-500/30" 
                        : "bg-[#121f38] text-gray-400 border-[#1e2e4a] hover:text-white"
                    }`}
                  >
                    Fundo branco
                  </button>
                </div>
              </div>

              {/* Botão Usar Esse Template */}
              <button 
                onClick={handleConfirmTemplate}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-sm py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/30 active:scale-98 flex items-center justify-center gap-2"
              >
                <span>Usar esse template</span>
                <Check size={18} />
              </button>

            </div>
          </div>
        )}

        {/* ------------------- PASSO 2: SOBRE O QUE É O CARROSSEL (IMAGEM 3 DO USUÁRIO) ------------------- */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">
                ● PASSO 2 DE 4
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Sobre o que é o carrossel?
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Escreva o tema, cole um texto ou o link de uma matéria, a IA lê o conteúdo e desenvolve o roteiro no visual do template.
              </p>
            </div>

            {/* Badge do Template Selecionado */}
            <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Layout size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-mono uppercase">Template Selecionado:</span>
                  <div className="text-sm font-bold text-white">
                    {templates.find(t => t.id === selectedTemplate)?.name} ({cardTheme === "dark" ? "Fundo Escuro" : "Fundo Claro"})
                  </div>
                </div>
              </div>
              <button onClick={() => setCurrentStep(1)} className="text-xs text-blue-400 hover:underline font-bold">
                Alterar Template
              </button>
            </div>

            {/* Formulário Principal */}
            <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
              
              {/* Tema do Carrossel */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                  TEMA DO CARROSSEL
                </label>
                <textarea
                  rows={4}
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  placeholder="Ex.: A importância de beber água ao longo do dia, benefícios para a pele, disposição e quantidade ideal por peso..."
                  className="w-full bg-[#080d19] border border-[#1d2d4a] rounded-2xl p-4 text-white text-sm focus:border-blue-500 outline-none transition-colors leading-relaxed"
                />
              </div>

              {/* Link de Matéria Opcional */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                  LINK DE MATÉRIA <span className="text-gray-500 font-normal lowercase">(opcional, a IA lê a página e usa como base)</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="url"
                    value={linkMateria}
                    onChange={(e) => setLinkMateria(e.target.value)}
                    placeholder="https://exemplo.com/materia-completa"
                    className="w-full bg-[#080d19] border border-[#1d2d4a] rounded-xl pl-12 pr-4 py-3.5 text-white text-sm focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Tom de Voz */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
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
                      className={`p-3 rounded-xl text-xs font-bold border text-center transition-all ${
                        tomDeVoz === tom 
                          ? "bg-blue-600 text-white border-blue-400 shadow-md" 
                          : "bg-[#091122] text-gray-400 border-[#182642] hover:text-white"
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
                  className="px-6 py-3.5 rounded-xl border border-[#1e2e4a] text-gray-400 hover:text-white font-bold text-xs transition-colors"
                >
                  &larr; Voltar ao Passo 1
                </button>
                
                <button
                  onClick={handleGenerateIdeas}
                  disabled={isGeneratingIdeas}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25 active:scale-98"
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
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">
                ● PASSO 3 DE 4
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                Escolha o Ângulo do Carrossel
              </h2>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Selecione a ideia aprovada para estruturar os 5 slides em alta definição.
              </p>
            </div>

            {/* Lista de Ideias Geradas */}
            <div className="space-y-4">
              {ideas.map((idea, idx) => (
                <div 
                  key={idx}
                  className={`bg-[#0e172a] border rounded-2xl p-6 transition-all space-y-3 ${
                    selectedIdeaIndex === idx ? "border-blue-500 ring-2 ring-blue-500/40 bg-[#12203d]" : "border-[#1e2e4a] hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase">
                      OPÇÃO 0{idx + 1}
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-300 font-bold px-2.5 py-0.5 rounded-full">
                      Ângulo Recomendado
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    {idea.titulo}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {idea.descricao}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleApproveIdea(idea, idx)}
                      className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all flex items-center gap-2"
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
                className="px-6 py-3 rounded-xl border border-[#1e2e4a] text-gray-400 hover:text-white font-bold text-xs"
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
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full">
                  ● PASSO 4 DE 4
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mt-1">
                  Edição Visual & Download Final
                </h2>
              </div>

              {/* Botões de Download */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleDownloadPNG}
                  disabled={isDownloading}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs md:text-sm px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  <Download size={16} />
                  <span>{isDownloading ? "Gerando PNG..." : "Baixar em PNG"}</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <FileText size={16} />
                  <span>{isDownloading ? "Gerando PDF..." : "Baixar em PDF"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Coluna Esquerda: Edição dos Slides & Imagens */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Carrossel de Miniaturas dos Slides */}
                <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-2xl p-4 space-y-3">
                  <span className="text-xs font-mono font-bold text-gray-400 uppercase">
                    SELECIONE O SLIDE PARA EDITAR (SLIDE 0{currentSlideIndex + 1})
                  </span>
                  <div className="grid grid-cols-5 gap-3">
                    {slides.map((s, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`aspect-[4/5] rounded-xl bg-black border cursor-pointer overflow-hidden p-2 flex flex-col justify-end transition-all ${
                          currentSlideIndex === idx ? "border-blue-500 ring-2 ring-blue-500/50 scale-105" : "border-white/10 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <span className="text-[7px] font-mono text-white/60">0{idx + 1}</span>
                        <div className="text-[7px] font-bold text-white truncate">{s.titulo}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Painel de Edição do Slide Selecionado */}
                <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-3xl p-6 space-y-5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#1e2e4a] pb-4">
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <Edit3 size={16} className="text-blue-400" />
                      <span>Editar Conteúdo do Slide 0{currentSlideIndex + 1}</span>
                    </h3>
                  </div>

                  {/* Edição do Título */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                      TÍTULO DO SLIDE
                    </label>
                    <input
                      type="text"
                      value={slides[currentSlideIndex]?.titulo || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSlides(prev => prev.map((s, i) => i === currentSlideIndex ? { ...s, titulo: val } : s));
                      }}
                      className="w-full bg-[#080d19] border border-[#1d2d4a] rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Edição do Texto */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                      TEXTO DO SLIDE
                    </label>
                    <textarea
                      rows={3}
                      value={slides[currentSlideIndex]?.texto || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSlides(prev => prev.map((s, i) => i === currentSlideIndex ? { ...s, texto: val } : s));
                      }}
                      className="w-full bg-[#080d19] border border-[#1d2d4a] rounded-xl p-4 text-white text-sm focus:border-blue-500 outline-none leading-relaxed"
                    />
                  </div>

                  {/* Opções de Imagem do Slide */}
                  <div className="space-y-3 pt-2 border-t border-[#1e2e4a]">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                      IMAGEM DE FUNDO DO SLIDE
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      
                      {/* Opção 1: Upload Próprio */}
                      <label className="flex-1 bg-[#12203d] hover:bg-[#1a2d54] text-white text-xs font-bold px-4 py-3 rounded-xl cursor-pointer border border-[#233863] transition-colors flex items-center justify-center gap-2">
                        <Upload size={14} />
                        <span>Subir Imagem Própria</span>
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>

                      {/* Opção 2: Gerar com IA / Unsplash */}
                      <button
                        onClick={handleGenerateAIImage}
                        disabled={isGeneratingImage}
                        className="flex-1 bg-[#1e1b4b] hover:bg-[#2e2a72] text-indigo-300 border border-indigo-500/30 text-xs font-bold px-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        {isGeneratingImage ? <Loader size={14} className="animate-spin" /> : <Wand2 size={14} />}
                        <span>Gerar Imagem com IA</span>
                      </button>

                    </div>
                  </div>

                </div>

                {/* Legenda Pronta do Instagram */}
                <div className="bg-[#0e172a] border border-[#1e2e4a] rounded-3xl p-6 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                      <FileText size={16} className="text-blue-400" />
                      LEGENDA E HASHTAGS DO POST
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(legenda);
                        alert("Legenda copiada para a área de transferência!");
                      }}
                      className="text-xs text-blue-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <Copy size={12} />
                      <span>Copiar Legenda</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={legenda}
                    onChange={(e) => setLegenda(e.target.value)}
                    className="w-full bg-[#080d19] border border-[#1d2d4a] rounded-xl p-4 text-white text-xs leading-relaxed focus:border-blue-500 outline-none"
                  />
                </div>

              </div>

              {/* Coluna Direita: Preview Interativo do Slide */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center sticky top-24 space-y-4">
                <div className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span>PREVIEW INTERATIVO</span>
                  <span className="text-blue-400 font-bold">SLIDE 0{currentSlideIndex + 1} DE 05</span>
                </div>

                {/* Alvo de Renderização para Download */}
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

                {/* Setas de Navegação */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentSlideIndex === 0}
                    className="p-3 rounded-full bg-[#0e172a] border border-[#1e2e4a] text-white hover:bg-blue-600 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-xs font-mono font-bold text-gray-400">
                    0{currentSlideIndex + 1} / 05
                  </span>
                  <button
                    onClick={() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
                    disabled={currentSlideIndex === slides.length - 1}
                    className="p-3 rounded-full bg-[#0e172a] border border-[#1e2e4a] text-white hover:bg-blue-600 disabled:opacity-30 transition-colors"
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