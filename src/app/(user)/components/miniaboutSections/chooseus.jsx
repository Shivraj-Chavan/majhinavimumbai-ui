import React from "react";
import Image from "next/image";

export default function ChooseUs() {
  return (

    <div className="max-w-6xl mx-auto px-1 py-6 mt-5 flex flex-col md:flex-row items-center justify-center h-auto md:h-[70vh] shadow-md p-6 md:p-10 gap-6">
      
      <div className="w-full md:w-1/3 flex justify-center">

        <Image src="/choose.jpg" alt="Chooseus" width={300} height={200} className="rounded-xl md:w-[400px] shadow-lg" />

      </div>


      <div className="w-full md:w-2/3 text-center md:text-left">

        <h1 className="font-bold text-2xl md:text-3xl text-green-600 mb-4">WHY CHOOSE US?</h1>

        <p className="text-md md:text-md text-gray-700 leading-relaxed"> 
        &#8226; 100% Navi Mumbai-Focused: Unlike other platforms that cover the entire country,
        we are exclusively focused on Navi Mumbai’s local market.
        <br/>
        &#8226; Real-Time Data: Accurate, verified, and updated listings to ensure you get the best
        information.
        <br/>
        &#8226; User-Friendly Platform: Clean, simple interface for smooth navigation and
        interaction.
        <br/>
        &#8226; Business Growth Support: We help small and medium businesses in Navi Mumbai to
        get discovered, gain leads, and grow their digital presence.
        <br/>
        &#8226; Community-Driven Reviews: We believe in the power of local voice — our platform
        thrives on real reviews from Navi Mumbai residents.
        </p>

      </div>
      
    </div>
  );
}
