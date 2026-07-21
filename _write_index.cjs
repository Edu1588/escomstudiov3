const fs = require("fs");
const path = "E:\\ANTIGRAVITY\\ESCOM_STUDIO\\api\\index.ts";

const content = `import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import * as cheerio from "cheerio";
import Groq from "groq-sdk";
import cron from "node-cron";

const origStringify = JSON.stringify;
JSON.stringify = function(value, replacer, space) {
  try {
    return origStringify(value, replacer, space);
  } catch (err) {
    return '"[Cyclic Object]"';
  }
};

dotenv.config();

if (process.env.Groq_API_KEY && !process.env.GROQ_API_KEY) {
  process.env.GROQ_API_KEY = process.env.Groq_API_KEY;
}
if (process.env.Groq && !process.env.GROQ_API_KEY) {
  process.env.GROQ_API_KEY = process.env.Groq;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Resend } from "resend";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, Timestamp, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import fs from 'fs';
import firebaseConfig from "./firebase-applet-config.js";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || '(default)');

async function ensureAuth() {
  if (!auth.currentUser) {
    try {
      await signInWithEmailAndPassword(auth, "admin@escom.com", "Edu@1508001");
      console.log("[SERVER_AUTH] Autenticação Firebase realizada com sucesso");
    } catch(e: any) {
      console.error("[SERVER_AUTH] Falha ao autenticar o servidor no Firebase:", e.message);
    }
  }
}
ensureAuth().catch(err => console.error("Initial auth failed:", err));

function calculateLeadScore(lead: any, auditData?: any): number {
  let score = 50;
  const titleLower = (lead.title || "").toLowerCase();
  const corporateTerms = ["shopping", "hospital", "universidade", "faculdade", "prefeitura", "governo", "estado", "corporation", "s.a.", "s/a", "holding", "banco", "itaú", "bradesco", "santander", "unimed", "drogasil", "raia", "supermercado", "carrefour", "extra", "pão de açúcar", "assai", "atacadao"];
  if (corporateTerms.some(term => titleLower.includes(term))) {
    return 5;
  }
  const ratingCount = lead.ratingCount || 0;
  if (ratingCount > 500) { score -= 20; }
  else if (ratingCount >= 20 && ratingCount <= 250) { score += 25; }
  else if (ratingCount > 0 && ratingCount < 10) { score -= 10; }
  const siteUrl = lead.website || lead.link || lead.site || "";
  if (siteUrl && siteUrl.length > 5) {
    if (auditData) {
      const issuesCount = auditData.issues?.length || 0;
      if (issuesCount >= 6) score += 20;
      else if (issuesCount <= 2) score -= 30;
      else score += 5;
    } else { score += 5; }
  } else { score += 25; }
  return Math.max(0, Math.min(100, score));
}

import { Resend } from "resend";

async function performUxAuditForLead(url: string, companyName: string, niche: string): Promise<any> {
  if (!process.env.GROQ_API_KEY) return null;
  try {
    let pageText = "";
    try {
      const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)" }});
      if (response.ok) {
        const html = await response.text();
        const $ = cheerio.load(html);
        $('script, style, nav, footer, header').remove();
        pageText = $("body").text().replace(/\s+/g, ' ').substring(0, 10000);
      }
    } catch (e) { console.warn("Could not fetch URL:", e); }
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    let promptText = "";
    if (pageText.length > 50) {
      promptText = 'Você é um diretor sênior de UX/UI, Heurísticas e CRO. Faça uma auditoria profunda no conteúdo extraído do site (' + url + '):\\n"' + pageText + '"';
    } else {
      promptText = 'Você é um diretor sênior de UX/UI, Heurísticas e CRO. O site alvo é: ' + url + '. Como não foi possível extrair o texto, use seu amplo conhecimento sobre esta marca ou deduza as informações com base no domínio e nome para fazer uma auditoria completa.';
    }
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "system", content: "You always return ONLY purely valid JSON, with absolutely NO markdown backticks." }, { role: "user", content: promptText + "\\n\\nRetorne APENAS JSON válido com summary e issues. Formato: { summary: string, brandAnalysis: { companyName, niche, audience, differentiators, tone, colors, primaryHex }, issues: [{ category, tab, title, description, recommendation }] }" }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      response_format: { type: "json_object" }
    });
    return JSON.parse(chatCompletion.choices[0].message.content || "{}");
  } catch (error) {
    console.error("[UX_AUDIT] Error auditing lead " + companyName + ":", error);
    return null;
  }
}

async function generateProspectSitePlanForLead(companyName: string, niche: string): Promise<any> {
  if (!process.env.GROQ_API_KEY) return null;
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You always return ONLY purely valid JSON, with absolutely NO markdown backticks." },
        { role: "user", content: 'Você é Edu Santos, especialista em design de landing pages e conversão. Crie um plano estratégico de prospecção de site para a empresa "' + companyName + '" do nicho "' + niche + '" que atualmente não possui site. Retorne JSON com summary, colors, tone, differentiators, sections.' }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });
    return JSON.parse(chatCompletion.choices[0].message.content || "{}");
  } catch (error) {
    console.error("[SITE_PLAN] Error:", error);
    return null;
  }
}

async function runMineraLeadsCron() {
  console.log("[CRON] Running daily Mineração de Sites finder at 6 AM...");
  if (!process.env.SERPER_API_KEY || !process.env.GROQ_API_KEY) { return; }
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "Você é um analista de marketing..." },
        { role: "user", content: "Gere uma frase curta de busca para Google Maps focada em comércios locais brasileiros que precisam de site." }
      ],
      model: "llama-3.3-70b-versatile", temperature: 0.9
    });
    let query = chatCompletion.choices[0]?.message?.content?.trim() || "Dentista em São Paulo";
    query = query.replace(/^["']|["']$/g, '');
    const response = await fetch("https://google.serper.dev/places", {
      method: "POST", headers: { "X-API-KEY": process.env.SERPER_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, gl: "br", hl: "pt-br" })
    });
    const searchData = JSON.parse(await response.text());
    const placesResults = searchData.places || [];
    await ensureAuth();
    const querySnapshot = await getDocs(collection(db, "leads"));
    const existingLeads = new Set(querySnapshot.docs.map(d => d.id));
    let addedCount = 0;
    for (const r of placesResults) {
      if (addedCount >= 30) break;
      const placeId = (r.cid || r.placeId || Date.now().toString()).toString();
      if (!existingLeads.has(placeId)) {
        const siteUrl = r.website || "";
        let auditData = null, sitePlan = null;
        const companyName = r.title || "Empresa";
        if (siteUrl) auditData = await performUxAuditForLead(siteUrl, companyName, query);
        else sitePlan = await generateProspectSitePlanForLead(companyName, query);
        const score = calculateLeadScore({ title: companyName, ratingCount: r.ratingCount, website: siteUrl }, auditData);
        if (score < 30) continue;
        await new Promise(r => setTimeout(r, 5000));
        await setDoc(doc(db, "leads", placeId), {
          title: companyName, address: r.address || "", phone: r.phoneNumber || "", website: siteUrl,
          rating: r.rating || 0, ratingCount: r.ratingCount || 0, placeId, status: 'pending',
          niche: query, auditData, sitePlan, score, createdAt: Date.now()
        });
        addedCount++;
        existingLeads.add(placeId);
      }
    }
    console.log("[CRON] Mined " + addedCount + " leads for query: " + query);
  } catch (error) { console.error("[CRON] Error:", error); }
}

console.log("Script loaded, file would be written...");
fs.writeFileSync("E:\\ANTIGRAVITY\\ESCOM_STUDIO\\api\\index.ts", "console.log('placeholder');", "utf8");
console.log("Done writing placeholder");
`;

fs.writeFileSync(path, content, "utf8");
console.log("Written: " + content.length + " bytes");
