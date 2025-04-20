"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import subcategoriesData from '@/dummy/subcategories';
import Input from '../components/businessRegistercomp/Input';
import { useRouter } from 'next/navigation';

export default function BusinessRegister() {
    
  // Category state & logic
  const categoryRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [checkingOtp, setCheckingOtp] = useState(true);
  const router = useRouter();
  
  //  OTP Verification for opening BusinessRegister page
  useEffect(() => {
    const isVerified = localStorage.getItem("otpVerified");
    if (isVerified !== "true") {
      router.push("/Pop-Up");
    } else {
      setCheckingOtp(false); 
    }
  }, []);

  if (checkingOtp) return null;

  const handleCategoryChange = (e) => {
    const slug = e.target.value;
    setSelectedCategory(slug);
    setSelectedSubcategory("");
    setShowWarning(false);

    const matchedCategory = subcategoriesData.find((cat) => cat.slug === slug);
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

  return (
    <form className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-2xl shadow-lg mt-6">
      <h1 className="text-center font-bold text-2xl sm:text-3xl text-blue-600 mb-6 font-raleway">
        BUSINESS REGISTER
      </h1>

      {/* Business Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Input label="Business Name" />
        <Input label="Pincode" />
        <Input label="Block Name" />
        <Input label="Street Name" />
        <Input label="LandMark" />

        {/* Area Dropdown */}
        <div>
          <label className="font-semibold text-gray-700">Area</label>
          <select className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select Area</option>
            <option>Nerul</option>
            <option>Vashi</option>
            <option>Belapur</option>
          </select>
        </div>

        {/* Category */}
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">Category</label>
          <select
            ref={categoryRef}
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="" disabled>Select Category</option>
            {subcategoriesData.map((cat) => (
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

      {/* Contact Info */}
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mt-10 mb-4">
        Contact Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Input label="Contact Person Name" />
        <Input label="Mobile Number" />
        <Input label="WhatsApp Number" />
        <Input label="Email" />
        <Input label="Website" />
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
    
      </div> */}
      
      {/* Submit Button */}
      <button className="w-full mt-6 sm:mt-8 bg-blue-600 text-white font-semibold py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition">
        Submit
      </button>
    </form>

  );
}
