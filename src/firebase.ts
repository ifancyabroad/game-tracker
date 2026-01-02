// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAmpt7bllpvaTxyt3QzZ-sUv5NOsAkL7_s",
	authDomain: "game-tracker-1d562.firebaseapp.com",
	projectId: "game-tracker-1d562",
	storageBucket: "game-tracker-1d562.firebasestorage.app",
	messagingSenderId: "126926780782",
	appId: "1:126926780782:web:877f421797b232a760697f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

// Initialize Authentication and get a reference to the service
export const auth = getAuth(app);

// Secondary auth instance for creating users without affecting current session
// This is the recommended approach for admin user creation
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
export const secondaryAuth = getAuth(secondaryApp);
