import React from 'react';
import { AuthProvider } from './context/AuthContext'; 
import { CartWishlistProvider } from './context/CartWishlistContext';
import SignInPage from './signin/SignInPage';
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