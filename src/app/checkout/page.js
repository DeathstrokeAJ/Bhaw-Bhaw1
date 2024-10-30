'use client'
import React, { useEffect, useState } from "react";
import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    state: "",
    city: "",
    postalCode: "",
    checked: false,
  });
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const db = getFirestore();
  const userId = typeof window !== "undefined" ? sessionStorage.getItem("userId") : null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSubtotal(Number(sessionStorage.getItem("subtotal")) || 0);
      setTotal(Number(sessionStorage.getItem("total")) || 0);
    }

    const fetchCartItems = async () => {
      if (userId) {
        const userDocRef = doc(db, "users", userId);
        const cartSnapshot = await getDocs(collection(userDocRef, "cart"));
        setCartItems(cartSnapshot.docs.map((doc) => doc.data()));
      }
    };

    fetchCartItems();
  }, [db, userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContinueShipping = async (event) => {
    event.preventDefault();
    const { email, firstName, lastName, address, apartment, state, city, postalCode } = formData;

    const generateShippingId = () => `SID${Date.now()}`;
    const shippingId = generateShippingId();
    const shippingData = {
      email,
      firstName,
      lastName,
      address,
      apartment,
      state,
      city,
      postalCode,
    };

    try {
      await setDoc(doc(db, "shippingAddresses", shippingId), shippingData);
      window.location.href = "/products";
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleProceedToPayment = async () => {
    await pushOrderDetails();
    await clearCart();
    setIsPopupVisible(true);
  };

  const pushOrderDetails = async () => {
    const orderId = `OID${Date.now()}`;
    const orderData = {
      userId,
      products: cartItems,
    };

    try {
      await setDoc(doc(db, "orders", orderId), orderData);
    } catch (error) {
      console.error("Error adding order details: ", error);
    }
  };

  const clearCart = async () => {
    const userDocRef = doc(db, "users", userId);
    const cartRef = collection(userDocRef, "cart");
    const cartSnapshot = await getDocs(cartRef);
    cartSnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    setCartItems([]);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    window.location.href = "/products"; // Redirect after closing the modal
  };


  return (
    <div className="font-poppins py-6 text-black bg-white">
      <style jsx>{`
        input::placeholder {
          color: #c1c8e1;
        }
      `}</style>
      <div className="bg-[#e4d5d0] py-8 lg:py-16 px-10 lg:px-36 mb-6">
        <h1 className="text-lg lg:text-xl font-bold text-left text-[#15245E]">Hello Ujjawal Tyagi</h1>
      </div>
      <div className="flex flex-col lg:flex-row lg:justify-between mx-auto lg:mx-16 gap-6 lg:gap-0">
        <div className="w-full lg:w-8/12">
          <h2 className="text-lg lg:text-xl text-[#1D3178] font-extrabold mb-4 lg:m-4">Checkout</h2>
          <div className="shadow-lg bg-[#fdfafa]">
            <div className="p-6 rounded-lg mb-6">
              <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
                <h3 className="text-lg lg:text-xl text-[#1D3178] font-extrabold my-4">Contact Information</h3>
                <span className="text-sm text-[#676767]">Already have an account? <a href="#">Log in</a></span>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email or mobile phone number"
                className="w-full py-3 my-4 text-sm focus:outline-none bg-[#fdfafa] border-b-2 border-gray-300"
                value={formData.email}
                onChange={handleChange}
              />
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  name="checked"
                  className="mr-2"
                  checked={formData.checked}
                  onChange={handleChange}
                />
                <span className="text-sm text-[#676767]">Keep me up to date on news and exclusive offers</span>
              </div>
            </div>
            <div className="p-6 rounded-lg">
              <h3 className="text-lg lg:text-xl text-[#1D3178] font-extrabold my-4">Shipping address</h3>
              {["firstName", "lastName", "address", "apartment", "state", "city", "postalCode"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field === "firstName" ? "First name (optional)" : field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full py-3 text-sm mb-7 focus:outline-none bg-[#fdfafa] border-b-2 border-gray-300"
                  value={formData[field]}
                  onChange={handleChange}
                />
              ))}
              <button
                className="bg-[#E57A7A] text-white mt-10 lg:mt-28 mb-10 px-6 py-3 rounded-md font-semibold w-full lg:w-auto"
                onClick={handleContinueShipping}
              >
                Continue Shipping
              </button>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-4/12">
          <div className="rounded-lg">
            <div className="mb-6 py-6">
              {cartItems.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center">
                    <img src={item.images} alt={item.title} className="w-16 h-12 lg:w-24 lg:h-16 object-cover rounded-lg" />
                    <div className="flex-1 text-sm lg:text-base">
                      <h3 className="font-semibold text-sm text-black mb-2">{item.title}</h3>
                      <p className="mb-1 text-sm">Size: {item.size}</p>
                      <p className="text-sm">Qnt: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-xs text-[#15245E]">INR {item.price}</span>
                  </div>
                  <hr className="my-4" />
                </div>
              ))}
            </div>
          </div>
          <div className="border-t bg-[#f4f4fc] p-7 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-lg lg:text-xl font-medium">Subtotals:</span>
              <span className="text-lg lg:text-xl font-medium">INR {subtotal}</span>
            </div>
            <hr className="my-1 border-gray-300 mb-8 mx-2" />
            <div className="flex justify-between">
              <span className="text-lg lg:text-xl font-medium">Totals:</span>
              <span className="text-lg lg:text-xl font-medium">INR {total}</span>
            </div>
            <button
              onClick={handleProceedToPayment}
              className="bg-[#E57A7A] text-white mt-8 px-6 py-3 rounded-md font-semibold w-full"
            >
              Proceed To Payment
            </button>
          </div>
        </div>
      </div>
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md">
          <div className="flex flex-col mx-32 my-3 items-center">
              <img
                src="/images/services/popup.png"
                alt="Success Icon"
                className="h-32 w-32 mb-6"
              />
              <h2 className="text-xl font-bold text-center">Thank you for your order!</h2>
              <p className="text-gray-600 text-center">Your order has been received and is being processed.</p>
            </div>
            <button className="bg-[#E57A7A] text-white px-6 py-3 rounded-md font-semibold mt-4 w-full" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
