"use client";
import React, { useEffect, useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useRouter } from "next/navigation";

const ProductCard = ({ product, isRecommendation = false }) => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);

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
      await setDoc(cartRef, {
        ...product,
        addedAt: serverTimestamp(),
      });
      alert("Product added to cart successfully!");
    } catch (error) {
      alert("Error adding to cart: " + error.message);
      console.error("Error adding to cart:", error);
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

      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleBuyNow}
          className="bg-white text-orange-500 font-bold py-2 px-4 mb-2 rounded"
        >
          Buy Now
        </button>
        <button
          onClick={handleAddToCart}
          className="border border-white text-white font-bold py-2 px-4 rounded mb-4"
        >
          Add to Cart
        </button>
        <div className="flex space-x-6">
          <button className="text-white text-sm">Share</button>
          <button className="text-white text-sm">Compare</button>
          <button onClick={handleAddToWishlist} className="text-white text-sm">
            Like
          </button>
        </div>
      </div>

      <div className="py-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-black text-lg text-[#2C2C2C]">{product.title}</h3>
          <span className="text-lg font-semibold text-gray-800">
            ₹{product.price}
          </span>
        </div>

        <p className="text-gray-700 my-5 text-sm w-64">{product.description}</p>

        <div className="flex items-center">
          {Array.from({ length: Math.floor(product.rating) }, (_, index) => (
            <img
              key={index}
              src="/images/common/star.png"
              alt="star"
              className="w-6 h-6"
            />
          ))}
          <span className="text-gray-600 text-sm ml-4">({product.reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
