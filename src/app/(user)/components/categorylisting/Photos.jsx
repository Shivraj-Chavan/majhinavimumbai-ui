import React from "react";
import Image from "next/image";

export default function Photos({ business, setTab }) {
  const hasImages = business?.images?.length > 0;
  const imagecopy = "/imagecopy.png";
  const firstImg = typeof business.images?.[0] === 'string' 
  ? business.images?.[0] 
  : business.images?.[0]?.url;
  console.log("business.images", business.images);


  if (!hasImages) {
    return (
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 z-0 relative">
        <div className="relative col-span-1 h-36 sm:h-40 md:h-48 rounded-xl overflow-hidden">
          <Image
            src='http://69.62.84.113/5005/uploads/1751113677338-658185846.jpg'
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
         src={firstImg || imagecopy}
          alt="Business Image"
          fill
          className="object-cover"
        />
      </div>

      {/* Thumbnails */}
      {business.images.map((imgObj, i) => {
        if (i === 0) return null;

      const imageUrl = typeof imgObj === 'string' ? imgObj : imgObj?.url;
      const isLast = i === business.images.length - 1;

  return (
    <div
      key={i}
      className="relative w-full h-24 rounded-lg overflow-hidden group cursor-pointer"
      onClick={() => isLast && setTab && setTab("photos")}
    >
      {imageUrl ? (
        <img
          src={`http://69.62.84.113:5005${imageUrl}`}
          alt={`Image ${imageUrl}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-sm text-white">
          No Images Available
        </div>
      )}

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
