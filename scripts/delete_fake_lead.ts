import { db } from "../src/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

async function deleteFakeLeads() {
  const q = collection(db, "leads");
  const snapshot = await getDocs(q);
  let deleted = 0;
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (data.nome && data.nome.includes("Silva")) {
      await deleteDoc(doc(db, "leads", docSnap.id));
      console.log(`Deletado lead falso: ${data.nome}`);
      deleted++;
    }
  }
  console.log(`Processo finalizado. Deletados: ${deleted}`);
  process.exit(0);
}

deleteFakeLeads();
