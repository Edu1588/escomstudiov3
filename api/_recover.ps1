$path = "E:\ANTIGRAVITY\ESCOM_STUDIO\api\index.ts"
$content = @'
import express from "express";
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
'@
Set-Content -Path $path -Value $content -Encoding UTF8
Write-Host "Part 1 written: $($content.Length) bytes"
