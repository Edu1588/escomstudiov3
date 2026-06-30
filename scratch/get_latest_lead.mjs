import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const configObj = {
  projectId: "escom-studio-portfolio",
  appId: "1:885439718303:web:531fc4658dd499cde713aa",
  apiKey: "AIzaSyDjDQAtyv_csEsFVZRsj1gYPLy81eDYKA8",
  authDomain: "escom-studio-portfolio.firebaseapp.com",
  firestoreDatabaseId: "(default)",
  storageBucket: "escom-studio-portfolio.firebasestorage.app",
  messagingSenderId: "885439718303",
  measurementId: ""
};

const firebaseApp = initializeApp(configObj);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp, '(default)');

async function run() {
  try {
    console.log("Autenticando no Firebase...");
    await signInWithEmailAndPassword(auth, "admin@escom.com", "Edu@1508001");
    console.log("Autenticado! Buscando o último site gerado...");

    const q = query(
      collection(db, 'generated_sites'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("Nenhum site gerado encontrado na coleção 'generated_sites'.");
    } else {
      console.log("\n=== Últimos Sites Gerados (Ordenados por Data) ===");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`- ID: ${doc.id}`);
        console.log(`  Empresa: ${data.name || data.companyName || data.title}`);
        console.log(`  Nicho: ${data.niche}`);
        console.log(`  Data: ${data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt}`);
        console.log(`  Status: ${data.status}`);
        console.log("-----------------------------------------");
      });
    }
  } catch (err) {
    console.error("Erro durante a execução:", err);
  } finally {
    process.exit(0);
  }
}

run();
