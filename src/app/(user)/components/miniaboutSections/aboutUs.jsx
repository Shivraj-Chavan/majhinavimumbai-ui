"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function About() {

  return (
    <div className="mt-5 max-w-6xl mx-auto px-1 py-6 flex flex-col md:flex-row items-center justify-center h-auto md:h-[70vh] shadow-md p-6 md:p-10 gap-6">

      {/* Image Section */}
      <div className="w-full md:w-1/3 h-[300px] md:h-full flex justify-center items-center">
       
          <div className="relative w-[400px] h-[300px] rounded-xl shadow-lg overflow-hidden">
          <Image
           src='/logo.png'
            alt="logo"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      
      </div>

      {/* Text Section */}
      <div className="w-full md:w-2/3 text-center md:text-left">
       
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
        
      </div>
    </div>
  );
}
