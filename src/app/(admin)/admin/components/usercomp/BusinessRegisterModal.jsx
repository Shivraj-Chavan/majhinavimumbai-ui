"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { apiGet, apiPut ,apiPost } from '@/lib/apiClient';
import { toast } from 'react-toastify';
import { addMonths, format, parseISO, isValid } from 'date-fns';
import LocationPicker from '../LocationPicker';

export default function BusinessRegisterModal({ isOpen, onClose, business }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [subcategoriesData, setSubcategoriesData] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [newDay, setNewDay] = useState("Monday");
  // const [plans, setPlans] = useState([]);
  // const [selectedPlan, setSelectedPlan] = useState("");
  const [duration, setDuration] = useState("");
  const [success, setSuccess] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  const { user, role } = useSelector((state) => state.user);
  const effectiveRole = user?.role || role; // prioritize user.role
const canEdit = effectiveRole ? ["admin", "sub-admin"].includes(effectiveRole.toLowerCase()|| "") : false;  

// console.log("user:", user || "No user in state yet");
// console.log("canEdit:", canEdit);
// console.log({effectiveRole});

  useEffect(() => {
    if (categories?.length > 0) {
      setSubcategoriesData(categories);
    }
  }, [categories]);

  useEffect(() => {
    if (business) {
      let parsedTimings = [];
      try {
        parsedTimings = typeof business.timing === "string" && business.timing.trim().startsWith("[")
        ? JSON.parse(business.timing) 
        : Array.isArray(business.timing) 
        ? business.timing 
        : [];
        // console.log("Business Timing:", business.timing)
      } catch (err) {
        console.error("Failed to parse timing JSON", err);
      }
      setFormData({...business,timing: parsedTimings,});
      setSelectedCategory(business.category_id);
      setSelectedSubcategory(business.subcategory_id);
    }
  }, [business]);

  const handleDurationChange = (value) => {
    setDuration(value);

    if (startDate) {
      const monthsToAdd = getMonthsFromDuration(value);
      const end = addMonths(new Date(startDate), monthsToAdd);
      setEndDate(format(end, 'dd/MM/yyyy')); 
    }
  };

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;
    setStartDate(selectedDate);

    if (duration) {
      const monthsToAdd = getMonthsFromDuration(duration);
      const end = addMonths(new Date(selectedDate), monthsToAdd);
      setEndDate(format(end, 'yyyy-MM-dd'));
    }
  }; 
  
  const handleEndDateChange = (e) => {
    const endDate = e.target.value;
    setEndDate(endDate);
  };


  const getMonthsFromDuration = (durationStr) => {
    switch (durationStr) {
      case '1 Month':
        return 1;
      case '3 Months':
        return 3;
      case '6 Months':
        return 6;
      case '1 Year':
        return 12;
      default:
        return 0;
    }
  };

  //next_phase
  // useEffect(() => {
  //   const fetchSelectedPlan = async () => {
  //     if (!business?.id) return;
  //     try {
  //       const res = await apiGet(`/plan/selectedplan/${business.id}`);
  //       console.log("Selected Plan for business:", res);
  
  //       if (res && res?.id) {
  //         setSelectedPlan(res.id.toString()); // match with dropdown
  //         setStartDate(res.start_date?.slice(0,10)); // yyyy-mm-dd format
  //         setEndDate(res.end_date?.slice(0,10));
  
  //         // auto detect duration if possible
  //         const months = getMonthsFromDuration(res.duration);
  //         if (months) setDuration(res.duration);
  //       }
  //     } catch (err) {
  //       console.warn("No existing plan found for this business");
  //     }
  //   };
  
  //   fetchSelectedPlan();
  // }, [business]);
  

  // Plans
  // useEffect(() => {
  //   const fetchPlans = async () => {
  //     try {
  //       const res = await apiGet("/plan/plans");
  //       console.log("Plans:", res); 
  
  //       const order = ["Free", "Silver", "Gold", "Platinum"];
  //       const plansArray = Array.isArray(res.data) ? res.data : res;
  
  //       const sorted = plansArray.sort(
  //         (a, b) => order.indexOf(a.name) - order.indexOf(b.name)
  //       );
  //       console.log("Sorted plans:", sorted);
  //       setPlans(sorted);
  //     } catch (err) {
  //       console.error("Failed to fetch plans", err);
  //       setPlans([]);
  //     }
  //   };
  
  //   fetchPlans();
  // }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimingChange = (index, field, value) => {
    setFormData(prev => {
      const updatedTiming = prev.timing ? [...prev.timing] : [];
      updatedTiming[index] = {
        ...updatedTiming[index],
        [field]: value
      };
      return { ...prev, timing: updatedTiming };
    });
  };
   
  
  // const handleUpdate = async () => {
  //   try {
  //     const payload = {
  //       ...formData,
  //       category: selectedCategory,
  //       subcategory: selectedSubcategory,
  //       timing: JSON.stringify(formData.timing),
  //     };
  //     await apiPut("/users/profile", payload);
  //     toast.success("Business updated successfully!");
  //     setIsEditing(false);
  //   } catch (error) {
  //     console.error("Update failed:", error);
  //     toast.error("Failed to update business");
  //   }
  // };

  const handleCategoryChange = (e) => {
    const selectedSlug = e.target.value;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSelectedCategory(selectedSlug);
  };

  useEffect(()=>{
    setSelectedSubcategory("");
    const category = subcategoriesData.find((cat) => cat.id == selectedCategory);
    setFilteredSubcategories(category ? category.subcategories : []);
  },[selectedCategory])

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  const handleSubcategoryFocus = () => {
    if (!selectedCategory) setShowWarning(true);
    else setShowWarning(false);
  };

  const handleSubmit = async () => {
    if (!canEdit) {
      toast.error("Unauthorized: only admin/subadmin can edit.");
      return;
    }
    try {
      // Update plan only if a plan is selected
      // if (selectedPlan && startDate && endDate) {
      //   const selectedPlanObj = plans.find((p) => p.id == selectedPlan);
  
      //   await apiPost("/plan/select-plan", {
      //     business_id: business?.id,
      //     plan_id: selectedPlan,
      //     startDate,
      //     endDate,
      //     plan_duration: duration,
      //     plan_price: selectedPlanObj?.price ?? 0
      //   });
  
      //   toast.success("Plan updated successfully!");
      // }

     // Ensure lat/lng are floats
     const lat = formData.latitude != null ? parseFloat(formData.latitude) : null;
     const lng = formData.longitude != null ? parseFloat(formData.longitude) : null;
  
      // Always update business details
      const payload = { 
        ...formData,
        category: formData.category_id,
        subcategory: formData.subcategory_id,
        timing: JSON.stringify(formData.timing),
        latitude: lat,
        longitude: lng,
      };
      console.log("Final payload to update business:", payload);
  
      await apiPut(`/businesses/${business?.id}`, payload);
      toast.success("Business updated successfully!");
  
      setIsEditing(false);
      onClose(true);
      // onClose();
  
      if (payload.is_verified && typeof onVerified === "function") {
        onVerified(business.id);
      }
  
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update business");
    }
  };
  

  const handleAddTiming = () => {
    const isDuplicate = formData.timing?.some((item) => item.day === newDay);
    if (isDuplicate) {
      toast.error(`${newDay} already exists.`);
      return;
    }
  
    const newTiming = {
      day: newDay,
      open: "09:00",
      close: "18:00"
    };
  
    setFormData((prev) => ({
      ...prev,
      timing: [...(prev.timing || []), newTiming],
    }));
  };
  

  const handleDeleteTiming = (indexToDelete) => {
    setFormData((prev) => ({
      ...prev,
      timing: prev.timing.filter((_, index) => index !== indexToDelete),
    }));
  };
  
  if (!business) return null;

  // Helper function to format coordinates
