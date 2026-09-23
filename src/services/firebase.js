import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

// Your web app's Firebase configuration
// Provide these in your .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only if the config is provided (prevents crashing if not set up yet)
const app = (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_api_key_here') ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;

/**
 * Submits a new field report to Firebase Firestore
 */
export const submitFieldReport = async (reportData) => {
  if (!db) {
    console.warn("Firebase is not initialized. Using local state fallback.");
    return { ...reportData, id: Date.now(), status: 'pending (local)', timestamp: new Date().toISOString() };
  }
  
  try {
    const docRef = await addDoc(collection(db, 'field_reports'), {
      ...reportData,
      status: 'pending',
      timestamp: new Date().toISOString()
    });
    return { ...reportData, id: docRef.id, status: 'pending' };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

/**
 * Listens to all field reports in real-time from Firestore
 */
export const listenToFieldReports = (callback) => {
  if (!db) {
    callback([]);
    return () => {}; 
  }
  
  const q = query(collection(db, 'field_reports'), orderBy('timestamp', 'desc'));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const reports = [];
    querySnapshot.forEach((doc) => {
      reports.push({ id: doc.id, ...doc.data() });
    });
    callback(reports);
  });
  
  return unsubscribe;
};
