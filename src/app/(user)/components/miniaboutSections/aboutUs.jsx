"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function About() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-5 max-w-6xl mx-auto px-1 py-6 flex flex-col md:flex-row items-center justify-center h-auto md:h-[70vh] shadow-md p-6 md:p-10 gap-6">

      {/* Image Section */}
      <div className="w-full md:w-1/3 h-[300px] md:h-full flex justify-center items-center">
        {loading ? (
          <div className="w-[90%] md:w-[400px] h-full bg-gray-200 animate-pulse rounded-xl" />
        ) : (
          <div className="relative w-[400px] h-[300px] rounded-xl shadow-lg overflow-hidden">
          <Image
            src="/nmmc.png"
            alt="mahanagarpalika"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
        )}
      </div>

      {/* Text Section */}
      <div className="w-full md:w-2/3 text-center md:text-left">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
            <div className="h-4 bg-gray-200 rounded w-3/6" />
          </div>
        ) : (
          <>
            <h1 className="font-bold text-3xl md:text-3xl text-orange-400 mb-4">ABOUT US</h1>
            <p className="text-sm md:text-md text-gray-700 leading-relaxed px-3 md:px-0">
              <span className="font-bold">Navi Mumbai Local Search (Majhi Navi Mumbai)</span> is Navi
              Mumbai’s dedicated local discovery platform. Our mission is to connect users with the
              best businesses, services, and solutions available exclusively in Navi Mumbai. Whether
              you're looking for a service provider, a local store, a restaurant, or any essential
              service, we make discovery simple, fast, and reliable.
              <br /><br />
              We empower users to find relevant local businesses and enable smooth communication and
              transactions, all through a single, user-friendly platform available on web, mobile
              apps, and voice services.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
