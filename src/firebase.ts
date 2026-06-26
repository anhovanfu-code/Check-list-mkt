import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Configuration from firebase-applet-config.json
const firebaseConfig = {
  projectId: "gen-lang-client-0977264813",
  appId: "1:418218050420:web:6978cf3b97ebd67b036221",
  apiKey: "AIzaSyCZhtajUmYjhidCaV8RKoQRa6xtrtragiY",
  authDomain: "gen-lang-client-0977264813.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-qunlnhmmedia-dc943aa8-bd91-4bb3-b117-750cdd594c17",
  storageBucket: "gen-lang-client-0977264813.firebasestorage.app",
  messagingSenderId: "418218050420"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Standard validation connection to Firestore (as instructed by system skills)
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or network status.");
    }
  }
}

testConnection();
