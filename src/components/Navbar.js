"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "../app/context/AuthContext"; // Update this import path as needed
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // Logout function
  const handleLogout = () => {
    logout();
    console.log("User logged out");
    router.push("/Signin");
  };

  return (
    <nav className="bg-white py-5 px-6 md:px-12">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/images/logo.png"
            alt="BHAW Logo"
            className="h-10 w-auto mx-2"
          />
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex flex-grow justify-center lg:space-x-8 text-gray-600">
          <li>
            <Link href="/about" className="hover:text-black text-[#C4B0A9] cursor-pointer">
              About us
            </Link>
          </li>
          <li>
            <Link href="/products" className="hover:text-black text-[#C4B0A9] cursor-pointer">
              Products
            </Link>
          </li>
          <li>
            <Link href="/service" className="hover:text-black text-[#C4B0A9] cursor-pointer">
              Services
            </Link>
          </li>
          <li>
            <Link href="/blogs" className="hover:text-black text-[#C4B0A9] font-medium cursor-pointer">
              Blogs
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-black text-[#C4B0A9] cursor-pointer">
              Contact us
            </Link>
          </li>
        </ul>

        {/* Icons and Buttons */}
        <div className="flex items-center space-x-4 ml-auto">
          <Link href="/recommendation">
            <button>
              <img
                src="/images/navbar/heart.png"
                alt="Wishlist"
                className="w-6 h-6"
              />
            </button>
          </Link>
          <Link href="/cart">
            <button>
              <img
                src="/images/navbar/cart.png"
                alt="Cart"
                className="w-6 h-6"
              />
            </button>
          </Link>
          {user ? (
            <button onClick={handleLogout}>
              <img
                src="/images/navbar/profile.png"
                alt="Profile"
                className="w-6 h-6 mb-2"
              />
            </button>
          ) : (
            <>
              <Link href="/login">
                <button className="text-[#8E8E8E] px-3 py-1 rounded-md">
                  LOGIN
                </button>
              </Link>
              <Link href="/signin">
                <button className="flex items-center justify-between w-full bg-black text-white px-8 py-2 rounded-full">
                  <p>Sign up now</p>
                  <img
                    src="/images/navbar/image.png"
                    alt="Icon"
                    className="w-5 h-5 ml-2"
                  />
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleDrawer} className="focus:outline-none">
            <FiMenu className="w-6 h-6 ml-4 text-gray-600 hover:text-black" />
          </button>
        </div>
      </div>

      {/* Drawer Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg z-10">
          <ul className="flex flex-col items-center text-gray-600 p-4">
            <li>
              <Link href="/about" className="hover:text-black text-[#C4B0A9] cursor-pointer py-2">
                About us
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-black text-[#C4B0A9] cursor-pointer py-2">
                Products
              </Link>
            </li>
            <li>
              <Link href="/service" className="hover:text-black text-[#C4B0A9] cursor-pointer py-2">
                Services
              </Link>
            </li>
            <li>
              <Link href="/blogs" className="hover:text-black text-[#C4B0A9] font-medium cursor-pointer py-2">
                Blogs
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-black text-[#C4B0A9] cursor-pointer py-2">
                Contact us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
