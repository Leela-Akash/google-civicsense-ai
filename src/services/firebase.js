import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, doc, setDoc } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAIu_lzxpDVR0sPXNzbdkariOmuxxHHRRQ",
  authDomain: "ai-civic-voice.firebaseapp.com",
  projectId: "ai-civic-voice",
  storageBucket: "ai-civic-voice.firebasestorage.app",
  messagingSenderId: "207855789486",
  appId: "1:207855789486:web:f673c2ba23446a65da543f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// 🔥 CONNECT TO EMULATORS (LOCAL DEVELOPMENT ONLY)
if (typeof window !== 'undefined' && window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
}

// Store user data in Firestore
const storeUserData = async (user, additionalData = {}) => {
  await setDoc(
    doc(db, "users", user.uid),
    {
      name: user.displayName || additionalData.name,
      email: user.email,
      photo: user.photoURL || null,
      uid: user.uid,
      createdAt: new Date(),
      lastLogin: new Date(),
      ...additionalData
    },
    { merge: true }
  );
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await storeUserData(user);
    console.log("Google sign-in successful:", user.uid);
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Email/Password Registration
export const registerWithEmail = async (email, password, name) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update display name
    await updateProfile(user, { displayName: name });
    
    // Store in Firestore
    await storeUserData(user, { name });
    
    console.log("Email registration successful:", user.uid);
    return user;
  } catch (error) {
    console.error("Error registering with email:", error);
    throw error;
  }
};

// Email/Password Sign In
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Update last login
    await setDoc(
      doc(db, "users", user.uid),
      { lastLogin: new Date() },
      { merge: true }
    );
    
    console.log("Email sign-in successful:", user.uid);
    return user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

// Sign Out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export default app;
