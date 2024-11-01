"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../app/context/AuthContext";
import { useCartWishlist } from "../app/context/CartWishlistContext";
import { useRouter } from "next/navigation";
import { doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import toast from 'react-hot-toast'; // Optional: for better notifications

const ProductCard = ({ product, isRecommendation = false }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, removeFromCart, addToWishlist, removeFromWishlist } = useCartWishlist();
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
    
  useEffect(() => {
    const checkProductStatus = async () => {
      if (user && product) {
        // Check cart status
        const cartDocRef = doc(db, "users", user.uid, "cart", product.id);
        const cartDoc = await getDoc(cartDocRef);
        setIsProductInCart(cartDoc.exists());

        // Check wishlist status
        const wishlistDocRef = doc(db, "users", user.uid, "wishlist", product.id);
        const wishlistDoc = await getDoc(wishlistDocRef);
        setIsInWishlist(wishlistDoc.exists());
      }
    };
    checkProductStatus();
  }, [user, product]);

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please sign in to continue");
      router.push('/signin');
      return;
    }
    const route = isRecommendation ? `/details/${product.id}` : `/productdetails/${product.id}`;
    router.push(route);
  };

  const handleCartAction = async () => {
    if (!user) {
      toast.error("Please sign in to continue");
      router.push('/Signin');
      return;
    }

    setLoading(true); // Start loading
    try {
      if (isProductInCart) {
        await removeFromCart(product.id);
        setIsProductInCart(false);
        toast.success("Product removed from cart");
      } else {
        await addToCart({
          ...product,
          addedAt: serverTimestamp(),
        });
        setIsProductInCart(true);
        toast.success("Product added to cart");
      }
    } catch (error) {
      toast.error("Error updating cart: " + error.message);
      console.error("Error updating cart:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleWishlistAction = async () => {
    if (!user) {
      toast.error("Please sign in to continue");
      router.push('/Signin');
      return;
    }

    setLoading(true); // Start loading
    try {
      if (isInWishlist) {
        await removeFromWishlist(product.id);
        setIsInWishlist(false);
        toast.success("Product removed from wishlist");
      } else {
        await addToWishlist({
          ...product,
          addedAt: serverTimestamp(),
        });
        setIsInWishlist(true);
        toast.success("Product added to wishlist");
      }
    } catch (error) {
      toast.error("Error updating wishlist: " + error.message);
      console.error("Error updating wishlist:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Error sharing: " + error.message);
      console.error("Error sharing:", error);
    }
  };

  const handleCompare = () => {
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    if (!compareList.some(item => item.id === product.id)) {
      compareList.push(product);
      localStorage.setItem('compareList', JSON.stringify(compareList));
      toast.success("Product added to compare list");
    } else {
      toast.error("Product already in compare list");
    }
  };

  return (
    <div className="relative rounded font-montserrat overflow-hidden p-4 group shadow-lg bg-white">
      <div className="absolute top-4 right-4 p-2 rounded-full bg-black shadow-md hover:bg-gray-200 focus:outline-none">
        <img
          src="/images/common/heart.png"
          alt="wishlist"
          className={`w-4 h-4 cursor-pointer ${isInWishlist ? 'opacity-50' : ''}`}
          onClick={handleWishlistAction}
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
          onClick={handleCartAction}
          className={`border border-white text-white font-bold py-2 px-4 rounded mb-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Processing...' : (isProductInCart ? 'Remove from Cart' : 'Add to Cart')}
        </button>
        <div className="flex space-x-6">
          <button onClick={handleShare} className="text-white text-sm">Share</button>
          <button onClick={handleCompare} className="text-white text-sm">Compare</button>
          <button onClick={handleWishlistAction} className="text-white text-sm">
            {isInWishlist ? 'Unlike' : 'Like'}
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
          {Array.from({ length: Math.floor(product.rating || 0) }, (_, index) => (
            <img
              key={index}
              src="/images/common/star.png"
              alt="star"
              className="w-6 h-6"
            />
          ))}
          <span className="text-gray-600 text-sm ml-4">({product.reviews || 0})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
