import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.production.local' });

console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Encontrada" : "Não encontrada");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Olá, me diga qual é o seu modelo e se está funcionando.',
    });
    console.log("Resposta do Gemini:", response.text);
  } catch (err) {
    console.error("Erro no Gemini:", err);
  }
}
main();
