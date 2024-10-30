// Ensure Firebase is initialized correctly
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBj5Ec8XNj9qSH-QXW4uaCugbMJeFzSBDA",
  authDomain: "bhaw-bhaw.firebaseapp.com",
  projectId: "bhaw-bhaw",
  storageBucket: "bhaw-bhaw.appspot.com",
  messagingSenderId: "560201072377",
  appId: "1:560201072377:web:e6de079fd4ecf076c5ac28",
  measurementId: "G-8H9K8L77X6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let analytics;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { db };
