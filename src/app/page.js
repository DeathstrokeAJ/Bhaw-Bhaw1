"use client";

import Hero from "@/components/Hero";
import PetSearchSection from "@/components/PetSearchSection";
import ProductCarousel from "@/components/ProductCarousel";
import ProtectedHomeRoute from "@/components/ProtectedHomeRoute";
import Protected from "@/components/ProtectedRoute";
import Services from "@/components/Services";

const Home = () => {
  return (
    <div>
      <Hero />
      <Services />
      <ProductCarousel/>
      <PetSearchSection />
    </div>
  );
};

export default ProtectedHomeRoute(Home);