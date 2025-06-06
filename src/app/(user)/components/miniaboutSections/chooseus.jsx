"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function ChooseUs() {
  const [loading, setLoading] = useState(true);

  const points = [
    {
      title: "100% Navi Mumbai-Focused:",
      text: "Unlike other platforms that cover the entire country, we are exclusively focused on Navi Mumbai’s local market.",
    },
    {
      title: "Real-Time Data:",
      text: "Accurate, verified, and updated listings to ensure you get the best information.",
    },
    {
      title: "User-Friendly Platform:",
      text: "Clean, simple interface for smooth navigation and interaction.",
    },
    {
      title: "Business Growth Support:",
      text: "We help small and medium businesses in Navi Mumbai to get discovered, gain leads, and grow their digital presence.",
    },
    {
      title: "Community-Driven Reviews:",
      text: "We believe in the power of local voice — our platform thrives on real reviews from Navi Mumbai residents.",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-1 py-6 mt-5 flex flex-col md:flex-row items-center justify-center h-auto md:h-[70vh] shadow-md p-6 md:p-10 gap-6">
      
      {/* Left Image Section */}
      <div className="w-full md:w-1/3 flex justify-center">
        {loading ? (
          <div className="w-[300px] md:w-[400px] h-[250px] bg-gray-200 animate-pulse rounded-xl" />
        ) : (
          <Image
            src="/choose.jpg"
            alt="Chooseus"
            width={300}
            height={200}
            className="rounded-xl md:w-[400px] shadow-lg"
          />
        )}
      </div>

      {/* Right Text Section */}
      <div className="w-full md:w-2/3 text-left space-y-3">
        {loading ? (
          <>
            <div className="h-6 w-56 bg-gray-200 animate-pulse rounded mb-4" />
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 mt-2.5 bg-gray-300 rounded-full flex-shrink-0 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              </div>
            ))}
          </>
        ) : (
          <>
            <h1 className="font-bold text-2xl md:text-3xl text-green-600 mb-4">
              WHY CHOOSE US?
            </h1>
            {points.map((point, index) => (
              <div key={index} className="flex items-start">
                <span className="w-2 h-2 mt-2.5 rounded-full bg-green-600 flex-shrink-0"></span>
                <p className="ml-3 text-gray-700 text-md leading-relaxed">
                  <span className="font-medium">{point.title}</span> {point.text}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
