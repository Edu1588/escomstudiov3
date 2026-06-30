import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { toPng } from 'html-to-image';
import { jsPDF } from "jspdf";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import {
  Upload,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  Download,
  Eye,
  X,
  History,
  Trash,
  Hand,
  Globe,
  ArrowUp,
  Grid,
  Monitor,
  Check,
  Sparkles,
  Lightbulb,
  Calendar,
  ThumbsUp,
  Loader,
  Send
} from "lucide-react";

const currentYear = new Date().getFullYear();

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

const SlidePreview = ({ slide, image, index, onClick, small = false, id, selectedModel }: any) => {
    const isCover = index === 0;
    const isLast = slide.isLast;
    const isSlide4 = slide.slide === 4;
    const manualLayout = slide.layoutOverride;
    const defaultIsTextTop = index % 2 !== 0 && !isCover && !isLast;
    const isTextTop = manualLayout ? manualLayout === 'top' : defaultIsTextTop;
    
    let bgColor = 'bg-black';
    if (isSlide4) bgColor = 'bg-white';
    if (isCover && selectedModel === 2) bgColor = 'bg-[#F4F3EE]';

    let defaultTitleColor = '#00d1ff';
    if (selectedModel === 2) defaultTitleColor = '#CCFF00';
    if (isSlide4) defaultTitleColor = '#000000';
    if (isCover && selectedModel === 2) defaultTitleColor = '#000000';

    const defaultTextColor = isSlide4 ? '#000000' : '#ffffff';
    const headerTextColor = isSlide4 ? 'text-[#00d1ff]' : 'text-white';
    
    const titleColorStyle = { color: slide.customTitleColor || defaultTitleColor };
    const textColorStyle = { color: slide.customTextColor || defaultTextColor };
    
    const imgStyle = { 
        objectPosition: `${slide.imgX}% ${slide.imgY}%`,
        transform: `scale(${slide.imgScale || 1})`, 
        transformOrigin: `${slide.imgX}% ${slide.imgY}%` 
    };
    
    const titleSize = small ? 'text-[10px]' : (isCover && selectedModel !== 2 ? 'text-2xl' : (isCover && selectedModel === 2 ? 'text-3xl' : 'text-xl')); 
    const bodySize = small ? 'text-[7px]' : 'text-sm';
    const headerSize = small ? 'text-[5px]' : 'text-[10px]';
    const footerTextSize = small ? 'text-[5px]' : 'text-[8px]';
    
    let contentAlignment = isTextTop ? 'justify-start' : 'justify-end';
    let horizontalPadding;
    let verticalPadding;
    
    if (isCover) { 
        horizontalPadding = small ? 'px-4' : 'px-10';
        verticalPadding = small ? 'pt-4 pb-14' : 'pt-10 pb-24'; 
    }
    else if (isLast) { 
        contentAlignment = 'justify-center'; 
        horizontalPadding = small ? 'px-4' : 'px-10';
        verticalPadding = small ? 'py-4' : 'py-10'; 
    }
    else if (isSlide4) { 
        horizontalPadding = small ? 'px-4' : 'px-10';
        verticalPadding = small ? 'pt-8 pb-16' : 'pt-16 pb-20'; 
    }
    else if (isTextTop) { 
        horizontalPadding = small ? 'px-6' : 'px-12';
        verticalPadding = small ? 'pt-6 pb-20' : 'pt-16 pb-28'; 
    }
    else { 
        horizontalPadding = small ? 'px-6' : 'px-12';
        verticalPadding = small ? 'pt-20 pb-12' : 'pt-28 pb-20'; 
    }

    return (
        <div id={id} onClick={onClick} className={`relative ${bgColor} shrink-0 overflow-hidden shadow-2xl transition-transform border border-[#1a1a1a] flex flex-col ${small ? 'w-full aspect-[4/5] cursor-pointer hover:border-[#00d1ff] rounded-lg' : 'w-[400px] aspect-[4/5] rounded-xl'}`}>
            
            {!(selectedModel === 2 && !isLast) && (
                <div className={`absolute top-0 left-0 w-full p-6 flex justify-between items-start z-40 font-sans tracking-wider uppercase ${headerTextColor} ${headerSize}`}>
                    <span>ESCOM STUDIO</span><span>© {currentYear}</span>
                </div>
            )}
            
            {!isSlide4 && selectedModel === 1 && (
                <div className="absolute inset-0 z-0 overflow-hidden bg-[#111] flex items-center justify-center">
                    {image ? <img src={image} className="w-full h-full object-cover transition-transform duration-75" style={imgStyle} alt="Background" /> : <div className="w-full h-full bg-[#111] flex items-center justify-center"><ImageIcon className="w-12 h-12 text-[#333]" /></div>}
                </div>
            )}
            
            {!isSlide4 && selectedModel === 1 && (isTextTop ? (
                <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-transparent z-10 pointer-events-none"></div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/80 to-transparent z-10 pointer-events-none"></div>
            ))}

            <div className={`flex-1 flex flex-col h-full w-full relative z-20 ${contentAlignment}`}>
                {isSlide4 ? (
                    <div className={`flex flex-col h-full ${horizontalPadding} ${verticalPadding} text-left overflow-hidden`}>
                        <div className={`${small ? 'mb-2' : 'mb-4'}`}>
                            <h1 className={`font-black mb-1 leading-tight ${small ? 'text-[10px]' : 'text-xl'}`} style={titleColorStyle}>{slide.titulo}</h1>
                            <p className={`font-sans leading-relaxed ${bodySize}`} style={textColorStyle}>{slide.texto}</p>
                        </div>
                        <div className="flex-1 border border-neutral-200 rounded-2xl relative overflow-hidden bg-gray-50 p-1 mb-6">
                            <div className="w-full h-full relative overflow-hidden rounded-xl bg-white">
                                {image ? <img src={image} className="w-full h-full object-cover" style={imgStyle} /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon className="w-8 h-8" /></div>}
                            </div>
                        </div>
                    </div>
                ) : isCover ? (
                    selectedModel === 2 ? (
                        <div className="flex flex-col h-full w-full text-left bg-[#F4F3EE]">
                            <div className={`h-1/2 w-full flex flex-col justify-end ${small ? 'px-4 pb-2' : 'px-8 pb-4'}`}>
                                <h1 className={`font-black uppercase tracking-tighter ${small ? 'text-[20px] leading-[0.9]' : 'text-[38px] leading-[0.9]'}`} style={titleColorStyle}>
                                    {slide.titulo}
                               </h1>
                                <div className={`w-full border-t-[1.5px] border-black flex justify-between items-center text-black font-black uppercase tracking-widest ${small ? 'mt-2 pt-1 text-[4px]' : 'mt-4 pt-2 text-[8px]'} opacity-80`}>
                                    <span>GEM</span>
                                    <span>SOCIAL</span>
                                    <span>ENGAGE</span>
                                    <span>PREMIUM</span>
                                </div>
                            </div>
                            
                            <div className="h-1/2 w-full relative bg-black overflow-hidden">
                                {image ? (
                                    <img src={image} className="w-full h-full object-cover" style={imgStyle} alt="Cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#111] text-[#333]">
                                        <ImageIcon className="w-16 h-16 opacity-50" />
                                    </div>
                                )}
                                
                                <div className={`absolute top-0 left-0 w-full bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none z-10 ${small ? 'h-20' : 'h-32'}`}></div>
                                
                                <h2 className={`absolute z-20 text-white font-sans font-medium leading-snug drop-shadow-md ${small ? 'top-3 left-4 right-4 text-[7px]' : 'top-6 left-8 right-8 text-[15px]'}`}>
                                    {slide.texto}
                                </h2>
                                
                                <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10 ${small ? 'h-10' : 'h-20'}`}></div>
                                
                                <div className={`absolute z-30 ${small ? 'bottom-2 left-4' : 'bottom-6 left-8'}`}>
                                    <img src="/OLHO.png" alt="OLHO" className={small ? 'h-2' : 'h-4'} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={`flex flex-col ${horizontalPadding} ${verticalPadding} text-center`}>
                            <div className={`flex flex-col ${small ? 'gap-1.5' : 'gap-3'}`}>
                                <h1 className={`font-black uppercase leading-tight tracking-tight ${small ? 'text-[10px]' : 'text-2xl'}`} style={titleColorStyle}>{slide.titulo}</h1>
                                <h2 className={`font-sans uppercase tracking-wide text-white ${small ? 'text-[6px]' : 'text-xs'}`}>{slide.texto}</h2>
                            </div>
                        </div>
                    )
                ) : isLast ? (
                    <div className={`flex flex-col items-start ${horizontalPadding} ${verticalPadding} text-left z-20`}>
                        <div className={`flex flex-col items-start ${small ? 'gap-1.5' : 'gap-3'}`}>
                            <h2 className={`font-black leading-tight ${small ? 'text-[10px]' : 'text-xl'}`} style={{ color: slide.customTitleColor || defaultTitleColor }}>{slide.titulo === 'CONCLUSÃO' ? slide.texto : slide.titulo}</h2>
                        </div>
                        <div className="flex items-center gap-2 text-white mt-4">
                            <img src="/OLHO.png" alt="OLHO" className={small ? 'h-3' : 'h-6'} />
                            <span className={`font-sans font-bold tracking-widest ${small ? 'text-[5px]' : 'text-[10px]'}`}>gerador-escom.escom.studio</span>
                        </div>
                    </div>
                ) : (
                    selectedModel === 2 ? (
                        <div className="relative w-full h-full bg-black overflow-hidden flex flex-col items-start justify-center">
                            <div className={`absolute top-0 left-0 w-full z-40 flex justify-between font-sans text-white/70 ${small ? 'p-3 text-[5px]' : 'p-6 text-[10px]'}`}>
                                <span>ESCOM STUDIO \ {slide.titulo ? slide.titulo.split(' ')[0] : 'Conteúdo'} \ {currentYear}</span>
                                <span className="font-black">/escom</span>
                            </div>

                            <div className="absolute inset-0 z-0">
                                {image ? (
                                    <img src={image} className="w-full h-full object-cover transition-transform duration-75" style={imgStyle} />
                                ) : (
                                    <div className="w-full h-full bg-[#111] flex items-center justify-center"><ImageIcon className="text-[#333] w-12 h-12"/></div>
                                )}
                                <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
                            </div>

                            <div className={`relative z-20 flex-1 flex flex-col justify-center text-left ${small ? 'p-4' : 'p-10'}`}>
                                <h2 className={`font-black uppercase leading-[0.95] text-white tracking-tight ${small ? 'text-[16px]' : 'text-[38px]'}`}>
                                    {formatHighlight(slide.titulo, slide.customTitleColor || '#CCFF00')}
                                </h2>
                                {slide.texto && (
                                    <p className={`font-sans text-white/90 font-medium leading-relaxed ${small ? 'mt-2 text-[7px]' : 'mt-6 text-sm'}`}>
                                        <span className="font-serif italic font-normal text-lg leading-none mr-1">→</span> {slide.texto}
                                    </p>
                                )}
                            </div>

                            <div className={`absolute bottom-0 left-0 w-full z-40 flex justify-between items-center font-sans text-white/70 ${small ? 'p-3 text-[5px]' : 'p-6 text-[10px]'}`}>
                                <span>{currentYear} © Copyrights | ESCOM STUDIO</span>
                                <div className="flex items-center gap-1.5">
                                    <img src="/OLHO.png" alt="OLHO" className={small ? 'h-2' : 'h-4'} />
                                    <div className={`rounded-full bg-[#00d1ff] flex items-center justify-center text-black ${small ? 'w-2 h-2 text-[4px]' : 'w-4 h-4 text-[8px]'}`}><Check className="w-[100%] h-[100%]" /></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={`flex flex-col ${horizontalPadding} ${verticalPadding} text-left`}>
                            <div className="relative w-full">
                                <h2 className={`font-black ${small ? 'mb-1.5' : 'mb-3'} leading-tight ${small ? 'text-[10px]' : 'text-xl'}`} style={titleColorStyle}>{slide.titulo}</h2>
                                <p className={`font-sans leading-relaxed ${bodySize}`} style={textColorStyle}>{slide.texto}</p>
                            </div>
                        </div>
                    )
                )}
            </div>

            {!isLast && selectedModel === 1 && !isSlide4 && (
                <div className={`absolute z-50 ${small ? 'bottom-2 left-4 right-4' : 'bottom-5 left-6 right-6'}`}>
                    <div className={`w-full rounded-full flex items-center justify-between px-6 border border-white/5 backdrop-blur-md shadow-2xl transition-all ${small ? 'h-6' : 'h-10'} bg-black/40`}>
                        <div className="flex items-center justify-center"><Hand className={`${small ? 'w-3 h-3' : 'w-5 h-5'}`} /></div>
                        <div className={`flex items-center gap-3 font-bold tracking-[0.15em] uppercase leading-none text-white ${footerTextSize}`}>
                            <span className="inline-block transform translate-y-[0.5px]">Arraste para o lado</span>
                        </div>
                        <div className="flex items-center justify-center"><ChevronRight className={`${small ? 'w-2 h-2' : 'w-3 h-3'}`} /></div>
                    </div>
                </div>
            )}
        </div>
    );
};

function nextScheduleDate(): string {
    const days = [1, 3, 5]; // seg=1, qua=3, sex=5
    let d = new Date();
    d.setDate(d.getDate() + 1);
    while (true) {
        const dow = d.getDay();
        if (days.includes(dow)) {
            return d.toLocaleDateString("pt-BR");
        }
        d.setDate(d.getDate() + 1);
    }
}

export default function InstagramGEM() {
    const [step, setStep] = useState<number | string>(1);
    const [selectedModel, setSelectedModel] = useState<number>(1);
    const [jsonInput, setJsonInput] = useState('');
    const [slides, setSlides] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [uploadedImages, setUploadedImages] = useState<any>({});

    const [viewMode, setViewMode] = useState('focus');
    const [fullscreenPreview, setFullscreenPreview] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadTarget, setDownloadTarget] = useState<string | null>(null);

    const [section, setSection] = useState<"carrossel" | "pautas">("carrossel");
    const [pautaMode, setPautaMode] = useState<"auto" | "suggest" | null>(null);
    const [pautas, setPautas] = useState<any[]>([]);
    const [pautaInput, setPautaInput] = useState("");
    const [loadingPautas, setLoadingPautas] = useState(false);
    const [pautaDetail, setPautaDetail] = useState<any>(null);
    const [savedPautas, setSavedPautas] = useState<any[]>(() => {
        try {
            const saved = localStorage.getItem("escom_pautas_saved");
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    useEffect(() => {
        try { localStorage.setItem("escom_pautas_saved", JSON.stringify(savedPautas)); } catch {}
    }, [savedPautas]);

    const generatePautas = async (mode: "auto" | "suggest") => {
        setLoadingPautas(true);
        setPautaMode(mode);
        try {
            const res = await fetch("/api/generate-pautas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mode, suggestion: mode === "suggest" ? pautaInput : undefined }),
            });
            const data = await res.json();
            if (data.success && data.pautas) {
                setPautas(data.pautas);
            } else {
                setPautas([]);
                alert("Erro ao gerar pautas: " + (data.error || "Resposta inválida"));
            }
        } catch (e: any) {
            console.error(e);
            alert("Erro de conexão ao gerar pautas");
            setPautas([]);
        }
        setLoadingPautas(false);
    };

    const approvePauta = (pauta: any) => {
        const json = {
            titulo01: pauta.titulo,
            texto01: pauta.descricao,
            titulo02: pauta.ideias_chave?.[0] || "Ideia principal",
            texto02: pauta.ideias_chave?.slice(1).join(", ") || "Detalhes da pauta",
            titulo03: "Como aplicar",
            texto03: `Estratégia visual: ${pauta.ideias_chave?.join(", ") || "Crie uma estética alinhada ao conceito"}`,
            textofinal: `Produza esse conteúdo e publique na sua rede — ESCOM STUDIO`
        };
        setJsonInput(JSON.stringify(json, null, 2));
        setSection("carrossel");
        setStep("model-select");
        setSelectedModel(1);
        window.scrollTo(0, 0);
    };

    const savePauta = (pauta: any) => {
        const nova = {
            ...pauta,
            id: Date.now(),
            dataAgendada: nextScheduleDate(),
            aprovada: true,
        };
        setSavedPautas(prev => [nova, ...prev]);
    };

    const removeSavedPauta = (id: number) => {
        setSavedPautas(prev => prev.filter(p => p.id !== id));
    };

    const fetchHistory = async () => {
        try {
            const q = query(collection(db, "instagram_history"), orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            const historyData: any[] = [];
            querySnapshot.forEach((doc) => {
                historyData.push({ id: doc.id, ...doc.data() });
            });
            setHistory(historyData);
        } catch(e) {
            console.error("Erro ao carregar histórico: ", e);
            try {
                const saved = localStorage.getItem('escom_history');
                if (saved) setHistory(JSON.parse(saved));
            } catch(err) {}
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const saveToHistory = async () => {
        if (slides.length === 0) return;
        setIsSaving(true);
        const carouselData = {
            title: slides[0]?.titulo || 'Sem Título',
            slides: JSON.stringify(slides),
            images: JSON.stringify(uploadedImages),
            timestamp: Date.now()
        };
        try {
            const docRef = await addDoc(collection(db, "instagram_history"), carouselData);
            setHistory([{ id: docRef.id, ...carouselData }, ...history]);
            alert('Post salvo no histórico com sucesso!');
        } catch (e) {
            console.error('Erro ao salvar no firebase', e);
            alert('Erro ao salvar no firebase. Salvo localmente.');
            const localData = { id: Date.now().toString(), ...carouselData };
            const newHistory = [localData, ...history];
            setHistory(newHistory);
            try { localStorage.setItem('escom_history', JSON.stringify(newHistory)); } catch(err) {}
        }
        setIsSaving(false);
    };

    const loadFromHistory = (item: any) => {
        try {
            setSlides(JSON.parse(item.slides));
            setUploadedImages(JSON.parse(item.images));
            setStep(2);
            setIsHistoryOpen(false);
        } catch(e) { console.error('Erro ao carregar item', e); }
    };

    const deleteHistoryItem = async (e: any, id: string) => {
        e.stopPropagation();
        try {
            await deleteDoc(doc(db, "instagram_history", id));
            setHistory(history.filter(item => item.id !== id));
        } catch (error) {
            console.log("Erro apagando do firebase, tentando local");
            const newHistory = history.filter(item => item.id !== id);
            setHistory(newHistory);
            try { localStorage.setItem('escom_history', JSON.stringify(newHistory)); } catch(err) {}
        }
    };

    const handleDownloadInstagram = async () => {
        setIsDownloading(true);
        setDownloadTarget('instagram');
        try {
            const wrapper = document.getElementById('capture-container-wrapper');
            if (wrapper) wrapper.classList.remove('opacity-0');
            await new Promise(r => setTimeout(r, 200));

            for (let i = 0; i < slides.length; i++) {
                const element = document.getElementById(`capture-slide-${i}`);
                if (element) {
                    const dataUrl = await toPng(element, { pixelRatio: 2, backgroundColor: 'rgba(0,0,0,0)' });
                    const link = document.createElement('a');
                    link.download = `escom-carrossel-slide-${i + 1}.png`;
                    link.href = dataUrl;
                    link.click();
                    await new Promise(r => setTimeout(r, 600));
                }
            }
            if (wrapper) wrapper.classList.add('opacity-0');
        } catch(err: any) { 
            console.error('Erro no download', err); 
            alert('Erro no Instagram: ' + err.message);
        }
        setIsDownloading(false);
        setDownloadTarget(null);
    };

    const handleDownloadLinkedin = async () => {
        setIsDownloading(true);
        setDownloadTarget('linkedin');
        try {
            const wrapper = document.getElementById('capture-container-wrapper');
            if (wrapper) wrapper.classList.remove('opacity-0');
            await new Promise(r => setTimeout(r, 200));

            const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [400, 500] });
            for (let i = 0; i < slides.length; i++) {
                const element = document.getElementById(`capture-slide-${i}`);
                if (element) {
                    const imgData = await toPng(element, { pixelRatio: 2, backgroundColor: 'rgba(0,0,0,0)' });
                    if (i > 0) pdf.addPage([400, 500], 'portrait');
                    pdf.addImage(imgData, 'PNG', 0, 0, 400, 500);
                }
            }
            pdf.save('escom-carrossel.pdf');
            if (wrapper) wrapper.classList.add('opacity-0');
        } catch(err: any) { 
            console.error('Erro no download PDF', err); 
            alert('Erro no Linkedin: ' + err.message);
        }
        setIsDownloading(false);
        setDownloadTarget(null);
    };

    const loadExample = () => {
        const EXAMPLE_JSON = { 
            titulo01: 'O ano de dois mil e dezesseis foi há dez anos', 
            texto01: 'O último ano em que a internet foi realmente feliz — se você viveu, você sabe muito bem.', 
            titulo02: 'O sinal que virou estática', 
            texto02: 'Em um mundo saturado, a curadoria humana era o filtro necessário. Hoje, somos guiados por dados frios que priorizam a retenção em vez da qualidade.', 
            titulo03: 'A marca sobreviveu. A alma, não.', 
            texto03: 'Muitas empresas focaram em escala global, trocando especialistas apaixonados por engrenagens genéricas. O resultado é o conteúdo ultraprocessado.', 
            titulo04: 'O manual visual', 
            texto04: 'Quando Justin Bieber lançou Sorry ele definiu a paleta de cores de uma geração inteira. O fundo branco e roupas de streetwear criaram uma estética vibrante.', 
            textofinal: 'Descubra a revolução da ESCOM STUDIO em nosso portal.' 
        };
        setJsonInput(JSON.stringify(EXAMPLE_JSON, null, 2));
        setError('');
    };

    const parseSlides = (inputData: any) => {
        const data = Array.isArray(inputData) ? inputData[0] : inputData;
        const slidesMap: any = {};
        Object.keys(data).forEach((key: string) => {
            const match = key.match(/^(titulo|texto|prompt|visual)_?(\d+)$/i);
            if (match) {
                const [, type, numStr] = match;
                const normalizedType = type.toLowerCase();
                const num = parseInt(numStr, 10);
                if (!slidesMap[num]) slidesMap[num] = { slide: num, titulo: '', texto: '', layoutOverride: null, imgX: 50, imgY: 50, imgScale: 1, customTitleColor: null, customTextColor: null };
                slidesMap[num][normalizedType] = data[key];
            }
        });
        let slidesArray = Object.values(slidesMap).sort((a: any, b: any) => a.slide - b.slide);
        
        const textFinal = data.textofinal || data.texto_final || data.textoFinal || data.text_final;
        if (textFinal) slidesArray.push({ slide: slidesArray.length + 1, titulo: 'CONCLUSÃO', texto: textFinal, isLast: true, imgX: 50, imgY: 50, imgScale: 1 });
        
        return slidesArray;
    };

    const handleStart = () => {
        try {
            if (!jsonInput.trim()) { setError('Insira o JSON.'); return; }
            const parsed = JSON.parse(jsonInput);
            const processedSlides = parseSlides(parsed);
            if (processedSlides.length === 0) { setError('Formato inválido.'); return; }
            setSlides(processedSlides);
            setStep('model-select');
            setError('');
        } catch(e) { setError('JSON inválido.'); }
    };

    const handleImageUpload = (e: any, index: number) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setUploadedImages((prev: any) => ({ ...prev, [index]: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const updateSlideContent = (index: number, field: string, value: any) => {
        const newSlides = [...slides];
        newSlides[index][field] = value;
        setSlides(newSlides);
    };

    const toggleLayout = () => {
        const newSlides = [...slides];
        const currentLayout = newSlides[currentSlideIndex].layoutOverride;
        if (!currentLayout) {
            const isCover = currentSlideIndex === 0;
            const isLast = newSlides[currentSlideIndex].isLast;
            const defaultIsTextTop = currentSlideIndex % 2 !== 0 && !isCover && !isLast;
            newSlides[currentSlideIndex].layoutOverride = defaultIsTextTop ? 'bottom' : 'top';
        } else {
            newSlides[currentSlideIndex].layoutOverride = currentLayout === 'top' ? 'bottom' : 'top';
        }
        setSlides(newSlides);
    };

    const ModelPreviewMini = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => {
        const previewSlides = slides.length > 0 ? slides.slice(0, 2) : [
            { titulo: 'Título Principal', texto: 'Subtítulo aqui.', slide: 1, layoutOverride: null, imgX: 50, imgY: 50, imgScale: 1, customTitleColor: null, customTextColor: null },
            { titulo: 'Slide 2', texto: 'Corpo do texto para engajar.', slide: 2, layoutOverride: null, imgX: 50, imgY: 50, imgScale: 1, customTitleColor: null, customTextColor: null },
        ];
        
        const modelForPreview = label === "Modelo 1" ? 1 : 2;

        return (
            <div onClick={onClick} className={`cursor-pointer rounded-2xl border-2 p-4 transition-all flex flex-col gap-3 ${active ? 'border-[#00d1ff] bg-[#111] shadow-lg' : 'border-[#333] bg-[#0a0a0a] hover:border-[#444]'}`}>
                <div className="flex gap-4 overflow-hidden pointer-events-none justify-center px-2">
                    {previewSlides.map((s, i) => (
                        <div key={i} className="flex-1 max-w-[150px] min-w-0">
                            <SlidePreview slide={s} image={null} index={i} small={true} selectedModel={modelForPreview} />
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between mt-2">
                    <span className="font-black text-sm uppercase tracking-widest text-white">{label}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-[#00d1ff] bg-[#00d1ff]' : 'border-[#333]'}`}>
                        {active && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                    </div>
                </div>
            </div>
        );
    };

    const HistoryModal = () => (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-md bg-[#0a0a0a] h-full border-l border-[#1a1a1a] p-6 pt-12 shadow-2xl overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-black text-xl text-[#00d1ff] uppercase tracking-widest">Histórico</h2>
                    <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-[#111] rounded-full transition-colors"><X className="w-6 h-6 text-white"/></button>
                </div>
                <div className="space-y-3">
                    {history.length === 0 ? (
                        <p className="text-gray-500 font-sans text-center py-10 italic">Nenhum carrossel guardado ainda.</p>
                    ) : (
                        history.map(item => (
                            <div key={item.id} onClick={() => loadFromHistory(item)} className="p-4 bg-[#111] border border-[#333] rounded-2xl hover:border-[#00d1ff] cursor-pointer group transition-all">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-black text-white mb-1 tracking-tight text-sm">{item.title}</h3>
                                        <p className="text-[10px] text-gray-500 font-mono">{new Date(item.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    <button onClick={(e) => deleteHistoryItem(e, item.id)} className="text-gray-500 hover:text-red-500 p-1 transition-colors"><Trash className="w-4 h-4"/></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );

    if (step === 1 && section === "pautas") {
        return (
            <div className="flex-1 overflow-y-auto w-full font-sans relative">
                <Header title="Análise Geral" />
                <div className="p-4 md:p-8 max-w-[1200px] mx-auto mt-4">
                    {/* Tabs */}
                    <div className="flex gap-1 mb-8 bg-[#111] rounded-xl p-1 border border-[#333] w-fit mx-auto">
                        <button onClick={() => { setSection("carrossel"); setPautaMode(null); }} className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all text-gray-500 hover:text-white">Gerar Carrossel</button>
                        <button onClick={() => setSection("pautas")} className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all bg-[#00d1ff] text-black">Pautas</button>
                    </div>

                    {/* Pauta selection: Gerar or Sugerir */}
                    {!pautaMode && !loadingPautas && pautas.length === 0 && (
                        <div className="max-w-3xl mx-auto">
                            <div className="text-center mb-10">
                                <h2 className="text-[#00d1ff] font-black text-3xl uppercase tracking-wider mb-2">Pautas Instagram</h2>
                                <p className="text-gray-400 text-sm">Crie pautas com IA para seus posts</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button onClick={() => generatePautas("auto")} className="bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#00d1ff] rounded-2xl p-8 text-left transition-all group">
                                    <Sparkles className="w-10 h-10 text-[#00d1ff] mb-4 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-white font-black text-lg mb-2 uppercase tracking-tight">Gerar Pauta</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">A IA busca tendências atuais do mundo da estética, design e acontecimentos mundiais para sugerir 5 pautas em alta.</p>
                                </button>
                                <button onClick={() => setPautaMode("suggest")} className="bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#00d1ff] rounded-2xl p-8 text-left transition-all group">
                                    <Lightbulb className="w-10 h-10 text-[#CCFF00] mb-4 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-white font-black text-lg mb-2 uppercase tracking-tight">Sugerir Pauta</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">Descreva o que você quer e a IA monta as pautas personalizadas para você.</p>
                                </button>
                            </div>

                            {/* Saved pautas */}
                            {savedPautas.length > 0 && (
                                <div className="mt-16">
                                    <h3 className="text-white font-black text-lg mb-4 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-5 h-5 text-[#00d1ff]" /> Pautas Salvas</h3>
                                    <div className="space-y-3">
                                        {savedPautas.map((p: any) => (
                                            <div key={p.id} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 flex items-center justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white font-black text-sm mb-1 truncate">{p.titulo}</h4>
                                                    <p className="text-gray-500 text-xs">Agendado para: <span className="text-[#00d1ff] font-bold">{p.dataAgendada}</span></p>
                                                </div>
                                                <button onClick={() => approvePauta(p)} className="bg-[#00d1ff] hover:bg-[#00b8e6] text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shrink-0">Gerar Carrossel</button>
                                                <button onClick={() => removeSavedPauta(p.id)} className="text-gray-500 hover:text-red-500 transition-colors shrink-0"><Trash className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Suggest mode input */}
                    {pautaMode === "suggest" && pautas.length === 0 && !loadingPautas && (
                        <div className="max-w-2xl mx-auto">
                            <button onClick={() => setPautaMode(null)} className="text-gray-500 text-sm hover:text-white transition-colors mb-6 flex items-center gap-2">
                                <ChevronLeft className="w-4 h-4" /> Voltar
                            </button>
                            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8">
                                <h3 className="text-white font-black text-lg mb-4">O que você quer pautar?</h3>
                                <textarea
                                    value={pautaInput}
                                    onChange={e => setPautaInput(e.target.value)}
                                    className="w-full h-32 bg-black border border-[#1a1a1a] rounded-xl p-4 text-white font-sans text-sm focus:outline-none focus:border-[#00d1ff] transition-colors resize-y mb-4"
                                    placeholder="Ex: Quero algo sobre branding pessoal para esteticistas, conectando com o momento atual das redes sociais..."
                                />
                                <button
                                    onClick={() => generatePautas("suggest")}
                                    disabled={!pautaInput.trim() || loadingPautas}
                                    className="w-full bg-[#CCFF00] hover:bg-[#b8e600] disabled:bg-[#333] disabled:text-gray-600 text-black font-bold py-4 rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                                >
                                    {loadingPautas ? "Gerando..." : "Gerar Pautas"} <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Loading */}
                    {loadingPautas && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader className="w-8 h-8 text-[#00d1ff] animate-spin mb-4" />
                            <p className="text-gray-400 text-sm">IA está gerando pautas...</p>
                        </div>
                    )}

                    {/* Results */}
                    {/* Pauta detail modal */}
                    {pautaDetail && (
                        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPautaDetail(null)}>
                            <div className="bg-[#0a0a0a] border border-[#333] rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="text-[10px] text-[#00d1ff] font-bold uppercase tracking-widest mb-1">Detalhes da Pauta</div>
                                        <h3 className="text-white font-black text-xl leading-tight">{pautaDetail.titulo}</h3>
                                    </div>
                                    <button onClick={() => setPautaDetail(null)} className="text-gray-500 hover:text-white p-1 transition-colors"><X className="w-5 h-5" /></button>
                                </div>
                                <div className="space-y-5">
                                    <div>
                                        <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Descrição</h4>
                                        <p className="text-gray-300 text-sm leading-relaxed">{pautaDetail.descricao}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Palavras-chave</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {pautaDetail.ideias_chave?.map((tag: string, i: number) => (
                                                <span key={i} className="text-[10px] bg-[#111] border border-[#333] text-gray-300 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    {pautaDetail.data_contexto && (
                                        <div>
                                            <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Período / Contexto</h4>
                                            <p className="text-[#00d1ff] text-sm font-bold">{pautaDetail.data_contexto}</p>
                                        </div>
                                    )}
                                    {pautaDetail.referencias && pautaDetail.referencias.length > 0 && (
                                        <div>
                                            <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Referências</h4>
                                            <div className="space-y-2">
                                                {pautaDetail.referencias.map((ref: string, i: number) => (
                                                    <a key={i} href={ref} target="_blank" rel="noopener noreferrer" className="block bg-[#111] border border-[#333] hover:border-[#00d1ff] rounded-lg p-3 text-xs text-gray-300 hover:text-white transition-all truncate">
                                                        <span className="text-[#00d1ff] font-bold mr-2">🔗</span> {ref}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 mt-8 pt-6 border-t border-[#1a1a1a]">
                                    <button onClick={() => { approvePauta(pautaDetail); setPautaDetail(null); }} className="flex-1 bg-[#00d1ff] hover:bg-[#00b8e6] text-black text-xs font-bold py-3 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5">
                                        <ThumbsUp className="w-3.5 h-3.5" /> Aprovar Pauta
                                    </button>
                                    <button onClick={() => { savePauta(pautaDetail); setPautaDetail(null); }} className="bg-[#111] hover:bg-[#222] border border-[#333] text-gray-300 text-xs font-bold py-3 px-4 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" /> Agendar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {pautas.length > 0 && !loadingPautas && (
                        <div className="max-w-5xl mx-auto">
                            <button onClick={() => { setPautas([]); setPautaMode(null); }} className="text-gray-500 text-sm hover:text-white transition-colors mb-6 flex items-center gap-2">
                                <ChevronLeft className="w-4 h-4" /> Gerar novas pautas
                            </button>
                            <h3 className="text-white font-black text-xl mb-6 uppercase tracking-wider">Pautas Geradas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {pautas.map((pauta, idx) => (
                                    <div key={idx} className="bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#333] rounded-2xl p-6 transition-all flex flex-col">
                                        <div className="flex-1">
                                            <div className="text-[10px] text-[#00d1ff] font-bold uppercase tracking-widest mb-2">Pauta #{idx + 1}</div>
                                            <h4 className="text-white font-black text-base mb-2 leading-tight">{pauta.titulo}</h4>
                                            <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-3">{pauta.descricao}</p>
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {pauta.ideias_chave?.map((tag: string, i: number) => (
                                                    <span key={i} className="text-[9px] bg-[#111] border border-[#333] text-gray-300 px-2 py-1 rounded-full uppercase tracking-wider font-bold">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-auto pt-4 border-t border-[#1a1a1a]">
                                            <button onClick={() => setPautaDetail(pauta)} className="text-gray-500 hover:text-[#00d1ff] text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0">
                                                Ver mais
                                            </button>
                                            <button
                                                onClick={() => approvePauta(pauta)}
                                                className="flex-1 bg-[#00d1ff] hover:bg-[#00b8e6] text-black text-xs font-bold py-3 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <ThumbsUp className="w-3.5 h-3.5" /> Aprovar
                                            </button>
                                            <button
                                                onClick={() => savePauta(pauta)}
                                                className="bg-[#111] hover:bg-[#222] border border-[#333] text-gray-300 text-xs font-bold py-3 px-4 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <Calendar className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (step === 1) {
        return (
            <div className="flex-1 overflow-y-auto w-full font-sans relative">
                <Header title="Análise Geral" />
                <div className="p-4 md:p-8 max-w-[1200px] mx-auto mt-4">
                    {/* Tabs */}
                    <div className="flex gap-1 mb-8 bg-[#111] rounded-xl p-1 border border-[#333] w-fit mx-auto">
                        <button onClick={() => setSection("carrossel")} className={`px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${section === "carrossel" ? "bg-[#00d1ff] text-black" : "text-gray-500 hover:text-white"}`}>Gerar Carrossel</button>
                        <button onClick={() => setSection("pautas")} className="px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all text-gray-500 hover:text-white">Pautas</button>
                    </div>

                    <div className="flex justify-end mb-8 relative z-20">
                        <button onClick={() => setIsHistoryOpen(true)} className="flex items-center gap-2 bg-[#111] hover:bg-[#222] border border-[#333] text-gray-400 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                            <History className="w-4 h-4" />
                            <span className="uppercase tracking-wider">Histórico</span>
                        </button>
                    </div>
                    {isHistoryOpen && <HistoryModal />}
                    <div className="max-w-[700px] mx-auto bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8 relative z-10">
                        <div className="text-center mb-8">
                            <h2 className="text-[#00d1ff] font-black text-3xl uppercase tracking-wider mb-2">ESCOM STUDIO</h2>
                            <p className="text-gray-400 text-sm">Insira o JSON para gerar os seus posts.</p>
                        </div>
                        <div className="mb-6 relative">
                            <textarea 
                              value={jsonInput} 
                              onChange={e => setJsonInput(e.target.value)} 
                              className="w-full h-64 bg-black border border-[#1a1a1a] rounded-xl p-6 text-white font-mono text-xs focus:outline-none focus:border-[#00d1ff] transition-colors resize-y min-h-[300px]" 
                              placeholder='{ "titulo01": "...", "texto01": "..." }' 
                            />
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <button onClick={loadExample} className="bg-[#111] border border-[#333] hover:bg-[#222] text-sm text-gray-300 px-6 py-4 rounded-xl font-medium transition-colors">Carregar Exemplo</button>
                            <button onClick={handleStart} className="flex-1 bg-[#00d1ff] hover:bg-[#00b8e6] text-black font-black text-lg px-6 py-4 rounded-xl transition-colors uppercase tracking-wider">Gerar Carrossel</button>
                        </div>
                        {error && <p className="text-red-500 mt-4 text-center text-sm font-bold">{error}</p>}
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'model-select') {
        return (
            <div className="flex-1 overflow-y-auto w-full font-sans relative">
                <Header title="Análise Geral" />
                {isHistoryOpen && <HistoryModal />}
                <div className="p-8 max-w-[1200px] mx-auto mt-4 flex flex-col items-center">
                    <div className="max-w-3xl w-full pt-12">
                        <button onClick={() => setStep(1)} className="text-gray-500 text-sm hover:text-white transition-colors mb-8 flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4" /> Voltar
                        </button>
                        <h1 className="text-3xl font-black text-[#00d1ff] mb-1 uppercase tracking-tight">Escolha o Modelo GEM</h1>
                        <p className="text-gray-400 mb-8 text-sm">Selecione o estilo visual do seu carrossel.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <ModelPreviewMini label="Modelo 1" active={selectedModel === 1} onClick={() => setSelectedModel(1)} />
                            <ModelPreviewMini label="Modelo 2" active={selectedModel === 2} onClick={() => setSelectedModel(2)} />
                        </div>
                        <button onClick={() => setStep(2)} className="w-full bg-[#00d1ff] hover:bg-[#00b8e6] text-black font-black text-xl uppercase py-4 rounded-xl transition-all tracking-wider shadow-[0_0_20px_rgba(0,209,255,0.2)]">
                            Usar Estilo {selectedModel}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col font-sans overflow-hidden bg-black/50 relative">
            <div id="capture-container-wrapper" className="fixed z-[-100] opacity-0" style={{ left: 0, top: 0, pointerEvents: 'none' }}>
                {slides.map((s, idx) => (
                    <div key={`capture-${idx}`} style={{ width: '400px', height: '500px' }}>
                        <SlidePreview id={`capture-slide-${idx}`} slide={s} image={uploadedImages[idx]} index={idx} selectedModel={selectedModel} />
                    </div>
                ))}
            </div>
            {isHistoryOpen && <HistoryModal />}
            {fullscreenPreview && (
                <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-8">
                    <button onClick={() => setFullscreenPreview(false)} className="absolute top-6 right-6 text-white bg-[#111] p-2 rounded-full transition-transform hover:scale-110 border border-[#333]"><X className="w-6 h-6" /></button>
                    <div className="h-full max-h-[90vh] aspect-[4/5]"><SlidePreview slide={slides[currentSlideIndex]} image={uploadedImages[currentSlideIndex]} index={currentSlideIndex} selectedModel={selectedModel} /></div>
                </div>
            )}
            
            <header className="h-[72px] border-b border-[#1a1a1a] flex items-center justify-between px-6 bg-[#050505] shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setStep('model-select')} className="text-gray-500 text-sm hover:text-white transition-colors flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Voltar</button>
                    <div className="w-px h-4 bg-[#333]"></div>
                    <span className="font-bold text-white tracking-widest hidden md:inline font-black text-xs uppercase tracking-[0.2em]">Editor ESCOM STUDIO</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-[#111] rounded-lg p-1 border border-[#333]">
                        <button onClick={() => setViewMode('focus')} className={`p-1.5 rounded-md transition-all ${viewMode === 'focus' ? 'bg-[#222] text-[#00d1ff] shadow-inner' : 'text-gray-500 hover:text-white'}`}><Monitor className="w-4 h-4"/></button>
                        <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#222] text-[#00d1ff] shadow-inner' : 'text-gray-500 hover:text-white'}`}><Grid className="w-4 h-4"/></button>
                    </div>
                    <div className="w-px h-6 bg-[#333] mx-1"></div>
                    <button onClick={() => setIsHistoryOpen(true)} className="p-2 text-gray-500 hover:text-white transition-colors"><History className="w-4 h-4" /></button>
                    <button onClick={saveToHistory} disabled={isSaving} className="bg-[#111] hover:bg-[#222] px-4 py-2 rounded-lg text-xs font-bold border border-[#333] text-white transition-colors uppercase">{isSaving ? 'Salvando...' : 'Salvar'}</button>
                    <button onClick={handleDownloadInstagram} disabled={isDownloading && downloadTarget === 'instagram'} className="flex items-center gap-1.5 bg-[#E1306C] hover:bg-[#C13584] text-white px-3 py-1.5 rounded-md text-[10px] font-bold shadow-lg transition-all uppercase">
                        {isDownloading && downloadTarget === 'instagram' ? 'Aguarde...' : 'Instagram'} 
                        <Download size={12} strokeWidth={3} />
                    </button>

                    <button onClick={handleDownloadLinkedin} disabled={isDownloading && downloadTarget === 'linkedin'} className="flex items-center gap-1.5 bg-[#0077B5] hover:bg-[#005E93] text-white px-3 py-1.5 rounded-md text-[10px] font-bold shadow-lg transition-all uppercase">
                        {isDownloading && downloadTarget === 'linkedin' ? 'Aguarde...' : 'LinkedIn'} 
                        <Download size={12} strokeWidth={3} />
                    </button>
                </div>
            </header>
            
            <main className="flex-1 flex overflow-hidden">
                <aside className="w-64 border-r border-[#1a1a1a] bg-[#050505] hidden md:block overflow-y-auto shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-10 p-4">
                    <div className="space-y-2">
                        {slides.map((s, idx) => (
                            <button key={idx} onClick={() => { setCurrentSlideIndex(idx); setViewMode('focus'); }} className={`w-full text-left p-3 rounded-lg border flex gap-3 items-center transition-all ${currentSlideIndex === idx && viewMode === 'focus' ? 'bg-[#111] border-[#00d1ff] ring-1 ring-[#00d1ff]/20' : 'border-[#1a1a1a] bg-[#0a0a0a] hover:bg-[#111] hover:border-[#333]'}`}>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded ${currentSlideIndex === idx && viewMode === 'focus' ? 'bg-[#00d1ff] text-black' : 'bg-[#1a1a1a] text-gray-500'}`}>{String(idx + 1).padStart(2, '0')}</span>
                                <span className={`text-xs truncate uppercase font-bold tracking-tight ${currentSlideIndex === idx && viewMode === 'focus' ? 'text-white' : 'text-gray-400'}`}>{s.titulo || 'Slide'}</span>
                            </button>
                        ))}
                    </div>
                </aside>
                
                <section className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center bg-[#0a0a0a]">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl pb-12">
                            {slides.map((s, idx) => <SlidePreview key={idx} slide={s} image={uploadedImages[idx]} index={idx} onClick={() => { setCurrentSlideIndex(idx); setViewMode('focus'); }} small selectedModel={selectedModel} />)}
                        </div>
                    ) : (
                        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-12 justify-center items-start pb-12">
                            <div className="flex flex-col items-center w-full max-w-[420px] shrink-0 lg:sticky lg:top-8">
                                <div className="w-full flex justify-between items-center mb-4 px-2">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Preview ao Vivo</span>
                                    <button onClick={() => setFullscreenPreview(true)} className="p-1.5 rounded-full text-gray-500 hover:text-white hover:bg-[#111] border border-transparent hover:border-[#333] transition-all"><Eye className="w-4 h-4" /></button>
                                </div>
                                <SlidePreview id="slide-preview-capture" slide={slides[currentSlideIndex]} image={uploadedImages[currentSlideIndex]} index={currentSlideIndex} selectedModel={selectedModel} />
                                <div className="flex gap-4 mt-8 items-center bg-[#050505] p-1.5 pl-6 pr-1.5 rounded-full border border-[#1a1a1a] shadow-lg">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mr-2">Slide {(currentSlideIndex + 1).toString().padStart(2, '0')} / {slides.length.toString().padStart(2, '0')}</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))} className="p-2 bg-[#111] hover:bg-[#222] border border-[#333] rounded-full text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                                        <button onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))} className="p-2 bg-[#111] hover:bg-[#222] border border-[#333] rounded-full text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-1 bg-[#050505] rounded-2xl border border-[#1a1a1a] p-8 h-fit max-w-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)] w-full relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00d1ff]/20 to-transparent opacity-50"></div>
                                <h3 className="font-black text-white uppercase text-[10px] tracking-[0.2em] mb-8 border-b border-[#1a1a1a] pb-4">Propriedades do Slide</h3>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] text-gray-500 font-bold mb-2 block uppercase tracking-widest flex justify-between items-center">
                                            <span>Título Principal</span>
                                            {selectedModel === 2 && currentSlideIndex !== 0 && !slides[currentSlideIndex].isLast && (
                                                <span className="text-[#00d1ff]/70 font-mono text-[9px] lowercase tracking-normal bg-[#00d1ff]/10 px-2 py-0.5 rounded">use *asteriscos* p/ destaque</span>
                                            )}
                                        </label>
                                        <input type="text" value={slides[currentSlideIndex].titulo} onChange={e => updateSlideContent(currentSlideIndex, 'titulo', e.target.value)} className="w-full bg-[#111] border border-[#333] p-4 rounded-lg text-white font-black text-sm focus:border-[#00d1ff] outline-none transition-all placeholder-gray-600" placeholder="Insira o título aqui" />
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] text-gray-500 font-bold mb-2 block uppercase tracking-widest">Texto Complementar</label>
                                        <textarea value={slides[currentSlideIndex].texto} onChange={e => updateSlideContent(currentSlideIndex, 'texto', e.target.value)} rows={5} className="w-full bg-[#111] border border-[#333] p-4 rounded-lg text-white font-sans text-xs focus:border-[#00d1ff] outline-none transition-all leading-relaxed resize-y placeholder-gray-600" placeholder="Insira o texto complementar aqui" />
                                    </div>
                                    
                                    <div className="pt-6 border-t border-[#1a1a1a] space-y-6">
                                        <label className="block w-full p-4 border border-dashed border-[#333] rounded-lg cursor-pointer hover:border-[#00d1ff] hover:bg-[#00d1ff]/5 transition-all text-center group">
                                            <span className="text-[10px] text-gray-400 group-hover:text-[#00d1ff] font-bold uppercase flex items-center justify-center gap-2 transition-colors"><Upload className="w-4 h-4" /> Alterar Fotografia</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, currentSlideIndex)} />
                                        </label>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#111] p-4 rounded-lg border border-[#222] flex flex-col items-center">
                                                <label className="text-[9px] text-gray-500 font-bold mb-3 block uppercase tracking-widest text-center">Cores do Texto</label>
                                                <div className="flex gap-4 items-center">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="w-8 h-8 rounded-full border border-[#444] overflow-hidden p-0.5 bg-black cursor-pointer group hover:border-[#00d1ff] transition-colors relative">
                                                            <input type="color" className="absolute -top-2 -left-2 w-16 h-16 opacity-0 cursor-pointer" value={slides[currentSlideIndex].customTitleColor || ((currentSlideIndex === 0 && selectedModel === 2) || slides[currentSlideIndex].slide === 4 ? '#000000' : (selectedModel === 2 ? '#CCFF00' : '#00d1ff'))} onChange={e => updateSlideContent(currentSlideIndex, 'customTitleColor', e.target.value)} />
                                                            <div className="w-full h-full rounded-full" style={{ backgroundColor: slides[currentSlideIndex].customTitleColor || ((currentSlideIndex === 0 && selectedModel === 2) || slides[currentSlideIndex].slide === 4 ? '#000000' : (selectedModel === 2 ? '#CCFF00' : '#00d1ff')) }}></div>
                                                        </div>
                                                        <span className="text-[8px] font-mono text-gray-600">TITULO</span>
                                                    </div>
                                                    <div className="flex flex-col items-center gap-1">
                                                        <div className="w-8 h-8 rounded-full border border-[#444] overflow-hidden p-0.5 bg-black cursor-pointer group hover:border-[#00d1ff] transition-colors relative">
                                                            <input type="color" className="absolute -top-2 -left-2 w-16 h-16 opacity-0 cursor-pointer" value={slides[currentSlideIndex].customTextColor || (slides[currentSlideIndex].slide === 4 ? '#000000' : '#ffffff')} onChange={e => updateSlideContent(currentSlideIndex, 'customTextColor', e.target.value)} />
                                                            <div className="w-full h-full rounded-full" style={{ backgroundColor: slides[currentSlideIndex].customTextColor || (slides[currentSlideIndex].slide === 4 ? '#000000' : '#ffffff') }}></div>
                                                        </div>
                                                        <span className="text-[8px] font-mono text-gray-600">TEXTO</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-[#111] p-4 rounded-lg border border-[#222] flex flex-col justify-center items-center">
                                                <label className="text-[9px] text-gray-500 font-bold mb-3 block uppercase tracking-widest text-center">Inverter Eixo Y</label>
                                                <button onClick={toggleLayout} disabled={currentSlideIndex === 0 || slides[currentSlideIndex].isLast || selectedModel === 2} className={`p-2.5 rounded-full border transition-all ${currentSlideIndex === 0 || slides[currentSlideIndex].isLast || selectedModel === 2 ? 'bg-[#1a1a1a] border-[#333] text-gray-700' : 'bg-[#222] text-white border-[#444] hover:border-[#00d1ff] hover:text-[#00d1ff]'}`}><ArrowUp className="w-4 h-4"/></button>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-[#111] p-5 rounded-lg border border-[#222] space-y-5">
                                            <label className="text-[9px] font-bold block flex items-center gap-2 uppercase tracking-widest text-gray-500">Ajuste de Imagem <Globe className="w-3 h-3 ml-auto text-gray-600" /></label>
                                            <div className="flex flex-col gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[8px] text-gray-600 font-mono tracking-widest"><span>EIXO X</span><span>{slides[currentSlideIndex].imgX || 50}%</span></div>
                                                    <input type="range" min="0" max="100" value={slides[currentSlideIndex].imgX} onChange={e => updateSlideContent(currentSlideIndex, 'imgX', e.target.value)} className="w-full accent-[#00d1ff] h-1 bg-[#333] outline-none rounded-full" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[8px] text-gray-600 font-mono tracking-widest"><span>EIXO Y</span><span>{slides[currentSlideIndex].imgY || 50}%</span></div>
                                                    <input type="range" min="0" max="100" value={slides[currentSlideIndex].imgY} onChange={e => updateSlideContent(currentSlideIndex, 'imgY', e.target.value)} className="w-full accent-[#00d1ff] h-1 bg-[#333] outline-none rounded-full" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[8px] text-gray-600 font-mono tracking-widest"><span>ESCALA</span><span>x{slides[currentSlideIndex].imgScale || 1}</span></div>
                                                    <input type="range" min="1" max="2" step="0.05" value={slides[currentSlideIndex].imgScale || 1} onChange={e => updateSlideContent(currentSlideIndex, 'imgScale', e.target.value)} className="w-full accent-[#00d1ff] h-1 bg-[#333] outline-none rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}