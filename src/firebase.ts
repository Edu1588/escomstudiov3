import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);

export const saveLead = async (data: { name: string; email: string; phone?: string; message: string }) => {
  try {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...data,
      status: 'novo',
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving lead:", error);
    return { success: false, error };
  }
};

export interface PortfolioProject {
  id?: string;
  name: string;
  category: string;
  desc: string;
  image: string;
  score: string;
  destaque: boolean;
  createdAt?: any;
}

export const getPortfolioProjects = async () => {
  try {
    const { getDocs, query, orderBy } = await import('firebase/firestore');
    const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioProject));
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return [];
  }
};

export const savePortfolioProject = async (project: PortfolioProject) => {
  try {
    const { doc, setDoc, updateDoc } = await import('firebase/firestore');
    if (project.id) {
      const docRef = doc(db, 'portfolio', project.id);
      const { id, ...data } = project;
      await updateDoc(docRef, data);
      return { success: true, id: project.id };
    } else {
      const { id, ...data } = project;
      const docRef = await addDoc(collection(db, 'portfolio'), {
        ...data,
        createdAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    }
  } catch (error) {
    console.error("Error saving project:", error);
    return { success: false, error };
  }
};

export const deletePortfolioProject = async (id: string) => {
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'portfolio', id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error };
  }
};
