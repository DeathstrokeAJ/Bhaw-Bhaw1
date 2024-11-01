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
      const userId = sessionStorage.getItem('userId'); // Get userId from session storage
      if (userId) {
        try {
          const userRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUser({ id: userDoc.id, ...userDoc.data() });
          } else {
            setUser(null); // Reset user if not found
            sessionStorage.removeItem('userId'); // Clear session storage if user not found
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null); // Reset user in case of error
          sessionStorage.removeItem('userId'); // Clear session storage on error
        }
      } else {
        setUser(null); // No userId found, reset user state
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('userId'); // Clear userId on logout
    setUser(null); // Reset user state
  };

  const value = {
    user,
    setUser, // This allows components to set the user
    loading,
    handleLogout, // Providing a logout handler
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