const formatCoord = (coord) => {
  if (coord === null || coord === undefined || isNaN(coord)) return "N/A";
  return parseFloat(coord).toFixed(6); // keeps up to 6 decimal places
};


  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-start justify-center p-4 overflow-y-auto sm:items-center">
        <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all mt-auto">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <Dialog.Title className="text-2xl font-semibold text-gray-800">
              Business Details
            </Dialog.Title>
            <button onClick={onClose}>
              <IoMdClose className="text-2xl text-gray-500 hover:text-red-600" />
            </button>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {/* Text Inputs */}
            {[
              { label: "Name", name: "name" },
              { label: "Phone", name: "phone" },
              { label: "Email", name: "email" },
              { label: "Address", name: "address" },
              { label: "Area", name: "area" },
              { label: "Pincode", name: "pin_code" },
              { label: "Landmark", name: "landmark" },
              { label: "Sector", name: "sector" },
              { label: "Whatsapp Number", name: "wp_number" },
              { label: "Website", name: "website" },
            ].map(({ label, name },index) => (
              <div key={name || index}>
                <label className="block text-gray-600 font-medium mb-1">{label}</label>
                <input
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${isEditing ? "border-gray-300 focus:ring-2 focus:ring-orange-400" : "bg-gray-100 text-gray-700" }`}
                />
              </div>
            ))}

                {/* Category */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Category</label>
                  <select
                    value={formData['category_id']}
                    onChange={handleCategoryChange}
                    name='category_id'
                    className="w-full px-4 py-2 border rounded-xl"
                    disabled={!isEditing}
                  >
                    <option value="">Select Category</option>
                    {subcategoriesData.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Subcategory</label>
                  <select
                    value={formData['subcategory_id']}
                    onChange={handleChange}
                    name='subcategory_id'
                    onFocus={handleSubcategoryFocus}
                    disabled={!isEditing}

                    className={`w-full px-4 py-2 border rounded-xl ${showWarning ? "border-red-500 ring-red-400" : ""}`}
                  >
                    <option value="">Select Subcategory</option>
                    {filteredSubcategories.map((sub, i) => (
                      <option key={i} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                  {showWarning && <p className="text-red-500 text-sm mt-1">Please select a category first.</p>}
                </div>
             
            {/* Timing */}
            <div className="sm:col-span-2 ">
            <label className="block text-gray-600 font-medium mb-1">Timing</label>
            <div className="space-y-2">
              {Array.isArray(formData.timing) && formData.timing.length > 0 ? (
                formData.timing.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    {isEditing && (
                      <button
                        onClick={() => handleDeleteTiming(index)}
                        className="text-red-500 hover:text-red-700 font-bold text-xl"
                        title="Delete"
                      >
                        ×
                      </button>
                    )}
                    <input
                      type="text"
                      value={item.day}
                      onChange={(e) => handleTimingChange(index, "day", e.target.value)}
                      className="border rounded px-2 py-1 w-24"
                      placeholder="Day"
                      readOnly={!isEditing || !canEdit}
                    />
                    {isEditing ? (
                      <>
                        <input
                          type="time"
                          value={item.open}
                          onChange={(e) => handleTimingChange(index, "open", e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={item.close}
                          onChange={(e) => handleTimingChange(index, "close", e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                      </>
                    ) : (
                      <span>{item.open} - {item.close}</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">N/A</div>
              )}
            </div>

               {/* Wrapper */}
               <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Verification Status */}
          
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
            {isEditing ? (
              <div className="relative">
                <select
                  name="is_verified"
                  value={formData.is_verified ? "true" : "false"}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, is_verified: e.target.value === "true" }))
                  }
                  className="block w-full appearance-none border border-gray-300 bg-white py-2 px-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="false">Unverified</option>
                  <option value="true">Verified</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3A1 1 0 0110 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div
                className={`text-sm font-semibold px-4 py-2 mt-1 rounded-xl inline-block ${
                  formData.is_verified
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {formData.is_verified ? "✅ Verified" : "❌ Unverified"}
              </div>
            )}
          </div>
          {/* next_phase */}
          {/* Plan Selection */}
          {/* <div className="w-full">
            <div className="space-y-6 p-4 bg-white rounded-xl shadow-md">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Select a Plan</label>
                <select
              onChange={(e) => setSelectedPlan(e.target.value)}
              value={selectedPlan}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="" disabled>Choose Plan</option>
              {plans?.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ₹{plan.price} / {plan.duration}
                </option>
              ))}
            </select>

              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">end Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {startDate && endDate && (
              <div className="mt-4 text-sm text-green-700 font-medium bg-green-100 p-3 rounded-lg">
                📆 Active From: <strong>{format(new Date(startDate), 'dd/MM/yyyy')}</strong> 
                to <strong>{format(new Date(endDate), 'dd/MM/yyyy')}</strong>
              </div>
            )}


            </div>
          </div> */}
          </div>

       </div>
    </div>

          {/* Description */}
          <div className="pt-5">
          <label htmlFor="description" className="block mb-1 font-medium">
            Business Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            value={formData?.description || ''}
            onChange={handleChange} 
            disabled={!isEditing || !canEdit}
            className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${isEditing ? "border-gray-300 focus:ring-2 focus:ring-orange-400" : "bg-gray-100 text-gray-700" }`}
            placeholder="Enter business details..."
          />
        </div>

         {/* Location Picker */}
         <div className="sm:col-span-2">
            <label className="block text-gray-600 font-medium mb-1">Business Location</label>
            
            <LocationPicker
            defaultLocation={
              formData.latitude && formData.longitude
                ? [parseFloat(formData.latitude), parseFloat(formData.longitude)]
                : null
            }
            onSelect={(coords) => {
              setFormData((prev) => ({
                ...prev,
                latitude: parseFloat(coords.lat),
                longitude: parseFloat(coords.lng),
              }));
            }}
          />

          {(formData.latitude != null || formData.longitude != null) && (
            <p className="text-sm text-gray-600 mt-2">
              📍 Selected: {formatCoord(formData.latitude)}, {formatCoord(formData.longitude)}
            </p>
          )}

          </div>
        
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            {isEditing ? (
              <>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium"
                  disabled={!canEdit}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(business);
                    setSelectedCategory(business.category);
                    setSelectedSubcategory(business.subcategory);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-full font-medium"
                >
                  Cancel
                </button>
              </>
            ) : (
              canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium"
                >
                  Edit Business
                </button>
              )
              
            )}
          </div>

        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
