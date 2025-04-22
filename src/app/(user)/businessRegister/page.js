"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import subcategoriesData from "@/dummy/subcategories";
import Input from "../components/businessRegistercomp/Input";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiPost } from "@/lib/apiClient";
import Validations from "../components/businessRegistercomp/Validations";
import { FcCollaboration } from "react-icons/fc";

export default function BusinessRegister() {
  const categoryRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [checkingOtp, setCheckingOtp] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isVerified = localStorage.getItem("otpVerified");
      if (isVerified !== "true") {
        router.push("/Pop-Up");
      } else {
        setCheckingOtp(false);
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    businessName: "",
    pincode: "",
    block: "",
    street: "",
    landmark: "",
    area: "",
    contactPerson: "",
    mobile: "",
    whatsapp: "",
    email: "",
    website: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationResult = Validations({
      ...formData,
      selectedCategory,
      selectedSubcategory,
    });

    if (validationResult !== true) {
      toast.error(validationResult);
      return;
    }

    const finalData = {
      ...formData,
      category: selectedCategory,
      subcategory: selectedSubcategory,
    };

    console.log("Submitted Data:", finalData);

    try {
      const data = await apiPost("/register-business", finalData);
      toast.success("Business Registered Successfully!");

      setFormData({
        businessName: "",
        pincode: "",
        block: "",
        street: "",
        landmark: "",
        area: "",
        contactPerson: "",
        mobile: "",
        whatsapp: "",
        email: "",
        website: "",
      });
      setSelectedCategory("");
      setSelectedSubcategory("");
      setFilteredSubcategories([]);
      setShowWarning(false);
    } catch (error) {
      toast.error("Error submitting form.");
    }
  };

  const handleInputChange = (label, value) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

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
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl mx-auto px-6 py-8 md:py-10 bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow mt-10"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-center flex items-center justify-center gap-2 font-extrabold text-3xl md:text-4xl text-blue-700 mb-10 tracking-tight font-raleway">
        <FcCollaboration className="text-3xl md:text-4xl" />
        Register Your Bussiness
      </h1>

      {/* Form Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-6">
          <Input label="Business Name" value={formData.businessName} onChange={(value) => handleInputChange("businessName", value)} />
        </div>
        <div className="md:col-span-6">
          <Input label="Pincode" value={formData.pincode} onChange={(value) => handleInputChange("pincode", value)} />
        </div>
        <div className="md:col-span-4">
          <Input label="Block Name" value={formData.block} onChange={(value) => handleInputChange("block", value)} />
        </div>
        <div className="md:col-span-4">
          <Input label="Street Name" value={formData.street} onChange={(value) => handleInputChange("street", value)} />
        </div>
        <div className="md:col-span-4">
          <Input label="Landmark" value={formData.landmark} onChange={(value) => handleInputChange("landmark", value)} />
        </div>

        <div className="md:col-span-6">
          <label className="font-semibold text-gray-700">Area</label>
          <select
            onChange={(e) => handleInputChange("area", e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Select Area</option>
            <option>Nerul</option>
            <option>Vashi</option>
            <option>Belapur</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="block text-gray-700 mb-1">Category</label>
          <select
            ref={categoryRef}
            value={selectedCategory}
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
            value={selectedSubcategory}
            onFocus={handleSubcategoryFocus}
            onChange={handleSubcategoryChange}
            disabled={!filteredSubcategories.length}
            className={`w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 ${showWarning ? "border-red-500 ring-red-400" : "border-gray-300 ring-orange-400"}`}
          >
            <option value="" disabled>{filteredSubcategories.length ? "Select Subcategory" : "Choose a category first"}</option>
            {filteredSubcategories.map((sub, i) => (
              <option key={i} value={sub.slug}>{sub.name}</option>
            ))}
          </select>
          {showWarning && <p className="text-red-500 text-sm mt-1">Please select a category first.</p>}
        </div>

        <div className="md:col-span-6">
          <Input label="Contact Person Name" value={formData.contactPerson} onChange={(value) => handleInputChange("contactPerson", value)} />
        </div>
        <div className="md:col-span-6">
          <Input label="Mobile Number" value={formData.mobile} onChange={(value) => handleInputChange("mobile", value)} />
        </div>
        <div className="md:col-span-6">
          <Input label="WhatsApp Number" value={formData.whatsapp} onChange={(value) => handleInputChange("whatsapp", value)} />
        </div>
        <div className="md:col-span-6">
          <Input label="Email" value={formData.email} onChange={(value) => handleInputChange("email", value)} />
        </div>
        <div className="md:col-span-12">
          <Input label="Website" value={formData.website} onChange={(value) => handleInputChange("website", value)} />
        </div>
      </div>

      <button className="w-full mt-10 px-4 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white font-bold text-lg py-3 rounded-xl shadow-md hover:scale-102 transition-transform">
      Submit Registration
      </button>

    </form>
  );
}
