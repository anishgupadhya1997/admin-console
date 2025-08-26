// Firebase Firestore Configuration for CyberLearn Admin Console
// This version only handles data persistence, not authentication

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyA51AgJLb8c-PUQ71ewQz5DAEL25d2AOFo",
    authDomain: "cyberaccend.firebaseapp.com",
    projectId: "cyberaccend",
    storageBucket: "cyberaccend.firebasestorage.app",
    messagingSenderId: "110562767185",
    appId: "1:110562767185:web:219eb88b0b911d34a3a370",
    measurementId: "G-66KWD7KJ0L"
};

console.log('🔧 Loading Firebase Firestore configuration...');

// Load Firebase SDK via script tags (Firestore only)
function loadFirebaseFirestore() {
    return new Promise((resolve, reject) => {
        // Firebase App
        const appScript = document.createElement('script');
        appScript.src = 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js';
        appScript.onload = () => {
            console.log('✅ Firebase App loaded');
            
            // Firebase Firestore
            const firestoreScript = document.createElement('script');
            firestoreScript.src = 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore-compat.js';
            firestoreScript.onload = () => {
                console.log('✅ Firebase Firestore loaded');
                
                // Initialize Firebase
                try {
                    const app = firebase.initializeApp(firebaseConfig);
                    const db = firebase.firestore();
                    
                    console.log('🔥 Firebase Firestore initialized');
                    console.log('📊 Firestore DB:', db);
                    
                    // Make Firestore available globally
                    window.db = db;
                    
                    // Dispatch custom event to notify app that Firestore is ready
                    const firestoreReadyEvent = new CustomEvent('firestoreReady');
                    document.dispatchEvent(firestoreReadyEvent);
                    console.log('📡 Firestore ready event dispatched');
                    
                    resolve();
                    
                } catch (error) {
                    console.error('❌ Firebase Firestore initialization failed:', error);
                    reject(error);
                }
            };
            firestoreScript.onerror = reject;
            document.head.appendChild(firestoreScript);
        };
        appScript.onerror = reject;
        document.head.appendChild(appScript);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFirebaseFirestore);
} else {
    loadFirebaseFirestore();
}
