"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiPost } from "@/lib/apiClient";
import Input from "../components/businessRegistercomp/Input";
import Validations from "../components/businessRegistercomp/Validations";
import { FcCollaboration } from "react-icons/fc";
import SuccessModal from "../components/businessRegistercomp/SuccessModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/redux/slice/categoriesSlice";

export default function BusinessRegister({ ownerId }) {
  const router = useRouter();
  const [checkingOtp, setCheckingOtp] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const categoryRef = useRef(null);
  const [subcategoriesData, setSubcategoriesData] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [formData, setFormData] = useState({
    owner_id: null,
    name: "",
    category_id: "",
    subcategory_id: "",
    pin_code: "",
    address: "",
    landmark: "",
    sector: "",
    area: "",
    phone: "",
    wp_number: "",
    email: "",
    website: "",
    timing:[{ day: "", open: "09:00", close: "18:00" }],
  });
  const dispatch = useDispatch();
  
    const { categories, loading, error } = useSelector((state) => state.categories);
  
    useEffect(() => {
      if (categories?.length > 0) {
        setSubcategoriesData(categories);
        //  dispatch(fetchCategories());
      }
    }, [categories]);
 

    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedOwnerId = localStorage.getItem("ownerId");
        console.log("ownerId from localStorage:", storedOwnerId);
        
        setCheckingOtp(false);
        // setFormData((prev) => ({
        //   ...prev,
        //   owner_id: storedOwnerId,
        // }));
      }
    }, [router]);
    
  useEffect(()=>{
    console.log({"Timing-----":formData.timing})
  },[formData.timing])

  useEffect(() => {
    console.log("Received ownerId:", ownerId);
    if (ownerId) {
      setFormData((prev) => ({ ...prev, owner_id: Number(ownerId),}));
    }
  }, [ownerId]);

    if (loading) {
      return <div className="text-center py-10 font-semibold">Loading...</div>;
    }
    
    if (error) {
      return <div className="text-center py-10 text-red-500 font-semibold">{error}</div>;
    }

    const handleTimingChange = (index, field, value, day) => {
      setFormData((prev) => {
        const updatedTimings = [...(prev.timing || [])];
        const existingIndex = updatedTimings.findIndex((t) => t.day === day);
    
        if (existingIndex >= 0) {
          updatedTimings[existingIndex] = {
            ...updatedTimings[existingIndex],
            [field]: value,
          };
    
          // If "closed" is checked, reset times
          if (field === "closed" && value === true) {
            updatedTimings[existingIndex].open = "";
            updatedTimings[existingIndex].close = "";
          }
        } else {
          const newEntry = { day, open: "", close: "", closed: false };
          newEntry[field] = value;
          if (field === "closed" && value === true) {
            newEntry.open = "";
            newEntry.close = "";
          }
          updatedTimings.push(newEntry);
        }
    
        return { ...prev, timing: updatedTimings };
      });
    };

    const clearTiming = (day) => {
      setFormData((prev) => {
        const updatedTimings = (prev.timing || []).map((t) =>
          t.day === day ? { ...t, open: "", close: "", closed: false } : t
        );
        return { ...prev, timing: updatedTimings };
      });
    };
    
  
  const handleInputChange = (label,value) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  ];
  
  // const handleTimingChange = (index, field, value) => {
  //   const updatedTimings = [...formData.timing];
  //   updatedTimings[index][field] = value;
  //   setFormData({ ...formData, timing: updatedTimings });
  // };
  
  // const addTiming = () => {
  //   setFormData((prev) => ({ ...prev,
  //     timing: [...prev.timing, { day: "", open: "09:00", close: "18:00" }],
  //   }));
  // };

  // const removeTiming = (index) => {
  //   const updatedTimings = formData.timing.filter((_, i) => i !== index);
  //   setFormData((prev) => ({ ...prev, timing: updatedTimings }));
  // };

  const handleCategoryChange = (e) => {
    const selectedSlug = e.target.value;
    setSelectedCategory(selectedSlug);
    setSelectedSubcategory(""); 
    console.log({selectedSlug})
    const category = subcategoriesData.find((cat) => cat.id == selectedSlug);
    console.log({category})
    setFilteredSubcategories(category ? category.subcategories : []);
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  const handleSubcategoryFocus = () => {
    if (!selectedCategory) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setSuccessModalOpen(true);

    const validationResult = Validations({ ...formData });
    if (validationResult !== true) {
      toast.error(validationResult);
      return;
    }

    const finalData = {
      ...formData,
      category_id: selectedCategory,
    subcategory_id: selectedSubcategory,
    };
    console.log("Data submitting to server:", finalData.timing);

    try {
      await apiPost("/businesses", finalData);
      console.log('bussiness',finalData);
      
      toast.success("Bussiness Registered Successfully!");
      setSuccessModalOpen(true);

      setFormData({
        owner_id: "",
        name: "",
        category_id: "",
        subcategory_id: "",
        pin_code: "",
        address: "",
        landmark: "",
        sector: "",
        area: "",
        phone: "",
        wp_number: "",
        email: "",
        website: "",
        timing: [{ day: "", open: "09:00", close: "18:00" }],
      });
      console.log("Submitting formData:", formData);

      setSelectedCategory("");
      setSelectedSubcategory("");
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Error submitting form.");
    }
  };

  if (checkingOtp) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl mx-auto px-6 py-8 md:py-10 bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow mt-10"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-center flex items-center justify-center gap-2 font-extrabold text-3xl md:text-4xl text-blue-700 mb-10 tracking-tight font-raleway">
        <FcCollaboration className="text-3xl md:text-4xl" />
        Register Your Business
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Business Name */}
        <div className="md:col-span-6">
          <Input label="Business Name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
        </div>

        {/* Category */}
        <div className="md:col-span-6">
          <label className="block text-gray-700 mb-1">Category</label>
          <select
            ref={categoryRef}
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="" disabled>Select Category</option>
            {subcategoriesData?.map((cat) => (
              <option key={cat.slug} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div className="md:col-span-6">
          <label className="block text-gray-700 mb-1">Subcategory</label>
          <select
            value={selectedSubcategory}
            onFocus={handleSubcategoryFocus}
            onChange={handleSubcategoryChange}
            disabled={!filteredSubcategories.length}
            className={`w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 ${
              showWarning ? "border-red-500 ring-red-400" : "border-gray-300 ring-orange-400"
            }`}
          >
            <option value="" disabled>
              {filteredSubcategories.length ? "Select Subcategory" : "Choose a category first"}
            </option>
            {filteredSubcategories?.map((sub, i) => (
              <option key={i} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
          {showWarning && <p className="text-red-500 text-sm mt-1">Please select a category first.</p>}
        </div>

        {/* Other Fields */}
        <div className="md:col-span-6">
          <Input label="Pincode" value={formData.pin_code} onChange={(e) => handleInputChange("pin_code", e.target.value)} />
        </div>

        <div className="md:col-span-6">
          <Input label="Address" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} />
        </div>

        <div className="md:col-span-6">
          <Input label="Landmark" value={formData.landmark} onChange={(e) => handleInputChange("landmark", e.target.value)} />
        </div>

        <div className="md:col-span-6">
          <Input label="Sector" value={formData.sector} onChange={(e) => handleInputChange("sector", e.target.value)} />
        </div>

        <div className="md:col-span-6">
          <Input label="Area" value={formData.area} onChange={(e) => handleInputChange("area", e.target.value)} />
        </div>

        <div className="md:col-span-6">
          <Input label="Phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
        </div>

        <div className="md:col-span-6">
          <Input label="WhatsApp Number" value={formData.wp_number} onChange={(e) => handleInputChange("wp_number", e.target.value)} />
        </div>

        <div className="md:col-span-6">
          <Input label="Email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
        </div>

        <div className="md:col-span-6">
          <Input label="Website" value={formData.website} onChange={(e) => handleInputChange("website", e.target.value)} />
          </div>
        </div>

{/* Business Timings */}
<div className="w-full">
  <h3 className="font-semibold text-gray-700 mb-4 mt-6">Business Timings</h3>

  {/* Desktop Table View */}
  <div className="hidden md:block">
    <table className="w-full text-left border rounded-lg text-sm">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="px-4 py-2">#</th>
          <th className="px-4 py-2">Day</th>
          <th className="px-4 py-2">Open Time</th>
          <th className="px-4 py-2">Close Time</th>
          <th className="px-4 py-2">Closed</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {daysOfWeek.map((day, index) => {
          const currentTiming = formData.timing?.find((t) => t.day === day) || {
            open: "",
            close: "",
            closed: false,
          };

          return (
            <tr key={day} className="border-b">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2 font-medium">{day}</td>
              <td className="px-4 py-2">
                <input
                  type="time"
                  value={currentTiming.open}
                  disabled={currentTiming.closed}
                  onChange={(e) => handleTimingChange(index, "open", e.target.value, day)}
                  className="border border-gray-300 rounded px-2 py-1 w-full disabled:bg-gray-100"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="time"
                  value={currentTiming.close}
                  disabled={currentTiming.closed}
                  onChange={(e) => handleTimingChange(index, "close", e.target.value, day)}
                  className="border border-gray-300 rounded px-2 py-1 w-full disabled:bg-gray-100"
                />
              </td>
              <td className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={currentTiming.closed || false}
                  onChange={(e) => handleTimingChange(index, "closed", e.target.checked, day)}
                />
              </td>
              <td className="px-4 py-2">
                {currentTiming.closed ? (
                  <span className="text-gray-600 italic">Closed</span>
                ) : currentTiming.open && currentTiming.close ? (
                  <span className="text-green-600 font-semibold">✅ Set</span>
                ) : (
                  <span className="text-gray-400">Not Set</span>
                )}
              </td>
              <td className="px-4 py-2">
                <button
                  type="button"
                  onClick={() => clearTiming(day)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Clear
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>

  {/* Mobile Card View */}
  <div className="block md:hidden space-y-4">
    {daysOfWeek.map((day, index) => {
      const currentTiming = formData.timing?.find((t) => t.day === day) || {
        open: "",
        close: "",
        closed: false,
      };

      return (
        <div key={day} className="border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700">{index + 1}. {day}</span>
            <input
              type="checkbox"
              checked={currentTiming.closed || false}
              onChange={(e) => handleTimingChange(index, "closed", e.target.checked, day)}
            />
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-sm text-gray-600">Open Time</label>
              <input
                type="time"
                value={currentTiming.open}
                disabled={currentTiming.closed}
                onChange={(e) => handleTimingChange(index, "open", e.target.value, day)}
                className="border border-gray-300 rounded px-3 py-2 w-full disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Close Time</label>
              <input
                type="time"
                value={currentTiming.close}
                disabled={currentTiming.closed}
                onChange={(e) => handleTimingChange(index, "close", e.target.value, day)}
                className="border border-gray-300 rounded px-3 py-2 w-full disabled:bg-gray-100"
              />
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {currentTiming.closed ? "Closed" : currentTiming.open && currentTiming.close ? "✅ Set" : "Not Set"}
              </span>
              <button
                type="button"
                onClick={() => clearTiming(day)}
                className="text-red-500 text-sm hover:underline"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>
          
      {/* Submit Button */}
      <button
        type="submit"
        className="w-full mt-10 px-4 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white font-bold text-lg py-3 rounded-xl shadow-md hover:scale-105 transition-transform"
      >
        Submit Registration
      </button>

      {/* Success Modal */}
      <SuccessModal isOpen={isSuccessModalOpen}  onClose={() => setSuccessModalOpen(false)} message="Your business has been successfully registered!" />
    </form>
  );
}
