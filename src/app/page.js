"use client"
import Hero from "@/components/Hero";
import PetSearchSection from "@/components/PetSearchSection";
import Services from "@/components/Services";

export default function Home() {
  return (
    <div>
      <Hero/>
      <Services/>
      <PetSearchSection/>
    </div>
  );
}
