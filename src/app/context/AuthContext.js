"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const userId = sessionStorage.getItem('userId');

      if (userId) {
        try {
          const userRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUser({ id: userDoc.id, ...userDoc.data() });
          } else {
            setUser(null);
            sessionStorage.removeItem('userId');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
          sessionStorage.removeItem('userId');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    setUser(null);
  };

  const value = {
    user,
    setUser,
    loading,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
