import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc } from "firebase/firestore";
import fs from "fs";

async function main() {
  const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
  const app = initializeApp(config);
  const db = getFirestore(app);
  
  const snap = await getDocs(collection(db, "leads"));
  let removed = 0;
  for (const item of snap.docs) {
     const data = item.data();
     const name = (data.title || data.name || "").toLowerCase();
     const hasPhone = data.phone && data.phone !== "Sem telefone";
     if (!hasPhone || name.includes("criação") || name.includes("site") || name.includes("agência") || name.includes("marketing") || name.includes("web") || name.includes("desenvolvimento")) {
         try {
             await deleteDoc(item.ref);
             removed++;
         } catch(e) {}
     }
  }
  console.log("Removed " + removed + " bad leads");
  process.exit(0);
}
main();
