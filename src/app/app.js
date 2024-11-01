import React from 'react';
import { AuthProvider } from './context/AuthContext'; // Ensure this is correct
import { CartWishlistProvider } from './context/CartWishlistContext';
import SignInPage from './Signin/SignInPage'; // Adjust the import path if necessary
import ProductCard from '@/components/ProductCard';

const App = () => {
  return (
    <AuthProvider>
      <CartWishlistProvider>
        <ProductCard/>
        <SignInPage />
      </CartWishlistProvider>
    </AuthProvider>
  );
};

export default App;