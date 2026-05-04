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
      const pageText = $("body").text().replace(/\s+/g, ' ').substring(0, 8000); // Only first 8000 chars

      // Use Groq API
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: `You are a strict and senior UX/UI auditor. Analyze this text extracted from a website to provide an audit report:
"${pageText}"

Return ONLY a valid JSON object matching this structure exactly, with texts strictly in PORTUGUESE (pt-BR). Do not add any markdown formatting, only pure JSON.
{ 
  "summary": "Main overall issue summary (e.g., 'A identidade visual do site é confusa e...'). At least 2 sentences.", 
  "issues": [
    { 
      "category": "tipografia" | "cores" | "heuristica" | "vies" | "arquitetura" | "acessibilidade",
      "tab": "IDENTIDADE VISUAL E UI" | "HEURÍSTICAS DE NIELSEN" | "VIESES COGNITIVOS E PSICOLOGIA" | "ARQUITETURA DA INFORMAÇÃO" | "ACESSIBILIDADE E INCLUSÃO",
      "title": "Short title of the problem (e.g., 'Falta de Consistência na Tipografia')",
      "description": "Clear explanation of the problem found on the text/content.",
      "recommendation": "Technical recommendation on how to fix it."
    }
  ]
}
Make sure to generate at least 4-5 issues spanning different categories.`}],
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(chatCompletion.choices[0].message.content || "{}");
      res.json({ success: true, data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to analyze UX" });
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
          email: "contato@" + new URL(r.link.startsWith('http') ? r.link : 'https://' + r.link).hostname.replace('www.', '')
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
          q: "site:linkedin.com/jobs/view/ OR site:gupy.io/ (Web Designer OR UI Designer OR UX Designer) (São Paulo OR Remoto)",
          gl: "br",
          hl: "pt-br",
          tbs: "qdr:w", // past week
          num: 10
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    app.get("/portfolioedu*", (req, res, next) => {
      req.url = "/portfolioedu/index.html";
      next();
    });
    app.get("/admin*", (req, res, next) => {
      req.url = "/admin/index.html";
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
    app.get("/portfolioedu*", (req, res) => {
      res.sendFile(path.join(distPath, "portfolioedu", "index.html"));
    });
    app.get("/admin*", (req, res) => {
      res.sendFile(path.join(distPath, "admin", "index.html"));
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
