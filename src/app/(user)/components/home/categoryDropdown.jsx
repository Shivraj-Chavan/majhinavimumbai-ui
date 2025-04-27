"use client";

import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import LocationDropdown from "./locationDropdown";
import SearchBar from "./searchBar";
import { FcSearch } from "react-icons/fc";
import Button from "../form/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slice/categoriesSlice";

export default function CategoryDropdown() {
  const [location, setLocation] = useState("Navi-Mumbai");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const router = useRouter();
  const categoryRef = useRef(null);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();

  const { categories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    if (categories?.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  if (loading) {
    return <div className="text-center py-10 font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500 font-semibold">{error}</div>;
  }

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

  const handleSearch = () => {
    if (selectedCategory && selectedSubcategory) {
      const url = `/listing?category=${selectedCategory}&subcategory=${selectedSubcategory}`;
      console.log('Navigating to:', url); 
      router.push(url); 
    }
  };
  
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md mx-auto mt-10 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-800">
        <FcSearch className="text-2xl" />
        <h2>Find Services</h2>
      </div>

      {/* Location */}
      <div className="flex flex-col sm:flex-row gap-0 border border-gray-100 shadow rounded-lg">
        <div className="flex-1">
          <LocationDropdown
            location={location}
            setLocation={setLocation}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            dropdownRef={dropdownRef}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Search */}
        <div className="flex-2">
          <SearchBar
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Category */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">Category</label>
          <select
            ref={categoryRef}
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="" disabled>Select Category</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">Subcategory</label>
          <select
            value={selectedSubcategory}
            onFocus={handleSubcategoryFocus}
            onChange={handleSubcategoryChange}
            disabled={!filteredSubcategories.length}
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
              showWarning ? "border-red-500 ring-red-400" : "border-gray-300 ring-orange-400"
            }`}
          >
            <option value="" disabled>
              {filteredSubcategories.length ? "Select Subcategory" : "Choose a category first"}
            </option>
            {filteredSubcategories.map((sub, i) => (
              <option key={i} value={sub.slug}>
                {sub.name}
              </option>
            ))}
          </select>
          {showWarning && (
            <p className="text-red-500 text-sm mt-1">Please select a category first.</p>
          )}
        </div>
      </div>

      {/* Search Button */}
      <Button onClick={handleSearch} disabled={!selectedCategory || !selectedSubcategory} className="w-full bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-80 disabled:cursor-not-allowed">
        Search
      </Button>
    </div>
  );
}
