"use client";

import React, { useRef, useState, useEffect } from "react";
import { IoIosContact } from "react-icons/io";
import Image from "next/image";
import ContactPopup from "./contactPopup";
import Button from "../form/Button";
import CategoryDropdown from "./categoryDropdown";
import { CiLocationArrow1 } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { FcInternal } from "react-icons/fc";
import LocationDropdown from "./locationDropdown";
import SearchBar from "./searchBar";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";

export default function HeroSection() {
  const [location, setLocation] = useState("Navi-Mumbai");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading state 
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); 
    return () => clearTimeout(timer);
  }, []);

  const handleScrollDown = () => {
    window.scrollBy({ top: 150, behavior: "smooth" });  
  };

  if (loading) {
    return (
      <div className="relative w-full h-[450px] md:h-[550px] max-w-8xl mx-auto shadow-xl overflow-hidden">
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
    <div className="relative w-full h-[450px] sm:h-[400px] md:h-[600px] overflow-hidden shadow-xl max-w-8xl mx-auto">
  <div className="absolute inset-0 z-0">
    <Image
      src="/nmmc.png"
      alt="I Love Majhi Navi Mumbai"
      fill
      className="object-contain object-center w-full h-full blur-sm brightness-95 transition-all duration-500"
      priority
    />
  </div>
 
  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 py-8 bg-white/10 backdrop-blur-md h-full">

        {/* Left Section */}
        <div className="w-full md:w-1/2 m-4 sm:m-6 md:mt-16 flex flex-col items-center md:items-start text-center md:text-left">
        
        {/* {loading ? (
          <div className="hidden sm:flex items-center gap-2 mb-3 border border-gray-100 shadow rounded-lg bg-white max-w-xl mx-auto p-2"> */}
            {/* Location skeleton */}
            {/* <div className="w-40 h-10 bg-gray-200 rounded animate-pulse"></div> */}

            {/* Search bar skeleton */}
            {/* <div className="flex-1">
              <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 ms-7 mb-22 border border-gray-100 shadow rounded-lg bg-white max-w-xl mx-auto">
            <div className="flex items-center gap-2 border-r border-gray-300">
              <LocationDropdown
                location={location}
                setLocation={setLocation}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                dropdownRef={dropdownRef}
                className="focus:outline-none"
              />
            </div>

            <div className="flex-1">
              <SearchBar
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-3 py-2 focus:outline-none"
                placeholder="Search for services..."
              />
            </div>
          </div>
        )} */}

        <h1 className="font-bold italic leading-tight">
          <span className="text-orange-500 text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-mukta block">
            माझी
          </span>
          <span className="text-blue-800 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-montserrat block">
            Navi Mumbai
          </span>
          <span className="text-blue-800 text-sm sm:text-base md:text-lg lg:text-xl font-medium block mt-2 text-center md:text-left">
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
                <span className="text-base sm:text-lg font-semibold cursor-pointer">
                  Contact Us
                </span>
                <span className="text-lg sm:text-xl font-bold transform group-hover:translate-x-1 transition duration-200">
                  →
                </span>
              </div>
            </Button>

            {/* Location  */}
            <div
              className="w-full mt-6 md:hidden flex items-center gap-2 px-2 sm:px-4"
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
        <div className="hidden md:flex w-full md:w-1/2 justify-center items-center mt-10 md:mt-0 px-4 md:px-10">
          <div className="w-full max-w-md lg:max-w-lg">
            <CategoryDropdown />
          </div>
        </div>

        {/* Bouncing arrow */}
        <div onClick={handleScrollDown} className="flex flex-col items-center fixed bottom-4 right-4 z-50 animate-bounce md:hidden">
          <span className="text-xs sm:text-sm mb-1 text-gray-600">Scroll Down</span>
          <div className="text-xl sm:text-2xl text-gray-700 p-2 bg-gray-500/10 rounded-full">
            <MdOutlineKeyboardDoubleArrowDown />
          </div>
        </div>
      </div>

      {/* Contact Popup */}
      <ContactPopup showContact={showContact} setShowContact={setShowContact} />
    </div>
  );
}
