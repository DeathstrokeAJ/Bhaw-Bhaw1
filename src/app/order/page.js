"use client";
import CalendarAndSlot from '@/components/CalenderAndSlots';
import ContactInformation from '@/components/ContactInformation';
import ReviewInformation from '@/components/ReviewInformation';
import React, { useState } from 'react';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Ensure this path is correct

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [visitedSteps, setVisitedSteps] = useState([]);
  const [formData, setFormData] = useState({
    contactInfo: {},
    calendarAndSlot: {},
    reviewInfo: {},
  });

  const nextStep = () => {
    if (!visitedSteps.includes(step)) {
      setVisitedSteps([...visitedSteps, step]);
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleFormDataChange = (data) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  const getStepStyle = (currentStep) => {
    if (visitedSteps.includes(currentStep)) {
      return {
        icon: '/images/services/tick.png',
        borderColor: 'border-black',
        textColor: 'text-black',
      };
    } else if (step === currentStep) {
      return {
        icon: '/images/services/downArrow.png',
        borderColor: 'border-black',
        textColor: 'text-black',
      };
    } else {
      return {
        icon: '/images/services/arrow.png',
        borderColor: 'border-gray-400',
        textColor: 'text-gray-400',
      };
    }
  };

  const handleSubmit = async () => {
    // Create a custom document ID (e.g., based on timestamp)
    const customDocId = `form-${Date.now()}`;
  
    try {
      await setDoc(doc(db, "bookService", customDocId), { // Change the collection name here
        contactInfo: formData.contactInfo,
        calendarAndSlot: formData.calendarAndSlot,
        reviewInfo: formData.reviewInfo,
        createdAt: new Date(),
      });
      console.log("Form data saved successfully!");
      
      // Optionally reset the form or redirect the user
      setFormData({
        contactInfo: {},
        calendarAndSlot: {},
        reviewInfo: {},
      });
      setVisitedSteps([]); // Reset visited steps
      setStep(1); // Reset to the first step
    } catch (error) {
      console.error("Error saving form data: ", error);
    }
  };
  

  return (
    <div className="flex px-10 flex-col bg-white items-center justify-center font-montserrat">
      <div className="w-full bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-black">Book Your Service</h2>

        <div className="flex items-center mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className={`text-center ${getStepStyle(stepNumber).textColor}`}>
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center border-2 ${getStepStyle(stepNumber).borderColor} ${visitedSteps.includes(stepNumber) ? 'bg-black' : ''}`}>
                  <img src={getStepStyle(stepNumber).icon} alt="Step icon" className="w-6 h-6" />
                </div>
                <p className="mt-2 h-10 w-32">
                  {stepNumber === 1
                    ? "Contact Information"
                    : stepNumber === 2
                    ? "Calendar and Slot Choose"
                    : "Review Information"}
                </p>
              </div>
              {stepNumber < 3 && (
                <div className={`w-full mb-10 ${step > stepNumber ? 'bg-black h-1' : 'bg-gray-400 h-0.5'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && <ContactInformation nextStep={nextStep} handleFormDataChange={handleFormDataChange} />}
        {step === 2 && <CalendarAndSlot nextStep={nextStep} prevStep={prevStep} handleFormDataChange={handleFormDataChange} />}
        {step === 3 && <ReviewInformation prevStep={prevStep} onSubmit={handleSubmit} />}
      </div>
    </div>
  );
};

export default MultiStepForm;
