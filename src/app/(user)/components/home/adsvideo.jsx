"use client";
import React, { useState, useEffect } from "react";

const Adsvideo = () => {
  // Mobile slides
  const slidesMobile = [
    { type: "image", src: "/assests/app-soon1.jpg" },
    { type: "image", src: "/assests/app-soon1.jpg" },
    // { type: "video", src: "/assests/adsvideo.mp4" },
  ];

  // Desktop slides
  const slidesDesktop = [
    { type: "image", src: "/assests/app-soon1.jpg" },
    { type: "image", src: "/assests/advimg1.jpeg" },
    // { type: "video", src: "/assests/adsvideo.mp4" },
  ];

  const [currentIndexMobile, setCurrentIndexMobile] = useState(0);
  const [currentIndexDesktop, setCurrentIndexDesktop] = useState(0);

  useEffect(() => {
    const intervalMobile = setInterval(() => {
      setCurrentIndexMobile((prev) => (prev + 1) % slidesMobile.length);
    }, 5000);

    const intervalDesktop = setInterval(() => {
      setCurrentIndexDesktop((prev) => (prev + 1) % slidesDesktop.length);
    }, 5000);

    return () => {
      clearInterval(intervalMobile);
      clearInterval(intervalDesktop);
    };
  }, []);

  return (
    <>
      {/* ===================== DESKTOP VIEW ===================== */}
      <div className="hidden md:block w-full h-50 relative overflow-hidden rounded-xl mb-3">
        {slidesDesktop.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentIndexDesktop ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {slide.type === "image" ? (
              <img src={slide.src} alt="slide" className="w-full h-full object-contain" />
            ) : (
              <video src={slide.src} className="w-full h-full object-contain p-1" autoPlay muted loop />
            )}
          </div>
        ))}
      </div>

      {/* ===================== MOBILE VIEW ===================== */}
      <div className="md:hidden w-full h-36 relative overflow-hidden rounded-xl mt-5">
        {slidesMobile.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentIndexMobile ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {slide.type === "image" ? (
              <img src={slide.src} alt="slide" className="w-full h-full object-cover object-center" />
            ) : (
              <video src={slide.src} className="w-full h-full object-cover object-center" autoPlay muted loop />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Adsvideo;
