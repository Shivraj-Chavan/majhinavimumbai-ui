"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiPost } from "@/lib/apiClient";
import Input from "../components/businessRegistercomp/Input";
import Validations from "../components/businessRegistercomp/Validations";
import { FcCollaboration } from "react-icons/fc";

export default function BusinessRegister() {
  const router = useRouter();
  const [checkingOtp, setCheckingOtp] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [selectedSubcategory, setSelectedSubcategory] = useState("1");

  const [formData, setFormData] = useState({
    owner_id: "3",
    name: "",
    category_id: "1", 
    subcategory_id: "1", 
    pin_code: "",
    address: "",
    landmark: "",
    sector: "",
    area: "",
    phone: "",
    wp_number: "",
    email: "",
    website: "",
    timings: [{ day: "", open: "09:00", close: "18:00" }], 
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isVerified = localStorage.getItem("otpVerified");
      const storedOwnerId = localStorage.getItem("ownerId");

      console.log("OTP Verified:", isVerified); 
      console.log("Owner ID from localStorage:", storedOwnerId); 

      if (isVerified !== "true") {
        router.push("/Pop-Up");
      } else {
        setCheckingOtp(false);
        setFormData((prev) => ({
          ...prev,
          owner_id: storedOwnerId || "3",
        }));
      }
    }
  }, [router]);

  const handleInputChange = (label, value) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  const handleTimingChange = (index, field, value) => {
    const updatedTimings = [...formData.timings];
    updatedTimings[index][field] = value;
    setFormData((prev) => ({ ...prev, timings: updatedTimings }));
  };

  const addTiming = () => {
    setFormData((prev) => ({
      ...prev,
      timings: [...prev.timings, { day: "", open: "09:00", close: "18:00" },],
    }));
  };

  const removeTiming = (index) => {
    const updatedTimings = formData.timings.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, timings: updatedTimings }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Form Data:", formData);

    const validationResult = Validations({
      ...formData,
    });

    if (validationResult !== true) {
      console.warn("Validation Failed:", validationResult);
      toast.error(validationResult);
      return;
    }

    const finalData = {
      ...formData,
      timings: JSON.stringify(formData.timings), // Backend expects JSON string for timings
    };
    console.log("Final Data to be Sent:", finalData); 

    try {
      await apiPost("/businesses", finalData);
      console.log("API Response:", response);
      toast.success("Business Registered Successfully!");

      // Reset form
      setFormData({
        owner_id: "3",
        name: "",
        category_id: "1",
        subcategory_id: "1",
        pin_code: "",
        address: "",
        landmark: "",
        sector: "",
        area: "",
        phone: "",
        wp_number: "",
        email: "",
        website: "",
        timings: [{ day: "", open: "09:00", close: "18:00" }],
      });

      setSelectedCategory("1");
      setSelectedSubcategory("1");
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Error submitting form.");
    }
  };

  if (checkingOtp) return null;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-5xl mx-auto px-6 py-8 md:py-10 bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow mt-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-center flex items-center justify-center gap-2 font-extrabold text-3xl md:text-4xl text-blue-700 mb-10 tracking-tight font-raleway">
        <FcCollaboration className="text-3xl md:text-4xl" />
        Register Your Bussiness
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Owner ID */}
        <div className="md:col-span-6">
          <Input label="Owner ID" value={formData.owner_id} onChange={(value) => handleInputChange("owner_id", value)} />
        </div>

        {/* Business Name */}
        <div className="md:col-span-6">
          <Input label="Business Name" value={formData.name} onChange={(value) => handleInputChange("name", value)}/>
        </div>

        {/* Category */}
        <div className="md:col-span-6">
          <Input label="Category ID" value={selectedCategory} onChange={(value) => setSelectedCategory(value)} />
        </div>

        {/* Subcategory */}
        <div className="md:col-span-6">
          <Input label="Subcategory ID" value={selectedSubcategory} onChange={(value) => setSelectedSubcategory(value)}/>
        </div>

        {/* <div className="md:col-span-3">
          <label className="block text-gray-700 mb-1">Category</label>
          <select
            ref={categoryRef}
             value={selectedCategory || "1"}
            onChange={handleCategoryChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="" disabled>Select Category</option>
            {subcategoriesData.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="block text-gray-700 mb-1">Subcategory</label>
          <select
            value={selectedCategory || "2"}
            onFocus={handleSubcategoryFocus}
            onChange={handleSubcategoryChange}
            disabled={!filteredSubcategories.length}
            className={w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 ${showWarning ? "border-red-500 ring-red-400" : "border-gray-300 ring-orange-400"}}
          >
            <option value="" disabled>{filteredSubcategories.length ? "Select Subcategory" : "Choose a category first"}</option>
            {filteredSubcategories.map((sub, i) => (
              <option key={i} value={sub.slug}>{sub.name}</option>
            ))}
          </select>
          {showWarning && <p className="text-red-500 text-sm mt-1">Please select a category first.</p>} 
        </div> */}

        {/* Pincode */}
        <div className="md:col-span-6">
          <Input label="Pincode" value={formData.pin_code} onChange={(value) => handleInputChange("pin_code", value)}/>
        </div>

        {/* Address */}
        <div className="md:col-span-6">
          <Input label="Address" value={formData.address} onChange={(value) => handleInputChange("address", value)} />
        </div>

        {/* Landmark */}
        <div className="md:col-span-6">
          <Input label="Landmark" value={formData.landmark} onChange={(value) => handleInputChange("landmark", value)}/>
        </div>

        {/* Sector */}
        <div className="md:col-span-6">
          <Input label="Sector" value={formData.sector} onChange={(value) => handleInputChange("sector", value)}/>
        </div>

        {/* Area */}
        <div className="md:col-span-6">
          <Input label="Area" value={formData.area} onChange={(value) => handleInputChange("area", value)}/>
        </div>

        {/* Phone Number */}
        <div className="md:col-span-6">
          <Input label="Phone" value={formData.phone} onChange={(value) => handleInputChange("phone", value)}/>
        </div>

        {/* WhatsApp Number */}
        <div className="md:col-span-6">
          <Input label="WhatsApp Number" value={formData.wp_number} onChange={(value) => handleInputChange("wp_number", value)} />
        </div>

        {/* Email */}
        <div className="md:col-span-6">
          <Input label="Email" value={formData.email} onChange={(value) => handleInputChange("email", value)}/>
        </div>

        {/* Website */}
        <div className="md:col-span-6">
          <Input label="Website" value={formData.website} onChange={(value) => handleInputChange("website", value)}
          />
        </div>

        {/* Business Timings */}
        <div className="md:col-span-12">
          <h3 className="font-semibold text-gray-700 mb-4">Business Timings</h3>
          {formData.timings.map((timing, index) => (
            <div key={index} className="flex gap-4 mb-4">
              {/* Day Input */}
              <div className="w-1/4">
                <Input label="Day" value={timing.day} onChange={(value) => handleTimingChange(index, "day", value) }/>
              </div>

              {/* Open Time Input */}
              <div className="w-1/4">
                <Input label="Open Time" value={timing.open} onChange={(value) => handleTimingChange(index, "open", value) }/>
              </div>

              {/* Close Time Input */}
              <div className="w-1/4">
                <Input label="Close Time" value={timing.close} onChange={(value) => handleTimingChange(index, "close", value) }/>
              </div>

              {/* Remove Button */}
              <div className="w-1/4 flex items-center justify-center">
                <button type="button" className="text-red-500" onClick={() => removeTiming(index)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Add Timing Button */}
          <button type="button" onClick={addTiming} className="text-blue-600 mt-4">
            Add Timing
          </button>
        </div>

      </div>

      <button type="submit" className="w-full mt-10 px-4 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white font-bold text-lg py-3 rounded-xl shadow-md hover:scale-102 transition-transform">
        Submit Registration
      </button>
    </form>
  );
}
