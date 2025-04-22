import React from 'react';
import Image from 'next/image';
import { FaCheckSquare } from "react-icons/fa";

export default function WeOffer() {
  const offers = [
    "Local Business Directory: A vast collection of verified listings of service providers, shops, and professionals from Navi Mumbai.",
    "Search & Discover: Find businesses by category, location, rating, or service offered.",
    "Customer Reviews & Ratings: Genuine feedback from real users to help you make better decisions.",
    "Seamless Communication: Directly connect with businesses through calls, messages, or real-time chat.",
    "Digital Solutions for Businesses: Free business listing, premium packages, online presence creation, and campaign promotions."
  ];

  return (
    <div className="mt-5 mx-auto px-1 py-6 bg-blue-100 flex flex-col md:flex-row items-center justify-center h-auto md:h-[60vh] shadow-md p-6 md:p-10 gap-6">
      {/* Text Content */}
      <div className="w-full md:w-2/3 text-left max-w-7xl space-y-2">
        <h1 className="font-bold text-2xl md:text-3xl text-blue-800 mb-2">What We Offer</h1>
        
        {offers.map((item, index) => (
          <div key={index} className="flex items-start">
            <FaCheckSquare className="text-green-600 text-lg mt-1.5" />
            <p className="text-md text-gray-700 leading-relaxed ml-2">{item}</p>
          </div>
        ))}
      </div>

      {/* Image */}
      <div className="w-full md:w-1/3 flex justify-center">
        <Image
          src="/vision.jpg"
          width={400}
          height={250}
          alt="Offer"
          className="rounded-xl shadow-lg w-full md:w-[400px] h-auto object-cover"
        />
      </div>
    </div>
  );
}
