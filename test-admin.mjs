import admin from "firebase-admin";

async function test() {
  try {
    admin.initializeApp();
    const db = admin.firestore();
    await db.collection("test").doc("test").set({ test: true });
    console.log("Success with default creds!");
    process.exit(0);
  } catch (e) {
    console.error("Failed:", e);
    process.exit(1);
  }
}
test();
