import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';
import { readFileSync, writeFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function printSchema() {
  try {
    let output = "";
    const collections = ['proposals', 'generated_sites', 'leads', 'contracts'];
    for (const colName of collections) {
      output += `=== Coleção: ${colName} ===\n`;
      const snap = await getDocs(query(collection(db, colName), limit(1)));
      if (snap.empty) {
        output += `  (Vazia)\n`;
      } else {
        snap.forEach(doc => {
          output += `  Chaves do Documento (${doc.id}):\n`;
          output += JSON.stringify(Object.keys(doc.data())) + "\n";
          output += `  Valores de amostra:\n`;
          const data = doc.data();
          const sample = {};
          for (const k in data) {
            if (typeof data[k] !== 'object') {
              sample[k] = data[k];
            } else {
              sample[k] = `[Object / Array]`;
            }
          }
          output += JSON.stringify(sample, null, 2) + "\n";
        });
      }
      output += "-----------------------------------------\n";
    }
    writeFileSync('schema_output.txt', output, 'utf8');
    console.log("Esquema salvo em schema_output.txt");
  } catch (err) {
    console.error("Erro ao imprimir chaves:", err);
  }
}

printSchema();
