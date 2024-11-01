"use client";
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../app/context/AuthContext";
import { useCartWishlist } from "../app/context/CartWishlistContext";
import { useRouter } from "next/navigation";

const ProductDetails = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, addToWishlist, isInCart, isInWishlist } = useCartWishlist();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productId = router.query.id; // Assume productId is passed in the URL as a query parameter

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const productRef = doc(db, "products", productId);
        const productSnapshot = await getDoc(productRef);
        if (productSnapshot.exists()) {
          setProduct(productSnapshot.data());
        } else {
          setError("No product found with the given ID.");
        }
      } catch (error) {
        setError("Error fetching product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/signin');
      return;
    }
    try {
      await addToCart(product, quantity);
      setError("Product added to cart successfully!");
    } catch (error) {
      setError("Error adding to cart: " + error.message);
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      router.push('/signin');
      return;
    }
    try {
      await addToWishlist(product);
      setError("Product added to wishlist!");
    } catch (error) {
      setError("Error adding to wishlist: " + error.message);
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleBuyNow = async () => {
    try {
      await handleAddToCart();
      window.location.href = "/cart";
    } catch (error) {
      console.error("Error adding product to cart or navigating to checkout:", error);
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-10 font-poppins space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">{product?.title || "Product Title"}</h1>
        <button
          onClick={handleAddToWishlist}
          className={`flex items-center ${isInWishlist(productId) ? 'bg-gray-300' : 'bg-[#FFEB3B]'} px-8 py-1 rounded-2xl`}
          disabled={isInWishlist(productId)}
        >
          <img src="/images/navbar/heart.png" alt="Add to Wishlist" width={32} height={32} />
          <p>Add To Wishlist</p>
        </button>
      </div>

      <div className="rounded-lg p-6 flex justify-between items-start">
        <img
          src={product?.images || "/images/details/image.png"}
          alt={product?.title || "Product Image"}
          width={80}
          height={80}
          className="w-20 px-1 pt-2 pb-3 border border-black object-contain rounded-2xl"
        />

        <div className="flex space-x-6">
          <img
            src={product?.images || "/images/details/image.png"}
            alt={product?.title || "Product Image"}
            width={256}
            height={256}
            className="w-64 object-contain rounded-md"
          />

          <div className="space-y-4">
            <p className="text-sm">Brand: {product?.brand || "Kopman"}</p>
            <p className="text-sm">{product?.description || "Product description not available."}</p>
            <p className="text-sm">Size: {product?.size || "10 x 5 cm"}</p>
            <p className="text-sm">ID: {productId}</p>
          </div>
        </div>

        <div className="flex flex-col border border-[#F5D1DD] rounded-xl w-[30%] p-4 items-start space-y-2">
          <div className="text-2xl text-black font-semibold">Rs. {product?.price || "Price not available"}</div>
          <div className="flex">
            <img
              src="/images/details/freedelivery.png"
              alt="Free Delivery"
              width={28}
              height={28}
              className="w-7 object-contain pr-1"
            />
            <div className="text-black">Free Delivery</div>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={decreaseQuantity} className="px-3 py-1 bg-gray-300 rounded-md">-</button>
            <p>{quantity}</p>
            <button onClick={increaseQuantity} className="px-3 py-1 bg-gray-300 rounded-md">+</button>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-[#D4C6C0] text-black w-full py-[0.5rem] text-left px-2 text-xs rounded-md border flex items-center"
          >
            <img src="/images/details/cart.png" alt="Add to Cart" width={28} height={28} className="w-7 object-contain pr-2" />
            <p>Add To Cart</p>
          </button>

          <button onClick={handleBuyNow} className="bg-[#85716B] w-full text-white py-1 text-center px-2 text-sm rounded-md border">
            Buy Now
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-black">{product?.title || "Product Title"}</h2>
        <p className="text-black text-sm">{product?.longDescription || "Product details not available."}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
