import React, { useState, useEffect, useRef } from "react";
import { Header } from "../components/Header";
import { Search, Plus, Clock, FileText, CheckCircle, XCircle, Download, Eye, Edit3, Trash2, Copy, Check, Sparkles, Building2, User, DollarSign, Calendar, ShieldCheck, FileCheck } from "lucide-react";
import { jsPDF } from "jspdf";

interface Contract {
  id?: string;
  title: string;
  company: string;
  personType: string;
  cnpj: string;
  address: string;
  clientName: string;
  contractorName: string;
  contractorCnpj: string;
  contractorRepresentative: string;
  serviceType: string;
  serviceObject: string;
  deliverables: string[];
  initialDeadline: string;
  finalDeadline: string;
  revisionsPolicy: string;
  revisionsPeriod: string;
  budget: string;
  budgetText: string;
  signalValue: string;
  signalText: string;
  finalValue: string;
  finalText: string;
  pixBank: string;
  pixKey: string;
  pixFavored: string;
  forumCity: string;
  contractDate: string;
  status: "ATIVO" | "FINALIZADO" | "ENCERRADO";
  createdAt?: any;
}

const DEFAULT_CONTRACT_DATA: Contract = {
  title: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS",
  company: "RASTRO VERDE",
  personType: "Pessoa Jurídica de Direito Privado",
  cnpj: "62.878.265/0001-44",
  address: "Alameda Rio Negro, 503 - CEP: 06454-000",
  clientName: "Rastro Verde",
  contractorName: "ES COM Creative Studio",
  contractorCnpj: "48.298.795/0001-92",
  contractorRepresentative: "Eduardo Tavares dos Santos",
  serviceType: "Identidade Visual & Engenharia Digital",
  serviceObject: "Prestação de serviços de Design Gráfico para o desenvolvimento de Identidade Visual (Logotipo) exclusivo para o produto SONDA SOLO, pertencente à empresa Rastro Verde.",
  deliverables: [
    "Propostas Visuais: Criação e apresentação de 03 (três) opções de logotipo para o produto Sonda Solo, cada uma com sua proposta visual distinta e original das demais.",
    "Materiais Finais (Após Aprovação): Entrega do material aberto da opção de logotipo escolhida, bem como as suas adaptações (versões com cores de destaque, fundo transparente em PNG, versão para fundo claro e escuro).",
    "Aplicações da Marca: Desenvolvimento de simulação/mockup da marca Sonda Solo em formato \"White Label\" aplicada aos produtos (ex: sensor, caixa/resskit)."
  ],
  initialDeadline: "21 de agosto de 2026, às 18:00",
  finalDeadline: "28 de agosto de 2026, às 18:00",
  revisionsPolicy: "Rodadas ilimitadas de alterações e ajustes sobre a opção de logotipo selecionada.",
  revisionsPeriod: "Entre os dias 22 e 25 de agosto de 2026.",
  budget: "R$ 1.200,00",
  budgetText: "um mil e duzentos reais",
  signalValue: "R$ 600,00",
  signalText: "seiscentos reais (50%)",
  finalValue: "R$ 600,00",
  finalText: "seiscentos reais (50%)",
  pixBank: "C6 Bank",
  pixKey: "13981062787",
  pixFavored: "Eduardo Tavares dos Santos",
  forumCity: "São Paulo - SP",
  contractDate: "20 de agosto de 2026",
  status: "ATIVO"
};

