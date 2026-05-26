import 'dotenv/config';

console.log("Keys available:");
console.log("SERPER_API_KEY:", !!process.env.SERPER_API_KEY);
console.log("GROQ_API_KEY:", !!process.env.GROQ_API_KEY);
