"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../../../firebaseConfig';
import { doc, setDoc, deleteDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from './AuthContext';

export const CartWishlistContext = createContext();

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error('useCartWishlist must be used within a CartWishlistProvider');
  }
  return context;
};

export const CartWishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const fetchCartItems = async () => {
    if (!user) return;
    const cartRef = collection(db, 'users', user.uid, 'cart');
    const cartSnapshot = await getDocs(cartRef);
    setCartItems(cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Add the missing fetchWishlistItems function
  const fetchWishlistItems = async () => {
    if (!user) return;
    const wishlistRef = collection(db, 'users', user.uid, 'wishlist');
    const wishlistSnapshot = await getDocs(wishlistRef);
    setWishlistItems(wishlistSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addToCart = async (product) => {
    if (!user) return;
    const cartRef = doc(db, 'users', user.uid, 'cart', product.id);
    await setDoc(cartRef, { ...product, addedAt: serverTimestamp() });
    await fetchCartItems();
  };

  const removeFromCart = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'cart', id));
    await fetchCartItems();
  };

  const isInCart = (id) => cartItems.some(item => item.id === id);

  const addToWishlist = async (product) => {
    if (!user) return;
    const wishlistRef = doc(db, 'users', user.uid, 'wishlist', product.id);
    await setDoc(wishlistRef, { ...product, addedAt: serverTimestamp() });
    await fetchWishlistItems();
  };

  const removeFromWishlist = async (id) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'wishlist', id));
    await fetchWishlistItems();
  };

  const isInWishlist = (id) => wishlistItems.some(item => item.id === id);

  useEffect(() => {
    if (user) {
      fetchCartItems();
      fetchWishlistItems();
    }
  }, [user]);

  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    isInCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchCartItems,
    fetchWishlistItems
  };

  return (
    <CartWishlistContext.Provider value={value}>
      {children}
    </CartWishlistContext.Provider>
  );
};