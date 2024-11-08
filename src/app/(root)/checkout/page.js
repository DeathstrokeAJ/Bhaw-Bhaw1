'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux/cartSlice";
import { ClipLoader } from "react-spinners";

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.items);

  const [formData, setFormData] = useState({
    email: user.email || "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    state: "",
    city: "",
    postalCode: "",
    checked: false,
  });
  
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const calculatedSubtotal = cartItems.reduce((acc, item) => {
      return acc + (item.sellingPrice * (item.quantity || 1));
    }, 0);
    setSubtotal(calculatedSubtotal);
    setTotal(calculatedSubtotal);
  }, [cartItems]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContinueShipping = (e) => {
    e.preventDefault();
    const { email, firstName, lastName, address, state, city, postalCode } = formData;
    if (!email || !firstName || !lastName || !address || !state || !city || !postalCode) {
      setError("All fields are required.");
      return;
    }
    setError(null);
  };


  const handleProceedToPayment = async () => {
    const orderData = {
      userId: user.userId,
      cartItems: cartItems, 
      paymentMethod: 'COD',
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        apartment: formData.apartment,
        state: formData.state,
        city: formData.city,
        postalCode: formData.postalCode,
      },
      email: formData.email,
      notification: formData.checked,
      totalAmount: subtotal
    };
  
    try {
      setLoading(true)
      const response = await fetch('/api/checkout/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        setIsPopupVisible(true);
        setSubtotal(0);
        setTotal(0);
        dispatch(clearCart());
      } else {
        setError("Failed to process payment");
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Failed to process payment");
    } finally {
      setLoading(false)
    }
  }; 

  const closePopup = () => {
    setIsPopupVisible(false);
    router.push('/products');
  };

  return (
    <div className="font-poppins py-6 text-black bg-white">
      <style jsx>{`
        input::placeholder {
          color: #c1c8e1;
        }
      `}</style>
      <div className="bg-[#e4d5d0] py-8 lg:py-16 px-10 lg:px-36 mb-6">
        <h1 className="text-lg lg:text-xl font-bold text-left text-[#15245E]">Hello {user.userData.username} !!</h1>
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
              <Link href="/products">
                <button
                  className="bg-[#E57A7A] text-white mt-10 lg:mt-28 mb-10 px-6 py-3 rounded-md font-semibold w-full lg:w-auto"
                  onClick={handleContinueShipping}
                >
                  Continue Shipping
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-4/12">
          <div className="rounded-lg">
            <div className="mb-6 py-6">
              {cartItems.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center">
                    <img src={item.images} alt={item.title} className="w-16 h-12 lg:w-20 mx-2 lg:h-16 object-cover rounded-lg" />
                    <div className="flex-1 text-sm lg:text-base">
                      <h3 className="font-semibold text-sm text-black mb-2">{item.title}</h3>
                      <p className="mb-1 text-sm">Size: {item.size}</p>
                      <p className="text-sm">Qnt: {item.quantity || 1}</p>
                    </div>
                    <span className="font-semibold text-xs text-[#15245E]">INR {item.sellingPrice}</span>
                  </div>
                  <hr className="my-4" />
                </div>
              ))}
            </div>
          </div>
          <div className="border-t bg-[#f4f4fc] p-7 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-[#6e6e6e]">Subtotal</span>
              <span className="font-semibold text-black">INR {subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#6e6e6e]">Shipping</span>
              <span className="font-semibold text-black">Free</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-[#6e6e6e]">Total</span>
              <span className="font-semibold text-black">INR {total}</span>
            </div>
            <button
              className="bg-[#E57A7A] text-white mt-10 mb-6 w-full py-3 rounded-md font-semibold"
              onClick={handleProceedToPayment}
              disabled={loading}
            >
              {
                loading ? <ClipLoader size={20} color="#fff" className="mx-10"/> : "Proceed to Payment"
              }
            </button>
          </div>
        </div>
      </div>
      {isPopupVisible && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Order Placed!</h3>
            <p>Your order has been successfully placed. Thank you!</p>
            <button
              className="mt-4 bg-[#E57A7A] text-white px-4 py-2 rounded"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
