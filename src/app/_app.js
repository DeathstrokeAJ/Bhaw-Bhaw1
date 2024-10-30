import React from "react";
import { AuthProvider } from "../context/AuthContext"; // Adjust the path accordingly
import ProductCard from "../components/ProductCard"; // Replace with your actual component

const App = () => {
  return (
    <AuthProvider>
      <ProductCard />
    </AuthProvider>
  );
};

export default App;