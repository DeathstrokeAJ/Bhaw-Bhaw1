import React, { useState } from 'react';

const ReviewInformation = ({
  prevStep,
  formData = {}, // Default to an empty object
  handleChange,
  focusedField,
  handleFocus,
  handleBlur,
  nextStep,
}) => {
  // State to manage popup visibility
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Function to handle popup visibility
  const handleConfirmSubmit = () => {
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div>
      <div className="p-8 bg-white rounded-lg shadow-lg mx-auto">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={`text-sm ${focusedField === 'fullName' ? 'text-blue-600' : 'text-gray-700'}`}>
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              onFocus={() => handleFocus('fullName')}
              onBlur={handleBlur}
              placeholder="Enter your full name"
              className={`mt-1 block w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB] ${
                formData.fullName ? 'border-2 border-[#5E6366]' : 'border-0'
              }`}
            />
          </div>
          <div>
            <label className={`text-sm ${focusedField === 'email' ? 'text-blue-600' : 'text-gray-700'}`}>
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              placeholder="Enter your email address"
              className={`mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB] ${
                formData.email ? 'border-2 border-[#5E6366]' : 'border-0'
              }`}
            />
            {formData.email === '' && (
              <span className="text-red-500 text-sm">Fill the Box</span>
            )}
          </div>
          <div>
            <label className={`text-sm ${focusedField === 'address' ? 'text-blue-600' : 'text-gray-700'}`}>
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              onFocus={() => handleFocus('address')}
              onBlur={handleBlur}
              placeholder="Enter your address"
              className={`mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB] ${
                formData.address ? 'border-2 border-[#5E6366]' : 'border-0'
              }`}
            />
          </div>
          <div>
            <label className={`text-sm ${focusedField === 'phoneNumber' ? 'text-blue-600' : 'text-gray-700'}`}>
              Phone Number
            </label>
            <div className="flex">
              <input
                type="text"
                value="+234"
                className="bg-gray-100 text-black p-2 rounded-l-md w-16 text-center outline-none h-12"
                readOnly
              />
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                onFocus={() => handleFocus('phoneNumber')}
                onBlur={handleBlur}
                placeholder="Enter your phone number"
                className={`mt-1 block text-black w-full rounded-r-md outline-none p-2 h-12 bg-[#F6F7FB] ${
                  formData.phoneNumber ? 'border-2 border-[#5E6366]' : 'border-0'
                }`}
              />
            </div>
          </div>
          <div className="col-span-2 flex justify-between items-center">
            <div className="w-1/2 mr-4">
              <label className={`text-sm ${focusedField === 'contactMethod' ? 'text-blue-600' : 'text-gray-700'}`}>
                Preferred Contact Method
              </label>
              <select
                value={formData.contactMethod}
                onChange={(e) => handleChange('contactMethod', e.target.value)}
                onFocus={() => handleFocus('contactMethod')}
                onBlur={handleBlur}
                className={`mt-1 block text-black w-full rounded-md outline-none p-2 h-12 bg-[#F6F7FB] ${
                  formData.contactMethod ? 'border-2 border-[#5E6366]' : 'border-0'
                }`}
              >
                <option value="">Choose</option>
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            className="w-full text-black p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Time Slot</label>
          <select className="w-full p-2 text-black border border-gray-300 rounded mt-1">
            <option>Choose</option>
            <option>9:00 AM - 10:00 AM</option>
            <option>10:00 AM - 11:00 AM</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Duration</label>
          <select className="w-full p-2 border text-black border-gray-300 rounded mt-1">
            <option>Choose</option>
            <option>30 minutes</option>
            <option>1 hour</option>
          </select>
        </div>
        <div className="flex justify-between">
          <button
            className="border border-pink-500 text-pink-500 px-4 py-2 rounded"
            onClick={prevStep}
          >
            Back
          </button>
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded"
            onClick={nextStep}
          >
            Confirm Slot
          </button>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          className="border border-pink-500 text-pink-500 px-4 py-2 rounded"
          onClick={prevStep}
        >
          Edit
        </button>
        <button
          className="bg-pink-500 text-white px-4 py-2 rounded"
          onClick={handleConfirmSubmit}
        >
          Confirm and Submit
        </button>
      </div>

      {/* Popup Modal */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2"
              onClick={closePopup}
            >
              <img
                src="/images/services/cross.png" // Update this path based on your project structure
                alt="Close"
                className="w-4 h-4 m-1"
              />
            </button>
            <div className="flex flex-col mx-32 my-3 items-center">
              <img
                src="/images/services/popup.png"
                alt="Success Icon"
                className="w-32 h-32 mb-7"
              />
              <p className="text-lg font-semibold mb-2">
                Your Booking is done successfully
              </p>
              <button className="bg-[#F33877] text-white px-8 py-2 rounded mt-4">
                View Bookings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewInformation;
