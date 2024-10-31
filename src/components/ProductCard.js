// pages/product/ProductCard.js
// "use client";
// import React, { useEffect, useState, useContext } from "react";
// import { useAuth } from "../app/context/AuthContext"; // Adjust the path as necessary
// import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "../../firebaseConfig";
// import { useRouter } from "next/navigation";

// const ProductCard = ({ product, isRecommendation = false }) => {
//   const router = useRouter();
//   const { user } = useAuth(); // Get user from context
//   const [userId, setUserId] = useState(null);
//   const [isInCart, setIsInCart] = useState(false);

//   useEffect(() => {
//     const storedUserId = sessionStorage.getItem("userId");
//     setUserId(storedUserId);
//   }, []);

//   const handleBuyNow = () => {
//     const route = isRecommendation ? `/details` : `/productdetails`;
//     sessionStorage.setItem("productId", product.id);
//     router.push(route);
//   };

//   const handleAddToCart = async () => {
//     try {
//       if (!product?.id || !userId) throw new Error("Product ID or User ID is undefined");

//       const cartRef = doc(db, "users", userId, "cart", product.id);

//       if (isInCart) {
//         await deleteDoc(cartRef);
//         alert("Product removed from cart!");
//       } else {
//         await setDoc(cartRef, {
//           ...product,
//           addedAt: serverTimestamp(),
//         });
//         alert("Product added to cart successfully!");
//       }

//       setIsInCart((prev) => !prev);
//     } catch (error) {
//       alert("Error updating cart: " + error.message);
//       console.error("Error updating cart:", error);
//     }
//   };

//   const handleAddToWishlist = async () => {
//     try {
//       if (!product?.id || !userId) throw new Error("Product ID or User ID is undefined");

//       const wishlistRef = doc(db, "users", userId, "wishlist", product.id);
//       await setDoc(wishlistRef, {
//         ...product,
//         addedAt: serverTimestamp(),
//       });
//       alert("Product added to wishlist!");
//     } catch (error) {
//       alert("Error adding to wishlist: " + error.message);
//       console.error("Error adding to wishlist:", error);
//     }
//   };

//   useEffect(() => {
//     const checkCartStatus = async () => {
//       if (userId) {
//         const cartDoc = await doc(db, "users", userId, "cart", product.id).get();
//         setIsInCart(cartDoc.exists());
//       }
//     };

//     checkCartStatus();
//   }, [userId, product.id]);

//   return (
//     <div className="relative rounded font-montserrat overflow-hidden p-4 group shadow-lg bg-white">
//       <div className="absolute top-4 right-4 p-2 rounded-full bg-black shadow-md hover:bg-gray-200 focus:outline-none">
//         <img
//           src="/images/common/heart.png"
//           alt="wishlist"
//           className="w-4 h-4 cursor-pointer"
//           onClick={handleAddToWishlist}
//         />
//       </div>

//       <div className="bg-[#F3EAE7] mx-3 py-1 rounded-lg mt-6">
//         <img
//           className="w-full h-48 object-contain"
//           src={product.images}
//           alt={product.title}
//         />
//       </div>

//       <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
//         <h3 className="text-white text-lg font-bold">{product.title}</h3>
//         <p className="text-white">${product.price}</p>
//         <button
//           className="bg-baw-red text-white py-2 px-4 rounded mt-2"
//           onClick={handleBuyNow}
//         >
//           Buy Now
//         </button>
//         <button
//           className="bg-gray-300 text-black py-1 px-3 rounded mt-2"
//           onClick={handleAddToCart}
//         >
//           {isInCart ? "Remove from Cart" : "Add to Cart"}
//         </button>
//       </div>
//     </div>
//   );
// };
// export default ProductCard;

// src/components/ProductCard.js
// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../context/AuthContext';
// import { useCartWishlist } from '../context/CartWishlistContext';

// const ProductCard = ({ product }) => {
//   const router = useRouter();
//   const { user } = useAuth();
//   const { addToCart, removeFromCart, addToWishlist, removeFromWishlist, isInCart, isInWishlist } = useCartWishlist();

//   const handleCartAction = async () => {
//     if (!user) {
//       router.push('/signin');
//       return;
//     }
//     if (isInCart(product.id)) {
//       await removeFromCart(product.id);
//     } else {
//       await addToCart(product);
//     }
//   };

//   const handleWishlistAction = async () => {
//     if (!user) {
//       router.push('/signin');
//       return;
//     }
//     if (isInWishlist(product.id)) {
//       await removeFromWishlist(product.id);
//     } else {
//       await addToWishlist(product);
//     }
//   };

//   return (
//     <div className="product-card">
//       <img src={product.images[0]} alt={product.title} onClick={() => router.push(`/product/${product.id}`)} />
//       <h3>{product.title}</h3>
//       <p>Price: ${product.price}</p>
//       <button onClick={handleCartAction}>
//         {isInCart(product.id) ? 'Remove from Cart' : 'Add to Cart'}
//       </button>
//       <button onClick={handleWishlistAction}>
//         {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
//       </button>
//     </div>
//   );
// };

