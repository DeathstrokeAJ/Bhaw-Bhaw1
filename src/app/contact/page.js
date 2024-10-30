"use client";
import React, { useState } from 'react';
import { db } from '../../../firebaseConfig'; // Adjust the path if necessary
import { doc, setDoc } from 'firebase/firestore';

const ContactUs = () => {
  // States for each section of the form
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  const [serviceInfo, setServiceInfo] = useState({
    service: '',
    message: '',
  });

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value,
    });
  };

  const handleServiceInfoChange = (e) => {
    const { name, value } = e.target;
    setServiceInfo({
      ...serviceInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Create a custom document ID using a combination of user data or timestamp
      const uid = `contact_${Date.now()}`;

      // Get current date and time for createdAt and updatedAt fields
      const now = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
      });

      // Combine all form data
      const combinedData = {
        ...personalInfo,
        ...serviceInfo,
        createdAt: now,
        updatedAt: now,
      };

      // Store data in Firestore
      await setDoc(doc(db, 'contacts', uid), combinedData);

      // Reset both sections of the form
      setPersonalInfo({
        name: '',
        email: '',
        phoneNumber: '',
      });
      setServiceInfo({
        service: '',
        message: '',
      });

      alert('Contact information stored successfully.');
    } catch (error) {
      console.error('Error storing contact information:', error);
      alert('Error storing contact information.');
    }
  };

  return (
    <div className='bg-white p-10'>
      <div className="flex flex-col items-center text-black p-8 font-poppins bg-white lg:px-16">
        <h1 className="lg:text-8xl text-4xl font-extrabold text-[#85716B]">Contact us</h1>
        <p className="text-center lg:mx-32 text-gray-600 mt-2">
          We know your pets are cherished members of your family. Thats why we provide loving, personalized pet sitting services tailored to their needs.
        </p>

        <div className="mt-8 w-full p-6 rounded-lg border border-[#F3EAE7]">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="flex flex-col">
              <label className="text-[#846F67] text-2xl">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={personalInfo.name}
                onChange={handlePersonalInfoChange}
                className="mt-1 p-2 border rounded-md text-gray-600 bg-[#F3EAE7]"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[#846F67] text-2xl">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Example@youremail.com"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                className="mt-1 p-2 border rounded-md text-gray-600 bg-[#F3EAE7]"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[#846F67] text-2xl">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="+777 666 8888"
                value={personalInfo.phoneNumber}
                onChange={handlePersonalInfoChange}
                className="mt-1 p-2 border rounded-md text-gray-600 bg-[#F3EAE7]"
                required
              />
            </div>

            {/* Service Information Section */}
            <div className="flex flex-col">
              <label className="text-[#846F67] text-2xl">Service</label>
              <input
                type="text"
                name="service"
                placeholder="Ex Dog walking"
                value={serviceInfo.service}
                onChange={handleServiceInfoChange}
                className="mt-1 p-2 border rounded-md text-gray-600 bg-[#F3EAE7]"
                required
              />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <label className="text-[#846F67] text-2xl">Message</label>
              <textarea
                name="message"
                placeholder="Write your message here.."
                value={serviceInfo.message}
                onChange={handleServiceInfoChange}
                className="mt-1 p-2 border rounded-md text-[#85716B] bg-[#F3EAE7] h-24"
                required
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-[#FFEB3B] text-[#4D413E] py-2 px-4 rounded-md text-2xl"
              >
                Book Now
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Additional information (like opening hours, location, and contact) */}
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#F3EAE7] rounded-xl text-gray-600">
        <div className="flex items-center space-x-4 p-4">
          <img src="/images/contact/clock.png" alt="Clock" className="w-16 h-16" />
          <div>
            <h4 className="font-staatliches text-[#4D413E] text-2xl">OPEN HOURS</h4>
            <p className='text-sm' >Mon - Fri: 9:00 AM to 6:00 PM</p>
            <p className='text-sm' >Saturday: 9:00 AM to 2:00 PM</p>
            <p className='text-sm' >Sunday: 9:00 AM to 2:00 PM</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4">
          <img src="/images/contact/location.png" alt="Location" className="w-16 h-16" />
          <div>
            <h4 className="font-staatliches text-[#4D413E] text-2xl">LOCATION</h4>
            <p className='text-sm' >123 Maple Street, Springfield, Anytown, USA</p>
            <a href="#" className="text-[#FFEB3B]">See on map</a>
          </div>
        </div>
        <div className="flex items-center space-x-4 p-4">
          <img src="/images/contact/phone.png" alt="Phone" className="w-16 h-16" />
          <div>
            <h4 className="font-staatliches text-[#4D413E] text-2xl">CONTACT</h4>
            <p className='text-sm' >648-423-2785</p>
            <p className='text-sm' >Contact@gatito.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
