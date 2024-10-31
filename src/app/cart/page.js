"use client";
import React, { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig"; 
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useCartWishlist } from "../context/cartwishlistcontext";
import { useRouter } from "next/navigation";

const Cart = () => {
  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [error, setError] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateCartItemQuantity, fetchCartItems } = useCartWishlist();
  const router = useRouter();
  
  const userId = user?.uid;  // Retrieve userId from AuthContext
  
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      setIsPopupVisible(true);
    } else {
      router.push('/checkout', {
        state: { subtotal, total }
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCartItems(userId);  // Fetch items using the context method
    }
  }, [userId, fetchCartItems]);

  const handleDelete = async (id) => {
    try {
      await removeFromCart(id);  // Use context method to remove item
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  const handleQuantityChange = (id, change) => {
    const itemIndex = cartItems.findIndex(item => item.id === id);
    const newQuantity = cartItems[itemIndex].quantity + change;

    if (newQuantity < 1) return;

    try {
      updateCartItemQuantity(id, newQuantity);  // Update quantity using context
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * (couponDiscount / 100);
  const total = subtotal - discountAmount + 15;

  const handleApplyCoupon = async () => {
    try {
      const couponRef = collection(db, "coupons");
      const q = query(couponRef, where("couponTitle", "==", coupon));
      const couponSnapshot = await getDocs(q);

      if (couponSnapshot.empty) {
        setError("Invalid coupon");
        setCouponDiscount(0);
        return;
      }

      const couponData = couponSnapshot.docs[0].data();
      setCouponDiscount(couponData.discount);
      setError("");
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  };

  return (
    <div className="flex bg-white text-black flex-col px-4 md:px-8 font-poppins">
      <div className="flex items-center mt-4 md:mt-8">
        <span className="text-sm md:text-lg text-[#676767]">Home</span>
        <img src="images/services/arrow.png" alt="Arrow" className="mx-2 w-3 h-3 md:w-4 md:h-4" />
        <span className="text-sm md:text-lg">Cart</span>
      </div>

      <div className="flex flex-col lg:flex-row justify-between mt-6">
        <div className="w-full lg:w-8/12 p-4 md:p-6 lg:p-10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Your cart</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="border border-gray-300 bg-white p-4 rounded-lg flex items-center justify-between mb-4 flex-col sm:flex-row">
              <div className="flex items-center mb-4 sm:mb-0">
                <img src="images/common/product.png" alt={item.title} className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg bg-[#f0eeed]" />
                <div className="ml-4">
                  <h3 className="font-bold text-base md:text-lg">{item.title}</h3>
                  <p className="text-xs md:text-sm my-1">Size: <span className="text-[#676767]">{item.size}</span></p>
                  <p className="text-xs md:text-sm my-1">Color: <span className="text-[#676767]">{item.color}</span></p>
                  <p className="font-bold text-lg">INR {item.price}</p>
                </div>
              </div>
              <div className="flex lg:flex-col sm:flex-row-reverse items-center lg:items-end w-full lg:w-auto justify-between">
                <img src="images/common/dustbin.png" alt="Delete" className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer lg:mt-2 ml-4 sm:ml-0" onClick={() => handleDelete(item.id)} />
                <div className="flex items-center mt-12 bg-[#F0F0F0] px-2 py-1 rounded-2xl">
                  <button className="px-2" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                  <span className="mx-2">{item.quantity}</span>
                  <button className="px-2" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-5/12 mb-10 bg-white h-full p-6 rounded-lg lg:mt-24 shadow-lg border border-gray-300">
          <h2 className="text-lg md:text-xl font-semibold mb-3">Order Summary</h2>
          <div className="mb-4">
            <div className="flex justify-between">
              <span className="text-[#676767] text-sm md:text-lg mb-2">Subtotal</span>
              <span className="font-bold">INR {subtotal}</span>
            </div>
            <div className="flex justify-between text-[#E57A7A]">
              <span className="text-[#676767] text-sm md:text-lg mb-2">Discount (-{couponDiscount}%)</span>
              <span className="font-bold">-INR {discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#676767] text-sm md:text-lg mb-1">Delivery Fee</span>
              <span className="font-bold">INR 15</span>
            </div>
          </div>
          <hr className="mb-4" />
          <div className="flex justify-between text-lg md:text-xl">
            <span>Total</span>
            <span className="font-bold">INR {total.toFixed(2)}</span>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center">
            <div className="flex items-center bg-[#F0F0F0] rounded-full flex-1 mb-2 sm:mb-0">
              <img src="images/common/coupon.png" alt="Coupon Icon" className="w-5 h-5 sm:w-6 sm:h-6 mx-2" />
              <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Add Coupon Code" className="flex-1 p-2 bg-[#F0F0F0] rounded-full outline-none text-sm" />
            </div>
            <button onClick={handleApplyCoupon} className="bg-[#E57A7A] text-white px-4 lg:mt-0 mt-2 sm:px-6 py-2 rounded-full ml-2">
              Apply
            </button>
          </div>
          {error && <p className="text-red-500 mt-2 text-xs">{error}</p>}

          <button className="w-full bg-[#E57A7A] text-white py-3 rounded-full mt-4" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
        </div>
      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Your cart is empty!</h3>
            <p className="text-sm text-[#676767] mb-4">Please add items to your cart before proceeding to checkout.</p>
            <button className="bg-[#E57A7A] text-white px-4 py-2 rounded-full" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
