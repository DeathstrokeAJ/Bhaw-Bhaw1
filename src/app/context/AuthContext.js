// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      // Example: Fetch user data here if needed
      const userId = sessionStorage.getItem('userId'); // Or any other logic
      if (userId) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        setUser({ uid: userId, ...userDoc.data() });
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const value = {
    user,
    setUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