// export default ProductCard;
// src/components/ProductCard.js
// "use client";
// import React from "react";
// import { useAuth } from "../app/context/AuthContext";
// import { useCartWishlist } from "../cartwishlistcontext";
// import { useRouter } from "next/navigation";

// const ProductCard = ({ product, isRecommendation = false }) => {
//   const router = useRouter();
//   const { user } = useAuth();
//   const { addToCart, removeFromCart, addToWishlist, removeFromWishlist, isInCart, isInWishlist } = useCartWishlist();

//   const handleBuyNow = () => {
//     const route = isRecommendation ? `/details` : `/productdetails`;
//     sessionStorage.setItem("productId", product.id);
//     router.push(route);
//   };

//   const handleCartAction = async () => {
//     if (!user) {
//       router.push('/signin');
//       return;
//     }
//     try {
//       if (isInCart(product.id)) {
//         await removeFromCart(product.id);
//         alert("Product removed from cart!");
//       } else {
//         await addToCart(product);
//         alert("Product added to cart successfully!");
//       }
//     } catch (error) {
//       alert("Error updating cart: " + error.message);
//       console.error("Error updating cart:", error);
//     }
//   };

//   const handleWishlistAction = async () => {
//     if (!user) {
//       router.push('/signin');
//       return;
//     }
//     try {
//       if (isInWishlist(product.id)) {
//         await removeFromWishlist(product.id);
//         alert("Product removed from wishlist!");
//       } else {
//         await addToWishlist(product);
//         alert("Product added to wishlist!");
//       }
//     } catch (error) {
//       alert("Error updating wishlist: " + error.message);
//       console.error("Error updating wishlist:", error);
//     }
//   };

//   return (
//     <div className="relative rounded font-montserrat overflow-hidden p-4 group shadow-lg bg-white">
//       <div className="absolute top-4 right-4 p-2 rounded-full bg-black shadow-md hover:bg-gray-200 focus:outline-none">
//         <img
//           src="/images/common/heart.png "
//           alt="wishlist"
//           className="w-4 h-4 cursor-pointer"
//           onClick={handleWishlistAction}
//         />
//       </div>

//       <div className="bg-[#F3EAE7] mx-3 py-1 rounded-lg mt-6">
//         <img
//           className="w-full h-48 object-contain"
//           src={product.images}
//           alt={product.title}
//         />
//       </div>

//       <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
//         <h3 className="text-white text-lg font-bold">{product.title}</h3>
//         <p className="text-white">${product.price}</p>
//         <button
//           className="bg-baw-red text-white py-2 px-4 rounded mt-2"
//           onClick={handleBuyNow}
//         >
//           Buy Now
//         </button>
//         <button
//           className="bg-gray-300 text-black py-1 px-3 rounded mt-2"
//           onClick={handleCartAction}
//         >
//           {isInCart(product.id) ? "Remove from Cart" : "Add to Cart"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;
"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../app/context/AuthContext"; // Adjust the path as necessary
import { useCartWishlist } from "../cartwishlistcontext"; // Import the cart/wishlist context
import { useRouter } from "next/navigation";
import { doc, setDoc, deleteDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const ProductCard = ({ product, isRecommendation = false }) => {
  const router = useRouter();
  const { user } = useAuth(); // Get user from AuthContext
  const { addToCart, removeFromCart, addToWishlist, isInCart, isInWishlist } = useCartWishlist(); // Use CartWishlistContext
  const [isProductInCart, setIsProductInCart] = useState(false);

  useEffect(() => {
    if (user && product) {
      const checkCartStatus = async () => {
        const cartDocRef = doc(db, "users", user.uid, "cart", product.id);
        const cartDoc = await getDoc(cartDocRef);
        setIsProductInCart(cartDoc.exists());
      };
      checkCartStatus();
    }
  }, [user, product]);

  const handleBuyNow = () => {
    const route = isRecommendation ? `/details/${product.id}` : `/productdetails/${product.id}`;
    router.push(route);
  };

  const handleCartAction = async () => {
    if (!user) {
      router.push('/signin');
      return;
    }
    try {
      if (isProductInCart) {
        await removeFromCart(product.id);
        alert("Product removed from cart!");
      } else {
        await addToCart(product);
        alert("Product added to cart successfully!");
      }
      setIsProductInCart(!isProductInCart);
    } catch (error) {
      alert("Error updating cart: " + error.message);
      console.error("Error updating cart:", error);
    }
  };

  const handleWishlistAction = async () => {
    if (!user) {
      router.push('/signin');
      return;
    }
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
        alert("Product removed from wishlist!");
      } else {
        await addToWishlist(product);
        alert("Product added to wishlist!");
      }
    } catch (error) {
      alert("Error updating wishlist: " + error.message);
      console.error("Error updating wishlist:", error);
    }
  };

  return (
    <div className="relative rounded font-montserrat overflow-hidden p-4 group shadow-lg bg-white">
      <div className="absolute top-4 right-4 p-2 rounded-full bg-black shadow-md hover:bg-gray-200 focus:outline-none">
        <img
          src="/images/common/heart.png"
          alt="wishlist"
          className="w-4 h-4 cursor-pointer"
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
          onClick={handleCartAction}
        >
          {isProductInCart ? "Remove from Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
