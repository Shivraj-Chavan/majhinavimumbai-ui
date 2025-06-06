"use client";

import React, { useRef, useState, useEffect } from "react";
import { IoIosContact } from "react-icons/io";
import Image from "next/image";
import ContactPopup from "./contactPopup";
import Button from "../form/Button";
import CategoryDropdown from "./categoryDropdown";
import { CiLocationArrow1 } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";

export default function HeroSection() {
  const [location, setLocation] = useState("Navi-Mumbai");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [showContact, setShowContact] = useState(false);

  // Simulate loading state 
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="relative w-full h-[600px] md:h-[550px] max-w-8xl mx-auto shadow-xl overflow-hidden">
        {/* Skeleton Background */}
        <div className="absolute inset-0 bg-gray-300 animate-pulse" />

        {/* Skeleton Content Overlay */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 md:p-10 bg-white/60 backdrop-blur-md h-full">
          {/* Left Skeleton Text Block */}
          <div className="w-full md:w-1/2 m-4 sm:m-10 md:mt-16 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <div className="h-16 sm:h-20 md:h-24 bg-gray-300 rounded w-48 sm:w-64 md:w-80"></div>
            <div className="h-16 sm:h-20 md:h-24 bg-gray-300 rounded w-48 sm:w-64 md:w-80"></div>
            <div className="h-6 bg-gray-300 rounded w-40 sm:w-52 md:w-64 mt-2 md:ms-60 sm:ms-10"></div>

            <div className="flex flex-col md:flex-row items-center gap-4 mt-6 w-full">
              <div className="h-12 w-48 bg-gray-300 rounded-full animate-pulse"></div>

              <div className="w-full mt-10 md:hidden flex items-center gap-2 px-4">
                <div className="p-3 rounded-xl bg-gray-300 flex items-center justify-center"></div>
                <div className="flex-1 h-12 bg-gray-300 rounded-2xl"></div>
              </div>
            </div>
          </div>

          {/* Right Skeleton Box */}
          <div className="hidden md:flex w-full md:w-1/2 justify-center items-center mt-10 md:mt-0">
            <div className="w-full max-w-lg h-40 bg-gray-300 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Normal render when not loading
  return (
    <div className="relative w-full h-[600px] md:h-[550px] overflow-hidden shadow-xl max-w-8xl mx-auto ">
      {/* Background Image */}
      <Image
        src="/palika.jpg"
        alt="Mahanagarpalika"
        fill
        className="object-cover opacity-90 z-0"
        priority
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 md:p-10 bg-white/60 backdrop-blur-md h-full ">
        {/* Left Section */}
        <div className="w-full md:w-1/2 m-4 sm:m-10 md:mt-16 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="space-y-3 font-bold italic">
            <span className="text-orange-500 text-5xl sm:text-6xl md:text-7xl font-mukta block">
              माझी
            </span>
            <span className="text-blue-800 text-5xl sm:text-6xl md:text-7xl font-montserrat block">
              Navi Mumbai{" "}
            </span>
            <span className="text-blue-800 text-base sm:text-lg font-medium block mt-2 md:ms-60 sm:ms-10">
              Local Search, Made Simple!
            </span>
          </h1>

          {/* Contact Us */}
          <div className="flex flex-col md:flex-row items-center gap-4 mt-6 w-full">
            <Button
              onClick={() => setShowContact(true)}
              className="relative overflow-hidden bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-green-700 opacity-0 group-hover:opacity-10 transition duration-300 rounded-full"></div>
              <div className="flex items-center gap-2 relative z-10">
                <IoIosContact className="text-xl sm:text-2xl" />
                <span className="text-base sm:text-lg font-semibold">
                  Contact Us
                </span>
                <span className="text-lg sm:text-xl font-bold transform group-hover:translate-x-1 transition duration-200">
                  →
                </span>
              </div>
            </Button>

            {/* Location  */}
            <div
              className="w-full mt-10 md:hidden flex items-center gap-2 px-4"
              ref={dropdownRef}
            >
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-3 rounded-xl bg-white shadow-md border border-gray-300 flex items-center justify-center focus:ring-2 focus:ring-blue-400"
              >
                <CiLocationArrow1 className="text-gray-600 text-xl" />
              </button>

              {/* Search Input with Button Inside */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-white shadow-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-full shadow ">
                  <FiSearch className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Dropdown  */}
        <div className="hidden md:flex w-full md:w-1/2 justify-center items-center mt-10 md:mt-0">
          <div className="w-full max-w-lg">
            <CategoryDropdown />
          </div>
        </div>
      </div>

      {/* Contact Popup */}
      <ContactPopup showContact={showContact} setShowContact={setShowContact} />
    </div>
  );
}
