"use client"
import Hero from "@/components/Hero";
import PetSearchSection from "@/components/PetSearchSection";
import Image from "next/image";
import { useContext } from "react";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  console.log(user)
  return (
    <div className="">
      <Hero/>
      <PetSearchSection/>
    </div>
  );
}
