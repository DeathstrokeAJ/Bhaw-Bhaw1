'use client';
import React, { useState, useEffect } from "react";
import { useCartWishlist } from "../../app/context/CartWishlistContext"; 
import { useAuth } from "../../app/context/AuthContext"; 
import { db } from "../../../firebaseConfig"; 
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

const Cart = () => {
  const { cart, removeFromCart, updateCartItemQuantity } = useCartWishlist(); // Use context for cart management
  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const userId = user ? user.id : null; 
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      setIsPopupVisible(true);
    } else {
      const subtotal = calculateSubtotal(cart);
      sessionStorage.setItem('subtotal', subtotal);
      window.location.href = './checkout';
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) return; 
      
      const cartRef = collection(db, "users", userId, "cart");
      const cartSnapshot = await getDocs(cartRef);

      let fetchedItems = [];
      for (const doc of cartSnapshot.docs) {
        const productData = doc.data();
        const productRef = doc(db, "products", productData.productId); 
        const productDoc = await getDocs(productRef);

        if (productDoc.exists()) {
          const product = productDoc.data();
          const itemWithFallbacks = {
            id: productData.id || doc.id,
            title: product.title || "Sample Product",
            size: productData.size || "M",
            color: productData.color || "Red",
            price: product.price || 100,
            quantity: productData.quantity || 1 , 
          };

          fetchedItems.push(itemWithFallbacks);
        }
      }

      // Update cart state
      fetchedItems.forEach(item => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          existingItem.quantity += item.quantity; 
        } else {
          cart.push(item); 
        }
      });
    };

    fetchCartItems();
  }, [userId, cart]);

  const calculateSubtotal = (cartItems) => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const calculateTotal = (subtotal) => {
    const discountAmount = (subtotal * (couponDiscount / 100));
    return (subtotal - discountAmount + 15) || 0; // Include delivery fee
  };

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
      const minPrice = couponData.minPrice || 0; // Assuming minPrice is in the coupon document
      const subtotal = calculateSubtotal(cart);

      if (minPrice > subtotal) {
        setError(`Minimum subtotal of INR ${minPrice} required for this coupon.`);
        setCouponDiscount(0);
        return;
      }

      setCouponDiscount(couponData.discount);
      setError("");

      // Update timesUsed field in the coupon document
      const couponDocRef = doc(db, "coupons", couponSnapshot.docs[0].id);
      await updateDoc(couponDocRef, {
        timesUsed: couponData.timesUsed + 1 // Increment times used
      });
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  };

  const handleQuantityChange = async (id, change) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: Math.max(newQuantity, 1) }; // Ensure quantity doesn't go below 1
      }
      return item;
    });

    // Update cart state and Firestore
    await updateCartItemQuantity(updatedCart);
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
  
          {cart.map((item) => (
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
                <img src="images/common/dustbin.png" alt="Delete" className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer lg:mt-2 ml-4 sm:ml-0" onClick ={() => removeFromCart(item.id)} />
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
              <span className="font-bold">INR {calculateSubtotal(cart).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#E57A7A]">
              <span className="text-[#676767] text-sm md:text-lg mb-2">Discount (-{couponDiscount}%)</span>
              <span className="font-bold">-INR {(calculateSubtotal(cart) * (couponDiscount / 100)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#676767] text-sm md:text-lg mb-1">Delivery Fee</span>
              <span className="font-bold">INR 15</span>
            </div>
          </div>
          <hr className="mb-4" />
          <div className="flex justify-between text-lg md:text-xl">
            <span>Total</span>
            <span className="font-bold">INR {calculateTotal(calculateSubtotal(cart)).toFixed(2)}</span>
          </div>
  
          <div className="mt-4 flex flex-col sm:flex-row items-center">
            <div className="flex items-center border border-gray-300 p-2 rounded-full w-full md:w-3/4">
              <input 
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#F0F0F0] border-none focus:outline-none" 
              />
              <button className="bg-[#E57A7A] text-white rounded-full px-4 py-2" onClick={handleApplyCoupon}>Apply</button>
            </div>
            {error && <span className="text-red-500 text-xs mt-2">{error}</span>}
          </div>
  
          <button className="bg-[#E57A7A] text-white rounded-full py-2 px-4 mt-4" onClick={handleProceedToCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
  
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Cart is empty!</h3>
            <button onClick={closePopup} className="mt-4 bg-[#E57A7A] text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;