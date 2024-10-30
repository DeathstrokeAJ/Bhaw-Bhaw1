"use client";
import React, { useEffect, useState } from 'react';
import { subscribeToNewsletter } from '../backend/subscribeservice';

const ConnectNewsletter = ({ bg = '#C9ABA0' }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const prefilledEmail = sessionStorage.getItem("prefilledEmail");
    const subscribedStatus = sessionStorage.getItem("subscribedStatus");

    if (prefilledEmail && subscribedStatus === "true") {
      setEmail(prefilledEmail);
      setMessage("You are already subscribed.");
    }
  }, []);

  const handleSubscribe = async () => {
    if (!email) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const successMessage = await subscribeToNewsletter(email, 'website');
      setMessage(successMessage);
      sessionStorage.setItem("subscribedStatus", "true");
      sessionStorage.setItem("prefilledEmail", email);
      setEmail('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-20 font-poppins" style={{ backgroundColor: bg }}>
      <div className="container mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-white mb-4 leading-tight tracking-wider">
          Lets Connect Our Newsletter
        </h2>
        <p className="text-white md:mb-8 lg:mx-52 leading-relaxed tracking-wide">
          Stay updated with the latest grooming tips, offers, and pet care advice by subscribing to our newsletter.
        </p>
        <div className="flex flex-col md:flex-row mt-10 justify-center items-center gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-4 py-3 w-full md:w-80 rounded text-gray-700 border-none focus:outline-none"
            disabled={!!message && message.includes("already subscribed")}
          />
          <button
            onClick={handleSubscribe}
            className="bg-[#4D3C36] text-white w-full md:w-auto px-8 md:px-14 text-lg font-medium py-3 rounded tracking-wider"
            disabled={loading || (message && message.includes("Already subscribed"))}
          >
            {loading ? 'Subscribing...' : (message.includes("Already subscribed") ? "Subscribed" : "Subscribe")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectNewsletter;
