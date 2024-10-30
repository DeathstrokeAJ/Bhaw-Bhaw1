import ConnectNewsletter from "@/components/ConnectNewsletter";
import React from "react";

const PetCareSection = () => {
  return (
    <section className="bg-white">
      {/* Main Title and Image Section */}
      <div className="text-center lg:mb-16 relative mx-auto pt-8">
        {/* Hero Image */}
        <div className="relative flex justify-center">
          <img
            src="/images/about/hero1.png"
            alt="Happy dog"
            className="w-full max-w-[50rem] h-auto" // Responsive width and height
          />
          {/* Additional Image Overlaid on Hero Image */}
          <div className="absolute mt-32 md:mt-44 inset-0 flex justify-center items-center">
            <img
              src="/images/about/hero2.png" // Path to your new image
              alt="Another happy pet" // Update the alt text appropriately
              className="w-[20rem] max-w-full h-auto" // Responsive width
            />
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="relative mb-16 mt-20 flex flex-col lg:flex-row items-center justify-center">
        <div className="flex justify-center mb-6 lg:mb-0 lg:mr-8">
          <img
            src="/images/about/image.png"
            alt="Pet 1"
            className="h-[30rem] w-[30rem] rounded object-contain max-w-full max-h-[30rem]" // Responsive max width and height
          />
        </div>

        {/* Text on the right */}
        <div className="text-right pl-4 pr-10 w-full lg:w-1/2">
          <h2 className="text-4xl font-poppins text-[#4D413E] mb-4 flex justify-end items-center">
            <img
              src="images/about/paw.png"
              alt="Paw Icon"
              className="w-12 h-12 mr-4"
            />
            Our Story
          </h2>
          <p className="text-[#85716B] text-2xl lg:text-3xl font-kiwi leading-10"> {/* Adjusted font size for smaller screens */}
            BhawBhaw was born out of a deep love for animals of all kinds. Our
            founders realized that while pet care was improving for dogs and
            cats, there were fewer trusted options for fish, birds, and small
            pets. BhawBhaw was created to bridge that gap.
          </p>
          <button className="bg-[#4D413E] rounded-full text-white px-10 py-2 mt-6 font-poppins hover:bg-gray-700">
            Read More
          </button>
        </div>
      </div>

      {/* Bottom Illustrations */}
      <div className="flex flex-wrap justify-evenly pb-10 space-x-6">
        <img
          src="images/about/bottom1.png"
          alt="Cat doodle 1"
          className="w-64 h-64 mb-4 md:mb-0"
        />
        <img
          src="images/about/bottom2.png"
          alt="Dog doodle 2"
          className="w-64 h-64 mb-4 md:mb-0"
        />
        <img
          src="images/about/bottom3.png"
          alt="Person with pet"
          className="w-64 h-64 mb-4 md:mb-0"
        />
      </div>
      <ConnectNewsletter />
    </section>
  );
};

export default PetCareSection;
