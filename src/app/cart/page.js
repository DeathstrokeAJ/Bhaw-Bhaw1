'use client';
import React, { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig"; 
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from '../../app/context/AuthContext'; // Adjust the path as needed
import Link from "next/link";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [error, setError] = useState("");
  const { user } = useAuth(); // Get user from AuthContext
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupVisible1, setIsPopupVisible1] = useState(false);
  const [isPopupVisible2, setIsPopupVisible2] = useState(false);

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      setIsPopupVisible(true); // Show the popup if the cart is empty
    } else {
      // Proceed to checkout logic
      sessionStorage.setItem('subtotal', subtotal);
      sessionStorage.setItem('total', total);
      router.push('/checkout'); // Use router.push to navigate to the checkout page
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user || !user.uid) {
        console.error("User ID is not available.");
        return;
      }

      const cartRef = collection(db, "users", user.uid, "cart");
      const cartSnapshot = await getDocs(cartRef);

      let fetchedItems = [];
      cartSnapshot.forEach((doc) => {
        const productData = doc.data();
        const existingProductIndex = fetchedItems.findIndex(item => item.id === productData.id);
        
        const itemWithFallbacks = {
          id: productData.id || doc.id,
          title: productData.title || "Sample Product",
          size: productData.size || "M",
          color: productData.color || "Red",
          price: productData.price || 100,
          quantity: 1,
        };

        if (existingProductIndex > -1) {
          fetchedItems[existingProductIndex].quantity += 1;
        } else {
          fetchedItems.push(itemWithFallbacks);
        }
      });

      setCartItems(fetchedItems);
    };

    fetchCartItems();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", user.uid, "cart", id));
      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  const handleQuantityChange = async (id, change) => {
    const itemIndex = cartItems.findIndex(item => item.id === id);
    const newQuantity = cartItems[itemIndex].quantity + change;

    if (newQuantity < 1) return;

    const updatedItems = [...cartItems];
    updatedItems[itemIndex].quantity = newQuantity;
    setCartItems(updatedItems);

    try {
      await updateDoc(doc(db, "users", user.uid, "cart", id), { quantity: newQuantity });
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * (couponDiscount / 100));
  const total = subtotal - discountAmount + 15;

  const handleApplyCoupon = async () => {
    try {
      const couponRef = collection(db, "coupons");
      const q = query(couponRef, where("couponTitle", "==", coupon));
      const couponSnapshot = await getDocs(q);

      if (couponSnapshot.empty) {
        setIsPopupVisible1(true);
        setCouponDiscount(0);
        return;
      }

      const couponData = couponSnapshot.docs[0].data();

      // Check if subtotal is greater than or equal to minPrice
      if (subtotal < couponData.minPrice) {
        setIsPopupVisible2(true);
        return;
      }

      setCouponDiscount(couponData.discount);

      // Update timesUsed field
      await updateDoc(doc(db, "coupons", couponSnapshot.docs[0].id), {
        timesUsed: (couponData.timesUsed || 0) + 1
      });

      setError("");
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const closePopup1 = () => {
    setIsPopupVisible1(false);
  };
  
  const closePopup2 = () => {
    setIsPopupVisible2(false);
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
  <hr className="border-t border-gray-300 my-4" />
  <div className="flex justify-between mb-3">
    <span className="text-lg md:text-xl font-semibold">Total</span>
    <span className="font-bold">INR {total.toFixed(2)}</span>
  </div>

  <div className="mt-4 flex flex-col sm:flex-row items-center">
    <div className="flex items-center bg-[#F0F0F0] rounded-full flex-1 mb-2 sm:mb-0">
      <img src="images/common/coupon.png" alt="Coupon Icon" className="w-5 h-5 sm:w-6 sm:h-6 mx-2" />
      <input 
        type="text" 
        className="flex-1 p-2 bg-[#F0F0F0] rounded-full outline-none text-sm" 
        placeholder="Coupon Code"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
      />
    </div>
    <button 
      className="bg-[#E57A7A] text-white px-4 lg:mt-0 mt-2 sm:px-6 py-2 rounded-full ml-2" 
      onClick={handleApplyCoupon}
    >
      Apply Coupon
    </button>
    {error && <p className="text-red-600 mt-2">{error}</p>}
  </div>
  
  <button className="w-full bg-[#E57A7A] text-white py-3 rounded-full mt-4" onClick={handleProceedToCheckout}>
    <p>Proceed to Checkout</p>
  </button>


</div>

      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
          <img
                    src="/images/services/cancel.png"
                    alt="Fail Icon"
                    className="w-32 h-32 mb-7"
                  />
            <h3 className="text-lg font-semibold">Your cart is empty!</h3>
            <p>Please add items to your cart before proceeding.</p>
            <button className="mt-3 bg-[#E57A7A] text-white px-4 py-2 rounded" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      {isPopupVisible1 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
          <img
                    src="/images/services/cancel.png"
                    alt="Fail Icon"
                    className="w-32 h-32 mb-7"
                  />
            <h3 className="text-lg font-semibold">Invalid Coupon!</h3>
            <p>The coupon code you entered is not valid.</p>
            <button className="mt-3 bg-[#E57A7A] text-white px-4 py-2 rounded" onClick={closePopup1}>Close</button>
          </div>
        </div>
      )}

      {isPopupVisible2 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
          <img
                    src="/images/services/cancel.png"
                    alt="Fail Icon"
                    className="w-32 h-32 mb-7"
                  />
            <h3 className="text-lg font-semibold">Minimum Subtotal Not Attained!</h3>
            <p>To apply this coupon, your subtotal must be a bit higher.</p>
            <button className="mt-3 bg-[#E57A7A] text-white px-4 py-2 rounded" onClick={closePopup2}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
