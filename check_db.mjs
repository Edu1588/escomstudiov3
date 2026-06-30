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
  console.log("Autenticado com sucesso!");

  // Listar Generated Sites
  const sitesSnap = await getDocs(collection(db, "generated_sites"));
  console.log(`\n=== GENERATED SITES (${sitesSnap.size}) ===`);
  sitesSnap.forEach(d => {
    const data = d.data();
    console.log(`ID: ${d.id}`);
    console.log(`Company: ${data.companyName}`);
    console.log(`Status: ${data.status}`);
    console.log(`HTML URL: ${data.htmlUrl}`);
    console.log(`Deployed URL: ${data.deployedUrl}`);
    console.log('-----------------');
  });

  // Listar Leads
  const leadsSnap = await getDocs(collection(db, "leads"));
  console.log(`\n=== LEADS (${leadsSnap.size}) ===`);
  leadsSnap.forEach(d => {
    const data = d.data();
    console.log(`ID: ${d.id}`);
    console.log(`Title: ${data.title}`);
    console.log(`Website: ${data.website}`);
    console.log(`Status: ${data.status}`);
    console.log('-----------------');
  });
}

check().catch(console.error);
