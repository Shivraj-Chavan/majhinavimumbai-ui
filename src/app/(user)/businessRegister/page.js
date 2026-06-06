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
import { MdDelete } from "react-icons/md";
import axios from "axios";
import CONFIG from "@/constance";
import Image from "next/image";
import LocationPicker from "@/app/(admin)/admin/components/LocationPicker";
import TimePicker from "react-time-picker";
import PricingPlans from "../components/profileComp/PricingPlans";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

export default function BusinessRegister({ ownerId , isAdmin = false}) {
  const router = useRouter();
  const [checkingOtp, setCheckingOtp] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const categoryRef = useRef(null);
  const [subcategoriesData, setSubcategoriesData] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPricingPopup, setShowPricingPopup] = useState(false);  
  const [userBusiness, setUserBusiness] = useState(null);

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  ];
  const initialTimings = daysOfWeek.map(day => ({
    day,
    open: "",
    close: "",
    closed: false
  }));
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
    description:"",
    website: "",
    latitude: "",
    longitude: "",
    timing: initialTimings,
  });
  const dispatch = useDispatch();
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const { categories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {

    if (categories?.length > 0) {
      setSubcategoriesData(categories);
    } else {
      dispatch(fetchCategories());
    }
  }, [categories]);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOwnerId = localStorage.getItem("ownerId");
      // console.log("ownerId from localStorage:", storedOwnerId);

      setCheckingOtp(false);
      // setFormData((prev) => ({
      //   ...prev,
      //   owner_id: storedOwnerId,
      // }));
    }
  }, [router]);

  useEffect(() => {
    // console.log({ "Timing-----": formData.timing })
  }, [formData.timing])

  useEffect(() => {
    // console.log("Received ownerId:", ownerId);
    if (ownerId) {
      setFormData((prev) => ({ ...prev, owner_id: Number(ownerId), }));
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


  const handleInputChange = (label, value) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };


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
    // console.log({ selectedSlug })
    const category = subcategoriesData.find((cat) => cat.id == selectedSlug);
    // console.log({ category })
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

     // Validate before sending
     if (!isAdmin && (!formData.latitude || !formData.longitude)) {
      alert("Please select a location on the map.");
      return;
    }
    
    // console.log("Sending to API:", formData);

    if (!selectedCategory) {
      toast.error("Please select category .");
      return;
    }
    setSubmitting(true);

    const finalData = {
      ...formData,
      category_id: selectedCategory,
      subcategory_id: selectedSubcategory,
    };
    // console.log("Data submitting to server:", finalData.timing);

    try {
      const registeredBusiness = await apiPost("/businesses", finalData);
      // console.log('bussiness', finalData);
      
      if (selectedPhotos.length > 0) {
        const formPhotos = new FormData();
        selectedPhotos.forEach((file) => formPhotos.append("photos", file));

        const token = localStorage.getItem("token");
        const photoUploadUrl = `${CONFIG.API_BASE_URL}/businesses/${registeredBusiness.id}/photos`;

        await axios.post(photoUploadUrl, formPhotos, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      toast.success("Bussiness Registered Successfully!");
      setSuccessModalOpen(true);
      setUserBusiness(registeredBusiness);
      // setShowPricingPopup(true);
      setTimeout(() => {
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
        description: "",
        website: "",
        timing: [{ day: "", open: "09:00", close: "18:00" }],
        latitude:'',
        longitude:'',       
      });
      // console.log("Submitting formData:", formData);

      setSelectedCategory("");
      setSelectedSubcategory("");
      setSelectedPhotos([]);
    }, 300);

    } catch (error) {
      console.log("Submission Error:", error?.response?.data?.error);
      toast.error(error?.response?.data?.error || "Error submitting form.");
    } finally {
      setSubmitting(false);
    }
  };
  const handleChange = (e) => {
    const { name, files, type } = e.target;

    if (type === "file" && name === "photos") {
      const newFiles = Array.from(files);

      // Validate file size
      for (let file of newFiles) {
        if (file.size > 2 * 1024 * 1024) {
          toast.error(`File "${file.name}" exceeds  2MB size limit (must be under 2MB)`);
          return;
        }
      }

      // Combine existing + new files
      const totalFilesCount = selectedPhotos.length + newFiles.length;
      if (totalFilesCount > 2) {
        toast.error("You can upload a maximum of 2 photos");
        return;
      }

      const filesWithPreview = newFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

      setSelectedPhotos((prev) => [...prev, ...filesWithPreview]);
    }
  };

  const handleDeletePhoto = (index) => {
    const fileToDelete = selectedPhotos[index];
    if (fileToDelete?.preview) {
      URL.revokeObjectURL(fileToDelete.preview);
    }

    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLocationSelect = (latlng) => {
    // console.log({ lat: latlng.lat, lng: latlng.lng });
    setFormData(prev => ({
      ...prev,
      latitude: latlng.lat,
      longitude: latlng.lng,
    }));
  };
  
  if (checkingOtp) return null;

  return (
    <form onSubmit={handleSubmit}
      className="w-full max-w-5xl mx-auto px-6 py-8 md:py-10 bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow mt-10"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-center flex items-center justify-center gap-2 font-extrabold text-2xl md:text-4xl text-blue-700 mb-5 md:mb-10 tracking-tight font-raleway">
        <FcCollaboration className="text-3xl md:text-4xl" />
        Register Your Business
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6">
        {/* Business Name */}
        <div className="md:col-span-6">
          <Input label="Business Name" required={true} value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
        </div>

        {/* Category */}
        <div className="md:col-span-6">
          <label className="block text-gray-700 mb-1 font-medium">Category<span className="text-red-500">*</span></label>
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
          <label className="block text-gray-700 mb-1 font-medium">Subcategory<span className="text-red-500">*</span></label>
          <select
            value={selectedSubcategory}
            onFocus={handleSubcategoryFocus}
            onChange={handleSubcategoryChange}
            disabled={!filteredSubcategories.length}
            className={`w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 ${showWarning ? "border-red-500 ring-red-400" : "border-gray-300 ring-orange-400"
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
          <Input label="Pincode" required={true}  value={formData.pin_code} onChange={(e) => handleInputChange("pin_code", e.target.value)} />
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

        {/* <div className="md:col-span-6">
          <Input label="Phone" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
        </div>

        <div className="md:col-span-6">
          <Input label="WhatsApp Number" value={formData.wp_number} onChange={(e) => handleInputChange("wp_number", e.target.value)} />
        </div> */}

        <div className="md:col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <span className=" bg-gray-100 text-gray-700 px-[7px] border-r border-gray-300">+91</span>
            <input
              type="tel"
              maxLength={10}
              value={formData.phone}
              onChange={(e) => {
                const input = e.target.value.replace(/\D/g, "");
                if (input.length <= 10) {
                  handleInputChange("phone", input);
                }
              }}
              className="w-full px-1 py-2 focus:outline-none"
              placeholder="Enter 10-digit number"
            />
          </div>
        </div>

        <div className="md:col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number<span className="text-red-500">*</span></label>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <span className=" bg-gray-100 text-gray-700 px-[7px] border-r border-gray-300">+91</span>
            <input
              type="tel"
              maxLength={10}
              value={formData.wp_number}
              onChange={(e) => {
                const input = e.target.value.replace(/\D/g, "");
                if (input.length <= 10) {
                  handleInputChange("wp_number", input);
                }
              }}
              className="w-full px-1 py-2 focus:outline-none"
              placeholder="Enter 10-digit number"
            />
          </div>
        </div>

        <div className="md:col-span-6">
          <Input label="Email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
        </div>

        <div className="md:col-span-6">
          <Input label="Website" value={formData.website} onChange={(e) => handleInputChange("website", e.target.value)} />
        </div>
      </div>
      <div className="pt-5">
        <label htmlFor="description" className="block mb-1 font-medium">
          Business Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="Enter business details..."
        />
      </div>
      <div className="mt-3">
        <label htmlFor="location" className="block mb-1 font-medium">
          Pin your location
        </label>
        <p className="text-sm text-gray-500 mb-2">
        Tap on the map to pin your exact business location.
      </p>

        {/* Location Picker */}
        {/* <LocationPicker onSelect={handleLocationSelect} /> */}
        <LocationPicker 
          onSelect={handleLocationSelect} 
          // role={isAdmin ? "admin" : isSubadmin ? "sub-admin" : "user"} 
          pincode={formData.pin_code} 
        />

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
                    <div className="w-full">

  <TimePicker
    onChange={(value) => handleTimingChange(index, "open", value, day)}
    value={currentTiming.open}
    format="hh:mm a"       
    disableClock={true}
    clearIcon={null}
    clockIcon={null}
    disabled={currentTiming.closed}
  />
</div>

                    </td>
                    <td className="px-4 py-2">
                    <div className="w-full">

<TimePicker
  onChange={(value) => handleTimingChange(index, "close", value, day)}
  value={currentTiming.close}
  format="hh:mm a"       
  disableClock={true}
  clearIcon={null}
  clockIcon={null}
  disabled={currentTiming.closed}
/>
</div>
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
      <div className="pt-3">
        <label className="block text-sm font-medium mb-1">Add up to 2 photos (Each file must be under 2MB)</label>
        <input type="file" name="photos" accept="image/*" multiple onChange={handleChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        {selectedPhotos.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-auto">
            {selectedPhotos.map((file, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded overflow-hidden border border-gray-300">
                <Image width={300} height={300} src={file.preview} alt={`preview-${idx}`} className="object-cover w-full h-full" />
                <button type="button" onClick={() => handleDeletePhoto(idx)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full" aria-label="Delete selected photo">
                  <MdDelete size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className={`w-full mt-10 px-4 py-3 rounded-xl shadow-md font-bold text-lg text-white transition-transform ${submitting
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 hover:scale-105"
          }`}
      >
        {submitting ? (
          <div className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            Submitting...
          </div>
        ) : (
          "Submit Registration"
        )}
      </button>


      {/* Success Modal */}
      <SuccessModal isOpen={isSuccessModalOpen} ownerId={ownerId} onClose={() => setSuccessModalOpen(false)} message="Your business has been successfully registered!" />
      
      {/* next_phase */}
      <PricingPlans show={showPricingPopup} onClose={() => setShowPricingPopup(false)} business={userBusiness} onPlanActivated={() => {
    setShowPricingPopup(false);
    setSuccessModalOpen(true); 
  }}/>
    </form>
  );
}
