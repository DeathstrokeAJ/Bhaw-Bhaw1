import React from "react";
import { AuthProvider } from "../context/AuthContext";
import { CartWishlistProvider } from "../context/CartWishlistContext";
import ProductCard from "../components/ProductCard";

const App = () => {
  return (
    <AuthProvider>
      <CartWishlistProvider>
        <ProductCard />
      </CartWishlistProvider>
    </AuthProvider>
  );
};

export default App;