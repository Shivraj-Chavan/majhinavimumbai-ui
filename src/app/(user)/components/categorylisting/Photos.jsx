"use client";
import React, { useState } from "react";
import Image from "next/image";
import CONFIG from "@/constance";
import { MdArrowBackIos } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

export default function Photos({ business }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = business?.images || [];

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Grid of images */}
      <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 z-0 relative">
        {images.map((img, index) => {
          const imageUrl = typeof img === "string" ? img : img?.url;
          return (
            <div
              key={index}
              onClick={() => openModal(index)}
              className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
            >
              <Image
                src={`${CONFIG.IMAGE_BASE_URL}${imageUrl}`}
                alt={`Business Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isOpen && (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/15 bg-opacity-80 z-50 flex items-center justify-center">
      
        <div className="relative w-[90vw] h-[80vh] max-w-4xl rounded-xl overflow-hidden ">
        <button
        onClick={closeModal}
        className="absolute top-4 right-6 text-black font-bold text-3xl z-50"
      >
        <RxCross2 />
      </button>

        <Image
          src={`${CONFIG.IMAGE_BASE_URL}${
            typeof images[currentIndex] === "string"
              ? images[currentIndex]
              : images[currentIndex]?.url
          }`}
          alt={`Business Image ${currentIndex + 1}`}
          fill
          className="object-contain"
        />

        {/* LEFT ARROW */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-black text-4xl p-2 bg-opacity-40 rounded-full hover:bg-opacity-70 z-20"
        >
          <IoIosArrowBack />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black text-4xl p-2 bg-opacity-40 rounded-full hover:bg-opacity-70 z-20"
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  )}
    </>
  );
}
