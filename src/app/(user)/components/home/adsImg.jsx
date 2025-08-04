import Image from 'next/image';
import React from 'react';

export default function AdsImg({ className = "" }) {
  return (
    <div className={`w-full flex justify-center my-6 ${className}`}>
      {/* Desktop View Image (visible on md and up) */}
      <Image 
        src="/assests/advimg1.jpeg" 
        alt="Advertisement" 
        width={1200} 
        height={100} 
        className="rounded shadow-lg hidden md:block"
      />

      {/* Mobile View Image (visible below md) */}
      <Image 
        src="/assests/add1.jpeg" 
        alt="Advertisement" 
        width={1200} 
        height={100} 
        className="rounded shadow-lg block md:hidden"
      />
    </div>
  );
}
