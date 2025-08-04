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
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/apiClient";
import AdsImg from "./adsImg";

export default function HeroSection() {
  const [location, setLocation] = useState("Navi-Mumbai");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);

  // Simulate loading state 
  const router = useRouter();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchInput.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
  
      try {
        const res = await apiGet(`/businesses/search?q=${encodeURIComponent(searchInput)}`);
        const data = res.data || [];
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (err) {
        console.error("Suggestion fetch failed:", err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
  
    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [searchInput]);
  const handleScrollDown = () => {
    window.scrollBy({ top: 150, behavior: "smooth" });  
  };
  const handleSearchSubmit = () => {
    const trimmed = searchInput.trim();
    if (trimmed) {
      router.push(`/search?query=${encodeURIComponent(trimmed)}`);
      setSearchInput("");
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  const handleKeyPressMobile = (e) => {
    if (e.key === "Enter") handleSearchSubmit();
  };
  
  const handleSuggestionClick = (name) => {
    router.push(`/search?query=${encodeURIComponent(name)}`);
    setSearchInput("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <>
    <div className="relative w-full h-[450px] sm:h-[400px] md:h-[600px] overflow-hidden shadow-xl max-w-8xl mx-auto">
  <div className="absolute inset-0 z-0">
    <Image
      src="/logo.png"
      alt="I Love Majhi Navi Mumbai"
      fill
      className="object-contain object-center w-full h-full blur-sm brightness-95 transition-all duration-500"
      priority
    />
  </div>
 
  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 py-8 bg-white/15 backdrop-blur h-full">

        {/* Left Section */}
        <div className="w-full md:w-1/2 m-4 sm:m-6 md:mt-6 flex flex-col items-center md:items-start text-center md:text-left">
        
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
              className="relative  bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 group"
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
                    onKeyDown={handleKeyPressMobile}
                    className="w-full pl-4 pr-12 py-3 rounded-2xl bg-white shadow-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-50 max-h-32 overflow-y-auto">
                      {suggestions.map((item) => (
                        <li
                          key={item.id}
                          onClick={() => handleSuggestionClick(item.name)}
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  )}
              <button
                onClick={handleSearchSubmit}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-full shadow ">
                  <FiSearch className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Dropdown  */}
        <div className="hidden md:flex w-full md:w-1/2 justify-center items-center mt-5 md:mt-0 px-4 md:px-10">
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
    
    {/* ADVERTISEMENT IMG */}
    </div>
    <AdsImg/>
    </>
  );
}
