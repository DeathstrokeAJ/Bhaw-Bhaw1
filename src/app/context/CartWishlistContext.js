"use client";
import React, { createContext, useContext, useState } from "react";
import { db } from "../../../firebaseConfig"; // Ensure your Firebase config is correct
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions if needed
import { useAuth } from "../../app/context/AuthContext"; // Import AuthContext to access user information

export const CartWishlistContext = createContext(); // Ensure this is exported

export const CartWishlistProvider = ({ children }) => {
  const { user } = useAuth(); // Access user from AuthContext
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null); // New state for selected product ID

  const addToCart = async (product) => {
    if (!user) return; // Ensure user is logged in
    // Add product to cart state
    setCart((prevCart) => [...prevCart, product]);
    const docRef = doc(db, "users", user.uid, "cart", product.id);
    await setDoc(docRef, product); // Save product in Firestore under user's cart
  };

  const removeFromCart = async (productId) => {
    if (!user) return; // Ensure user is logged in
    // Remove product from cart state
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
    const docRef = doc(db, "users", user.uid, "cart", productId);
    await setDoc(docRef, { deleted: true }); // Mark as deleted or remove from Firestore
  };

  const addToWishlist = async (product) => {
    if (!user) return; // Ensure user is logged in
    // Add product to wishlist state
    setWishlist((prevWishlist) => [...prevWishlist, product]);
    const docRef = doc(db, "users", user.uid, "wishlist", product.id);
    await setDoc(docRef, product); // Save product in Firestore under user's wishlist
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return; // Ensure user is logged in
    // Remove product from wishlist state
    setWishlist((prevWishlist) => prevWishlist.filter(item => item.id !== productId));
    const docRef = doc(db, "users", user.uid, "wishlist", productId);
    await setDoc(docRef, { deleted: true }); // Mark as deleted or remove from Firestore
  };

  return (
    <CartWishlistContext.Provider value={{
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      addToWishlist,
      removeFromWishlist,
      selectedProductId, // Expose selected product ID
      setSelectedProductId, // Function to set selected product ID
    }}>
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  return useContext(CartWishlistContext); // Make sure this is exported
};