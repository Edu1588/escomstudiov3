import { db } from "./firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, setDoc, increment } from "firebase/firestore";

export async function logPageView(pageName: string) {
  try {
    const pageRef = doc(db, "page_views", pageName);
    await setDoc(pageRef, {
      viewCount: increment(1),
      lastViewed: serverTimestamp()
    }, { merge: true });
    
    // Also store daily for the charts
    const today = new Date().toISOString().split('T')[0];
    const dailyRef = doc(db, "daily_views", today);
    await setDoc(dailyRef, {
      viewCount: increment(1)
    }, { merge: true });

  } catch (error) {
    console.warn("Analytics not saved (permissions or disabled):", error);
  }
}
