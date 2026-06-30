import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';

async function run() {
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const docId = "16362500771644110426";
    const data = {
      projectId: docId,
      companyName: "Clínica Odontológica Restauração",
      niche: "Clínica Odontológica",
      screenId: "d0aefb2fabe24fd5819ec7029356002c",
      status: "pending", // pending | approved | rejected
      score: 95,
      createdAt: Date.now(),
      htmlUrl: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzg4MmJmYjA1Nzk5ZDQ1ODdhOTJkMzAyMWQzZDM4YjUxEgsSBxCCh-eE8AMYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjM2MjUwMDc3MTY0NDExMDQyNg&filename=&opi=96797242",
      deployedUrl: ""
    };

    await setDoc(doc(db, "generated_sites", docId), data);
    console.log("Stitch site registration success for doc ID:", docId);
    process.exit(0);
  } catch (e) {
    console.error("Error writing to Firestore:", e);
    process.exit(1);
  }
}
run();
