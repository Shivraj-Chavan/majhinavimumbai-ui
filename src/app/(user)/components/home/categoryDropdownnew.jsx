"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { apiGet } from "@/lib/apiClient";
import { FaPizzaSlice, FaHospitalSymbol, FaSchool } from "react-icons/fa";
import { GiComb } from "react-icons/gi"; 
import { toast } from "react-toastify";
import LocationDropdown from "./locationDropdown";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slice/categoriesSlice";

export default function CategoryDropdownnew() {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [warning, setWarning] = useState("");
  const [location, setLocation] = useState("Navi-Mumbai");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const router = useRouter();
  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);
  const dispatch = useDispatch();
  const wrapperRef = useRef(null);

  const { categories, loading, error } = useSelector((state) => state.categories);

   useEffect(() => {
      if (categories?.length === 0) {
        dispatch(fetchCategories());
      } else {
        console.log(categories);
      }
    }, [dispatch, categories]);
    
  

  // Fetch suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      const trimmed = searchInput.trim();
      if (!trimmed) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const res = await apiGet(`/businesses/search?q=${encodeURIComponent(trimmed)}`);
        const data = res?.data || [];
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300); // debounce input
    return () => clearTimeout(delay);
  }, [searchInput]);

  const handleSearch = () => {
    const trimmed = searchInput.trim();

    if (!trimmed) {
        setWarning("Please enter company name for Search.");
        return;
      }
    
      setWarning("");

    if (trimmed.length > 0) {
      router.push(`/search?query=${encodeURIComponent(trimmed)}`);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSuggestionClick = (name) => {
    router.push(`/search?query=${encodeURIComponent(name)}`);
    setSearchInput("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleCategoryChange = (e) => {
    const slug = e.target.value;
    setSelectedCategory(slug);
    setSelectedSubcategory("");
    setShowWarning(false);

    const matchedCategory = categories.find((cat) => cat.slug === slug);
    setFilteredSubcategories(matchedCategory ? matchedCategory.subcategories : []);
  };

  const handleSubcategoryFocus = () => {
    if (!selectedCategory) {
      categoryRef.current.focus();
      setShowWarning(true);
    }
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
    setShowWarning(false);
  };

  const handlePopularClick = (query) => {
    const encoded = encodeURIComponent(query);
    // Redirect to your site’s search endpoint
    window.location.href = `https://majhinavimumbai.com/search?query=${encoded}`;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 mt-6 space-y-5 relative">
      {/* Title */}
      <div className="text-center">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-700 via-blue-400 to-green-600 bg-clip-text text-transparent">
        Find What You Need
      </h2>

        <p className="text-sm text-gray-500">Search from thousands of local businesses</p>
      </div>

      {/* Search Input */}
      <div ref={wrapperRef} className="relative">
        <input
          type="text"
          placeholder="What are you looking for ?"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 rounded-xl cursor-pointer border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
        />
        {/* <button
          onClick={handleSearch}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-blue-600"
        >
          <FiSearch size={20} />
        </button> */}

        {warning && (
        <p className="text-red-500 text-xs mt-1">
            {warning}
        </p>
        )}


         {/* Location + Category + Subcategory */}
         <div className="space-y-4 relative">
      {/* Location Label */}
      <label className="block text-sm font-medium text-gray-600 mb-2 mt-3 ms-2">
        Select Your Location
      </label>

      {/* Dropdown Wrapper */}
      <div
        className="relative w-full focus-within:ring-2 focus-within:ring-blue-400"
        ref={dropdownRef}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="w-full border border-gray-300 px-4 py-2 rounded-xl text-sm cursor-pointer flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-400">
          <span className={location ? "text-gray-800" : "text-gray-400"}>
            {location || "Choose location"}
          </span>
          <svg
            className={`w-4 h-4 transform transition-transform ${
              showDropdown ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

    {/* Dropdown List */}
    {showDropdown && (
      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
        {["Vashi", "Nerul", "Belapur", "Kharghar", "Panvel", "Koparkhairne", "Ghansoli", "Sanpada", "Belapur (CBD Belapur)", "Seawooods", "Juinagar", "Turbhe", "Airoli","Rabale", "Kamothe", "Ulwe", "Dronagiri", "Taloja","Kalamboli"].map((item) => (
          <div
            key={item}
            onClick={() => {
              setLocation(item);
              setShowDropdown(false);
            }}
            className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
          >
            {item}
          </div>
        ))}
      </div>
    )}
  </div>
{/* </div> */}

        {/* Category */}
        {/* <div>
          <select
            ref={categoryRef}
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div> */}

        {/* Subcategory */}
        {/* <div>
          <select
            value={selectedSubcategory}
            onFocus={handleSubcategoryFocus}
            onChange={handleSubcategoryChange}
            disabled={!filteredSubcategories.length}
            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 text-sm ${
              showWarning
                ? "border-red-500 ring-red-400"
                : "border-gray-300 ring-blue-400"
            }`}
          >
            <option value="" disabled>
              {filteredSubcategories.length ? "Select Subcategory" : "Choose a category first"}
            </option>
            {filteredSubcategories.map((sub) => (
              <option key={sub.slug} value={sub.slug}>
                {sub.name}
              </option>
            ))}
          </select>

          {showWarning && (
            <p className="text-red-500 text-sm mt-1">
              Please select a category first.
            </p>
          )}
        </div> */}
      </div>


        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 bg-white border border-gray-200 rounded-xl mt-[-72] w-full shadow max-h-60 overflow-y-auto">
            {suggestions.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSuggestionClick(item.name)}
                className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search Button */}
      <button
        type="button"
        onClick={handleSearch}
        className="w-full bg-blue-600 text-white cursor-pointer font-semibold py-2 rounded-xl hover:bg-blue-700 text-sm transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-100 active:translate-y-0"
      >
        🔍 Search Now
      </button>

       {/* Popular Searches */}
       <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">Popular searches:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            {
              label: "Pizza",
              color: "bg-orange-100 text-orange-600",
              icon: <FaPizzaSlice className="mr-1 text-sm" />,
            },
            {
              label: "Salon",
              color: "bg-green-100 text-green-600",
              icon: <GiComb className="mr-1 text-base" />,
            },
            {
              label: "Hospital",
              color: "bg-blue-100 text-blue-600",
              icon: <FaHospitalSymbol className="mr-1 text-base" />,
            },
            {
              label: "School",
              color: "bg-purple-100 text-purple-600",
              icon: <FaSchool className="mr-1 text-base" />,
            },
          ].map((item) => (
            <span
              key={item.label}
              onClick={() => handlePopularClick(item.label)}
              className={`${item.color} flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:shadow-md transition`}
            >
              {item.icon}
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
