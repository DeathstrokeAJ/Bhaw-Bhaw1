"use client"
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCartWishlist } from "../context/CartWishlistContext";
import { useRouter } from "next/navigation";

const Cart = () => {
  const { user } = useAuth();
  const { cartItems, removeFromCart, fetchCartItems } = useCartWishlist();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user, fetchCartItems]);

  const handleDelete = async (id) => {
    await removeFromCart(id);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
    } else {
      router.push('/checkout');
    }
  };

  return (
    <div className="flex bg-white text-black flex-col px -4 py-6">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-lg">Your cart is empty!</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between mb-4">
              <span>{item.name}</span>
              <button onClick={() => handleDelete(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <button
        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleProceedToCheckout}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;