import { initializeApp } from 'firebase/app';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync(new URL('./firebase-applet-config.json', import.meta.url)));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function deleteProjects() {
  const generatedSitesToDelete = [
    '16689071719369495606', // Miami
    '7160536542187121912',  // Fabiana
    '8244073350648594250',  // Elizabete
    'proj_salles_nogueira'  // Salles Nogueira
  ];

  const leadsToDelete = [
    'miami_chiropractic_wellness',
    'place_fabiana_beltrao_test',
    'dra_elizabete_curitiba'
    // Salles might not be in leads, or under another ID, but we delete what we know
  ];

  for (const id of generatedSitesToDelete) {
    try {
      await deleteDoc(doc(db, 'generated_sites', id));
      console.log('Deleted generated_site:', id);
    } catch (e) {
      console.error('Failed to delete generated_site:', id, e);
    }
  }

  for (const id of leadsToDelete) {
    try {
      await deleteDoc(doc(db, 'leads', id));
      console.log('Deleted lead:', id);
    } catch (e) {
      console.error('Failed to delete lead:', id, e);
    }
  }
}

deleteProjects();
