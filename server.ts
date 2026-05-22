import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import * as cheerio from "cheerio";
import Groq from "groq-sdk";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Resend } from "resend";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf-8'));

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || '(default)');

// Resend initialization (Lazy loaded for security)
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[SECURITY_WARN] RESEND_API_KEY missing. Email delivery will skip.");
    return null;
  }
  return new Resend(apiKey);
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Secure API Route for Contact Form
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      
      // 1. Validation (Secure SDLC)
      if (!name || !email || !message) {
        return res.status(400).json({ 
          error: "VALIDATION_FAILED", 
          message: "Campos obrigatórios ausentes." 
        });
      }

      // Save Lead to Firebase
      let leadId = null;
      try {
        const docRef = await addDoc(collection(db, 'leads'), { name, email, phone: phone || null, message, status: 'novo', createdAt: serverTimestamp() });
        leadId = docRef.id;
      } catch (err) { console.error("Firebase save lead error:", err); }

      // 2. Email Sending via Resend
      const resendClient = getResend();
      
      if (resendClient) {
        await resendClient.emails.send({
          from: "ESCOM <onboarding@resend.dev>", // Default for free accounts, use your domain once verified
          to: process.env.CONTACT_RECEIVER_EMAIL || "es.comunicacao@outlook.com",
          subject: `[PROJETO_NOVO] ${name.toUpperCase()}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #111;">
              <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">SOLICITAÇÃO DE PROJETO</h2>
              <p><strong>NOME:</strong> ${name}</p>
              <p><strong>EMAIL:</strong> ${email}</p>
              <p><strong>WHATSAPP:</strong> ${phone || 'NÃO INFORMADO'}</p>
              <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
                <p><strong>MENSAGEM:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
              <p style="margin-top: 20px; font-size: 10px; color: #999;">PROTOCOLO: ${Date.now()}</p>
            </div>
          `,
          replyTo: email
        });
        console.log(`[SECURE_API] Email sent via Resend from ${email}`);
      } else {
        console.log(`[DEMO_MODE] Data received but not sent (missing RESEND_API_KEY):`, { name, email });
      }
      
      res.status(200).json({ 
        success: true, 
        message: "Dados transmitidos com sucesso via Resend.",
        protocol: `ESCOM-${Date.now().toString().slice(-6)}`
      });

    } catch (error) {
      console.error("[CRITICAL_API_ERROR]", error);
      res.status(500).json({ 
        error: "INTERNAL_SERVER_ERROR", 
        message: "Falha na comunicação segura. Tente novamente." 
      });
    }
  });

  // UX ANALYZER API
  app.post("/api/analyze-ux", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) return res.status(400).json({ error: "URL is required" });
      if (!process.env.GROQ_API_KEY) {
        return res.status(500).json({ error: "GROQ_API_KEY is not configured in .env" });
      }

      // Fetch url content
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)" }});
      if (!response.ok) return res.status(400).json({ error: "Could not fetch URL content" });
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Clean up body content
      $('script, style, nav, footer, header').remove();
      const pageText = $("body").text().replace(/\s+/g, ' ').substring(0, 10000); // 10k chars

      // Use Groq API for Deep Audit
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "system", content: "You always return ONLY purely valid JSON, with absolutely NO markdown backticks." }, { role: "user", content: `Você é um diretor sênior de UX/UI, Heurísticas, Psicologia Cognitiva e CRO. Faça uma auditoria extremamente profunda, rigorosa e técnica no conteúdo extraído do site:
"${pageText}"

Retorne APENAS um JSON válido. Não inclua os caracteres de markdown. 
Formato exigido:
{ 
  "summary": "Um sumário analítico profissional de alto nível, com no mínimo 6 a 8 frases detalhando vulnerabilidades cognitivas, deficiências na arquitetura de informação e fricções de interface.", 
  "issues": [
    { 
      "category": "tipografia" | "cores" | "heuristica" | "vies" | "arquitetura" | "acessibilidade",
      "tab": "IDENTIDADE VISUAL E UI" | "HEURÍSTICAS DE NIELSEN" | "VIESES COGNITIVOS E PSICOLOGIA" | "ARQUITETURA DA INFORMAÇÃO" | "ACESSIBILIDADE E INCLUSÃO",
      "title": "Nome técnico e robusto do problema.",
      "description": "Explicação muito detalhada (ao menos um parágrafo longo) baseada em princípios avançados de design e comportamento do usuário. Explique os custos ocultos de conversão que esse erro causa.",
      "recommendation": "O passo a passo incrivelmente exato de como aplicar a correção, sugerindo diretrizes e práticas modernas."
    }
  ]
}
Obrigatório: gere pelo menos de 7 a 10 problemas cobrindo TODAS e múltiplas áreas diferentes.`}],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(chatCompletion.choices[0].message.content || "{}");
      res.json({ success: true, data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to analyze UX" });
    }
  });

  // MAPS LEAD FINDER API
  app.post("/api/maps-leads", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) return res.status(400).json({ error: "Query is required" });
      if (!process.env.SERPER_API_KEY) {
         return res.status(500).json({ error: "SERPER_API_KEY is not configured in .env" });
      }

      // Search Google Maps using Serper
      const response = await fetch("https://google.serper.dev/places", {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          q: query,
          gl: "br",
          hl: "pt-br"
        })
      });
      
      const searchData = await response.json();
      const placesResults = searchData.places || [];

      res.json({ 
        success: true, 
        data: placesResults.map((r: any) => ({
          title: r.title,
          address: r.address,
          phone: r.phoneNumber || "Sem telefone",
          website: r.website || "",
          rating: r.rating,
          ratingCount: r.ratingCount,
          placeId: r.cid || r.placeId || Date.now().toString()
        }))
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to search maps" });
    }
  });

  // LEAD FINDER API
  app.post("/api/find-leads", async (req, res) => {
    try {
      const { niche } = req.body;
      if (!niche) return res.status(400).json({ error: "Niche query is required" });
      if (!process.env.SERPER_API_KEY) {
         return res.status(500).json({ error: "SERPER_API_KEY is not configured in .env" });
      }

      // Search Google using Serper
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          q: niche + " site:.com.br OR site:.br",
          gl: "br",
          hl: "pt-br",
          num: 10
        })
      });
      
      const searchData = await response.json();
      const organicResults = searchData.organic || [];

      res.json({ 
        success: true, 
        data: organicResults.map((r: any) => ({
          title: r.title,
          snippet: r.snippet,
          link: r.link,
          email: "contato@" + new URL((r.link || '').startsWith('http') ? (r.link || 'https://google.com') : 'https://' + (r.link || 'google.com')).hostname.replace('www.', '')
        }))
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to search leads" });
    }
  });
  
  // GENERATE PROSPECT TEXT API
  app.post("/api/generate-prospect-text", async (req, res) => {
    try {
       const { siteInfo } = req.body;
       if (!process.env.GROQ_API_KEY) {
         return res.status(500).json({ error: "GROQ_API_KEY is not configured in .env" });
       }
       const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
       const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: `You are Edu Santos, a website design and cognitive analysis specialist. 
Write a personalized cold email (in Brazilian Portuguese) to the company described below:
Company Info: ${JSON.stringify(siteInfo)}
The email must have:
1. An engaging subject line.
2. A very short introduction.
3. A mention of a possible improvement in UX/Conversion in their website.
4. A call to action for a quick chat.

Return ONLY a valid JSON object: {"subject": "...", "body": "..."}`}],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          response_format: { type: "json_object" }
       });
       const result = JSON.parse(chatCompletion.choices[0].message.content || "{}");
       res.json({ success: true, data: result });
    } catch(err) {
       console.error(err);
       res.status(500).json({ error: "Failed to generate text" });
    }
  });

  // JOB FINDER API
  app.post("/api/find-jobs", async (req, res) => {
    try {
      if (!process.env.SERPER_API_KEY) {
         return res.status(500).json({ error: "SERPER_API_KEY is not configured in .env" });
      }

      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          q: "(\"R$ 5.000\" OR \"5.000,00\" OR \"R$ 6.000\" OR \"R$ 7.000\" OR \"Sênior\" OR \"Pleno\") (Web Designer OR UI Designer OR UX Designer) site:vagas.com.br OR site:gupy.io OR site:linkedin.com/jobs/view/",
          gl: "br",
          hl: "pt-br",
          tbs: "qdr:m", // past month
          num: 15
        })
      });
      
      const searchData = await response.json();
      const organicResults = searchData.organic || [];

      res.json({ 
        success: true, 
        data: organicResults.map((r: any) => {
          let company = "Empresa não identificada";
          if (r.title.includes("-")) {
            const parts = r.title.split("-");
            company = parts[parts.length - 1].trim();
          } else if (r.title.includes("|")) {
            const parts = r.title.split("|");
            company = parts[parts.length - 1].trim();
          }
           
          return {
            title: r.title,
            company: company,
            snippet: r.snippet,
            link: r.link
          }
        })
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to search jobs" });
    }
  });

  // SERVICES API
  let servicesStore: any[] = [
    { id: 1, name: "Landing Page Alta Conversão", price: 2200, active: true, description: "Página única otimizada para capturar leads ou vender produtos com alta taxa de conversão." },
    { id: 2, name: "Site Completo (5 a 6 páginas)", price: 4500, active: true, description: "Site institucional completo com páginas sobre, serviços, contato e blog." },
    { id: 3, name: "E-commerce Básico", price: 6500, active: true, description: "Loja virtual completa com até 50 produtos cadastrados, carrinho e checkout." },
    { id: 4, name: "Gestão de Tráfego Mensal", price: 1500, active: false, description: "Gestão de campanhas de anúncios no Google e Meta Ads para atrair clientes." },
    { id: 5, name: "Identidade Visual", price: 3200, active: true, description: "Criação de logotipo, paleta de cores, tipografia e manual da marca." },
  ];

  app.get("/api/services", (req, res) => {
    res.json({ success: true, services: servicesStore });
  });

  app.post("/api/services", (req, res) => {
    try {
      const { id, name, price, active, description } = req.body;
      if (!name || price === undefined) return res.status(400).json({ error: "Name and price required" });
      
      let priceNumber = typeof price === 'string' ? parseFloat(price.replace(".", "")) : price;

      const existingIndex = servicesStore.findIndex((s: any) => s.id === id);
      if (existingIndex >= 0) {
        servicesStore[existingIndex] = { ...servicesStore[existingIndex], name, price: priceNumber, active, description: description || "" };
      } else {
        servicesStore.push({ id: id || Date.now(), name, price: priceNumber, active: active ?? true, description: description || "" });
      }
      res.json({ success: true, services: servicesStore });
    } catch (e) {
      res.status(500).json({ error: "Error saving service" });
    }
  });

  app.delete("/api/services/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = servicesStore.findIndex(s => s.id === id);
    if (index >= 0) {
       servicesStore.splice(index, 1);
    }
    res.json({ success: true, services: servicesStore });
  });

  // PROPOSALS API
  app.post("/api/proposals", async (req, res) => {
    try {
      const { clientName, phone, company, budget, selectedServices, observations } = req.body;
      if (!company) {
        return res.status(400).json({ error: "Company name is required." });
      }
      
      const slug = `proposta-escom-${company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
      const proposal = {
        id: slug,
        clientName,
        phone,
        company,
        budget,
        selectedServices,
        observations,
        status: 'pendente', // 'pendente', 'aceito', 'recusado'
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      };
      
      await setDoc(doc(db, "proposals", slug), proposal);
      
      res.json({ success: true, slug, proposal });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to generate proposal" });
    }
  });

  app.get("/api/proposals", async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, "proposals"));
      const proposalsList: any[] = [];
      querySnapshot.forEach((docSnap) => {
        proposalsList.push(docSnap.data());
      });
      res.json({ success: true, proposals: proposalsList });
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch proposals" });
    }
  });

  app.get("/api/proposals/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const docRef = doc(db, "proposals", slug);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return res.status(404).json({ error: "Proposal not found" });
      }
      
      const proposal = docSnap.data();
      
      // Check expiration
      if (new Date(proposal.expiresAt) < new Date() && proposal.status === 'pendente') {
        return res.status(410).json({ error: "Proposal expired" });
      }
      
      res.json({ success: true, proposal });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch proposal" });
    }
  });

  app.delete("/api/proposals/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const docRef = doc(db, "proposals", id);
      await deleteDoc(docRef);
      res.json({ success: true });
    } catch (e) {
      console.error("Error deleting proposal:", e);
      res.status(500).json({ error: "Failed to delete proposal" });
    }
  });

  app.post("/api/proposals/:slug/accept", async (req, res) => {
    try {
      const slug = req.params.slug;
      const docRef = doc(db, "proposals", slug);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return res.status(404).json({ error: "Proposal not found" });
      
      const proposal = docSnap.data();
      if (proposal.status === "aceito") {
        return res.json({ success: true, message: "Already accepted" });
      }
      
      await updateDoc(docRef, { status: "aceito" });
      
      // Criar contrato baseado na proposta
      await addDoc(collection(db, "contracts"), {
        proposalSlug: slug,
        clientName: proposal.clientName,
        company: proposal.company,
        budget: proposal.budget,
        selectedServices: proposal.selectedServices,
        status: "ATIVO", // ATIVO, FINALIZADO, ENCERRADO
        createdAt: serverTimestamp(),
      });
      
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to accept proposal" });
    }
  });

  // CONTRACTS API
  app.get("/api/contracts", async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, "contracts"));
      const contractsList: any[] = [];
      querySnapshot.forEach((docSnap) => {
        contractsList.push({ id: docSnap.id, ...docSnap.data() });
      });
      res.json({ success: true, contracts: contractsList });
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch contracts" });
    }
  });

  app.put("/api/contracts/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const docRef = doc(db, "contracts", id);
      await updateDoc(docRef, { status });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to update contract" });
    }
  });

  // LEADS API
  app.get("/api/leads", async (req, res) => {
    try {
      const querySnapshot = await getDocs(collection(db, "leads"));
      const leadsList: any[] = [];
      querySnapshot.forEach((docSnap) => {
        leadsList.push({ id: docSnap.id, ...docSnap.data() });
      });
      res.json({ success: true, leads: leadsList });
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  app.delete("/api/leads/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await deleteDoc(doc(db, "leads", id));
      res.json({ success: true });
    } catch (e) {
      console.error("Error deleting lead:", e);
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  app.put("/api/leads/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      await updateDoc(doc(db, "leads", id), { status });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Failed to update lead status" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    app.get("/portfolio-projetos*", (req, res, next) => {
      req.url = "/portfolio-projetos/index.html";
      next();
    });
    app.get("/portfolioedu*", (req, res, next) => {
      req.url = "/portfolioedu/index.html";
      next();
    });
    app.get("/admin*", (req, res, next) => {
      req.url = "/admin/index.html";
      next();
    });
    app.get("/sobre*", (req, res, next) => {
      req.url = "/sobre/index.html";
      next();
    });
    app.get("/baseproposta*", (req, res, next) => {
      req.url = "/baseproposta/index.html";
      next();
    });
    app.get("/proposta-escom-*", (req, res, next) => {
      req.url = "/baseproposta/index.html";
      next();
    });
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "mpa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("/portfolio-projetos*", (req, res) => {
      res.sendFile(path.join(distPath, "portfolio-projetos", "index.html"));
    });
    app.get("/portfolioedu*", (req, res) => {
      res.sendFile(path.join(distPath, "portfolioedu", "index.html"));
    });
    app.get("/admin*", (req, res) => {
      res.sendFile(path.join(distPath, "admin", "index.html"));
    });
    app.get("/sobre*", (req, res) => {
      res.sendFile(path.join(distPath, "sobre", "index.html"));
    });
    app.get("/baseproposta*", (req, res) => {
      res.sendFile(path.join(distPath, "baseproposta", "index.html"));
    });
    app.get("/proposta-escom-*", (req, res) => {
      res.sendFile(path.join(distPath, "baseproposta", "index.html"));
    });
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SECURE_SERVER] Running on http://localhost:${PORT}`);
    console.log(`[ENVIRONMENT] ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
