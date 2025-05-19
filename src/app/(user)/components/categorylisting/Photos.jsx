import React from "react";
import Image from "next/image";

export default function Photos({ business, setTab }) {
  const hasImages = business?.images?.length > 0;
  const imagecopy = "/imagecopy.png";

  if (!hasImages) {
    return (
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 z-0 relative">
        <div className="relative col-span-1 h-36 sm:h-40 md:h-48 rounded-xl overflow-hidden">
          <Image
            src={imagecopy}
            alt="No Images Available"
            fill
            className="object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 z-0 relative">
      {/* Main Featured Image */}
      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100">
        <Image
          src={business.images?.[0] || imagecopy}
          alt="Business Image"
          fill
          className="object-cover"
        />
      </div>

      {/* Thumbnails */}
      {business.images.map((img, i) => {
        if (i === 0) return null;
        const isLast = i === business.images.length - 1;

        return (
          <div
            key={i}
            className="relative w-full h-24 rounded-lg overflow-hidden group cursor-pointer"
            onClick={() => isLast && setTab && setTab("photos")}
          >
            <Image
              src={img}
              alt={`Image ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {isLast && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold text-xs backdrop-blur-sm">
                + Photos
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
