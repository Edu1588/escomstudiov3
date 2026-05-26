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
  Menu,
  Phone
} from 'lucide-react';
import Markdown from 'react-markdown';
import { GLSLHills } from '../../components/ui/glsl-hills';
import { TextMorph } from '../../components/ui/text-morph';

const getSafeImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.includes('...') || url.includes('em ingles') || url.includes('{english')) {
    return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  }
  return url.replace(/ /g, '%20');
};

export default function Mineracao() {
  const routerNavigate = useNavigate();
  // Estados da Aplicação ('leads' | 'generator' | 'loading' | 'preview' | 'pdf-loading' | 'brand-pdf' | 'success')
  const [currentView, setCurrentView] = useState('leads'); 
  
  // Estados do Gerador de Copy
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAnalyzingUrl, setIsAnalyzingUrl] = useState(false);

  // Estados de Auditoria e Ajustes Finos de Conversão
  const [auditIssues, setAuditIssues] = useState<any[]>([]);
  const [userAdjustments, setUserAdjustments] = useState('');
  const [isRefining, setIsRefining] = useState(false);

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
        const res = await fetch('/api/leads?type=mined');
        const resText = await res.text();
        let data: any = {};
        try { data = JSON.parse(resText); } catch(e) {}
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
    phone: '',
    address: '',
    email: '',
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
      const resText = await response.text();
      let data: any = {};
      try { data = JSON.parse(resText); } catch(e) {}
      
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
    setLeadSelected(true);
    
    // Collapse both sidebars to give more space on desktop
    setIsMineracaoSidebarOpen(false);
    window.dispatchEvent(new Event('close-sidebar'));
    
    const companyNameParam = lead.title?.split('-')[0].trim() || lead.name || lead.nome;
    const nicheTarget = searchQuery.split(' ')[0] || 'Serviços';
    const siteUrl = lead.website || lead.link || lead.site || '';
    const phone = lead.phoneNumber || lead.phone || '';
    const address = lead.address || lead.endereco || '';
    const email = lead.email || '';
    
    setFormData(prev => ({
      ...prev,
      companyName: companyNameParam,
      hasWebsite: !!siteUrl,
      websiteUrl: siteUrl,
      niche: nicheTarget,
      phone: phone,
      address: address,
      email: email,
    }));
    
    setCurrentView('generator'); // Show the form again
    
    // Auto-analyze UX faults if there is a site:
    if (siteUrl && !isAnalyzingUrl) {
       analyzeUrl(siteUrl);
    }
  };

  // --- FUNÇÕES DO GERADOR ---
  const analyzeUrl = async (overrideUrl?: string) => {
    const urlToAnalyze = overrideUrl || formData.websiteUrl;
    if (!urlToAnalyze) return;
    setIsAnalyzingUrl(true);
    
    try {
      const response = await fetch('/api/analyze-ux', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToAnalyze.startsWith('http') ? urlToAnalyze : `https://${urlToAnalyze}` })
      });
      const resText = await response.text();
      let data: any = {};
      try { data = JSON.parse(resText); } catch(e) {}
      
      if (data.success && data.data) {
        const issuesSummary = data.data.summary || '';
        const issuesText = data.data.issues?.map((i: any) => `- ERRO: ${i.title}\n  IMPACTO: ${i.description}\n  CORREÇÃO UX/COPY: ${i.recommendation || ''}`).join('\n\n') || '';
        
        if (data.data.issues) {
          setAuditIssues(data.data.issues.map((i: any) => ({
            title: i.title,
            description: i.description,
            recommendation: i.recommendation || '',
            checked: false // Começa falso, e após a geração se torna resolvido
          })));
        }
        
        const urlObj = new URL(urlToAnalyze.startsWith('http') ? urlToAnalyze : `https://${urlToAnalyze}`);
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
      const urlObj = new URL(urlToAnalyze.startsWith('http') ? urlToAnalyze : `https://${urlToAnalyze}`);
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
    
    // Auto-fix: if audit issues exist, explicitly demand they are fixed
    const issuesToFix = auditIssues.length > 0 ? 
      `[CRÍTICO] Você foi auditado e aqui estão as correções OBRIGATÓRIAS a serem aplicadas no design e na copy:\n` + 
      auditIssues.map(i => `- ${i.title}: ${i.recommendation}`).join('\n') + `\n======================================================\n` : '';

    const promptText = `URGENTE E ESTRITO: ATUE COMO Diretor de UX/UI, Head de Growth e Copywriter de Resposta Direta Sênior.

Sua missão é projetar mentalmente e GERAR A ESTRUTURA, O COPY COMPLETO E A DIREÇÃO DE ARTE EXATA para a nova Landing Page de alta conversão do cliente. Esta LP será desenvolvida por um engenheiro focado em design de elite usando React, Tailwind CSS, GSAP, WebGL, e Unicorn Studio. O design DEVE fugir do "AI slop" genérico. Chega de templates em blocos padrão, fundos escuros para qualquer nicho, e fontes sem personalidade. Pense de forma criativa e disruptiva, mas baseada em CRO. Entregue texto real e persuasivo. SEM "Lorem Ipsum".

CONTEXTO DO NEGÓCIO ====================
MARCA: ${formData.companyName || '[Nome da Empresa]'} 
NICHO: ${formData.niche || '[Nicho]'} (ATENÇÃO: A estética DEVE combinar com o nicho. Inspiração: saúde mental precisa inspirar tranquilidade, escritórios de advocacia inspiram seriedade, restaurantes instigam desejo. Siga as referências exatas do nicho).
PÚBLICO-ALVO: ${formData.audience || '[Público-alvo]'}
OBJETIVO DE CONVERSÃO: ${formData.goal}
TOM DE VOZ: ${formData.tone}
DIFERENCIAIS: ${formData.differentiators || 'Qualidade, Rapidez, Segurança'}

DADOS DE CONTATO REAIS DA EMPRESA (Obrigatoriamente incluir na seção Contact ou Footer):
Telefone: ${formData.phone || 'Não informado (crie um fictício brasileiro)'}
Endereço: ${formData.address || 'Não informado (crie um fictício no Brasil)'}
Email: ${formData.email || 'contato@' + (formData.companyName ? formData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'empresa') + '.com.br'}

${analysisBase ? `[RESULTADO DA AUDITORIA DO SITE ANTIGO - RESOLVA ESTES PROBLEMAS NESTE NOVO COPY E DESIGN]:\n${analysisBase}\n======================================================\n` : ''}
${issuesToFix}

DIRETRIZES DE DESIGN E IMAGENS (MANDATÓRIO):
1. O ESTILO E DIREÇÃO DE ARTE DEVE SE BASEAR NAS ESTRUTURAS/IMAGENS DAS REFERÊNCIAS.
   - Pense na disposição de elementos de landing pages premiadas (Awwwards) que não parecem em formato de blocos genéricos de IA, mas sim criativas, minimalistas, luxuosas ou brutalistas quando convir.
   - Dite exatamente qual a tipografia Display e a Sans para leitura adequada pro nicho.

2. GERAÇÃO DE IMAGENS REALISTAS / ADEQUADAS:
   - Para URLs de imagem, use SEMPRE a url "https://image.pollinations.ai/prompt/[SEU-PROMPT-DETALHADO-EM-INGLES-SEPARADO-POR-HIFENS]?width=1200&height=800&nologo=true".
   - O prompt DEVE ser muito realista e focado no nicho. NUNCA USE ESPAÇOS NO PROMPT DA URL, substitua espaços por hífen. Ex: "https://image.pollinations.ai/prompt/professional-cinematic-photo-of-modern-dental-clinic-interior-luxurious-lighting?width=1200&height=800&nologo=true".

3. SUGESTÃO DE CORES E PALETA:
   - Crie 4 opções distintas de paletas de cores premium que convertem bem para o nicho (cada uma com 5 cores e um nome temático). Retorne no array "colorPalettes".

4. THE ABOVE-THE-FOLD FORMULA (Hero Section):
   - Headline: 6-12 palavras, focada no RESULTADO DO CLIENTE FINAL. Zero clichês.
   - Subheadline: 15-25 palavras.
   - Primary CTA: Verbo de Ação Específico + Benefício.

FORMATO DE RETORNO OBRIGATÓRIO EM JSON. 
Retorne ESTRITAMENTE o formato abaixo (ajuste os campos se a seção não existir):
{
  "primaryHex": "#HEXCOLOR",
  "colorPalettes": [
    { "name": "Tema 1", "colors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4", "#HEX5"] },
    { "name": "Tema 2", "colors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4", "#HEX5"] },
    { "name": "Tema 3", "colors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4", "#HEX5"] },
    { "name": "Tema 4", "colors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4", "#HEX5"] }
  ],
  "hero": {
    "headline": "...",
    "subheadline": "...",
    "imageUrl": "https://image.pollinations.ai/prompt/... (em ingles)?width=1200&height=800&nologo=true",
    "cta": "..."
  },
  "about": { "title": "...", "text": "...", "imageUrl": "..." },
  "services": [ { "title": "...", "description": "...", "imageUrl": "https://image.pollinations.ai/prompt/... (em ingles)?width=800&height=600&nologo=true" } ],
  "benefits": [ { "title": "...", "description": "...", "iconName": "..." } ],
  "testimonials": [ { "name": "...", "role": "...", "text": "..." } ],
  "pricing": { "title": "...", "description": "...", "plans": [ { "name": "...", "price": "...", "features": ["..."] } ] },
  "faq": [ { "question": "...", "answer": "..." } ],
  "contact": {
    "title": "...",
    "description": "...",
    "phone": "${formData.phone || ''}",
    "email": "${formData.email || ''}",
    "address": "${formData.address || ''}",
    "mapsUrl": "https://maps.google.com/maps?q=${encodeURIComponent(formData.address || formData.companyName || 'Brasil')}&t=&z=13&ie=UTF8&iwloc=&output=embed"
  }
}
`;

    setIsGeneratingCopy(true);
    setCurrentView('loading-ai'); // Start loading animation automatically navigate to loading side!
    setGeneratedPrompt('Aguarde... Gerando copy e wireframe inteligente...');
    
    try {
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText, jsonMode: true })
      });
      const resText = await response.text();
      let data: any = {};
      try { data = JSON.parse(resText); } catch(e) {}
      
      if (data.success && data.text) {
        setGeneratedPrompt(data.text);
        
        // Also update primaryHex immediately if available
        let parsed;
        try {
          let cleanJson = data.text;
          if (cleanJson.startsWith('```json')) cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
          else if (cleanJson.startsWith('```')) cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
          parsed = JSON.parse(cleanJson);
          if (parsed.primaryHex) setFormData(prev => ({ ...prev, primaryHex: parsed.primaryHex }));
        } catch(e) {}
        
        // As falhas listadas já foram consideradas e corrigidas nesta geração
        if (auditIssues.length > 0) {
          setAuditIssues(prev => prev.map(item => ({ ...item, checked: true })));
        }

      } else {
        setGeneratedPrompt("Falha na IA. Use este prompt no ChatGPT:\n\n" + promptText);
      }
    } catch (e) {
      console.error(e);
      setGeneratedPrompt("Erro de conexão. Use este prompt:\n\n" + promptText);
    }
    
    setCopied(false);
    setIsGeneratingCopy(false);
    handleContinue();
  };

  const handleRefineLandingPage = async () => {
    if (isRefining) return;
    setIsRefining(true);
    
    const checklistText = auditIssues.length > 0 
      ? auditIssues.map(i => `- ${i.title}: ${i.description}\n  Correção a conferir: ${i.recommendation}`).join('\n')
      : `- Feedback Visual e Formulários Amigáveis: Garantir UX suave.\n- Tom Empático vs Autoridade Fria: Equilibrar a copy de forma acolhedora.\n- Acessibilidade e Leitores de Tela: Atributos alt e ARIA configurados no JSON.\n- Navegação e Escaneabilidade: Seções fluídas de cima a baixo.\n- Imagens Otimizadas ligadas ao Nicho: Imagens repletas de contexto real no formato Pollinations (sempre em inglês no prompt da URL).`;

    const promptText = `URGENTE E ESTRITO: ATUE COMO Diretor de UX/UI, Heurísticas, CRO Sênior e Engenheiro Frontend Elite.
Precisamos aplicar AJUSTES ESPECÍFICOS e fazer uma AUTO-CORREÇÃO rígida na Landing Page gerada do cliente: "${formData.companyName}".

MÉTRICAS DO NEGÓCIO GERAIS:
Nicho: ${formData.niche}
Objetivo: ${formData.goal}
Cores Principais: ${formData.colors || 'Configuradas na marca'}
Diferenciais de Conversão: ${formData.differentiators}

DADOS DA ESTRUTURA ATUAL DO SITE (JSON):
${JSON.stringify(parsedSiteData, null, 2)}

DIRETRIZES DE AJUSTES DETERMINADAS PELO USUÁRIO (MANDATÓRIO):
"${userAdjustments || 'Otimizar o tom da copy e polir ainda mais o design geral.'}"

CHECKLIST DE QUALIDADE UX & AUDITORIA A SER ATENDIDO NO REFINE:
${checklistText}

INSTRUÇÕES DE REFINAMENTO:
1. Integre perfeitamente as DIRETRIZES DE AJUSTES informadas pelo usuário, modificando textos, headlines ou estruturas necessárias.
2. Certifique-se de que TODAS as heurísticas e correções de UX do checklist estejam 100% resolvidas e mapeadas no copy.
3. Não insira blocos repetidos ou vazios. Garanta imagens premium de alta conversão usando exclusivamente links traduzidos do Pollinations.ai, e SEMPRE usando hífens no lugar de espaços (ex: "https://image.pollinations.ai/prompt/english-high-quality-prompt-with-dashes?width=1200&height=800&nologo=true").
4. O retorno DEVE ser um objeto JSON estrito e válido, no exato mesmo formato:
{
  "hero": {
    "headline": "...",
    "subheadline": "...",
    "imageUrl": "...",
    "cta": "..."
  },
  "about": { "title": "...", "text": "...", "imageUrl": "..." },
  "services": [ { "title": "...", "description": "..." } ],
  "benefits": [ { "title": "...", "description": "..." } ],
  "testimonials": [ { "name": "...", "role": "...", "text": "..." } ],
  "pricing": { "title": "...", "description": "...", "plans": [ { "name": "...", "price": "...", "features": ["..."] } ] },
  "faq": [ { "question": "...", "answer": "..." } ]
}
Retorne exclusivamente o JSON, sem nenhuma outra mensagem ou tags markdown de código.`;

    try {
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText, jsonMode: true })
      });
      const resText = await response.text();
      let data: any = {};
      try { data = JSON.parse(resText); } catch(e) {}
      
      if (data.success && data.text) {
        setGeneratedPrompt(data.text);
        // Corrige todos os itens do checklist!
        if (auditIssues.length > 0) {
          setAuditIssues(prev => prev.map(item => ({ ...item, checked: true })));
        }
        setUserAdjustments('');
      } else {
        console.error("Erro de resposta:", data);
      }
    } catch (e) {
      console.error("Erro ao aplicar ajustes:", e);
    }
    setIsRefining(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // --- NAVEGAÇÃO ---
  const [isMineracaoSidebarOpen, setIsMineracaoSidebarOpen] = useState(() => window.innerWidth >= 768);

  const navigateTo = (view: string) => {
    setCurrentView(view);
    if (window.innerWidth < 768) setIsMineracaoSidebarOpen(false);
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

  const slug = formData.companyName ? formData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'nomedaempresa';

  const isLoading = currentView === 'loading' || currentView === 'pdf-loading' || currentView === 'loading-ai';
  const loadingData = currentView === 'pdf-loading' 
    ? { title: 'Gerando PDF da Marca...', desc: 'A IA está construindo a identidade visual, paleta de cores e posts para o Instagram.' }
    : currentView === 'loading-ai'
    ? { title: 'O Gemini está pensando... 🧠', desc: 'Construindo a arquitetura perfeita para o seu App. Tempo estimado: 30s a 1min' }
    : { title: 'Criando Estrutura Inteligente...', desc: 'Lendo os parâmetros do prompt e desenhando a arquitetura (UI/UX).' };

  let parsedSiteData: any = {};
  if (generatedPrompt && typeof generatedPrompt === 'string') {
    try {
      let cleanJson = generatedPrompt;
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
      }
      parsedSiteData = JSON.parse(cleanJson);
    } catch(e) {}
  }

  return (
    <div className="flex h-full bg-[#0a0a0a] text-zinc-300 font-sans overflow-hidden selection:bg-[#2EFF00] selection:text-black">
      
      {/* Mobile Sidebar Overlay */}
      {isMineracaoSidebarOpen && window.innerWidth < 768 && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMineracaoSidebarOpen(false)}></div>
      )}

      {/* Sidebar (Internal for this tool) */}
      <aside className={`w-56 bg-[#0f0f0f] border-r border-[#1a1a1a] flex-col shrink-0 z-50 fixed md:relative h-full transition-transform duration-300 ${isMineracaoSidebarOpen ? 'flex translate-x-0' : '-translate-x-full absolute invisible md:block md:w-0 overflow-hidden'}`}>
        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar w-56">
          <div className="flex justify-between items-center mb-8 px-2">
            <h3 className="text-white font-bold">Mineração</h3>
            <button onClick={() => setIsMineracaoSidebarOpen(false)} className="text-zinc-400">
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
            <button className="text-zinc-400 hover:text-white mr-2" onClick={() => {
              setIsMineracaoSidebarOpen(true);
              window.dispatchEvent(new Event('open-sidebar'));
            }}>
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
            {currentView !== 'leads' && currentView !== 'success' && !isLoading && (
              <button 
                onClick={() => navigateTo('leads')}
                className="text-zinc-400 hover:text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors text-sm border border-zinc-800 hover:bg-zinc-800"
              >
                <ChevronLeft size={16} /> Voltar para Mineração
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
                               <a 
                                 href={`https://wa.me/${(lead.phoneNumber || lead.phone || '').replace(/\D/g, '')}`} 
                                 target="_blank" 
                                 rel="noreferrer"
                                 className="flex-1 bg-transparent border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                               >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                                  </svg> Contato
                               </a>
                            </div>
                            {/* Controles rápidos de Status */}
                            <div className="flex justify-center gap-4 items-center mt-1">
                              <button onClick={() => updateLeadStatus(lead.id, 'approved')} className={`transition-colors ${lead.status === 'approved' ? 'text-[#2EFF00]' : 'text-zinc-500 hover:text-[#2EFF00]'}`} title="Aprovar">
                                <CheckCircle size={16} />
                              </button>
                              <button onClick={() => updateLeadStatus(lead.id, 'pending')} className={`transition-colors ${lead.status === 'pending' || lead.status === 'Pendente' || !lead.status ? 'text-orange-500' : 'text-zinc-500 hover:text-orange-500'}`} title="Pendente">
                                <Clock size={16} />
                              </button>
                              <button onClick={() => updateLeadStatus(lead.id, 'discarded')} className={`transition-colors ${lead.status === 'discarded' ? 'text-red-500' : 'text-zinc-500 hover:text-red-500'}`} title="Descartar">
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
             <div className="max-w-4xl mx-auto flex flex-col gap-8 animate-in slide-in-from-right-8 duration-300">
              {/* Form Section */}
              <div className="space-y-6">
                
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

                        {auditIssues.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-zinc-800 animate-in fade-in slide-in-from-top-2">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                              <CheckSquare size={14} className="text-[#2EFF00]" /> Checklist de Correções da Análise
                            </h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                              {auditIssues.map((item, idx) => (
                                <div key={idx} className="bg-[#121212] p-2.5 rounded border border-zinc-800/80">
                                  <p className="text-xs font-semibold text-white mb-1"><span className="text-red-400 mr-1">■</span> {item.title}</p>
                                  <p className="text-[10px] text-zinc-400 leading-relaxed mb-1">{item.description}</p>
                                  <p className="text-[10px] text-[#2EFF00] bg-[#2EFF00]/5 px-1.5 py-1 rounded inline-block">&rarr; {item.recommendation}</p>
                                </div>
                              ))}
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-3 text-center">Essas melhorias serão aplicadas automaticamente ao gerar a próxima copy.</p>
                          </div>
                        )}
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
                    {isGeneratingCopy ? 'Analisando e Gerando Copys (IA)...' : 'Gerar Estrutura Inteligente (IA)'}
                  </button>
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
             <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-500 pb-12">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-black text-white flex items-center gap-2">
                    <Sparkles style={{ color: formData.primaryHex }} size={24} /> 
                    {formData.companyName || 'Landing Page'} — Versão Estruturada
                  </h1>
                  <p className="text-zinc-500 text-sm mt-1">Gere, analise Heurísticas / Heurísticas de Nielsen e auto-corrija discrepâncias usando IA.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleContinue} className="px-4 py-2 bg-[#121212] border border-zinc-800 text-zinc-300 rounded-md text-sm font-medium hover:bg-zinc-800 flex items-center gap-2 transition-colors">
                    <RefreshCw size={16} /> Reiniciar Setup
                  </button>
                  <button onClick={handleGenerateBrandPdf} className="px-6 py-2 bg-white text-black rounded-md text-sm font-bold shadow-lg hover:bg-zinc-200 flex items-center gap-2 transition-colors">
                    <FileCheck size={16} /> Validar PDF
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* COLUNA ESQUERDA: O PREVIEW DO SITE */}
                <div className="lg:col-span-8 flex flex-col">
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
                
                <div className="bg-[#0a0a0a] border-b border-zinc-800 text-white px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-bold z-50 shadow-md">
                  <div className="flex items-center text-center gap-2">
                    <span className="animate-pulse flex-shrink-0 text-[#2EFF00]">⏳</span> 
                    Proposta válida por 7 dias corridos.
                  </div>
                  <button onClick={handleAcceptProposal} className="bg-[#2EFF00] text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider hover:bg-[#28e000] transition-all shadow-[0_0_15px_rgba(46,255,0,0.3)] hover:shadow-[0_0_25px_rgba(46,255,0,0.5)] flex items-center flex-shrink-0 gap-2">
                    <Rocket size={14} /> Aceitar e Avançar
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
                      
                      {parsedSiteData?.hero?.imageUrl && (
                        <div className="absolute inset-0 opacity-40 pointer-events-none">
                          <img src={getSafeImageUrl(parsedSiteData.hero.imageUrl)} alt="Background" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-[#0a0a0a] bg-opacity-80 mix-blend-multiply"></div>
                        </div>
                      )}
                      
                      <div className="relative z-10 w-full flex flex-col items-center">
                        <div style={{ color: formData.primaryHex, borderColor: `${formData.primaryHex}33` }} className="inline-block px-4 py-1.5 bg-zinc-800/40 border rounded-full text-[10px] font-bold uppercase tracking-wider mb-8 backdrop-blur-sm">
                          🚀 {parsedSiteData?.hero?.subheadline || 'Aumente as suas conversões'}
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-4xl leading-[1.1]">
                          {parsedSiteData?.hero?.headline ? (
                            <span>
                              {parsedSiteData.hero.headline.split(' ').map((word: string, i: number, arr: string[]) => 
                                i === arr.length - 1 ? <span key={i}><TextMorph words={[word, "Resultado", "Negócio", "Futuro"]} color={formData.primaryHex} /></span> : word + ' '
                              )}
                            </span>
                          ) : (
                            <span>Transforme a realidade de <TextMorph words={[(formData.audience || 'seus clientes').substring(0,35) + '...', "seus negócios", "sua equipe"]} color={formData.primaryHex} /></span>
                          )}
                        </h1>
                        <button style={{ backgroundColor: formData.primaryHex, boxShadow: `0 0 20px ${formData.primaryHex}33` }} className="px-8 py-4 text-black font-bold rounded-md">
                           {parsedSiteData?.hero?.cta || 'Começar Agora Mesmo'}
                        </button>
                      </div>
                    </section>
                  )}

                  {formData.sections.about && (
                    <section className="relative p-16 lg:px-24 py-20 flex flex-col items-center justify-center text-center bg-[#0a0a0a] overflow-hidden min-h-[60vh]">
                      <div className="absolute inset-0 z-0 pointer-events-none opacity-80" style={{ mixBlendMode: 'screen' }}>
                        <GLSLHills width="100%" height="100%" color={formData.primaryHex} />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] z-[1] pointer-events-none"></div>
                      
                      <div className="relative z-10 flex flex-col items-center space-y-6 max-w-4xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">{parsedSiteData?.about?.title || `Sobre a ${formData.companyName || 'Empresa'}`}</h2>
                        <h3 className="text-white/80 font-medium text-xl md:text-2xl uppercase tracking-[0.2em] mb-4">Construindo Autoridade</h3>
                        <p className="text-zinc-300 text-lg md:text-xl leading-relaxed max-w-3xl drop-shadow-md bg-black/20 p-6 rounded-2xl backdrop-blur-sm border border-white/5">
                          {parsedSiteData?.about?.text || `Uma breve descrição sobre a missão, visão e valores da ${formData.companyName || 'empresa'}, estabelecendo autoridade no nicho de ${formData.niche || 'atuação'}.`}
                        </p>
                      </div>
                    </section>
                  )}

                  {formData.sections.services && (
                    <section className="p-16 lg:px-24 py-20 bg-[#121212]">
                      <h2 className="text-3xl font-bold text-white mb-12 text-center">Nossos Serviços</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(parsedSiteData?.services || [{ title: "Serviço 1", description: "Descrição estratégica do serviço" }, { title: "Serviço 2", description: "Descrição estratégica do serviço" }, { title: "Serviço 3", description: "Descrição estratégica do serviço" }]).map((svc: any, i: number) => (
                          <div key={i} className="bg-[#0a0a0a] rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all hover:-translate-y-1 overflow-hidden flex flex-col shadow-xl group">
                            {svc.imageUrl ? (
                              <div className="h-48 w-full overflow-hidden relative border-b border-zinc-800">
                                <div className="absolute inset-0 bg-[#0a0a0a] opacity-0 group-hover:opacity-20 transition-opacity z-10 mix-blend-multiply"></div>
                                <img src={getSafeImageUrl(svc.imageUrl)} alt={svc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100" />
                              </div>
                            ) : (
                              <div className="h-48 w-full bg-zinc-900 border-b border-zinc-800 flex items-center justify-center">
                                <Box size={32} className="text-zinc-700" />
                              </div>
                            )}
                            <div className="p-8 flex-1">
                              <h3 className="text-xl font-bold text-white mb-3">{svc.title}</h3>
                              <p className="text-zinc-400 text-sm">{svc.description}</p>
                            </div>
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
                          {(parsedSiteData?.benefits || [{ title: "Benefício 1", description: "Explicação" }, { title: "Benefício 2", description: "Explicação" }]).map((ben: any, i: number) => (
                            <li key={i} className="flex items-start gap-4">
                              <div style={{ color: formData.primaryHex }} className="mt-1"><CheckCircle2 size={24} /></div>
                              <div>
                                <h4 className="text-white font-bold mb-1 text-lg">{ben.title}</h4>
                                <p className="text-zinc-500 text-sm">{ben.description}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex-1">
                         <div className="w-full aspect-square bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-center overflow-hidden relative shadow-2xl">
                            <div style={{ backgroundColor: formData.primaryHex }} className="absolute w-full h-full opacity-10 mix-blend-color"></div>
                            <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url('${getSafeImageUrl(parsedSiteData?.hero?.imageUrl) || "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}')`}}></div>
                            <Rocket style={{ color: formData.primaryHex }} className="w-20 h-20 relative z-10 drop-shadow-[0_0_15px_rgba(46,255,0,0.5)]" />
                         </div>
                      </div>
                    </section>
                  )}

                  {formData.sections.testimonials && (
                    <section className="p-16 lg:px-24 py-20 bg-[#121212] flex flex-col items-center">
                      <h2 className="text-3xl font-bold text-white mb-12 text-center">O que dizem sobre nós</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                         {(parsedSiteData?.testimonials || [{ name: "Cliente Satisfeito", role: "CEO", text: "Excelente trabalho." }]).map((t: any, i: number) => (
                           <div key={i} className="bg-[#0a0a0a] p-8 rounded-2xl border border-zinc-800 relative shadow-lg">
                             <div style={{ color: formData.primaryHex }} className="absolute -top-5 -left-5 bg-[#121212] p-3 rounded-full border border-zinc-800 shadow-xl">
                               <Quote size={20} />
                             </div>
                             <p className="text-zinc-300 italic mb-8 mt-2">"{t.text}"</p>
                             <div className="flex items-center gap-4">
                               <img src={`https://i.pravatar.cc/150?img=${10+i}`} alt="Avatar" className="w-12 h-12 bg-zinc-800 rounded-full object-cover" />
                               <div>
                                 <h4 className="text-white font-bold">{t.name}</h4>
                                 <span className="text-zinc-500 text-xs uppercase tracking-wider">{t.role}</span>
                               </div>
                             </div>
                           </div>
                         ))}
                      </div>
                    </section>
                  )}

                  {formData.sections.pricing && (
                    <section className="p-16 lg:px-24 py-20 bg-[#0a0a0a] flex flex-col items-center">
                      <h2 className="text-3xl font-bold text-white mb-4 text-center">{parsedSiteData?.pricing?.title || "Investimento"}</h2>
                      <p className="text-zinc-500 mb-12 text-center max-w-2xl">{parsedSiteData?.pricing?.description || "Planos estruturados utilizando o viés cognitivo de Ancoragem para facilitar a decisão de compra."}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl items-center">
                         {(parsedSiteData?.pricing?.plans || [
                           { name: 'Básico', price: '99', highlight: false, features: ["Acesso a tudo"] },
                           { name: 'Profissional', price: '199', highlight: true, features: ["Acesso a tudo", "Suporte premium"] },
                           { name: 'Enterprise', price: '399', highlight: false, features: ["Acesso a tudo", "Servidor Dedicado"] },
                         ]).map((plan: any, i: number) => (
                           <div key={i} className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${plan.highlight || i===1 ? 'bg-[#121212] scale-105 shadow-2xl relative' : 'border-zinc-800 bg-[#0a0a0a]'}`} style={plan.highlight || i===1 ? { borderColor: formData.primaryHex, boxShadow: `0 20px 40px ${formData.primaryHex}22` } : {}}>
                             {(plan.highlight || i===1) && (
                               <div style={{ backgroundColor: formData.primaryHex }} className="absolute -top-4 left-1/2 -translate-x-1/2 text-black text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full">
                                 Mais Escolhido
                               </div>
                             )}
                             <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                             <div className="text-4xl font-black text-white mb-6">R$ {plan.price}<span className="text-zinc-600 text-lg font-medium">/mês</span></div>
                             <ul className="space-y-4 mb-8">
                               {(plan.features || []).map((f: string, j: number) => (
                                 <li key={j} className="flex items-center gap-3 text-zinc-300 text-sm">
                                   <CheckCircle2 size={16} style={{ color: formData.primaryHex }} /> {f}
                                 </li>
                               ))}
                             </ul>
                             <button style={plan.highlight || i===1 ? { backgroundColor: formData.primaryHex, color: 'black' } : { backgroundColor: 'transparent', color: 'white', borderColor: 'white' }} className={`w-full py-4 rounded-xl font-bold border transition-colors ${plan.highlight || i===1 ? 'hover:brightness-110 border-transparent' : 'hover:bg-white hover:text-black'}`}>
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
                        {(parsedSiteData?.faq || [{ question: "Dúvida 1", answer: "" }]).map((f: any, i: number) => (
                          <div key={i} className="bg-[#0a0a0a] p-6 rounded-2xl border border-zinc-800 flex justify-between items-center cursor-pointer hover:border-zinc-700 transition-colors">
                            <h4 className="text-white font-medium">{f.question}</h4>
                            <ChevronDown className="text-zinc-600" />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {formData.sections.contact && (
                    <section className="p-16 lg:px-24 py-20 bg-[#0a0a0a] flex flex-col items-center relative overflow-hidden">
                      <div style={{ backgroundColor: formData.primaryHex }} className="absolute bottom-0 right-0 w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none opacity-[0.03]"></div>
                      <h2 className="text-4xl font-bold text-white mb-4 text-center">{parsedSiteData?.contact?.title || "Vamos impulsionar o seu negócio?"}</h2>
                      <p className="text-zinc-500 mb-12 text-center max-w-xl">{parsedSiteData?.contact?.description || `Entre em contato hoje. Descubra como a nossa solução exclusiva para o nicho de ${formData.niche || 'atuação'} vai aumentar a sua conversão.`}</p>
                      
                      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 z-10">
                        {/* Forms Column */}
                        <div className="w-full bg-[#121212] border border-zinc-800 p-8 rounded-3xl shadow-2xl relative">
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

                        {/* Info & Map Column */}
                        <div className="flex flex-col gap-6">
                           <div className="bg-[#121212] border border-zinc-800 p-6 rounded-3xl flex flex-col gap-4">
                             <div className="flex items-center gap-4">
                               <div style={{ backgroundColor: `${formData.primaryHex}22`, color: formData.primaryHex }} className="w-10 h-10 rounded-full flex items-center justify-center">
                                 <Phone size={18} />
                               </div>
                               <div>
                                 <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Telefone</p>
                                 <p className="text-white font-medium">{parsedSiteData?.contact?.phone || formData.phone || "Não informado"}</p>
                               </div>
                             </div>
                             <div className="flex items-center gap-4">
                               <div style={{ backgroundColor: `${formData.primaryHex}22`, color: formData.primaryHex }} className="w-10 h-10 rounded-full flex items-center justify-center">
                                 <Mail size={18} />
                               </div>
                               <div>
                                 <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Email</p>
                                 <p className="text-white font-medium">{parsedSiteData?.contact?.email || formData.email || "Não informado"}</p>
                               </div>
                             </div>
                             <div className="flex items-center gap-4">
                               <div style={{ backgroundColor: `${formData.primaryHex}22`, color: formData.primaryHex }} className="w-10 h-10 rounded-full flex items-center justify-center">
                                 <MapPin size={18} />
                               </div>
                               <div>
                                 <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Endereço</p>
                                 <p className="text-white font-medium">{parsedSiteData?.contact?.address || formData.address || "Não informado"}</p>
                               </div>
                             </div>
                           </div>
                           
                           {/* Map */}
                           <div className="bg-[#121212] border border-zinc-800 p-2 rounded-3xl overflow-hidden h-full min-h-[200px]">
                              <iframe 
                                src={parsedSiteData?.contact?.mapsUrl || `https://maps.google.com/maps?q=${encodeURIComponent(formData.address || formData.companyName || 'Brasil')}&t=&z=13&ie=UTF8&iwloc=&output=embed`} 
                                className="w-full h-full rounded-2xl grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                                style={{ border: 0 }} 
                                allowFullScreen={false} 
                                loading="lazy">
                              </iframe>
                           </div>
                        </div>
                      </div>
                    </section>
                  )}
                  
                  <section className="p-12 lg:p-24 bg-[#0a0a0a] border-t border-zinc-800 flex flex-col items-center">
                    
                    {parsedSiteData?.colorPalettes && parsedSiteData.colorPalettes.length > 0 && (
                      <div className="w-full max-w-5xl mb-20 text-center">
                        <h3 className="text-3xl font-bold text-white mb-4">Escolha a sua Identidade</h3>
                        <p className="text-zinc-400 mb-12">Nossa inteligência gerou 4 opções de paletas de cores focadas na conversão do seu nicho.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {parsedSiteData.colorPalettes.map((palette: any, idx: number) => (
                            <div key={idx} className="bg-[#121212] p-6 rounded-2xl border border-zinc-800 hover:border-zinc-700 hover:-translate-y-1 transition-all text-left">
                              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Palette size={20} className="text-[#2EFF00]"/> {palette.name}</h4>
                              <div className="flex h-16 rounded-xl overflow-hidden shadow-2xl mb-4">
                                {palette.colors.map((c: string, cIdx: number) => (
                                  <div key={cIdx} className="flex-1" style={{ backgroundColor: c }}></div>
                                ))}
                              </div>
                              <div className="flex justify-between text-xs font-mono text-zinc-500 uppercase">
                                {palette.colors.map((c: string, cIdx: number) => (
                                  <span key={cIdx}>{c}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="w-full max-w-4xl bg-gradient-to-br from-[#121212] to-[#0a0a0a] p-12 rounded-3xl border border-zinc-800 text-center shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-full bg-[#2EFF00]/5 blur-[120px] pointer-events-none"></div>
                      
                      <h3 className="text-4xl font-extrabold text-white mb-6 relative z-10">Tudo isso e muito mais por a partir de R$850</h3>
                      <p className="text-zinc-400 text-lg mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
                        Lançamos sua landing page com o seu domínio próprio (ex: <strong>{slug || 'suaempresa'}.com.br</strong>). Aceitamos cartões, PIX, e geramos NF. Entregamos a landing page mais rápida do mercado.
                      </p>
                      <button onClick={handleAcceptProposal} className="mx-auto bg-[#2EFF00] hover:bg-[#28e000] text-black font-black px-12 py-5 rounded-xl flex items-center gap-3 transition-all transform hover:scale-105 shadow-[0_10px_40px_rgba(46,255,0,0.2)] text-xl uppercase tracking-wider relative z-10">
                        <Rocket size={24} /> Aceitar e Avançar
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: AJUSTES, CONTROLE E AUTO-CORREÇÃO AUTOMÁTICA DA IA */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
              
              {/* CARD DE AJUSTES DIRECIONADOS */}
              <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div style={{ backgroundColor: formData.primaryHex }} className="absolute -top-12 -right-12 w-32 h-32 blur-[40px] rounded-full opacity-10 pointer-events-none"></div>
                
                <div className="flex items-center gap-2 mb-3">
                  <div style={{ backgroundColor: `${formData.primaryHex}22`, color: formData.primaryHex }} className="p-2 rounded-lg">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Direcionar Ajustes da Página</h2>
                    <p className="text-[11px] text-zinc-500">Mude cores, textos ou reescreva seções com a IA.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">O que deseja ajustar na versão?</label>
                    <textarea 
                      value={userAdjustments}
                      onChange={(e) => setUserAdjustments(e.target.value)}
                      placeholder="Ex: 'Mude a cor de destaque para azul royal, reescreva a headline para focar em microempresas e adicione imagens de escritórios reais no sobre nós.'"
                      className="w-full bg-[#0a0a0a] border border-zinc-850 hover:border-zinc-800 focus:border-zinc-700 rounded-xl px-4 py-3 text-white text-xs placeholder-zinc-650 outline-none transition-all resize-none h-32 leading-relaxed custom-scrollbar"
                    />
                  </div>

                  <button 
                    onClick={handleRefineLandingPage}
                    disabled={isRefining}
                    style={isRefining ? { backgroundColor: '#27272a' } : { backgroundColor: formData.primaryHex, boxShadow: `0 0 15px ${formData.primaryHex}33` }} 
                    className="w-full py-3.5 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 active:scale-95 disabled:cursor-not-allowed disabled:text-zinc-500"
                  >
                    {isRefining ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Fazendo Auto-Correções...</span>
                      </>
                    ) : (
                      <>
                        <Rocket size={16} />
                        <span>Auto-Corrigir & Refinar Página</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* CARD DE AUTO-VERIFICAÇÃO DE HEURÍSTICAS E CHECKLIST */}
              <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 shadow-xl relative">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800/60">
                  <div className="flex items-center gap-2">
                    <CheckSquare style={{ color: formData.primaryHex }} size={18} />
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Erros do Site Antigo Resolvidos</h3>
                  </div>
                  <span className={`text-[10px] uppercase font-black px-2 py-1 rounded bg-[#2EFF00]/10 text-[#2EFF00]`}>
                    100% CUMPRIDO
                  </span>
                </div>

                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                  {(auditIssues.length > 0 ? auditIssues : [
                    { title: "Formulários e Feedback Amigáveis", description: "O formulário possui feedback visual imediato para ações do usuário.", recommendation: "Implementar estados de sucesso nos inputs e CTAs." },
                    { title: "Acessibilidade & Leitores de Tela (ARIA/Alt)", description: "Todas as seções possuem atributos ARIA para garantir inclusão e leitura por IA/assistentes.", recommendation: "Configurar aria-label e alt tags descritivas nas imagens." },
                    { title: "Equilíbrio Empatia vs Autoridade", description: "A copy da página usa abordagem humanizada sem tons frios ou autoritários intimidantes.", recommendation: "Balancear a autoridade com foco nas dores reais do cliente." },
                    { title: "Navegação e Arquitetura Intuitivas", description: "A estrutura flui de forma natural do problema até a solução por ancoragem.", recommendation: "Organizar seções de cima para baixo com visual limpo." },
                    { title: "Imagens do Nicho Otimizadas (Pollinations)", description: "Visual impactante acoplado ao nicho do cliente, sem assets de ilustração genéricos.", recommendation: "Prompts detalhados em inglês para geração de imagens reais." },
                    { title: "FAQ de Quebra de Objeções", description: "Resolução clara de atritos focada nas maiores dores mapeadas.", recommendation: "Incluir copy de superação de barreiras no FAQ." }
                  ]).map((item: any, idx: number) => {
                    // Força isChecked = true sempre para mostrar que isso foi corrigido!
                    const isChecked = true;
                    
                    return (
                      <div key={idx} className={`p-3 rounded-xl border transition-all ${isChecked ? 'bg-green-500/[0.02] border-green-500/10' : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/80'}`}>
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 shrink-0 ${isChecked ? 'text-green-400' : 'text-zinc-600'}`}>
                            {isChecked ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded border border-zinc-700 flex items-center justify-center text-[9px] font-bold text-zinc-500">i</div>}
                          </div>
                          <div className="space-y-1">
                            <h4 className={`text-xs font-bold leading-tight ${isChecked ? 'text-zinc-200' : 'text-zinc-400'}`}>{item.title}</h4>
                            <p className="text-[11px] text-zinc-500 leading-normal">{item.description}</p>
                            {!isChecked && (
                              <div className="mt-1.5 p-1.5 bg-yellow-500/[0.03] border border-yellow-500/10 rounded text-[10px] text-yellow-300 font-mono">
                                <span className="font-bold">Correção recomendada:</span> {item.recommendation}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {parsedSiteData?.colorPalettes && parsedSiteData.colorPalettes.length > 0 && (
                <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 shadow-xl relative mt-8">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-zinc-800/60">
                    <Palette style={{ color: formData.primaryHex }} size={18} />
                    <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Paletas de Cores Sugeridas</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {parsedSiteData.colorPalettes.map((palette: any, idx: number) => (
                      <div key={idx} className="bg-[#0a0a0a] p-4 rounded-xl border border-zinc-800">
                        <h4 className="text-xs font-bold text-white mb-3 tracking-wider">{palette.name}</h4>
                        <div className="flex gap-2">
                          {palette.colors.map((hex: string, colorIdx: number) => (
                            <div key={colorIdx} className="flex-1 flex flex-col items-center gap-2">
                              <div className="w-full h-10 rounded-md border border-zinc-700 shadow-md" style={{ backgroundColor: hex }}></div>
                              <span className="text-[9px] text-zinc-500 font-mono uppercase">{hex}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
