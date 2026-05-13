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
    const { getDocs, query, collection } = await import('firebase/firestore');
    const q = query(collection(db, 'portfolio_projects'));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.title || data.name || '',
        category: data.category || '',
        desc: data.description || data.desc || '',
        image: data.image || data.imageUrl || data.thumbnailUrl || '',
        score: data.score || '90%',
        destaque: data.featured || data.destaque || false,
        createdAt: data.createdAt,
      } as PortfolioProject;
    });
    return docs.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return [];
  }
};

export const savePortfolioProject = async (project: PortfolioProject) => {
  try {
    const { doc, setDoc, updateDoc } = await import('firebase/firestore');
    if (project.id) {
      const docRef = doc(db, 'portfolio_projects', project.id);
      const { id, ...data } = project;
      await updateDoc(docRef, {
        name: data.name,
        title: data.name,
        category: data.category,
        description: data.desc,
        desc: data.desc,
        image: data.image,
        imageUrl: data.image,
        score: data.score,
        featured: data.destaque,
        destaque: data.destaque
      });
      return { success: true, id: project.id };
    } else {
      const docRef = await addDoc(collection(db, 'portfolio_projects'), {
        name: project.name,
        title: project.name,
        category: project.category,
        description: project.desc,
        desc: project.desc,
        image: project.image,
        imageUrl: project.image,
        score: project.score,
        featured: project.destaque,
        destaque: project.destaque,
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
    await deleteDoc(doc(db, 'portfolio_projects', id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error };
  }
};

export interface ExternalProject {
  id?: string;
  name: string;
  desc: string;
  urlPaginaVendas: string;
  urlAdmin: string;
  observacao: string;
  createdAt?: any;
}

export const getExternalProjects = async () => {
  try {
    const { getDocs, query, collection } = await import('firebase/firestore');
    const q = query(collection(db, 'external_projects'));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExternalProject));
    return docs.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching external projects:", error);
    return [];
  }
};

export const saveExternalProject = async (project: ExternalProject) => {
  try {
    const { doc, setDoc, updateDoc } = await import('firebase/firestore');
    if (project.id) {
      const docRef = doc(db, 'external_projects', project.id);
      const { id, ...data } = project;
      await updateDoc(docRef, data);
      return { success: true, id: project.id };
    } else {
      const { id, ...data } = project;
      const docRef = await addDoc(collection(db, 'external_projects'), {
        ...data,
        createdAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    }
  } catch (error) {
    console.error("Error saving external project:", error);
    return { success: false, error };
  }
};

export const deleteExternalProject = async (id: string) => {
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'external_projects', id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting external project:", error);
    return { success: false, error };
  }
};
