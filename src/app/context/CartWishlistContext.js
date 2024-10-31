// src/context/CartWishlistContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { doc, setDoc, deleteDoc, collection, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const CartWishlistContext = createContext();

export const CartWishlistProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCartItems();
      fetchWishlistItems();
    } else {
      setCartItems([]);
      setWishlistItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;
    const cartRef = collection(db, 'users', user.uid, 'cart');
    const cartSnapshot = await getDocs(cartRef);
    setCartItems(cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

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

  const removeFromCart = async (productId) => {
    if (!user) return;
    const cartRef = doc(db, 'users', user.uid, 'cart', productId);
    await deleteDoc(cartRef);
    await fetchCartItems();
  };

  const addToWishlist = async (product) => {
    if (!user) return;
    const wishlistRef = doc(db, 'users', user.uid, 'wishlist', product.id);
    await setDoc(wishlistRef, { ...product, addedAt: serverTimestamp() });
    await fetchWishlistItems();
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    const wishlistRef = doc(db, 'users', user.uid, 'wishlist', productId);
    await deleteDoc(wishlistRef);
    await fetchWishlistItems();
  };

  const isInCart = (productId) => cartItems.some(item => item.id === productId);
  const isInWishlist = (productId) => wishlistItems.some(item => item.id === productId);

  return (
    <CartWishlistContext.Provider value={{
      cartItems,
      wishlistItems,
      addToCart,
      removeFromCart,
      addToWishlist,
      removeFromWishlist,
      isInCart,
      isInWishlist,
      fetchCartItems,
      fetchWishlistItems
    }}>
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => useContext(CartWishlistContext);