export default function Contratos() {
  const [activeTab, setActiveTab] = useState("TUDO");
  const tabs = ["TUDO", "ATIVOS", "FINALIZADOS", "ENCERRADOS"];
  
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Contract>(DEFAULT_CONTRACT_DATA);
  const [deliverablesText, setDeliverablesText] = useState(
    DEFAULT_CONTRACT_DATA.deliverables.join("\n")
  );

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contracts");
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setContracts(data.contracts || []);
      }
    } catch (e) {
      console.error("Failed to fetch contracts", e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: "ATIVO" | "FINALIZADO" | "ENCERRADO") => {
    try {
      const res = await fetch(`/api/contracts/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchContracts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteContract = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este contrato?")) return;
    try {
      const res = await fetch(`/api/contracts/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchContracts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openNewContractModal = () => {
    setEditingContract(null);
    setFormData({
      ...DEFAULT_CONTRACT_DATA,
      contractDate: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    });
    setDeliverablesText(DEFAULT_CONTRACT_DATA.deliverables.join("\n"));
    setIsModalOpen(true);
  };

  const openEditContractModal = (contract: Contract) => {
    setEditingContract(contract);
    setFormData(contract);
    setDeliverablesText((contract.deliverables || []).join("\n"));
    setIsModalOpen(true);
  };

  const openPreview = (contract: Contract) => {
    setSelectedContract(contract);
    setIsPreviewOpen(true);
  };

  const handleSaveContract = async (e: React.FormEvent) => {
    e.preventDefault();
    const deliverablesList = deliverablesText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const payload: Contract = {
      ...formData,
      deliverables: deliverablesList
    };

    try {
      if (editingContract?.id) {
        // Atualizar
        await fetch(`/api/contracts/${editingContract.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // Criar
        await fetch("/api/contracts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      fetchContracts();
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar contrato.");
    }
  };

  // Gerador de PDF Profissional
  const generatePDF = (c: Contract) => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = 22;

      const addHeader = () => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(20, 20, 20);
        doc.text(c.title.toUpperCase(), pageWidth / 2, y, { align: "center" });
        y += 8;

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text("ESCOM CREATIVE STUDIO — CONTRATO DE PRESTAÇÃO DE SERVIÇOS", pageWidth / 2, y, { align: "center" });
        y += 10;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
      };

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > 275) {
          doc.addPage();
          y = 20;
        }
      };

      addHeader();

      // Partes
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(20, 20, 20);
      doc.text("CONTRATANTE:", margin, y);
      doc.setFont("helvetica", "normal");
      const contratanteText = ` ${c.company}, ${c.personType}, inscrita no CNPJ/CPF nº ${c.cnpj}, com sede em ${c.address}.`;
      const splitContratante = doc.splitTextToSize(contratanteText, contentWidth - 30);
      doc.text(splitContratante, margin + 28, y);
      y += splitContratante.length * 5 + 3;

      checkPageBreak(15);
      doc.setFont("helvetica", "bold");
      doc.text("CONTRATADO:", margin, y);
      doc.setFont("helvetica", "normal");
      const contratadoText = ` ${c.contractorName}, pessoa jurídica inscrita no CNPJ sob o nº ${c.contractorCnpj}, representado por ${c.contractorRepresentative}.`;
      const splitContratado = doc.splitTextToSize(contratadoText, contentWidth - 28);
      doc.text(splitContratado, margin + 26, y);
      y += splitContratado.length * 5 + 5;

      checkPageBreak(15);
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);
      const preambulo = "Têm entre si justo e contratado o presente CONTRATO DE PRESTAÇÃO DE SERVIÇOS, regido pelas cláusulas e condições abaixo, bem como pela legislação civil aplicável.";
      const splitPreambulo = doc.splitTextToSize(preambulo, contentWidth);
      doc.text(splitPreambulo, margin, y);
      y += splitPreambulo.length * 4.5 + 6;

      const clauses = [
        {
          title: "CLÁUSULA PRIMEIRA - DO OBJETO",
          body: `1.1. O presente contrato tem por objeto a ${c.serviceObject}`
        },
        {
          title: "CLÁUSULA SEGUNDA - DO ESCOPO DO SERVIÇO E ENTREGAS",
          body: `2.1. O CONTRATADO compromete-se a realizar as seguintes etapas e entregas de criação:\n` +
            (c.deliverables || []).map(d => `• ${d}`).join("\n")
        },
        {
          title: "CLÁUSULA TERCEIRA - DOS PRAZOS",
          body: `3.1. O cronograma de entregas obedecerá às seguintes datas e horários limites:\n` +
            `• Opções Iniciais: Entrega até ${c.initialDeadline}.\n` +
            `• Entrega Final: Mediante aprovação de uma das opções, a entrega final ocorrerá até ${c.finalDeadline}.\n` +
            `3.2. A contagem do prazo pressupõe a confirmação do pagamento do Sinal (50%) e o envio do briefing prévio por parte da CONTRATANTE.`
        },
        {
          title: "CLÁUSULA QUARTA - DAS REVISÕES",
          body: `4.1. Ficam estabelecidas ${c.revisionsPolicy}\n` +
            `4.2. O período para solicitação e realização destes ajustes ocorrerá estritamente ${c.revisionsPeriod}`
        },
        {
          title: "CLÁUSULA QUINTA - DOS VALORES E PAGAMENTO",
          body: `5.1. Pelos serviços descritos, a CONTRATANTE pagará ao CONTRATADO o Investimento Total de ${c.budget} (${c.budgetText}), a serem pagos da seguinte forma:\n` +
            `• Sinal: ${c.signalValue} (${c.signalText}) pagos de forma antecipada no ato da assinatura deste contrato, servindo como garantia do CONTRATADO para o início dos trabalhos.\n` +
            `• Parcela Final: ${c.finalValue} (${c.finalText}) pagos após a aprovação e entrega dos arquivos finais e mockups.\n` +
            `5.2. O pagamento deverá ser efetuado através de transferência via PIX para a seguinte conta:\n` +
            `• Banco: ${c.pixBank} | Chave Pix: ${c.pixKey} | Favorecido: ${c.pixFavored}`
        },
        {
          title: "CLÁUSULA SEXTA - DA PROPRIEDADE E EXCLUSIVIDADE",
          body: `6.1. Fica garantido que, mediante a quitação integral dos valores, todos os direitos de uso e propriedade patrimonial sobre a arte final aprovada serão transferidos exclusivamente para a CONTRATANTE.\n` +
            `6.2. O CONTRATADO reserva-se o direito de utilizar apenas o projeto final aprovado em seu portfólio profissional para fins de divulgação.\n` +
            `6.3. Inutilização de Propostas Rejeitadas: É expressamente vedada a venda, reaproveitamento, reutilização ou aplicação das ideias, conceitos e propostas visuais que foram rejeitadas neste projeto para terceiros ou concorrentes. O CONTRATADO obriga-se à completa inutilização e manutenção do sigilo desse material após a sua apresentação.`
        },
        {
          title: "CLÁUSULA SÉTIMA - VIGÊNCIA E RESCISÃO",
          body: `7.1. Este contrato vigora da assinatura até a entrega final dos arquivos.\n` +
            `7.2. Caso a CONTRATANTE desista do projeto após o início da criação e envio das primeiras propostas, não haverá devolução do valor pago, devido às horas técnicas já empenhadas pelo CONTRATADO.`
        },
        {
          title: "CLÁUSULA OITAVA - DA ORIGINALIDADE E REGISTRABILIDADE",
          body: `8.1. O CONTRATADO garante que as propostas desenvolvidas são obras originais, não constituindo plágio ou cópia de marcas pré-existentes.\n` +
            `8.2. Caso o pedido de registro da marca aprovada seja indeferido pelo INPI (Instituto Nacional da Propriedade Industrial) por conflito com marca anterior de terceiros, o CONTRATADO compromete-se a desenvolver uma nova proposta para a CONTRATANTE sem nenhum custo adicional.`
        },
        {
          title: "CLÁUSULA NONA - DA CONFIDENCIALIDADE E SIGILO",
          body: `9.1. O CONTRATADO obriga-se a manter em absoluto sigilo todas e quaisquer informações, documentos, especificações técnicas, mockups, fotos de produtos ou estratégias comerciais fornecidas pela CONTRATANTE.\n` +
            `9.2. O CONTRATADO não poderá divulgar, reproduzir, compartilhar ou utilizar tais informações para qualquer finalidade diversa da prestação dos serviços contratados.`
        },
        {
          title: "CLÁUSULA DÉCIMA - FORO",
          body: `10.1. Fica eleito o foro da comarca de ${c.forumCity} para dirimir eventuais dúvidas oriundas deste instrumento.`
        }
      ];

      clauses.forEach(cl => {
        checkPageBreak(25);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(20, 20, 20);
        doc.text(cl.title, margin, y);
        y += 4.5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(50, 50, 50);
        const splitBody = doc.splitTextToSize(cl.body, contentWidth);
        checkPageBreak(splitBody.length * 4.2 + 6);
        doc.text(splitBody, margin, y);
        y += splitBody.length * 4.2 + 5;
      });

      // Data e Assinatura
      checkPageBreak(40);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      doc.text(`${c.forumCity}, ${c.contractDate}.`, margin, y);
      y += 18;

      const colWidth = (contentWidth - 20) / 2;

      // Assinatura Contratado
      doc.setFont("times", "italic");
      doc.setFontSize(11);
      doc.text(c.contractorRepresentative, margin + 5, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.line(margin, y + 2, margin + colWidth, y + 2);
      doc.setFont("helvetica", "bold");
      doc.text(c.contractorName.toUpperCase(), margin, y + 6);
      doc.setFont("helvetica", "normal");
      doc.text(c.contractorRepresentative, margin, y + 10);

      // Assinatura Contratante
      const rightX = margin + colWidth + 20;
      doc.line(rightX, y + 2, rightX + colWidth, y + 2);
      doc.setFont("helvetica", "bold");
      doc.text(c.company.toUpperCase(), rightX, y + 6);
      doc.setFont("helvetica", "normal");
      doc.text(c.clientName, rightX, y + 10);

      const fileName = `Contrato-ESCOM-${c.company.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar arquivo PDF do contrato.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const copyFullContractText = (c: Contract) => {
    const text = `
${c.title.toUpperCase()}

CONTRATANTE: ${c.company}, ${c.personType}, inscrita no CNPJ/CPF nº ${c.cnpj}, com sede em ${c.address}.

CONTRATADO: ${c.contractorName}, pessoa jurídica inscrita no CNPJ sob o nº ${c.contractorCnpj}, representado por ${c.contractorRepresentative}.

Têm entre si justo e contratado o presente CONTRATO DE PRESTAÇÃO DE SERVIÇOS, regido pelas cláusulas e condições abaixo:

CLÁUSULA PRIMEIRA - DO OBJETO
1.1. O presente contrato tem por objeto a ${c.serviceObject}

CLÁUSULA SEGUNDA - DO ESCOPO DO SERVIÇO E ENTREGAS
2.1. O CONTRATADO compromete-se a realizar as seguintes etapas e entregas:
${(c.deliverables || []).map(d => `- ${d}`).join("\n")}

CLÁUSULA TERCEIRA - DOS PRAZOS
3.1. O cronograma de entregas obedecerá às seguintes datas:
- Opções Iniciais: ${c.initialDeadline}
- Entrega Final: ${c.finalDeadline}
3.2. A contagem do prazo pressupõe a confirmação do pagamento do Sinal (50%) e o envio do briefing.

CLÁUSULA QUARTA - DAS REVISÕES
4.1. Ficam estabelecidas ${c.revisionsPolicy}
4.2. O período para solicitação e realização destes ajustes ocorrerá estritamente ${c.revisionsPeriod}

CLÁUSULA QUINTA - DOS VALORES E PAGAMENTO
5.1. Investimento Total: ${c.budget} (${c.budgetText})
- Sinal (50%): ${c.signalValue} (${c.signalText})
- Parcela Final (50%): ${c.finalValue} (${c.finalText})
5.2. Pagamento via PIX:
- Banco: ${c.pixBank}
- Chave Pix: ${c.pixKey}
- Favorecido: ${c.pixFavored}

CLÁUSULA SEXTA - DA PROPRIEDADE E EXCLUSIVIDADE
6.1. Mediante a quitação integral, todos os direitos patrimoniais sobre a arte final são transferidos exclusivamente para a CONTRATANTE.
6.2. O CONTRATADO pode utilizar apenas o projeto final aprovado em seu portfólio.
6.3. Inutilização de Propostas Rejeitadas: É expressamente vedada a venda ou reaproveitamento das propostas rejeitadas para concorrentes.

CLÁUSULA SÉTIMA - VIGÊNCIA E RESCISÃO
7.1. Vigora da assinatura até a entrega final.
7.2. Em caso de desistência após o início, não haverá devolução devido às horas técnicas já empenhadas.

CLÁUSULA OITAVA - DA ORIGINALIDADE E REGISTRABILIDADE
8.1. O CONTRATADO garante obras originais sem plágio.
8.2. Caso haja colidência no INPI, o CONTRATADO desenvolverá nova proposta sem custo adicional.

CLÁUSULA NONA - DA CONFIDENCIALIDADE E SIGILO
9.1. Sigilo absoluto sobre todas as informações, especificações e estratégias da CONTRATANTE.

CLÁUSULA DÉCIMA - FORO
10.1. Foro da comarca de ${c.forumCity}.

${c.forumCity}, ${c.contractDate}.

____________________________          ____________________________
ES COM CREATIVE STUDIO                ${c.company.toUpperCase()}
Eduardo Tavares dos Santos
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredContracts = contracts.filter(c => {
    const matchesTab =
      activeTab === "TUDO" ? true :
      activeTab === "ATIVOS" ? c.status === "ATIVO" :
      activeTab === "FINALIZADOS" ? c.status === "FINALIZADO" :
      c.status === "ENCERRADO";

    const matchesSearch =
      (c.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.clientName || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto w-full pb-20 bg-[#050507]">
      <Header title="Gestão de Contratos" />
      
      <div className="p-8 max-w-[1300px] mx-auto mt-2">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00d1ff] animate-pulse"></span>
              <h2 className="text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                Gestão & Emissão de Contratos
              </h2>
            </div>
            <p className="text-gray-400 text-xs font-mono mt-1">
              Base oficial ESCOM Studio com 10 cláusulas completas, PIX e exportação em PDF A4.
            </p>
          </div>
          
          <button 
            onClick={openNewContractModal}
            className="flex items-center gap-2 bg-[#00d1ff] hover:bg-[#00b8e6] text-black px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all shadow-lg shadow-[#00d1ff]/10 hover:scale-105"
          >
            <Plus size={16} />
            NOVO CONTRATO
          </button>
        </div>

        {/* Tabela Principal */}
        <div className="bg-[#0b0c12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header de Filtros e Busca */}
          <div className="p-4 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por empresa, título ou cliente..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00d1ff] transition-colors"
              />
            </div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {tabs.map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all ${
                    activeTab === tab 
                      ? 'bg-[#00d1ff]/15 text-[#00d1ff] border border-[#00d1ff]/30 font-bold' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Listagem */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] text-gray-500 font-mono tracking-widest text-left border-b border-white/10 bg-white/[0.02]">
                  <th className="px-6 py-4 font-medium">EMPRESA / CONTRATANTE</th>
                  <th className="px-6 py-4 font-medium">PROJETO / OBJETO</th>
                  <th className="px-6 py-4 font-medium">VALOR TOTAL</th>
                  <th className="px-6 py-4 font-medium">DATA EMISSÃO</th>
                  <th className="px-6 py-4 font-medium text-center">STATUS</th>
                  <th className="px-6 py-4 font-medium text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {!loading && filteredContracts.map(c => (
                  <tr key={c.id || c.company} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <Building2 size={14} className="text-[#00d1ff]" />
                        {c.company}
                      </div>
                      <div className="text-[10px] font-mono text-gray-500 mt-0.5">CNPJ: {c.cnpj}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{c.title}</div>
                      <div className="text-[10px] font-mono text-gray-500 line-clamp-1 max-w-xs">{c.serviceObject}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[#00e6a5] font-bold text-sm">
                      {c.budget?.includes('R$') ? c.budget : `R$ ${c.budget}`}
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-[11px]">
                      {c.contractDate || "--"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider ${
                        c.status === 'ATIVO' ? 'bg-[#00e6a5]/10 text-[#00e6a5] border border-[#00e6a5]/30' :
                        c.status === 'FINALIZADO' ? 'bg-[#00d1ff]/10 text-[#00d1ff] border border-[#00d1ff]/30' :
                        'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Ver Preview */}
                        <button 
                          onClick={() => openPreview(c)}
                          title="Visualizar Contrato Completo"
                          className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-[#00d1ff] transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                        
                        {/* Baixar PDF */}
                        <button 
                          onClick={() => generatePDF(c)}
                          title="Baixar Contrato em PDF"
                          className="p-2 hover:bg-[#00e6a5]/10 rounded-lg text-gray-400 hover:text-[#00e6a5] transition-colors"
                        >
                          <Download size={15} />
                        </button>

                        {/* Copiar Texto */}
                        <button 
                          onClick={() => copyFullContractText(c)}
                          title="Copiar Texto do Contrato"
                          className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                          <Copy size={15} />
                        </button>

                        {/* Editar */}
                        <button 
                          onClick={() => openEditContractModal(c)}
                          title="Editar Contrato"
                          className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-yellow-400 transition-colors"
                        >
                          <Edit3 size={15} />
                        </button>

                        {/* Alterar Status */}
                        {c.status !== 'ATIVO' && (
                          <button onClick={() => updateStatus(c.id!, 'ATIVO')} title="Marcar como Ativo" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-[#00e6a5] transition-colors">
                            <Clock size={15} />
                          </button>
                        )}
                        {c.status !== 'FINALIZADO' && (
                          <button onClick={() => updateStatus(c.id!, 'FINALIZADO')} title="Marcar como Finalizado" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-[#00d1ff] transition-colors">
                            <CheckCircle size={15} />
                          </button>
                        )}
                        {c.status !== 'ENCERRADO' && (
                          <button onClick={() => updateStatus(c.id!, 'ENCERRADO')} title="Encerrar" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                            <XCircle size={15} />
                          </button>
                        )}

                        {/* Excluir */}
                        {c.id && (
                          <button onClick={() => deleteContract(c.id!)} title="Excluir Contrato" className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center text-gray-500">
              <Clock size={32} className="mb-4 opacity-40 animate-spin text-[#00d1ff]" />
              <p className="text-xs font-mono tracking-widest uppercase">Carregando contratos...</p>
            </div>
          )}

          {!loading && filteredContracts.length === 0 && (
            <div className="py-24 flex flex-col items-center justify-center text-gray-500">
              <FileText size={36} className="mb-4 opacity-30 text-[#00d1ff]" />
              <p className="text-xs font-mono tracking-widest uppercase">Nenhum contrato encontrado.</p>
              <button 
                onClick={openNewContractModal}
                className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-mono transition-colors"
              >
                + Criar Primeiro Contrato
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL DE CRIAÇÃO / EDIÇÃO DE CONTRATO (COM TODAS AS CLÁUSULAS)
          ═══════════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e0f18] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileSignature size={18} className="text-[#00d1ff]" />
                  {editingContract ? "Editar Contrato" : "Novo Contrato Oficial"}
                </h3>
                <p className="text-[11px] font-mono text-gray-400">Preencha os dados sensíveis do cliente, escopo, valores e prazos.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-2">✕</button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveContract} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* BLOCO 1: DADOS BÁSICOS & OBJETO */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                <div className="text-[#00d1ff] font-mono font-bold tracking-widest text-[10px] uppercase">
                  1. IDENTIFICAÇÃO DO CONTRATO E OBJETO
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">Título do Contrato</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="Ex: CONTRATO SONDA SOLO"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Tipo de Serviço</label>
                    <input 
                      type="text" 
                      required
                      value={formData.serviceType} 
                      onChange={e => setFormData({...formData, serviceType: e.target.value})}
                      placeholder="Ex: Identidade Visual / Landing Page / Sistema Web"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Cláusula 1.1 — Descrição do Objeto</label>
                  <textarea 
                    rows={3}
                    required
                    value={formData.serviceObject} 
                    onChange={e => setFormData({...formData, serviceObject: e.target.value})}
                    placeholder="Descrição detalhada do que está sendo contratado..."
                    className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white font-mono focus:border-[#00d1ff] outline-none"
                  />
                </div>
              </div>

              {/* BLOCO 2: DADOS DO CONTRATANTE */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                <div className="text-[#00e6a5] font-mono font-bold tracking-widest text-[10px] uppercase">
                  2. DADOS DO CONTRATANTE (CLIENTE)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">Razão Social / Nome da Empresa</label>
                    <input 
                      type="text" 
                      required
                      value={formData.company} 
                      onChange={e => setFormData({...formData, company: e.target.value, clientName: e.target.value})}
                      placeholder="Ex: RASTRO VERDE"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Tipo de Pessoa</label>
                    <input 
                      type="text" 
                      value={formData.personType} 
                      onChange={e => setFormData({...formData, personType: e.target.value})}
                      placeholder="Ex: Pessoa Jurídica de Direito Privado"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">CNPJ ou CPF</label>
                    <input 
                      type="text" 
                      required
                      value={formData.cnpj} 
                      onChange={e => setFormData({...formData, cnpj: e.target.value})}
                      placeholder="Ex: 62.878.265/0001-44"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Endereço Completo & CEP</label>
                  <input 
                    type="text" 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="Ex: Alameda Rio Negro, 503 - Barueri - SP - CEP: 06454-000"
                    className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                  />
                </div>
              </div>

              {/* BLOCO 3: ESCOPO & ENTREGAS */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                <div className="text-yellow-400 font-mono font-bold tracking-widest text-[10px] uppercase">
                  3. ESCOPO & ENTREGAS (1 ITEM POR LINHA)
                </div>
                <div>
                  <textarea 
                    rows={4}
                    value={deliverablesText} 
                    onChange={e => setDeliverablesText(e.target.value)}
                    placeholder="Propostas Visuais: Criação de 3 opções..."
                    className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white font-mono focus:border-[#00d1ff] outline-none"
                  />
                </div>
              </div>

              {/* BLOCO 4: PRAZOS & REVISÕES */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                <div className="text-[#00d1ff] font-mono font-bold tracking-widest text-[10px] uppercase">
                  4. PRAZOS & POLÍTICA DE REVISÕES
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">Prazo para Opções Iniciais</label>
                    <input 
                      type="text" 
                      value={formData.initialDeadline} 
                      onChange={e => setFormData({...formData, initialDeadline: e.target.value})}
                      placeholder="Ex: 21 de agosto de 2026, às 18:00"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Prazo para Entrega Final</label>
                    <input 
                      type="text" 
                      value={formData.finalDeadline} 
                      onChange={e => setFormData({...formData, finalDeadline: e.target.value})}
                      placeholder="Ex: 28 de agosto de 2026, às 18:00"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Política de Alterações</label>
                    <input 
                      type="text" 
                      value={formData.revisionsPolicy} 
                      onChange={e => setFormData({...formData, revisionsPolicy: e.target.value})}
                      placeholder="Ex: Rodadas ilimitadas de alterações sobre o logo escolhido."
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Período para Solicitar Ajustes</label>
                    <input 
                      type="text" 
                      value={formData.revisionsPeriod} 
                      onChange={e => setFormData({...formData, revisionsPeriod: e.target.value})}
                      placeholder="Ex: Entre os dias 22 e 25 de agosto de 2026."
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* BLOCO 5: VALORES, SINAL & CONTA PIX */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                <div className="text-[#00e6a5] font-mono font-bold tracking-widest text-[10px] uppercase">
                  5. INVESTIMENTO & DADOS DE PAGAMENTO PIX
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">Valor Total do Projeto (R$)</label>
                    <input 
                      type="text" 
                      required
                      value={formData.budget} 
                      onChange={e => setFormData({...formData, budget: e.target.value})}
                      placeholder="Ex: R$ 1.200,00"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Valor por Extenso</label>
                    <input 
                      type="text" 
                      value={formData.budgetText} 
                      onChange={e => setFormData({...formData, budgetText: e.target.value})}
                      placeholder="Ex: um mil e duzentos reais"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Sinal (50%)</label>
                    <input 
                      type="text" 
                      value={formData.signalValue} 
                      onChange={e => setFormData({...formData, signalValue: e.target.value})}
                      placeholder="Ex: R$ 600,00"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Parcela Final (50%)</label>
                    <input 
                      type="text" 
                      value={formData.finalValue} 
                      onChange={e => setFormData({...formData, finalValue: e.target.value})}
                      placeholder="Ex: R$ 600,00"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Banco PIX</label>
                    <input 
                      type="text" 
                      value={formData.pixBank} 
                      onChange={e => setFormData({...formData, pixBank: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Chave PIX</label>
                    <input 
                      type="text" 
                      value={formData.pixKey} 
                      onChange={e => setFormData({...formData, pixKey: e.target.value})}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* BLOCO 6: DATA E FORO */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
                <div className="text-gray-400 font-mono font-bold tracking-widest text-[10px] uppercase">
                  6. FORO E DATA DO CONTRATO
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">Foro / Comarca</label>
                    <input 
                      type="text" 
                      value={formData.forumCity} 
                      onChange={e => setFormData({...formData, forumCity: e.target.value})}
                      placeholder="Ex: São Paulo - SP"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Data por Extenso</label>
                    <input 
                      type="text" 
                      value={formData.contractDate} 
                      onChange={e => setFormData({...formData, contractDate: e.target.value})}
                      placeholder="Ex: 20 de agosto de 2026"
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white font-mono focus:border-[#00d1ff] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-mono transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-[#00d1ff] hover:bg-[#00b8e6] text-black font-mono font-bold rounded-xl transition-all shadow-lg shadow-[#00d1ff]/10"
                >
                  {editingContract ? "Salvar Alterações" : "Emitir Contrato"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL DE VISUALIZAÇÃO & EXPORTAÇÃO (FOLHA TIMBRADA A4 / PDF)
          ═══════════════════════════════════════════════════════════════════════ */}
      {isPreviewOpen && selectedContract && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#12131c] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Preview Toolbar */}
            <div className="px-6 py-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <FileCheck size={18} className="text-[#00e6a5]" />
                <span className="font-bold text-white text-sm">{selectedContract.title}</span>
                <span className="text-[10px] font-mono text-gray-400">({selectedContract.company})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyFullContractText(selectedContract)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-mono transition-colors"
                >
                  {copied ? <Check size={14} className="text-[#00e6a5]" /> : <Copy size={14} />}
                  {copied ? "Copiado!" : "Copiar Texto"}
                </button>

                <button
                  onClick={() => generatePDF(selectedContract)}
                  disabled={isGeneratingPdf}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00e6a5] hover:bg-[#00ffb7] text-black rounded-lg text-xs font-mono font-bold transition-all shadow-lg shadow-[#00e6a5]/10"
                >
                  <Download size={14} />
                  {isGeneratingPdf ? "Gerando..." : "Baixar em PDF"}
                </button>

                <button onClick={() => setIsPreviewOpen(false)} className="text-gray-400 hover:text-white p-2">✕</button>
              </div>
            </div>

            {/* Preview Content (Folha Timbrada Formato A4) */}
            <div className="flex-1 overflow-y-auto p-8 bg-[#f5f3ee] text-[#1a1a1a] font-sans leading-relaxed text-[13px] shadow-inner select-text">
              <div className="max-w-[760px] mx-auto space-y-6 bg-white p-10 rounded-xl shadow border border-gray-200">
                {/* Cabeçalho */}
                <div className="text-center border-b pb-4">
                  <h1 className="text-lg font-bold uppercase tracking-wider text-gray-900">{selectedContract.title}</h1>
                  <p className="text-[11px] font-mono text-gray-500 mt-1">ESCOM CREATIVE STUDIO — INSTRUMENTO PARTICULAR DE CONTRATO</p>
                </div>

                {/* Qualificação das Partes */}
                <div className="space-y-2 text-justify">
                  <p>
                    <strong>CONTRATANTE:</strong> {selectedContract.company}, {selectedContract.personType}, inscrita no CNPJ nº {selectedContract.cnpj}, com sede em {selectedContract.address}.
                  </p>
                  <p>
                    <strong>CONTRATADO:</strong> {selectedContract.contractorName}, pessoa jurídica inscrita no CNPJ sob o nº {selectedContract.contractorCnpj}, representado por {selectedContract.contractorRepresentative}.
                  </p>
                  <p className="text-gray-600 text-xs mt-2">
                    Têm entre si justo e contratado o presente CONTRATO DE PRESTAÇÃO DE SERVIÇOS, regido pelas cláusulas e condições abaixo, bem como pela legislação civil aplicável.
                  </p>
                </div>

                {/* Cláusula 1 */}
                <div>
                  <h3 className="font-bold text-sm text-gray-900 border-b pb-1">CLÁUSULA PRIMEIRA - DO OBJETO</h3>
                  <p className="mt-2 text-justify">
                    1.1. O presente contrato tem por objeto a {selectedContract.serviceObject}
                  </p>
                </div>

                {/* Cláusula 2 */}
                <div>
                  <h3 className="font-bold text-sm text-gray-900 border-b pb-1">CLÁUSULA SEGUNDA - DO ESCOPO DO SERVIÇO E ENTREGAS</h3>
                  <p className="mt-2">2.1. O CONTRATADO compromete-se a realizar as seguintes etapas e entregas de criação:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1.5 text-justify">
                    {(selectedContract.deliverables || []).map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                {/* Cláusula 3 */}
                <div>
                  <h3 className="font-bold text-sm text-gray-900 border-b pb-1">CLÁUSULA TERCEIRA - DOS PRAZOS</h3>
                  <p className="mt-2">3.1. O cronograma de entregas obedecerá às seguintes datas e horários limites:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Opções Iniciais:</strong> Entrega até o dia <strong>{selectedContract.initialDeadline}</strong>.</li>
                    <li><strong>Entrega Final:</strong> Mediante aprovação de uma das opções, a entrega da próxima etapa será realizada até o dia <strong>{selectedContract.finalDeadline}</strong>.</li>
                  </ul>
                  <p className="mt-2 text-justify">3.2. A contagem do prazo pressupõe a confirmação do pagamento do Sinal (50%) e o envio do briefing prévio por parte da CONTRATANTE.</p>
                </div>

                {/* Cláusula 4 */}
                <div>
                  <h3 className="font-bold text-sm text-gray-900 border-b pb-1">CLÁUSULA QUARTA - DAS REVISÕES</h3>
                  <p className="mt-2 text-justify">
                    4.1. Ficam estabelecidas <strong>{selectedContract.revisionsPolicy}</strong>.
                  </p>
                  <p className="mt-1 text-justify">
                    4.2. O período para solicitação e realização destes ajustes ocorrerá estritamente <strong>{selectedContract.revisionsPeriod}</strong>.
                  </p>
                </div>

                {/* Cláusula 5 */}
                <div>
                  <h3 className="font-bold text-sm text-gray-900 border-b pb-1">CLÁUSULA QUINTA - DOS VALORES E PAGAMENTO</h3>
                  <p className="mt-2 text-justify">
                    5.1. Pelos serviços descritos, a CONTRATANTE pagará ao CONTRATADO o Investimento Total de <strong>{selectedContract.budget} ({selectedContract.budgetText})</strong>, a serem pagos da seguinte forma:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Sinal (50%):</strong> {selectedContract.signalValue} ({selectedContract.signalText}) pagos de forma antecipada no ato da assinatura deste contrato, servindo como garantia do CONTRATADO para o início dos trabalhos.</li>
                    <li><strong>Parcela Final (50%):</strong> {selectedContract.finalValue} ({selectedContract.finalText}) pagos após a aprovação do logotipo e mediante a entrega dos arquivos finais e mockups.</li>
                  </ul>
                  <p className="mt-2">5.2. O pagamento deverá ser efetuado através de transferência via PIX para a seguinte conta/chave:</p>
                  <ul className="list-disc pl-5 mt-1">
                    <li><strong>Banco:</strong> {selectedContract.pixBank}</li>
                    <li><strong>Chave Pix:</strong> {selectedContract.pixKey}</li>
                    <li><strong>Favorecido:</strong> {selectedContract.pixFavored}</li>
                  </ul>
                </div>

                {/* Cláusula 6 */}
                <div>
                  <h3 className="font-bold text-sm text-gray-900 border-b pb-1">CLÁUSULA SEXTA - DA PROPRIEDADE E EXCLUSIVIDADE</h3>
                  <p className="mt-2 text-justify">
                    6.1. Fica garantido que, mediante a quitação integral dos valores, todos os direitos de uso e propriedade patrimonial sobre a arte final do logotipo escolhido serão transferidos exclusivamente para a CONTRATANTE.
                  </p>
                  <p className="mt-1 text-justify">
                    6.2. O CONTRATADO reserva-se o direito de utilizar apenas o projeto final <strong>aprovado</strong> em seu portfólio profissional para fins de divulgação.
                  </p>
                  <p className="mt-1 text-justify">
                    6.3. <strong>Inutilização de Propostas Rejeitadas:</strong> É expressamente vedada a venda, reaproveitamento, reutilização ou aplicação das ideias, conceitos e propostas visuais que foram rejeitadas neste projeto para terceiros ou concorrentes. O CONTRATADO obriga-se à completa inutilização e manutenção do sigilo desse material após a sua apresentação, a fim de evitar qualquer problema de concorrência de mercado para a CONTRATANTE.
                  </p>
                </div>

                {/* Cláusula 7 */}
                <div>
                  <h3 className="font-bold text-sm text-gray-900 border-b pb-1">CLÁUSULA SÉTIMA - VIGÊNCIA E RESCISÃO</h3>
                  <p className="mt-2 text-justify">
                    7.1. Este contrato vigora da assinatura até a entrega final dos arquivos.
                  </p>
                  <p className="mt-1 text-justify">
                    7.2. Caso a CONTRATANTE desista do projeto após o início da criação e envio das primeiras propostas, não haverá devolução do valor pago, devido às horas técnicas já empenhadas pelo CONTRATADO.
                  </p>
                </div>

                {/* Cláusula 8 */}
                <div>
                  <h3 className="font-bold text-sm text-gray-900 border-b pb-1">CLÁUSULA OITAVA - DA ORIGINALIDADE E REGISTRABILIDADE DA MARCA</h3>
                  <p className="mt-2 text-justify">
                    8.1. O CONTRATADO garante que as propostas de logotipo desenvolvidas são obras originais, não constituindo plágio ou cópia de marcas pré-existentes.
                  </p>
                  <p className="mt-1 text-justify">
                    8.2. Caso o pedido de registro da marca aprovada seja indeferido pelo INPI (Instituto Nacional da Propriedade Industrial) por conflito com marca anterior de terceiros (colidência visual ou fonética com o projeto gráfico desenvolvido), o CONTRATADO compromete-se a desenvolver uma nova proposta de logotipo para a CONTRATANTE sem nenhum custo adicional.
                  </p>
                </div>

                {/* Cláusula 9 */}
                <div>
                  <h3 className="font-bold text-sm text-gray-900 border-b pb-1">CLÁUSULA NONA - DA CONFIDENCIALIDADE E SIGILO</h3>
                  <p className="mt-2 text-justify">
                    9.1. O CONTRATADO obriga-se a manter em absoluto sigilo todas e quaisquer informações, documentos, especificações técnicas, mockups, fotos de produtos (sensores, embalagens, caixas) ou estratégias comerciais fornecidas pela CONTRATANTE ou às quais tiver acesso em razão da execução deste contrato.
                  </p>
                  <p className="mt-1 text-justify">
                    9.2. O CONTRATADO não poderá divulgar, reproduzir, compartilhar ou utilizar tais informações para qualquer finalidade diversa da prestação dos serviços contratados, sob pena de responsabilização civil e criminal por eventuais perdas e danos causados à CONTRATANTE.
                  </p>
                </div>

                {/* Cláusula 10 */}
                <div>
                  <h3 className="font-bold text-sm text-gray-900 border-b pb-1">CLÁUSULA DÉCIMA - FORO</h3>
                  <p className="mt-2 text-justify">
                    10.1. Fica eleito o foro da comarca de {selectedContract.forumCity} para dirimir eventuais dúvidas.
                  </p>
                </div>

                {/* Assinaturas */}
                <div className="pt-8 space-y-8">
                  <p className="text-right">{selectedContract.forumCity}, {selectedContract.contractDate}.</p>
                  
                  <div className="grid grid-cols-2 gap-12 pt-6">
                    <div className="text-center">
                      <div className="font-serif italic text-base">{selectedContract.contractorRepresentative}</div>
                      <div className="border-t border-gray-400 mt-2 pt-1 font-bold text-xs">{selectedContract.contractorName.toUpperCase()}</div>
                      <div className="text-[11px] text-gray-600">{selectedContract.contractorRepresentative}</div>
                    </div>
                    <div className="text-center">
                      <div className="h-6"></div>
                      <div className="border-t border-gray-400 mt-2 pt-1 font-bold text-xs">{selectedContract.company.toUpperCase()}</div>
                      <div className="text-[11px] text-gray-600">{selectedContract.clientName}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
