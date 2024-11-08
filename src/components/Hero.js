import React from 'react';

const PetPromoBanner = () => {
  return (
    <section className="relative bg-[#F3F4F6] pt-4 flex justify-center items-center">
      {/* Text Section */}
      <div className="w-1/2 pl-24">
        <h1 className="text-7xl leading-tight font-bold text-black mb-4 font-prompt">
          Everything your pet deserves at one place!
        </h1>
        <p className="text-black w-[75%] font-montserrat text-lg mb-6">
          From pet essentials to expert services, we connect you with trusted
          vendors who care about your pets as much as you do.
        </p>
        <button className="bg-[#FFEB3B] text-[#4D413E] font-semibold px-8 py-3 rounded-full flex items-center hover:bg-yellow-500 transition">
          Explore
          <img src="/images/Home/arrow.png" alt="Arrow" className="ml-2 w-5 h-5 object-contain" /> {/* Use your arrow image here */}
        </button>
      </div>

      {/* Image Section */}
      <div className="relative">
        <img
          src="/images/Home/hero.png"
          alt="Dog getting treat"
          className="w-[45rem] h-[34rem]"
        />
        {/* 50% Badge (Moved to Left Side) */}
        <div className="absolute ml-24 font-prompt top-0 left-0 bg-[#E57A7A] text-white font-bold text-4xl py-3 px-6 rounded-full -rotate-12 transform -translate-x-6 -translate-y-6">
          50%
        </div>
        {/* Additional Shape (Purple Square) */}
        <div className="absolute bottom-8 left-8 bg-purple-300 w-8 h-8 rotate-45"></div>
      </div>
    </section>
  );
};

export default PetPromoBanner;
