// pages/product/ProductCard.js
"use client";
import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "../app/context/AuthContext"; // Adjust the path as necessary
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useRouter } from "next/navigation";

const ProductCard = ({ product, isRecommendation = false }) => {
  const router = useRouter();
  const { user } = useAuth(); // Get user from context
  const [userId, setUserId] = useState(null);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  const handleBuyNow = () => {
    const route = isRecommendation ? `/details` : `/productdetails`;
    sessionStorage.setItem("productId", product.id);
    router.push(route);
  };

  const handleAddToCart = async () => {
    try {
      if (!product?.id || !userId) throw new Error("Product ID or User ID is undefined");

      const cartRef = doc(db, "users", userId, "cart", product.id);

      if (isInCart) {
        await deleteDoc(cartRef);
        alert("Product removed from cart!");
      } else {
        await setDoc(cartRef, {
          ...product,
          addedAt: serverTimestamp(),
        });
        alert("Product added to cart successfully!");
      }

      setIsInCart((prev) => !prev);
    } catch (error) {
      alert("Error updating cart: " + error.message);
      console.error("Error updating cart:", error);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      if (!product?.id || !userId) throw new Error("Product ID or User ID is undefined");

      const wishlistRef = doc(db, "users", userId, "wishlist", product.id);
      await setDoc(wishlistRef, {
        ...product,
        addedAt: serverTimestamp(),
      });
      alert("Product added to wishlist!");
    } catch (error) {
      alert("Error adding to wishlist: " + error.message);
      console.error("Error adding to wishlist:", error);
    }
  };

  useEffect(() => {
    const checkCartStatus = async () => {
      if (userId) {
        const cartDoc = await doc(db, "users", userId, "cart", product.id).get();
        setIsInCart(cartDoc.exists());
      }
    };

    checkCartStatus();
  }, [userId, product.id]);

  return (
    <div className="relative rounded font-montserrat overflow-hidden p-4 group shadow-lg bg-white">
      <div className="absolute top-4 right-4 p-2 rounded-full bg-black shadow-md hover:bg-gray-200 focus:outline-none">
        <img
          src="/images/common/heart.png"
          alt="wishlist"
          className="w-4 h-4 cursor-pointer"
          onClick={handleAddToWishlist}
        />
      </div>

      <div className="bg-[#F3EAE7] mx-3 py-1 rounded-lg mt-6">
        <img
          className="w-full h-48 object-contain"
          src={product.images}
          alt={product.title}
        />
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
        <h3 className="text-white text-lg font-bold">{product.title}</h3>
        <p className="text-white">${product.price}</p>
        <button
          className="bg-baw-red text-white py-2 px-4 rounded mt-2"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
        <button
          className="bg-gray-300 text-black py-1 px-3 rounded mt-2"
          onClick={handleAddToCart}
        >
          {isInCart ? "Remove from Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
