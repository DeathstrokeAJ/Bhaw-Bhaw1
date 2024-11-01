"use client";
import React, { createContext, useContext, useState } from "react";
import { db } from "../../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../../app/context/AuthContext";

export const CartWishlistContext = createContext();

export const CartWishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const addToCart = async (product) => {
    if (!user) return;
    const newCart = [...cart, product];
    setCart(newCart);
    await setDoc(doc(db, "users", user.uid, "cart", product.id), product);
  };
  const addToWishlist = async (product) => {
    if (!user) return;
    setWishlist((prevWishlist) => [...prevWishlist, product]);
    const docRef = doc(db, "users", user.uid, "wishlist", product.id);
    await setDoc(docRef, product);
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== productId));
    const docRef = doc(db, "users", user.uid, "wishlist", productId);
    await setDoc(docRef, { deleted: true });
  };
  const removeFromCart = async (productId) => {
    if (!user) return;
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    await setDoc(doc(db, "users", user.uid, "cart", productId), { deleted: true });
  };

  const updateCartItemQuantity = async (productId, newQuantity) => {
    if (!user) return;
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    await setDoc(doc(db, "users", user.uid, "cart", productId), { quantity: newQuantity }, { merge: true });
  };

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        updateCartItemQuantity,
        selectedProductId,
        setSelectedProductId,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};


export const useCartWishlist = () => {
  return useContext(CartWishlistContext);
};
