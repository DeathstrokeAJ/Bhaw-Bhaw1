import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../../../firebaseConfig';
import { doc, setDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { AuthContext } from './AuthContext';

export const CartWishlistContext = createContext();

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

  const addToCart = async (product) => {
    if (!user) return;
    const cartRef = doc(db, 'users', user.uid, 'cart', product.id);
    await setDoc(cartRef, { ...product, addedAt: serverTimestamp() });
    await fetchCartItems();
  };

  const removeFromCart = async (id) => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid, 'cart', id), null);
    await fetchCartItems();
  };

  const fetchWishlistItems = async () => {
    if (!user) return;
    const wishlistRef = collection(db, 'users', user.uid, 'wishlist');
    const wishlistSnapshot = await getDocs(wishlistRef);
    setWishlistItems(wishlistSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addToWishlist = async (product) => {
    if (!user) return;
    const wishlistRef = doc(db, 'users', user.uid, 'wishlist', product.id);
    await setDoc(wishlistRef, { ...product, addedAt: serverTimestamp() });
    await fetchWishlistItems();
  };

  useEffect(() => {
    fetchCartItems();
    fetchWishlistItems();
  }, [user]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    wishlistItems,
    addToWishlist,
  };

  return (
    <CartWishlistContext.Provider value={value}>
      {children}
    </CartWishlistContext.Provider>
  );
};