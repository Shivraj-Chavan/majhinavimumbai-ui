import React from "react";
import Image from "next/image";

export default function ChooseUs() {
  return (
    <div className="max-w-6xl mx-auto px-1 py-6 mt-5 flex flex-col md:flex-row items-center justify-center h-auto md:h-[70vh] shadow-md p-6 md:p-10 gap-6">
      
      {/* Left Image Section */}
      <div className="w-full md:w-1/3 flex justify-center">
        <Image
          src="/choose.jpg"
          alt="Chooseus"
          width={300}
          height={200}
          className="rounded-xl md:w-[400px] shadow-lg"
        />
      </div>

      {/* Right Text Section */}
      <div className="w-full md:w-2/3 text-center md:text-left">
        <h1 className="font-bold text-2xl md:text-3xl text-green-600 mb-4">
          WHY CHOOSE US?
        </h1>

        <ul className="list-disc list-inside text-md text-gray-700 space-y-3">
          <li>
            <span className="font-medium">100% Navi Mumbai-Focused:</span> Unlike other platforms that cover the entire country, we are exclusively focused on Navi Mumbai’s local market.
          </li>
          <li>
            <span className="font-medium">Real-Time Data:</span> Accurate, verified, and updated listings to ensure you get the best information.
          </li>
          <li>
            <span className="font-medium">User-Friendly Platform:</span> Clean, simple interface for smooth navigation and interaction.
          </li>
          <li>
            <span className="font-medium">Business Growth Support:</span> We help small and medium businesses in Navi Mumbai to get discovered, gain leads, and grow their digital presence.
          </li>
          <li>
            <span className="font-medium">Community-Driven Reviews:</span> We believe in the power of local voice — our platform thrives on real reviews from Navi Mumbai residents.
          </li>
        </ul>
      </div>
    </div>
  );
}
