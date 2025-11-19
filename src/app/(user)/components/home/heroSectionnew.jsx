"use client";

import React, { useRef, useState, useEffect } from "react";
import { IoIosContact } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { CiLocationArrow1 } from "react-icons/ci";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaConciergeBell, FaGraduationCap, FaHospitalSymbol, FaPizzaSlice, FaSchool, FaShoppingBag, FaStar, FaUtensils } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import ContactPopup from "./contactPopup";
import Button from "../form/Button";
import { apiGet } from "@/lib/apiClient";
import CategoryDropdown from "./categoryDropdown";
import AdsImg from "./adsImg";
import CategoryDropdownnew from "./categoryDropdownnew";
import AdsImg3 from "./adsImg3";
import Link from "next/link";
import { GiComb } from "react-icons/gi";

export default function HeroSectionnew() {
  const [location, setLocation] = useState("Navi-Mumbai");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const [animateLeft, setAnimateLeft] = useState(false);
  const [animateRight, setAnimateRight] = useState(false);
  
  useEffect(() => {
    // Trigger animation after short delay
    const timer = setTimeout(() => {
      setAnimateLeft(true);
      setAnimateRight(true);
    }, 100);
  
    return () => clearTimeout(timer);
  }, []);
  


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
      <div className="w-full bg-gradient-to-b from-orange-50 via-white to-white py-0.5 px-4 sm:px-10 md:px-16 lg:px-24 xl:px-32">
      {/* searchbar */}
      <div className="order-1 md:hidden w-full mt-[-20]">
        <CategoryDropdownnew />
      </div>

        {/* Advertisement */}
            <div className="order-2 md:order-none w-full">
            <div className="w-full h-48 sm:h-68 md:h-auto ">
              <AdsImg className="w-full h-full object-cover rounded-xl " />
            </div>
          </div>


        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          {/* Left Section */}
          <div className={`w-full md:w-1/2 space-y-6 text-center md:text-left transform transition-all duration-1000 ease-out 
           ${animateLeft ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            {/* Top label */}
           <div className="hidden md:block">
            <div>
                <span className="inline-block 
                bg-orange-500 text-white text-xs rounded-full px-3 py-2 font-semibold mb-3">
                Your Local Business Directory
                </span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-5xl font-extrabold font-mukta text-orange-600">
                माझी <span className="text-blue-600">Navi</span>{" "}
                <span className="text-green-600">Mumbai</span>
            </h1>

            {/* Description */}
            <p className="mt-3 text-gray-700 text-md max-w-xl mx-auto md:mx-0">
                Discover the best businesses, services, and experiences in Navi Mumbai.{" "}
                <span className="text-orange-500 font-semibold">
                Your one-stop destination <span className="text-green-600">for local discoveries.</span>
                </span>
            </p>
            </div>

            {/* stats */}
            <div className="order-3 md:order-none">
          <div className="flex justify-center md:justify-start gap-4 flex-wrap md:flex-nowrap pt-9">
            {/* Reviews */}
            <div className="bg-white shadow-lg rounded-2xl cursor-pointer px-3 py-4 text-center flex flex-col items-start w-24 sm:w-32 md:w-35">
              <div className="flex items-center gap-1 sm:gap-2">
                <FaStar className="text-yellow-400 text-xl sm:text-2xl" />
                <div className="text-sm sm:text-lg font-extrabold text-gray-800">5k+</div>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 ml-4">Reviews</div>
            </div>

            {/* Businesses */}
            <div className="bg-white shadow-lg rounded-2xl cursor-pointer px-3 py-4 text-center flex flex-col items-start w-24 sm:w-32 md:w-35">
              <div className="flex items-center gap-1 sm:gap-2">
                <FaBuilding className="text-blue-400 text-xl sm:text-2xl"/>
                <div className="text-sm sm:text-lg font-extrabold text-gray-800">60K+</div>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 ml-4">Businesses</div>
            </div>

            {/* Users */}
            <div className="bg-white shadow-lg rounded-2xl cursor-pointer px-3 py-4 text-center flex flex-col items-start w-24 sm:w-32 md:w-35">
              <div className="flex items-center gap-1 sm:gap-2">
                <FaHeart className="text-pink-500 text-xl sm:text-2xl" />
                <div className="text-sm sm:text-lg font-extrabold text-gray-800">25k+</div>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1 ml-4">Users</div>
            </div>
          </div>
          </div>


            {/* Contact Button */}
            <div className="pt-4 flex justify-center md:justify-start">
            <Button
                onClick={() => setShowContact(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full cursor-pointer px-2 py-1 shadow-lg flex items-center gap-2 text-lg transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-105 active:translate-y-0"
            >
                <IoIosContact className="text-xl" />
                Contact Us
            </Button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3 pt-4 justify-center md:justify-start mb-7">
            {[                                              
                {
                label: "Restaurants",
                icon: <FaUtensils className="text-orange-600" />,
                bg: "bg-orange-50 text-orange-700",
                },
                {
                label: "Clothing",
                icon: <FaShoppingBag className="text-green-600" />,
                bg: "bg-green-50 text-green-700",
                },
                {
                label: "Electronics",
                icon: <FaConciergeBell className="text-blue-600" />,
                bg: "bg-blue-50 text-blue-700",
                },
                {
                label: "Retail",
                icon: <FaGraduationCap className="text-purple-600" />,
                bg: "bg-purple-50 text-purple-700",
                },
                            {
                              label: "Cafes",
                              bg: "bg-orange-100 text-orange-600 md:hidden",
                              icon: <FaPizzaSlice className="mr-1 text-sm text-orange-600" />,
                            },
                            {
                              label: "Bike Garage",
                              bg: "bg-green-100 text-green-600 md:hidden",
                              icon: <GiComb className="mr-1 text-base" />,
                            },
                            {
                              label: "Uniform",
                              bg: "bg-blue-100 text-blue-600 md:hidden",
                              icon: <FaHospitalSymbol className="mr-1 text-base" />,
                            },
                            {
                              label: "Doctors",
                              bg: "bg-purple-100 text-purple-600 md:hidden",
                              icon: <FaSchool className="mr-1 text-base" />,
                            },
                ].map((category) => (
                  <Link
                  key={category?.label}
                  href={`/search?query=${category?.label}`}
                  className={`${category.bg} flex items-center gap-2 text-sm px-4 py-2 rounded-full shadow-sm cursor-pointer hover:shadow-md transition`}
                  >
                  {category?.icon}
                  {category?.label}
                  </Link>
            ))}
            </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
            

        {/* Right Section - CategoryDropdown */}
        <div className="hidden md:block">
        <div className={`w-full transform transition-all duration-1000 ease-out 
        ${animateRight ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
        <CategoryDropdownnew />
        </div>
        </div>

        </div>

        </div>

        {/* Scroll Hint for Mobile */}
        {/* <div onClick={handleScrollDown} className="flex flex-col items-center mt-1 md:hidden animate-bounce">
          <span className="text-sm text-gray-600">Scroll Down</span>
          <div className="text-xl text-gray-700 p-2 bg-gray-200 rounded-full">
            <MdOutlineKeyboardDoubleArrowDown />
          </div>
        </div> */}
      </div>

      {/* Contact Popup */}
      <ContactPopup showContact={showContact} setShowContact={setShowContact} />

      {/* Ads */}
      {/* <AdsImg /> */}
    </>
  );
}
