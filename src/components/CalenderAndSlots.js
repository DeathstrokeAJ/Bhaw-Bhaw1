// CalendarAndSlot.js
import React from 'react';

const CalendarAndSlot = ({ nextStep, prevStep }) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block text-gray-700">Date</label>
        <input
          type="date"
          className="w-full p-2 border text-black border-gray-300 rounded mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Time Slot</label>
        <select className="w-full p-2 border text-black border-gray-300 rounded mt-1">
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
  );
};

export default CalendarAndSlot;
