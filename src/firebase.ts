// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyD_gll1yn2pcjJX2sKr6A9i5OtAdIS89r8",
	authDomain: "game-tracker-platform.firebaseapp.com",
	projectId: "game-tracker-platform",
	storageBucket: "game-tracker-platform.firebasestorage.app",
	messagingSenderId: "539376273880",
	appId: "1:539376273880:web:c50855cbfd5eda9be08aad",
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
