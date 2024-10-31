// Firebase initialization for Firestore and optional Analytics
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBj5Ec8XNj9qSH-QXW4uaCugbMJeFzSBDA",
  authDomain: "bhaw-bhaw.firebaseapp.com",
  projectId: "bhaw-bhaw",
  storageBucket: "bhaw-bhaw.appspot.com",
  messagingSenderId: "560201072377",
  appId: "1:560201072377:web:e6de079fd4ecf076c5ac28",
  measurementId: "G-8H9K8L77X6"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics if supported
let analytics;
isSupported()
  .then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  })
  .catch(error => {
    console.error("Analytics support check failed:", error);
  });

// Export Firestore and Analytics (if initialized)
export { db, analytics };
