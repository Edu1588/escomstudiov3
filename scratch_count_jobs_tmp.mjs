import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

async function check() {
  await signInWithEmailAndPassword(auth, "admin@escom.com", "Edu@1508001");
  const snap = await getDocs(collection(db, "jobs"));
  console.log(`Total de vagas salvas: ${snap.size}`);
}

check().catch(console.error);
