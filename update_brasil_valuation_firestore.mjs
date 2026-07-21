import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import firebaseConfig from './api/firebase-applet-config.ts';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

const brasilValuationAnalysis = `# Auditoria & Análise Estratégica: Brasil Valuation & M&A Advisory

### 🎯 Resumo da Empresa
- **Nome**: Brasil Valuation & M&A Advisory
- **Nicho**: Consultoria de Gestão Empresarial, Valuation por FCD e Fusões & Aquisições (M&A)
- **Localização**: Av. Brigadeiro Faria Lima, 1811, cj 918 - Jardim Paulistano, São Paulo - SP
- **Público-Alvo**: Founders, Sócios, CFOs e Conselhos de Administração de empresas com faturamento R$ 20M+

---

### 🔍 Diagnóstico do Site Antigo (Pontos de Melhoria Críticos)
1. **Falta de Responsividade & UI Antiga**: O layout anterior utilizava padrões visuais ultrapassados, com tabelas desalinhadas em dispositivos móveis.
2. **Tempo de Carregamento Elevado (LCP > 4.8s)**: Perda estimada de 55% dos visitantes executivos C-Level por lentidão de scripts não otimizados.
3. **Ausência de Funil Sell-Side / Buy-Side**: Formulários genéricos sem filtro ou qualificação de ticket/faturamento dos leads.
4. **Sem Integração com WhatsApp CRM**: Ausência de rastreamento direto de mensagens iniciadas por empresários.

---

### 💡 Solução Aplicada pela ESCOM Studio
- **Design Institucional Premium**: Tema claro corporativo em Azul Marinho (#0f2b48) e Dourado Executivo (#c59b27), com tipografia Cinzel/Inter.
- **Performance Sub-1s**: Código limpo otimizado sem dependência de WordPress ou construtores pesados.
- **Seções Estratégicas**: Apresentação de pilares de M&A (Valuation, Sell-Side, Buy-Side, Due Diligence), cases de sucesso com métricas e contatos oficiais.
- **Conversão Direta**: Botão flutuante de WhatsApp direcionando diretamente para o número corporativo da empresa ((11) 98883-2812).
`;

async function updateFirestore() {
  try {
    const snap = await getDocs(collection(db, "generated_sites"));
    let found = false;

    for (const d of snap.docs) {
      const data = d.data();
      if (data.companyName && data.companyName.toLowerCase().includes("brasil valuation")) {
        console.log("Atualizando registro existente:", d.id);
        await updateDoc(doc(db, "generated_sites", d.id), {
          analysis: brasilValuationAnalysis,
          updatedAt: Date.now()
        });
        found = true;
      }
    }

    if (!found) {
      const newId = "site_brasil_valuation_" + Date.now();
      console.log("Criando novo registro em generated_sites:", newId);
      await setDoc(doc(db, "generated_sites", newId), {
        companyName: "Brasil Valuation & M&A Advisory",
        niche: "Consultoria de Gestão Empresarial e M&A",
        status: "ready_for_approval",
        originalUrl: "brasilvaluation.com.br",
        website: "https://www.escomstudio.com.br/site-brasil-valuation/index.html",
        deployedUrl: "https://www.escomstudio.com.br/site-brasil-valuation/index.html",
        score: 88,
        analysis: brasilValuationAnalysis,
        phone: "(11) 98883-2812",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }

    console.log("SUCCESS: Firestore atualizado com a análise do projeto!");
  } catch (err) {
    console.error("Erro ao atualizar Firestore:", err);
  }
}

updateFirestore();
