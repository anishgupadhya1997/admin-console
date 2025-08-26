// Firebase Configuration for CyberLearn Admin Console
// This connects your admin console to your Firebase project

// Your Firebase config (from Firebase Console -> Project Settings -> General -> Your apps)
const firebaseConfig = {
    apiKey: "AIzaSyA51AgJLb8c-PUQ71ewQz5DAEL25d2AOFo",
    authDomain: "cyberaccend.firebaseapp.com",
    projectId: "cyberaccend",
    storageBucket: "cyberaccend.firebasestorage.app",
    messagingSenderId: "110562767185",
    appId: "1:110562767185:web:219eb88b0b911d34a3a370",
    measurementId: "G-66KWD7KJ0L"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firebase services for use in app.js
window.db = db;
window.auth = auth;
window.firebaseServices = {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
};

console.log("🔥 Firebase initialized successfully!");
console.log("📊 Database:", db);
console.log("🔐 Auth:", auth);