'use client';
import React, { useEffect, useState } from "react";
import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from '../../app/context/AuthContext';
import Link from "next/link";
import { useRouter } from 'next/navigation';

const CheckoutPage = () => {
  const router = useRouter();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  const db = getFirestore();

  // Redirect if no user
  useEffect(() => {
    if (!user) {
      router.push('/Signin');
    }
  }, [user, router]);

  // Fetch cart items and calculate totals
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user?.uid) return;

      try {
        setLoading(true);
        const userDocRef = doc(db, "users", user.uid);
        const cartSnapshot = await getDocs(collection(userDocRef, "cart"));
        const items = cartSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setCartItems(items);
        
        // Calculate totals
        const itemSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setSubtotal(itemSubtotal);
        setTotal(itemSubtotal); // Add shipping cost if needed
        
        // Store in session
        sessionStorage.setItem("subtotal", itemSubtotal.toString());
        sessionStorage.setItem("total", itemSubtotal.toString());
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart items");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [db, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContinueShipping = async (e) => {
    e.preventDefault();
    if (!user?.uid) {
      setError("Please sign in to continue");
      return;
    }

    try {
      const shippingId = `SID ${Date.now()}`;
      await setDoc(doc(db, "users", user.uid, "shipping", shippingId), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      // Continue with checkout flow
    } catch (err) {
      console.error("Error saving shipping info:", err);
      setError("Failed to save shipping information");
    }
  };

  const handleProceedToPayment = async () => {
    if (!user?.uid) {
      setError("Please sign in to continue");
      return;
    }

    try {
      // Create order
      await pushOrderDetails();
      // Clear cart
      await clearCart();
      // Show success popup
      setIsPopupVisible(true);
      // Reset totals
      setSubtotal(0);
      setTotal(0);
      // Clear session storage
      sessionStorage.removeItem("subtotal");
      sessionStorage.removeItem("total");
    } catch (err) {
      console.error("Error processing payment:", err);
      setError("Failed to process payment");
    }
  };

  const pushOrderDetails = async () => {
    const orderId = `OID ${Date.now()}`;
    const orderData = {
      userId: user.uid,
      products: cartItems,
      shippingDetails: formData,
      totalAmount: total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, "orders", orderId), orderData);
  };

  const clearCart = async () => {
    if (!user?.uid) return;
    
    const userDocRef = doc(db, "users", user.uid);
    const cartRef = collection(userDocRef, "cart");
    
    const cartSnapshot = await getDocs(cartRef);
    const deletePromises = cartSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    setCartItems([]);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    router.push('/products'); // Redirect to products page after order
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }


  const username = user?.username.split('@')[0] || "User";

  return (
    <div className="font-poppins py-6 text-black bg-white">
      <style jsx>{`
        input::placeholder {
          color: #c1c8e1;
        }
      `}</style>
      <div className="bg-[#e4d5d0] py-8 lg:py-16 px-10 lg:px-36 mb-6">
        <h1 className="text-lg lg:text-xl font-bold text-left text-[#15245E]">Hello {username}</h1>
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
            >
              Proceed to Payment
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
