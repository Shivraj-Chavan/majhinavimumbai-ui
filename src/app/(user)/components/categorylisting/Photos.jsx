import React from "react";
import Image from "next/image";

export default function Photos({ business, setTab }) {
  const hasImages = business?.images?.length > 0;

  return (
    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 z-0 relative">
      {hasImages &&
        business.images.map((img, index) => {
          const imageUrl = typeof img === "string" ? img : img?.url;
          return (
            <div
              key={index}
              className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100"
            >
              <Image
                src={`http://69.62.84.113:5005${imageUrl}`}
                alt={`Business Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          );
        })}
    </div>
  );
}
