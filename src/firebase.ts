import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config';

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
  client?: string;
  title?: string;
  category: string;
  tag?: string;
  tagType?: string;
  desc?: string;
  deliverables?: string;
  image?: string;
  video?: string;
  link?: string;
  url?: string;
  year?: string;
  score?: string;
  badges?: string[];
  destaque?: boolean;
  featured?: boolean;
  createdAt?: any;
}

export const getPortfolioProjects = async (): Promise<PortfolioProject[]> => {
  try {
    const { getDocs, query, collection } = await import('firebase/firestore');
    const q = query(collection(db, 'portfolio_projects'));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => {
      const data = doc.data();
      const clientName = data.client || data.name || data.title || '';
      const projTitle = data.title || data.name || '';
      const rawBadges = data.badges;
      const parsedBadges = Array.isArray(rawBadges)
        ? rawBadges
        : typeof rawBadges === 'string' && rawBadges.trim()
        ? rawBadges.split(',').map((s: string) => s.trim())
        : ['DEV', 'SOTD'];

      return {
        id: doc.id,
        name: clientName,
        client: clientName,
        title: projTitle,
        category: data.category || 'WEBSITE',
        tag: data.tag || data.tagType || 'WEBSITE',
        tagType: data.tagType || data.tag || 'WEBSITE',
        desc: data.description || data.desc || data.deliverables || '',
        deliverables: data.deliverables || data.desc || '',
        image: data.image || data.imageUrl || data.thumbnailUrl || data.thumb || '',
        video: data.video || data.videoUrl || '',
        link: data.link || data.url || '',
        url: data.url || data.link || '',
        year: data.year ? String(data.year) : '2025',
        score: data.score || '95%',
        badges: parsedBadges,
        destaque: data.destaque ?? data.featured ?? true,
        featured: data.destaque ?? data.featured ?? true,
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

export const savePortfolioProject = async (project: Partial<PortfolioProject>) => {
  try {
    const { doc, setDoc, updateDoc } = await import('firebase/firestore');
    const clientName = project.client || project.name || '';
    const projTitle = project.title || project.name || '';
    const badgesArray = Array.isArray(project.badges)
      ? project.badges
      : typeof project.badges === 'string'
      ? (project.badges as string).split(',').map((s: string) => s.trim()).filter(Boolean)
      : ['DEV', 'SOTD'];

    const payload = {
      name: clientName,
      client: clientName,
      title: projTitle,
      category: project.category || 'WEBSITE',
      tag: project.tag || project.tagType || 'WEBSITE',
      tagType: project.tagType || project.tag || 'WEBSITE',
      desc: project.desc || project.deliverables || '',
      description: project.desc || project.deliverables || '',
      deliverables: project.deliverables || project.desc || '',
      image: project.image || '',
      imageUrl: project.image || '',
      video: project.video || '',
      videoUrl: project.video || '',
      link: project.link || project.url || '',
      url: project.url || project.link || '',
      year: project.year || '2025',
      score: project.score || '95%',
      badges: badgesArray,
      featured: project.destaque ?? project.featured ?? true,
      destaque: project.destaque ?? project.featured ?? true,
    };

    if (project.id) {
      const docRef = doc(db, 'portfolio_projects', project.id);
      await updateDoc(docRef, payload);
      return { success: true, id: project.id };
    } else {
      const docRef = await addDoc(collection(db, 'portfolio_projects'), {
        ...payload,
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

export interface Experience {
  id?: string;
  role: string;
  company: string;
  period: string;
  location: string;
  desc: string;
  createdAt?: any;
}

export const getExperiences = async () => {
  try {
    const { getDocs, query, collection } = await import('firebase/firestore');
    const q = query(collection(db, 'experiences'));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Experience));
    return docs.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
};

export const saveExperience = async (experience: Experience) => {
  try {
    const { doc, setDoc, updateDoc } = await import('firebase/firestore');
    if (experience.id) {
      const docRef = doc(db, 'experiences', experience.id);
      const { id, ...data } = experience;
      await updateDoc(docRef, data);
      return { success: true, id: experience.id };
    } else {
      const { id, ...data } = experience;
      const docRef = await addDoc(collection(db, 'experiences'), {
        ...data,
        createdAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    }
  } catch (error) {
    console.error("Error saving experience:", error);
    return { success: false, error };
  }
};

export const deleteExperience = async (id: string) => {
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'experiences', id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting experience:", error);
    return { success: false, error };
  }
};

