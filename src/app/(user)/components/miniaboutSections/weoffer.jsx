import React from 'react';
import Image from 'next/image';
 
export default function WeOffer() {
  return (

    <div className=" mt-5 mx-auto px-1 py-6 bg-blue-100 flex flex-col md:flex-row items-center justify-center h-auto md:h-[60vh] shadow-md  p-6 md:p-10 gap-6">
    
    <div className="w-full md:w-2/3 text-center md:text-left max-w-7xl">

      <h1 className="font-bold text-2xl md:text-3xl text-blue-800 mb-4">What We Offer</h1>

      <p className="text-md md:text-md text-gray-700 leading-relaxed"> 
      ✅ Local Business Directory: A vast collection of verified listings of service providers, shops,
        and professionals from Navi Mumbai.
        <br/>
      ✅ Search &amp; Discover: Find businesses by category, location, rating, or service offered.
      <br/>
      ✅ Customer Reviews &amp; Ratings: Genuine feedback from real users to help you make better
        decisions.
        <br/>
      ✅ Seamless Communication: Directly connect with businesses through calls, messages, or
        real-time chat.
        <br/>
      ✅ Digital Solutions for Businesses: Free business listing, premium packages, online
        presence creation, and campaign promotions.
      </p>

    </div>


    <div className="w-full md:w-1/3 flex justify-center">

      <Image src='/vision.jpg' width={300} height={200} alt="Offer" className="rounded-xl  md:w-[400px] shadow-lg "/>

    </div>
    
  </div>
  )
}

     