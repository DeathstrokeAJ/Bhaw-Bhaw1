// pages/signin/SignInForm.js
"use client";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext"; // Adjust the path as necessary
import logo from "../../../public/images/signin/Group.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { db } from "../../../firebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";

const SignInForm = () => {
  const router = useRouter();
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const storedUser = sessionStorage.getItem("currentUser");
    if (storedUser) {
      toast.success("Login successful");
      router.push("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      let userFound = false;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.password === password) {
          userFound = true;
          sessionStorage.setItem("currentUser", JSON.stringify(userData));
          sessionStorage.setItem("userId", doc.id);
          sessionStorage.setItem("isLoggedIn", "true");
          setUser(userData); // Set user in context
          toast.success("Login successful");
          router.push("/");
        }
      });

      if (!userFound) {
        toast.error("Incorrect username or password");
      }
    } catch (error) {
      console.error("Error in login", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg w-3/4 mx-auto max-lg:w-full lg:pt-10 lg:px-20 lg:pb-32">
      <Toaster />
      <div className="flex justify-start mb-7">
        <Image src={logo} alt="Logo" width={200} height={80} className="h-20" />
      </div>
      <h2 className="text-left text-lg text-baw-light-gray mb-5">Welcome back !!!</h2>
      <h1 className="text-left text-4xl font-bold mb-6">Sign in</h1>
      <form className="mt-10" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-black text-sm mb-2 font-poppins" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="w-full p-3 bg-baw-input rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-6 font-poppins mt-10">
          <label className="text-black text-sm mb-2 font-poppins flex justify-between" htmlFor="password">
            Password
            <a href="#" className="text-sm text-gray-500 ml-4">Forgot Password?</a>
          </label>
          <div className="flex justify-between items-center">
            <input
              type="password"
              id="password"
              className="w-full p-3 bg-baw-input rounded-sm text-gray-900 focus:outline-none focus:border-red-400"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full flex justify-center lg:mt-10">
          <button
            type="submit"
            className="w-full lg:w-fit lg:rounded-full bg-baw-red text-white font-bold py-3 px-7 rounded-md flex justify-center items-center hover:bg-baw-yellow"
            disabled={loading}
          >
            <span>{loading ? "Signing In..." : "SIGN IN"}</span>
            <span className="ml-2">➔</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
