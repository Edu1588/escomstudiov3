import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PenTool, 
  Layers, 
  Settings, 
  FileText, 
  Copy, 
  Sparkles, 
  CheckCircle2,
  Bell,
  Plus,
  Briefcase,
  Target,
  Megaphone,
  CheckSquare,
  Globe,
  Link as LinkIcon,
  ArrowRight,
  ChevronLeft,
  Monitor,
  LayoutTemplate,
  Users,
  Star,
  MessageCircle,
  CreditCard,
  Mail,
  Loader2,
  RefreshCw,
  FileCheck,
  Palette,
  Instagram,
  Type,
  Download,
  Rocket,
  Search,
  MapPin,
  Trash2,
  CheckCircle,
  Clock,
  Box,
  Quote,
  ChevronDown,
  Image as ImageIcon,
  PenTool,
  Menu
} from 'lucide-react';
import Markdown from 'react-markdown';

export default function Mineracao() {
  const routerNavigate = useNavigate();
  // Estados da Aplicação ('leads' | 'generator' | 'loading' | 'preview' | 'pdf-loading' | 'brand-pdf' | 'success')
  const [currentView, setCurrentView] = useState('leads'); 
  
  // Estados do Gerador de Copy
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAnalyzingUrl, setIsAnalyzingUrl] = useState(false);

  // Estados da Busca de Leads
  const [searchQuery, setSearchQuery] = useState(''); // Começa vazio
  const [searchLimit, setSearchLimit] = useState(50);
  const [isSearching, setIsSearching] = useState(false);
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'discarded'>('all');
  const [leadSelected, setLeadSelected] = useState(false); // Novo estado para travar os passos seguintes

  useEffect(() => {
    // Fetch initial leads from DB
    const fetchLeads = async () => {
      try {
        const res = await fetch('/api/leads');
        const data = await res.json();
        if (data.success) {
          setLeadsList(data.leads.map((lead: any) => ({
            ...lead,
            updatedAt: new Date(lead.createdAt || Date.now()).toLocaleString('pt-BR'),
            name: (lead.title && lead.title.split('-')[0].trim()) || lead.name || lead.nome || 'Empresa não identificada'
          })));
        }
      } catch (err) {
        console.error("Falha ao carregar leads", err);
      }
    };
    fetchLeads();
  }, []);

  // Estado para os campos do formulário do Gerador
  const [formData, setFormData] = useState({
    companyName: '',
    niche: '',
    audience: '',
    hasWebsite: false,
    websiteUrl: '',
    goal: 'Geração de Leads',
    tone: 'Profissional e Persuasivo',
    differentiators: '',
    colors: '',
    primaryHex: '#2EFF00',
    sections: {
      hero: true,
      about: true,
      services: true,
      benefits: false,
      testimonials: false,
      faq: false,
      contact: true,
      pricing: false
    }
  });

  const goals = ['Geração de Leads', 'Vendas Diretas (E-commerce)', 'Portfólio/Autoridade', 'Informativo/Institucional', 'Lançamento de Produto'];
  const tones = ['Profissional e Persuasivo', 'Casual e Amigável', 'Jovem e Descontraído', 'Técnico e Especializado', 'Luxuoso e Exclusivo', 'Agressivo (Hard Sell)'];

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSectionToggle = (section: keyof typeof formData.sections) => {
    setFormData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: !prev.sections[section]
      }
    }));
  };

  // --- FUNÇÕES DE LEADS ---
  const handleSearchLeads = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    
    try {
      const response = await fetch('/api/maps-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await response.json();
      
      if (data.success) {
        setLeadsList(prev => {
          const newFetched = data.data.map((lead: any) => ({
            ...lead,
            updatedAt: new Date().toLocaleString('pt-BR'),
            name: lead.title?.split('-')[0].trim() || 'Empresa'
          }));
          
          const combined = [...newFetched, ...prev];
          const unique = Array.from(new Map(combined.map(item => [item.id || item.placeId, item])).values());
          return unique;
        });
      }
    } catch (err) {
      console.error(err);
    }
    setIsSearching(false);
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/leads/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setLeadsList(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
    } catch (err) {
      console.error('Falha ao atualizar status do lead', err);
    }
  };

  const handleGenerateSiteForLead = (lead: any) => {
    // Pré-preenche os dados no Gerador
    setFormData(prev => ({
      ...prev,
      companyName: lead.title?.split('-')[0].trim() || lead.name || lead.nome,
      hasWebsite: !!(lead.website || lead.link || lead.site),
      websiteUrl: lead.website || lead.link || lead.site || '',
      niche: searchQuery.split(' ')[0] || 'Serviços', // Tenta pegar a primeira palavra da busca (ex: Psicólogo)
    }));
    
    // Libera os próximos passos e muda para a tela do gerador
    setLeadSelected(true);
    navigateTo('generator');
  };

  // --- FUNÇÕES DO GERADOR ---
  const analyzeUrl = async () => {
    if (!formData.websiteUrl) return;
    setIsAnalyzingUrl(true);
    
    try {
      const response = await fetch('/api/analyze-ux', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formData.websiteUrl.startsWith('http') ? formData.websiteUrl : `https://${formData.websiteUrl}` })
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        const issuesSummary = data.data.summary || '';
        const issuesText = data.data.issues?.map((i: any) => `- ERRO: ${i.title}\n  IMPACTO: ${i.description}\n  CORREÇÃO UX/COPY: ${i.recommendation || ''}`).join('\n\n') || '';
        
        const urlObj = new URL(formData.websiteUrl.startsWith('http') ? formData.websiteUrl : `https://${formData.websiteUrl}`);
        const domainParts = urlObj.hostname.replace('www.', '').split('.');
        const simulatedName = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
        
        setFormData(prev => ({
          ...prev,
          companyName: data.data.brandAnalysis?.companyName || prev.companyName || simulatedName,
          niche: data.data.brandAnalysis?.niche || prev.niche || 'Negócio Local',
          audience: data.data.brandAnalysis?.audience || 'Público que precisa de maior clareza e credibilidade.',
          differentiators: data.data.brandAnalysis?.differentiators || 'Foco em conversão extrema com UX aprimorada.',
          tone: data.data.brandAnalysis?.tone || 'Profissional e Persuasivo',
          colors: data.data.brandAnalysis?.colors || prev.colors || '',
          primaryHex: data.data.brandAnalysis?.primaryHex || prev.primaryHex || '#2EFF00'
        }));

        setGeneratedPrompt(`[DADOS DA ANÁLISE PROFUNDA DO SITE ATUAL]\n${issuesSummary}\n\n[PRINCIPAIS PROBLEMAS ENCONTRADOS NO SITE ATUAL A SEREM CORRIGIDOS]\n${issuesText}\n\n-> INSTRUÇÃO: Mapeie as 'CORREÇÕES UX/COPY' apontadas acima para as seções (Hero, Problema, Solução, etc) neste novo copywriting.\n`);
      }
    } catch (e) {
      console.error(e);
      // Fallback manual se a API falhar
      const urlObj = new URL(formData.websiteUrl.startsWith('http') ? formData.websiteUrl : `https://${formData.websiteUrl}`);
      const domainParts = urlObj.hostname.replace('www.', '').split('.');
      const simulatedName = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
      
      setFormData(prev => ({
        ...prev,
        companyName: prev.companyName || simulatedName,
        niche: prev.niche || 'Serviços',
        audience: 'Público precisando de clareza imediata e UX otimizada.',
        differentiators: 'Foco absoluto e simples.',
        tone: 'Profissional e Persuasivo'
      }));
    }
    
    setIsAnalyzingUrl(false);
  };

  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

  const generatePrompt = async () => {
    const activeSections = Object.entries(formData.sections)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => {
        const labels: Record<string, string> = {
          hero: 'Hero Section (Foco em Proposição de Valor Única Mapeada)', 
          about: 'Sobre Nós (Construção de Autoridade e Storytelling)', 
          services: 'Serviços/Soluções (Apresentação orientada a resolução de dores)', 
          benefits: 'Benefícios (Por que a solução resolve a dor baseada em aversão à perda)',
          testimonials: 'Depoimentos (Uso de Prova Social robusta com quebra de objeções)', 
          faq: 'Perguntas Frequentes (FAQ estratégico para neutralizar atritos)', 
          contact: 'Contato (CTA claro com formulário otimizado para conversão)', 
          pricing: 'Planos/Preços (Uso de viés de ancoragem e Efeito Isca C-Decoy)'
        };
        return `- [ ] **${labels[key]}**: [Criar Copywriter específico aqui...]`;
      }).join('\n');

    const analysisBase = generatedPrompt.includes('[DADOS DA ANÁLISE PROFUNDA') ? generatedPrompt : '';

    const promptText = `URGENTE E ESTRITO: ATUE COMO Diretor de UX/UI, Head de Growth e Copywriter de Resposta Direta Sênior.

Sua missão é projetar mentalmente e GERAR A ESTRUTURA, O COPY COMPLETO E A DIREÇÃO DE ARTE EXATA para a nova Landing Page de alta conversão do cliente. Esta LP será desenvolvida por um engenheiro focado em design de elite usando React, Tailwind CSS, GSAP, WebGL, e Unicorn Studio. O design DEVE fugir do "AI slop" genérico. Chega de templates em blocos padrão, fundos escuros para qualquer nicho, e fontes sem personalidade. Pense de forma criativa e disruptiva, mas baseada em CRO. Entregue texto real e persuasivo. SEM "Lorem Ipsum".

CONTEXTO DO NEGÓCIO ====================
MARCA: ${formData.companyName || '[Nome da Empresa]'} 
NICHO: ${formData.niche || '[Nicho]'} (ATENÇÃO: A estética DEVE combinar com o nicho. Ex: Se for odontologia, fuja do "dark mode hacker". Seja clean, acolhedor, sofisticado. Se for SaaS de nicho infra, aí sim use dark mode tech).
PÚBLICO-ALVO: ${formData.audience || '[Público-alvo]'}
OBJETIVO DE CONVERSÃO: ${formData.goal}
TOM DE VOZ: ${formData.tone}
DIFERENCIAIS: ${formData.differentiators || 'Qualidade, Rapidez, Segurança'}

${analysisBase ? `[RESULTADO DA AUDITORIA DO SITE ANTIGO - RESOLVA ESTES PROBLEMAS NESTE NOVO COPY E DESIGN]:\n${analysisBase}\n======================================================\n` : ''}

DIRETRIZES DE DESIGN, ESTRUTURA E COPY (MANDATÓRIO):
1. O ESTILO E DIREÇÃO DE ARTE:
   - Proponha uma VIBE coerente com o ${formData.niche || 'negócio'}. Defina cores precisas (Evite o roxo padrão de GenAI, seja original. Use paletas monocromáticas com acento vibrante, duotones, editorial, etc.). Dite exatamente qual a tipografia Display (uma fonte moderna, inesperada, com personalidade) e a Sans para leitura.
   - Texturas e Estilo: Defina se será Glassmorphism minimalista, Neobrutalismo, Skewed geometric, Soft/Pastel, ou 3D WebGL scenes.

2. THE ABOVE-THE-FOLD FORMULA (Hero Section):
   - Headline: 6-12 palavras, focada no RESULTADO DO CLIENTE FINAL. ZERO clichês empresariais (ex: Nada de "Bem-vindo à nossa clínica" ou "Ajudamos negócios a crescer"). 
   - Subheadline: 15-25 palavras que detalham o "COMO" resolvendo a dor.
   - Hero Visuals (GSAP/WebGL): Descreva explicitamente a imagem da Hero focada em PESSOAS COM RESULTADOS, não o produto/serviço puramente técnico. Inclua recomendações sobre as animações de entrada usando \`GSAP\` (staggered reveals, scroll triggers) e se haverá um asset do Unicorn Studio.
   - Primary CTA: Verbo de Ação Específico + Benefício (ex: "Agendar Minha Avaliação Gratuita", nunca "Saiba Mais").

3. ARQUITETURA DA LANDING PAGE (Ordem de leitura):
   Hero -> Prova Social Rápida -> O Problema / Empatia -> Apresentação da Solução -> Benefícios Reais -> Depoimentos / Casos Reais -> Oferta e Preço (Ancoragem) -> FAQ -> CTA Final com urgência.

4. INSTRUÇÕES DE ENGENHARIA DE FRONTEND & COPY PARA CADA SEÇÃO:
   Para CADA seção a seguir, especifique DENTRO DE UM BLOCO CLARO:
   A) [TECH & UX/UI]: Exatamente como a equipe dev aplicará (ex: \`scroll-trigger\`, \`framer-motion\`, gradientes radiais em Tailwind, espaçamentos \`py-32\`, imagens on-scroll).
   B) [IMAGEM RECOMENDADA]: Sugira uma imagem realista e de alta conversão. IMPORTANTE: Forneça um link de imagem renderizável usando a API gratuita do Pollinations! O formato do link deve ser: \`https://image.pollinations.ai/prompt/{prompt-em-ingles-detalhado}?width=1200&height=800&nologo=true\`.
   C) [COPY FINAL]: Os textos exatos que vão para a tela. (H2, paragrafos curtos, bullets que vendem a transformação).

ESTRUTURA DE SEÇÕES SOLICITADAS:
${activeSections || '- [ ] ESTRUTURA COMPLETA MÍNIMA VIÁVEL DA LP'}

FORMATO DE RETORNO (MANDATÓRIO):
Responda APENAS E ESTRITAMENTE o output no formato Markdown profissional. Não responda conversar, apenas o layout Markdown. Crie uma grande seção inicial de [DIREÇÃO DE ARTE & BRANDING] e depois vá seção por seção do site.`;

    setIsGeneratingCopy(true);
    setGeneratedPrompt('Iniciando geração com Inteligência Artificial...');
    
    try {
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText })
      });
      const data = await response.json();
      
      if (data.success && data.text) {
        setGeneratedPrompt(data.text);
      } else {
        // Fallback to prompt if API fails
        setGeneratedPrompt("Falha na IA. Use este prompt no ChatGPT:\n\n" + promptText);
      }
    } catch (e) {
      console.error(e);
      setGeneratedPrompt("Erro de conexão. Use este prompt:\n\n" + promptText);
    }
    
    setCopied(false);
    setIsGeneratingCopy(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // --- NAVEGAÇÃO ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateTo = (view: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const handleContinue = () => {
    navigateTo('loading');
    setTimeout(() => navigateTo('preview'), 2000);
  };

  const handleGenerateBrandPdf = () => {
    navigateTo('pdf-loading');
    setTimeout(() => navigateTo('brand-pdf'), 2500);
  };

  const handleAcceptProposal = () => {
    navigateTo('success');
  };

  const slug = formData.companyName ? formData.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'nome-da-empresa';

  const isLoading = currentView === 'loading' || currentView === 'pdf-loading';
  const loadingData = currentView === 'pdf-loading' 
    ? { title: 'Gerando PDF da Marca...', desc: 'A IA está construindo a identidade visual, paleta de cores e posts para o Instagram.' }
    : { title: 'Criando Estrutura Inteligente...', desc: 'Lendo os parâmetros do prompt e desenhando a arquitetura (UI/UX).' };

  return (
    <div className="flex h-full bg-[#0a0a0a] text-zinc-300 font-sans overflow-hidden selection:bg-[#2EFF00] selection:text-black">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar (Internal for this tool) */}
      <aside className={`w-56 bg-[#0f0f0f] border-r border-[#1a1a1a] flex-col shrink-0 z-50 fixed md:relative h-full transition-transform duration-300 ${isMobileMenuOpen ? 'flex translate-x-0' : 'hidden md:flex -translate-x-full md:translate-x-0'}`}>
        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <div className="flex justify-between items-center mb-8 md:hidden px-2">
            <h3 className="text-white font-bold">Mineração</h3>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-400">
              <ChevronDown className="rotate-90" size={20} />
            </button>
          </div>
          <div className="mb-8">
            <h3 className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest mb-4 px-2">Fluxo do Projeto</h3>
            <nav className="space-y-1">
              <button onClick={() => navigateTo('leads')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === 'leads' ? 'bg-[#2EFF00]/10 text-[#2EFF00] border border-[#2EFF00]/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}>
                <Search size={18} />
                <span className="text-sm font-medium">1. Buscar Leads</span>
              </button>
              <button onClick={() => leadSelected && navigateTo('generator')} disabled={!leadSelected} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === 'generator' ? 'bg-[#2EFF00]/10 text-[#2EFF00] border border-[#2EFF00]/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'} ${!leadSelected ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <PenTool size={18} />
                <span className="text-sm font-medium">2. Gerador Copy</span>
              </button>
              <button onClick={() => generatedPrompt && navigateTo('preview')} disabled={!generatedPrompt || !leadSelected} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === 'preview' ? 'bg-[#2EFF00]/10 text-[#2EFF00] border border-[#2EFF00]/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 disabled:opacity-50 disabled:cursor-not-allowed'}`}>
                <LayoutTemplate size={18} />
                <span className="text-sm font-medium">3. Estrutura Site</span>
              </button>
              <button onClick={() => generatedPrompt && navigateTo('brand-pdf')} disabled={!generatedPrompt || !leadSelected} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${currentView === 'brand-pdf' ? 'bg-[#2EFF00]/10 text-[#2EFF00] border border-[#2EFF00]/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 disabled:opacity-50 disabled:cursor-not-allowed'}`}>
                <FileCheck size={18} />
                <span className="text-sm font-medium">4. Brand PDF</span>
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-[#0f0f0f] border-b border-[#1a1a1a] z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-zinc-400 hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold text-white truncate max-w-[200px] md:max-w-none">
              {currentView === 'leads' ? 'Mineração de Leads' :
               currentView === 'generator' ? 'Criar Copy para Site' : 
               currentView === 'preview' ? 'Pré-visualização do Template' : 
               currentView === 'brand-pdf' ? 'Proposta de Identidade Visual' :
               currentView === 'success' ? 'Projeto Finalizado' : 'Processando...'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {currentView !== 'leads' && currentView !== 'generator' && currentView !== 'success' && !isLoading && (
              <button 
                onClick={() => navigateTo('generator')}
                className="text-zinc-400 hover:text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm border border-zinc-800 hover:bg-zinc-800"
              >
                <ChevronLeft size={16} /> Voltar
              </button>
            )}
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm border border-zinc-700">
              <Bell size={16} /> <span className="absolute top-5 right-[2.5rem] w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Dynamic View Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
          
          {/* VIEW 0: LEADS SEARCH LAB */}
          {currentView === 'leads' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
              
              {/* Search Box */}
              <div className="bg-[#121212] border border-zinc-800/60 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#2EFF00] to-emerald-500"></div>
                <h2 className="text-2xl font-bold text-white mb-2">Google Maps Scraper</h2>
                <p className="text-zinc-400 text-sm mb-8">Busque empresas com a API do Google, revise a fila e exporte apenas os leads aprovados.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Busca</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0a0a0a] border-2 border-zinc-800 focus:border-[#2EFF00] rounded-xl pl-12 pr-4 py-4 text-white font-medium transition-colors outline-none"
                        placeholder="Ex: Nicho/Profissional + Cidade"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Limite</label>
                    <input 
                      type="number" 
                      value={searchLimit}
                      onChange={(e: any) => setSearchLimit(e.target.value)}
                      className="w-32 bg-[#0a0a0a] border-2 border-zinc-800 focus:border-[#2EFF00] rounded-xl px-4 py-3 text-white font-medium transition-colors outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <button 
                      onClick={handleSearchLeads}
                      disabled={isSearching || !searchQuery}
                      className="bg-[#2EFF00] hover:bg-[#28e600] text-black font-bold px-10 py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(46,255,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
                    >
                      {isSearching ? <Loader2 size={20} className="animate-spin" /> : 'Buscar'}
                    </button>
                    <button className="text-zinc-400 hover:text-white font-medium underline text-sm transition-colors">
                      Exportar .xlsx
                    </button>
                    <button 
                      onClick={() => {setSearchQuery(''); setLeadsList([]);}}
                      className="text-red-500/80 hover:text-red-400 font-medium text-sm transition-colors ml-auto"
                    >
                      Limpar
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Grid */}
              {leadsList.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-white font-bold flex items-center gap-2">
                      Resultados da Busca <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full">{leadsList.length}</span>
                    </h3>
                    <div className="flex bg-[#121212] p-1 rounded-lg border border-zinc-800 self-start">
                      {['all', 'pending', 'approved', 'discarded'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status as any)}
                          className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${
                            filterStatus === status 
                            ? 'bg-zinc-800 text-[#2EFF00]' 
                            : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {status === 'all' ? 'Todos' : status === 'pending' ? 'Pendentes' : status === 'approved' ? 'Aprovados' : 'Descartados'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    {leadsList.filter(l => filterStatus === 'all' || l.status === filterStatus).map(lead => (
                      <div key={lead.id} className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 shadow-lg hover:border-[#2EFF00]/30 transition-colors">
                        {/* Status Border */}
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${
                          lead.status === 'pending' ? 'bg-orange-500' : 
                          lead.status === 'approved' ? 'bg-[#2EFF00]' : 'bg-red-500'
                        }`}></div>

                        {/* Corpo do Card */}
                        <div className="pl-3 flex-1 flex flex-col w-full">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-white line-clamp-1 leading-tight">{lead.title || lead.name || lead.nome || 'Empresa não identificada'}</h4>
                            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                              lead.status === 'pending' ? 'text-orange-500' : 
                              lead.status === 'approved' ? 'text-[#2EFF00]' : 'text-red-500'
                            }`}>
                              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                              {lead.status === 'pending' ? 'Pendente' : lead.status === 'approved' ? 'Aprovado' : 'Descartado'}
                            </div>
                          </div>
                          <div className="text-zinc-400 font-mono text-sm mb-3 text-left">{lead.phone}</div>
                          
                          <div className="flex flex-wrap gap-4 mb-4 text-xs text-zinc-500">
                            <div className="flex items-center gap-1.5 max-w-xs shrink-0">
                              <MapPin size={12} className="shrink-0" /> 
                              <span className="truncate">{lead.address || 'Sem endereço'}</span>
                            </div>
                            {(lead.website || lead.link || lead.site) ? (
                              <div className="flex items-center gap-1.5 text-[#2EFF00] shrink-0">
                                <Globe size={12} className="shrink-0" /> 
                                <a href={lead.website || lead.link || lead.site} target="_blank" rel="noreferrer" className="hover:underline text-zinc-300 truncate max-w-[200px]">{lead.website || lead.link || lead.site}</a>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-zinc-600 shrink-0">
                                <Globe size={12} className="shrink-0" /> 
                                <span>Sem website detectado</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Ações Direita */}
                        <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                           <button 
                              onClick={() => handleGenerateSiteForLead(lead)}
                              className="w-full md:w-48 bg-white hover:bg-zinc-200 text-black font-bold py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 text-sm"
                            >
                              <Sparkles size={14} className="text-[#2EFF00]" /> Validar Lead
                            </button>
                            <div className="flex gap-2">
                               <button className="flex-1 bg-transparent border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                                  </svg> Contato
                               </button>
                            </div>
                            {/* Controles rápidos de Status */}
                            <div className="flex justify-center gap-4 items-center mt-1">
                              <button onClick={() => updateLeadStatus(lead.id, 'approved')} className="text-zinc-500 hover:text-[#2EFF00] transition-colors" title="Aprovar">
                                <CheckCircle size={16} />
                              </button>
                              <button onClick={() => updateLeadStatus(lead.id, 'pending')} className="text-zinc-500 hover:text-orange-500 transition-colors" title="Pendente">
                                <Clock size={16} />
                              </button>
                              <button onClick={() => updateLeadStatus(lead.id, 'discarded')} className="text-zinc-500 hover:text-red-500 transition-colors" title="Descartar">
                                <Trash2 size={16} />
                              </button>
                            </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 1: GENERATOR (Onde estava o antigo código) */}
          {currentView === 'generator' && (
             <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in slide-in-from-right-8 duration-300">
              {/* Form Section */}
              <div className="xl:col-span-7 space-y-6">
                
                {/* Card 1: Informações Básicas */}
                <div className="bg-[#121212] border border-zinc-800/60 rounded-xl p-6 shadow-xl relative overflow-hidden transition-all">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2EFF00]/30 to-transparent"></div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Briefcase className="text-[#2EFF00]" size={20} />
                      <h2 className="text-lg font-semibold text-white">Informações da Marca</h2>
                    </div>
                    
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">Empresa já possui site?</span>
                      <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${formData.hasWebsite ? 'bg-[#2EFF00]' : 'bg-zinc-700'}`}>
                        <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${formData.hasWebsite ? 'transform translate-x-5' : ''}`}></div>
                      </div>
                      <input type="checkbox" name="hasWebsite" checked={formData.hasWebsite} onChange={handleInputChange} className="hidden" />
                    </label>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.hasWebsite && (
                      <div className="p-4 bg-[#0a0a0a] rounded-lg border border-[#2EFF00]/30 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="flex items-center gap-2 text-xs font-medium text-[#2EFF00] uppercase tracking-wider mb-2">
                          <LinkIcon size={14} /> URL do Site Atual
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input 
                            type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleInputChange} placeholder="https://www.exemplo.com.br" 
                            className="flex-1 w-full bg-[#121212] border border-zinc-700 rounded-md px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#2EFF00] focus:ring-1 focus:ring-[#2EFF00]/50 transition-all placeholder:text-zinc-600"
                          />
                          <button 
                            onClick={analyzeUrl} disabled={!formData.websiteUrl || isAnalyzingUrl}
                            className="bg-zinc-800 hover:bg-zinc-700 text-[#2EFF00] px-4 py-2.5 rounded-md font-bold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700 shrink-0 uppercase tracking-wider"
                          >
                            {isAnalyzingUrl ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            {isAnalyzingUrl ? 'Analisando...' : 'Analisar (IA)'}
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Nome da Empresa</label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-md px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#2EFF00] transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Nicho de Mercado</label>
                        <input type="text" name="niche" value={formData.niche} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-md px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#2EFF00] transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Público-Alvo (Persona)</label>
                      <textarea name="audience" value={formData.audience} onChange={handleInputChange} rows={2} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-md px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#2EFF00] transition-all resize-none custom-scrollbar"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Cores da Marca</label>
                        <input type="text" name="colors" value={formData.colors} onChange={handleInputChange} placeholder="Ex: Roxo Escuro e Branco" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-md px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#2EFF00] transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Cor Principal (HEX)</label>
                        <div className="flex gap-2">
                            <input type="color" name="primaryHex" value={formData.primaryHex} onChange={handleInputChange} className="w-10 h-[42px] bg-[#0a0a0a] border border-zinc-800 rounded-md p-1 cursor-pointer" />
                            <input type="text" name="primaryHex" value={formData.primaryHex} onChange={handleInputChange} placeholder="Ex: #2EFF00" className="flex-1 bg-[#0a0a0a] border border-zinc-800 rounded-md px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#2EFF00] transition-all font-mono" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2 & 3: Estratégia e Seções */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#121212] border border-zinc-800/60 rounded-xl p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-6">
                      <Target className="text-[#2EFF00]" size={20} />
                      <h2 className="text-lg font-semibold text-white">Estratégia</h2>
                    </div>
                    <div className="space-y-4">
                      <select name="goal" value={formData.goal} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-md px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#2EFF00] appearance-none">
                        {goals.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <select name="tone" value={formData.tone} onChange={handleInputChange} className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-md px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#2EFF00] appearance-none">
                        {tones.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="bg-[#121212] border border-zinc-800/60 rounded-xl p-6 shadow-xl">
                    <div className="flex items-center gap-2 mb-4">
                      <Layers style={{ color: formData.primaryHex }} size={20} />
                      <h2 className="text-lg font-semibold text-white">Seções</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries({ hero: 'Hero', about: 'Sobre', services: 'Serviços', benefits: 'Benefícios', testimonials: 'Depoimentos', faq: 'FAQ', contact: 'Contato', pricing: 'Preços' }).map(([key, label]) => {
                        const isActive = formData.sections[key as keyof typeof formData.sections];
                        return (
                        <label key={key} style={isActive ? { backgroundColor: `${formData.primaryHex}11`, borderColor: `${formData.primaryHex}80`, color: 'white' } : {}} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${isActive ? '' : 'bg-[#0a0a0a] border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}>
                          <div style={isActive ? { backgroundColor: formData.primaryHex, borderColor: formData.primaryHex } : {}} className={`w-3 h-3 rounded-[3px] border flex items-center justify-center ${isActive ? '' : 'border-zinc-600'}`}>
                            {isActive && <CheckSquare size={10} className="text-black" />}
                          </div>
                          <span className="text-xs font-medium">{label}</span>
                          <input type="checkbox" className="hidden" checked={isActive} onChange={() => handleSectionToggle(key as keyof typeof formData.sections)} />
                        </label>
                      )})}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 pb-8 xl:pb-0">
                  <button onClick={generatePrompt} disabled={isGeneratingCopy} style={{ backgroundColor: formData.primaryHex, boxShadow: `0 0 25px ${formData.primaryHex}33` }} className="text-black font-bold px-8 py-3 rounded-md flex items-center gap-2 transition-all transform hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-70 disabled:cursor-wait">
                    {isGeneratingCopy ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />} 
                    {isGeneratingCopy ? 'Gerando Copy com IA...' : 'Gerar Output (IA)'}
                  </button>
                </div>

              </div>

              {/* Result Section */}
              <div className="xl:col-span-5 flex flex-col h-[600px] xl:h-auto">
                <div className="bg-[#121212] border border-zinc-800/60 rounded-xl flex flex-col h-full shadow-xl relative overflow-hidden xl:sticky xl:top-0">
                  <div className="p-4 border-b border-zinc-800/60 flex items-center justify-between bg-[#18181b]/50">
                    <div className="flex items-center gap-2">
                      <Megaphone style={{ color: formData.primaryHex }} size={18} />
                      <h2 className="text-sm font-semibold text-white">Copy do Template Gerada</h2>
                    </div>
                    {generatedPrompt && (
                      <button onClick={copyToClipboard} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${copied ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700'}`}>
                        {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />} {copied ? 'Copiado!' : 'Copiar'}
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1 p-0 relative flex flex-col">
                    {generatedPrompt ? (
                      <>
                        <div className="flex-1 w-full bg-[#0a0a0a] overflow-y-auto p-5 custom-scrollbar text-sm markdown-body max-w-none text-zinc-300">
                          <Markdown>{generatedPrompt}</Markdown>
                        </div>
                        <div className="p-4 bg-[#121212] border-t border-zinc-800/60 shrink-0">
                          <button onClick={handleContinue} className="w-full bg-white hover:bg-zinc-200 text-black font-bold px-6 py-3 rounded-md flex items-center justify-center gap-2 transition-all shadow-lg">
                            Seguir para a Estrutura (Wireframe) <ArrowRight size={18} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 border border-zinc-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"><Sparkles size={24} className="text-zinc-600" /></div>
                        <h3 className="text-zinc-300 font-medium mb-2">Nenhum prompt gerado ainda</h3>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: LOADING SPINNER */}
          {isLoading && (
            <div className="h-full flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
              <div className="relative">
                <div style={{ backgroundColor: formData.primaryHex }} className="absolute inset-0 blur-[30px] opacity-20 rounded-full"></div>
                <Loader2 size={64} style={{ color: formData.primaryHex }} className="animate-spin relative z-10" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">{loadingData.title}</h2>
                <p className="text-zinc-500">{loadingData.desc}</p>
              </div>
              <div className="w-64 h-2 bg-zinc-800 rounded-full overflow-hidden mt-8">
                <div style={{ backgroundColor: formData.primaryHex }} className="h-full rounded-full animate-[progress_2.5s_ease-in-out_forwards]"></div>
              </div>
            </div>
          )}

          {/* VIEW 3: PREVIEW E VIEW 4: BRAND PDF E VIEW 5: SUCCESS SÃO IGUAIS AO CÓDIGO ANTERIOR */}
          {currentView === 'preview' && (
             <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-500 pb-12">
              
              <div className="flex justify-end gap-3 mb-4">
                <button onClick={handleContinue} className="px-4 py-2 bg-[#121212] border border-zinc-800 text-zinc-300 rounded-md text-sm font-medium hover:bg-zinc-800 flex items-center gap-2 transition-colors">
                  <RefreshCw size={16} /> Gerar Novamente
                </button>
                <button onClick={handleGenerateBrandPdf} className="px-6 py-2 bg-white text-black rounded-md text-sm font-bold shadow-lg hover:bg-zinc-200 flex items-center gap-2 transition-colors">
                  <FileCheck size={16} /> Validar Site (Gerar PDF)
                </button>
              </div>

              <div className="bg-[#18181b] rounded-t-xl border border-zinc-800 flex items-center px-4 py-3 gap-4 shadow-2xl overflow-hidden relative">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/80"></div><div className="w-3 h-3 rounded-full bg-yellow-500/80"></div><div className="w-3 h-3 rounded-full bg-green-500/80"></div></div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="bg-[#0a0a0a] border border-zinc-800 rounded-md px-4 py-1.5 flex items-center gap-2 w-full max-w-lg text-xs text-zinc-400 font-mono">
                    <Globe size={14} className="text-zinc-500" /><span>https://{slug}.com.br/</span>
                  </div>
                </div>
                <div className="flex gap-3 text-zinc-500"><Monitor size={16} className="text-white" /><LayoutTemplate size={16} /></div>
              </div>

              <div className="bg-[#0a0a0a] border-x border-b border-zinc-800 rounded-b-xl overflow-hidden shadow-2xl relative text-zinc-300 font-sans">
                
                <div style={{ backgroundImage: `linear-gradient(to right, ${formData.primaryHex}, #000)` }} className="text-white px-4 py-3 flex flex-col sm:flex-row justify-center items-center gap-4 text-sm font-bold z-50 shadow-md">
                  <div className="flex items-center gap-2"><span className="animate-pulse">⏳</span>Oferta e template ativos por apenas 7 dias, não perca a oportunidade!</div>
                  <button onClick={handleGenerateBrandPdf} style={{ color: formData.primaryHex }} className="bg-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-zinc-900 transition-colors shadow-sm flex items-center gap-2">
                    <FileText size={14} /> Visualizar PDF da Marca
                  </button>
                </div>

                <nav className="border-b border-zinc-800/50 p-5 flex justify-between items-center bg-[#0a0a0a]/90 backdrop-blur-sm sticky top-0 z-40">
                  <div className="text-xl font-black text-white tracking-tighter flex items-center gap-2">
                    <div style={{ backgroundColor: formData.primaryHex }} className="w-6 h-6 rounded-sm flex items-center justify-center text-black"><Sparkles size={14} /></div>
                    {formData.companyName ? formData.companyName.toUpperCase() : 'SUA EMPRESA'}
                  </div>
                  <button style={{ backgroundColor: formData.primaryHex }} className="px-5 py-2 text-black font-bold text-xs rounded transition-colors opacity-90 hover:opacity-100">Fale Connosco</button>
                </nav>

                <div className="divide-y divide-zinc-800/30">
                  {formData.sections.hero && (
                    <section className="p-16 lg:px-24 lg:py-32 flex flex-col items-center text-center relative overflow-hidden bg-gradient-to-b from-[#121212] to-[#0a0a0a]">
                      <div style={{ backgroundColor: formData.primaryHex }} className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[120px] rounded-full pointer-events-none opacity-5"></div>
                      <div style={{ color: formData.primaryHex, borderColor: `${formData.primaryHex}33` }} className="inline-block px-4 py-1.5 bg-zinc-800/40 border rounded-full text-[10px] font-bold uppercase tracking-wider mb-8 backdrop-blur-sm">
                        {formData.goal === 'Geração de Leads' ? '🚀 Aumente as suas conversões' : '✨ A solução definitiva'}
                      </div>
                      <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-4xl leading-[1.1]">
                        Transforme a realidade de <span style={{ color: formData.primaryHex }}>{(formData.audience || 'seus clientes').substring(0,35)}...</span>
                      </h1>
                      <button style={{ backgroundColor: formData.primaryHex, boxShadow: `0 0 20px ${formData.primaryHex}33` }} className="px-8 py-4 text-black font-bold rounded-md">Começar Agora Mesmo</button>
                    </section>
                  )}

                  {formData.sections.about && (
                    <section className="p-16 lg:px-24 py-20 flex flex-col items-center text-center bg-[#0a0a0a]">
                      <h2 className="text-3xl font-bold text-white mb-6">Sobre a {formData.companyName || 'Empresa'}</h2>
                      <div className="w-full max-w-3xl h-64 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 overflow-hidden relative group">
                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity"></div>
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                         <h3 className="relative z-10 text-white font-bold text-xl uppercase tracking-widest opacity-80 mix-blend-overlay">Construindo Autoridade</h3>
                      </div>
                      <p className="text-zinc-500 mt-8 max-w-2xl text-lg">
                        Uma breve descrição sobre a missão, visão e valores da {formData.companyName || 'empresa'}, estabelecendo autoridade no nicho de {formData.niche || 'atuação'}. 
                      </p>
                    </section>
                  )}

                  {formData.sections.services && (
                    <section className="p-16 lg:px-24 py-20 bg-[#121212]">
                      <h2 className="text-3xl font-bold text-white mb-12 text-center">Nossos Serviços</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all hover:-translate-y-1">
                            <div style={{ backgroundColor: `${formData.primaryHex}22`, color: formData.primaryHex }} className="w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                              <Box size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Serviço {i}</h3>
                            <p className="text-zinc-500 text-sm">Descrição estratégica do serviço focada nos benefícios diretos para o cliente.</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {formData.sections.benefits && (
                    <section className="p-16 lg:px-24 py-20 bg-[#0a0a0a] flex flex-col md:flex-row items-center gap-12">
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-white mb-8">Por que nos escolher?</h2>
                        <ul className="space-y-6">
                          {[1, 2, 3, 4].map(i => (
                            <li key={i} className="flex items-start gap-4">
                              <div style={{ color: formData.primaryHex }} className="mt-1"><CheckCircle2 size={24} /></div>
                              <div>
                                <h4 className="text-white font-bold mb-1 text-lg">Benefício exclusivo {i}</h4>
                                <p className="text-zinc-500 text-sm">Explicação de como isso resolve uma dor específica baseada na aversão à perda.</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex-1">
                         <div className="w-full aspect-square bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-center overflow-hidden relative shadow-2xl">
                            <div style={{ backgroundColor: formData.primaryHex }} className="absolute w-full h-full opacity-10 mix-blend-color"></div>
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40"></div>
                            <Rocket style={{ color: formData.primaryHex }} className="w-20 h-20 relative z-10 drop-shadow-[0_0_15px_rgba(46,255,0,0.5)]" />
                         </div>
                      </div>
                    </section>
                  )}

                  {formData.sections.testimonials && (
                    <section className="p-16 lg:px-24 py-20 bg-[#121212] flex flex-col items-center">
                      <h2 className="text-3xl font-bold text-white mb-12 text-center">O que dizem sobre nós</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                         {[1, 2].map(i => (
                           <div key={i} className="bg-[#0a0a0a] p-8 rounded-2xl border border-zinc-800 relative shadow-lg">
                             <div style={{ color: formData.primaryHex }} className="absolute -top-5 -left-5 bg-[#121212] p-3 rounded-full border border-zinc-800 shadow-xl">
                               <Quote size={20} />
                             </div>
                             <p className="text-zinc-300 italic mb-8 mt-2">"Este é um depoimento forte que usa Prova Social para validar os diferenciais da marca e quebrar objeções comuns dos clientes."</p>
                             <div className="flex items-center gap-4">
                               <img src={`https://i.pravatar.cc/150?img=${10+i}`} alt="Avatar" className="w-12 h-12 bg-zinc-800 rounded-full object-cover" />
                               <div>
                                 <h4 className="text-white font-bold">Cliente Satisfeito {i}</h4>
                                 <span className="text-zinc-500 text-xs uppercase tracking-wider">CEO, Empresa Exemplo {i}</span>
                               </div>
                             </div>
                           </div>
                         ))}
                      </div>
                    </section>
                  )}

                  {formData.sections.pricing && (
                    <section className="p-16 lg:px-24 py-20 bg-[#0a0a0a] flex flex-col items-center">
                      <h2 className="text-3xl font-bold text-white mb-4 text-center">Investimento</h2>
                      <p className="text-zinc-500 mb-12 text-center max-w-2xl">Planos estruturados utilizando o viés cognitivo de Ancoragem para facilitar a decisão de compra.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl items-center">
                         {[
                           { name: 'Básico', price: '99', highlight: false },
                           { name: 'Profissional', price: '199', highlight: true },
                           { name: 'Enterprise', price: '399', highlight: false },
                         ].map((plan, i) => (
                           <div key={i} className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${plan.highlight ? 'bg-[#121212] scale-105 shadow-2xl relative' : 'border-zinc-800 bg-[#0a0a0a]'}`} style={plan.highlight ? { borderColor: formData.primaryHex, boxShadow: `0 20px 40px ${formData.primaryHex}22` } : {}}>
                             {plan.highlight && (
                               <div style={{ backgroundColor: formData.primaryHex }} className="absolute -top-4 left-1/2 -translate-x-1/2 text-black text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full">
                                 Mais Escolhido
                               </div>
                             )}
                             <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                             <div className="text-4xl font-black text-white mb-6">R$ {plan.price}<span className="text-zinc-600 text-lg font-medium">/mês</span></div>
                             <ul className="space-y-4 mb-8">
                               {[1,2,3,4].map(f => (
                                 <li key={f} className="flex items-center gap-3 text-zinc-300 text-sm">
                                   <CheckCircle2 size={16} style={{ color: formData.primaryHex }} /> Funcionalidade principal {f}
                                 </li>
                               ))}
                             </ul>
                             <button style={plan.highlight ? { backgroundColor: formData.primaryHex, color: 'black' } : { backgroundColor: 'transparent', color: 'white', borderColor: 'white' }} className={`w-full py-4 rounded-xl font-bold border transition-colors ${plan.highlight ? 'hover:brightness-110 border-transparent' : 'hover:bg-white hover:text-black'}`}>
                               Assinar Agora
                             </button>
                           </div>
                         ))}
                      </div>
                    </section>
                  )}

                  {formData.sections.faq && (
                    <section className="p-16 lg:px-24 py-20 bg-[#121212] flex flex-col items-center">
                      <h2 className="text-3xl font-bold text-white mb-12 text-center">Dúvidas Frequentes</h2>
                      <div className="w-full max-w-3xl space-y-4">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="bg-[#0a0a0a] p-6 rounded-2xl border border-zinc-800 flex justify-between items-center cursor-pointer hover:border-zinc-700 transition-colors">
                            <h4 className="text-white font-medium">Qual é a objeção ou dúvida comum {i}?</h4>
                            <ChevronDown className="text-zinc-600" />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {formData.sections.contact && (
                    <section className="p-16 lg:px-24 py-20 bg-[#0a0a0a] flex flex-col items-center relative overflow-hidden">
                      <div style={{ backgroundColor: formData.primaryHex }} className="absolute bottom-0 right-0 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none opacity-[0.03]"></div>
                      <h2 className="text-4xl font-bold text-white mb-4 text-center">Vamos impulsionar o seu negócio?</h2>
                      <p className="text-zinc-500 mb-12 text-center max-w-xl">Entre em contato hoje. Descubra como a nossa solução exclusiva para o nicho de {formData.niche || 'atuação'} vai aumentar a sua conversão.</p>
                      
                      <div className="w-full max-w-xl bg-[#121212] border border-zinc-800 p-8 rounded-3xl z-10 shadow-2xl relative">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                             <input type="text" placeholder="Nome Completo" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-zinc-600 transition-colors text-sm" />
                             <input type="text" placeholder="Empresa" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-zinc-600 transition-colors text-sm" />
                          </div>
                          <input type="email" placeholder="E-mail Corporativo" className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-zinc-600 transition-colors text-sm" />
                          <textarea placeholder="Fale um pouco sobre o seu desafio atual..." className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-zinc-600 transition-colors h-32 resize-none text-sm"></textarea>
                          <button style={{ backgroundColor: formData.primaryHex }} className="w-full py-4 rounded-xl text-black font-extrabold text-base mt-2 transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(46,255,0,0.15)] flex items-center justify-center gap-2">
                            Enviar Solicitação <ArrowRight size={18} />
                          </button>
                        </div>
                      </div>
                    </section>
                  )}
                  
                  <section className="p-12 bg-[#121212] border-t border-zinc-800 flex flex-col items-center text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Gostou do wireframe?</h3>
                    <p className="text-zinc-400 mb-8 max-w-md">Isso é apenas um mock inicial. Use o prompt extraído acima e gere o conteúdo em um AI para implementar com código perfeito.</p>
                    <button onClick={handleAcceptProposal} className="bg-white hover:bg-zinc-200 text-black font-black px-12 py-5 rounded-xl flex items-center gap-3 transition-all transform hover:scale-105 shadow-[0_10px_40px_rgba(255,255,255,0.1)] text-lg uppercase tracking-wider">
                      <Rocket size={24} /> Aceitar e Avançar
                    </button>
                  </section>
                </div>
              </div>
            </div>
          )}

          {currentView === 'brand-pdf' && (
            <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-500 pb-12">
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Palette style={{ color: formData.primaryHex }}/> Identidade da Marca (PDF)</h2>
                 </div>
                 <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors border border-zinc-700">
                    <Download size={16} /> Baixar PDF
                 </button>
               </div>
               <div className="bg-[#121212] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                 <div className="bg-[#0a0a0a] p-12 border-b border-zinc-800 text-center relative overflow-hidden">
                    <div style={{ backgroundColor: formData.primaryHex }} className="w-16 h-16 rounded-xl mx-auto mb-6 flex items-center justify-center text-black"><Sparkles size={32} /></div>
                    <h1 className="text-4xl font-black text-white mb-2">{formData.companyName || 'Sua Empresa'}</h1>
                    <p className="text-zinc-500 uppercase tracking-[0.3em] text-sm font-bold">Brandbook & Identidade Visual</p>
                 </div>
                 <div className="p-8 bg-[#0a0a0a] border-t border-zinc-800 flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Aprovar Identidade Visual e Site</h3>
                    <button onClick={handleAcceptProposal} style={{ backgroundColor: formData.primaryHex }} className="text-black font-black px-10 py-4 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 text-lg hover:brightness-110">
                      <CheckCircle2 size={24} /> Aceitar Todos os Itens
                    </button>
                 </div>
               </div>
            </div>
          )}

          {currentView === 'success' && (
            <div className="h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-500 text-center px-4">
              <div style={{ backgroundColor: `${formData.primaryHex}33` }} className="w-24 h-24 rounded-full flex items-center justify-center mb-8 relative">
                <Rocket size={48} style={{ color: formData.primaryHex }} className="relative z-10" />
              </div>
              <h1 className="text-4xl font-black text-white mb-4">Projeto no Ar! 🚀</h1>
              <p className="text-xl text-zinc-400 mb-8 max-w-lg">A proposta foi aceita com sucesso.</p>
              <button onClick={() => navigateTo('leads')} className="text-zinc-500 hover:text-white transition-colors underline text-sm">
                Voltar à Busca de Leads
              </button>
            </div>
          )}

        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
        @keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }
      `}} />
    </div>
  );
}
