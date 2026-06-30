import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "escom-studio-portfolio",
  appId: "1:885439718303:web:531fc4658dd499cde713aa",
  apiKey: "AIzaSyDjDQAtyv_csEsFVZRsj1gYPLy81eDYKA8",
  authDomain: "escom-studio-portfolio.firebaseapp.com",
  firestoreDatabaseId: "(default)",
  storageBucket: "escom-studio-portfolio.firebasestorage.app",
  messagingSenderId: "885439718303",
  measurementId: ""
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

async function run() {
  await signInWithEmailAndPassword(auth, "admin@escom.com", "Edu@1508001");
  console.log("Autenticado com sucesso!");

  const docRef = doc(db, "generated_sites", "12943424911819052785");
  await updateDoc(docRef, {
    deployedUrl: ""
  });
  console.log("URL de deploy do Silva & Associados Advocacia atualizada para vazia com sucesso!");
}

run().catch(console.error);
