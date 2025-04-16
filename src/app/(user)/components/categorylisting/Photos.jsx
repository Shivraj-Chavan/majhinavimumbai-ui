import React from "react";
import Image from "next/image";

export default function Photos({ business, setTab }) {
  if (!business?.images?.length) return null;

  return (
    <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      
      {/* Main Featured Image */}
      <div className="relative col-span-2 row-span-2 h-48 sm:h-56 md:h-64 rounded-xl overflow-hidden group">
        <Image
          src={business.images[0]}
          alt="Featured"
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      {business.images.map((img, i) => {
        if (i === 0) return null; 

        const isLast = i === business.images.length - 1;

        return (
          <div
            key={i}
            className="relative h-10 sm:h-24 md:h-28 rounded-lg overflow-hidden group cursor-pointer"
            onClick={() => isLast && setTab && setTab("photos")}
          >
            <Image
              src={img}
              alt={`Image ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {isLast && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-sm backdrop-blur-sm">
                + Photos
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
