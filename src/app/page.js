"use client";

import Hero from "@/components/Hero";
import PetSearchSection from "@/components/PetSearchSection";
import Protected from "@/components/ProtectedRoute";
import Services from "@/components/Services";

const Home = () => {
  return (
    <div>
      <Hero />
      <Services />
      <PetSearchSection />
    </div>
  );
};

export default Protected(Home);