import React from 'react';

const PetJoySection = () => {
  return (
    <div className='bg-white'>
    <section className="relative pt-20 flex flex-col items-center justify-center text-center py-16 px-4 bg-white">
      {/* Main Content */}
      <div className="z-10 max-w-5xl">
        <h1 className="text-9xl font-bold mb-4 font-staatliches text-[#4D413E]">WHERE EVERY </h1>
        <h1 className="text-9xl font-bold mb-4 font-staatliches  text-[#4D413E]">PETS JOY BEGINS!</h1>
        <p className="text-[#4D413E] mb-3 mx-64 font-poppins">
          We know your pets are cherished members of your family.
          That’s why we provide loving, personalized pet sitting
          services tailored to their needs.
        </p>
        <button className="bg-[#FFEB3B] font-poppins  text-black px-2 py-1 rounded-md ">
          book Now
        </button>
      </div>

      {/* Circular Images */}
      <div className="absolute w-[600px] h-[400px] flex items-center justify-center">
        {/* Top Image */}
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-28 h-28 rounded-full border-8 border-[#e57373] overflow-hidden">
          <img src="images/services/pet2.png" alt="Pet 1" className="object-cover w-full h-full" />
        </div>

        {/* Left Image */}
        <div className="absolute -left-14 top-[82%]  transform -translate-y-1/2 -translate-x-8 w-36 h-36 rounded-full border-8 border-[#e57373] overflow-hidden">
          <img src="images/services/pet4.png" alt="Pet 3" className="object-cover w-full h-full" />
        </div>

        {/* Right Image */}
        <div className="absolute -right-12 top-[79%]  transform -translate-y-1/2 translate-x-8 w-32 h-32 rounded-full border-8 border-[#a0df6d] overflow-hidden">
          <img src="images/services/pet5.png" alt="Pet 4" className="object-cover w-full h-full" />
        </div>

        {/* Top Left Image */}
        <div className="absolute -top-3 -left-40 w-40 h-40 rounded-full border-8 border-[#febf03] overflow-hidden">
          <img src="images/services/pet1.png" alt="Pet 5" className="object-cover w-full h-full" />
        </div>

        {/* Top Right Image */}
        <div className="absolute -top-0 -right-28 w-28 h-28 rounded-full border-8 border-[#febf03] overflow-hidden">
          <img src="images/services/pet3.png" alt="Pet 6" className="object-cover w-full h-full" />
        </div>

      </div>
    </section>
    </div>
  );
};

export default PetJoySection;
