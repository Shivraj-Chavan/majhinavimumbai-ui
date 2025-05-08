import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { apiPut } from '@/lib/apiClient';

export default function BusinessRegisterModal({ isOpen, onClose, business }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [subcategoriesData, setSubcategoriesData] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [showWarning, setShowWarning] = useState(false);

  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    if (categories?.length > 0) {
      setSubcategoriesData(categories);
    }
  }, [categories]);

  useEffect(() => {
    if (business) {
      let parsedTimings = [];
      try {
        parsedTimings = typeof business.timing === "string"
          ? JSON.parse(business.timing)
          : Array.isArray(business.timing)
            ? business.timing
            : [];
      } catch (err) {
        console.error("Failed to parse timing JSON", err);
      }
      setFormData({
        ...business,
        timing: parsedTimings,
      });
      setSelectedCategory(business.category);
      setSelectedSubcategory(business.subcategory);
    }
  }, [business]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimingChange = (index, type, value) => {
    const updatedTiming = [...formData.timing];
    updatedTiming[index][type] = value;
    setFormData((prev) => ({ ...prev, timing: updatedTiming }));
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...formData,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        timing: JSON.stringify(formData.timing),
      };
      await apiPut("/users/profile", payload);
      toast.success("Business updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update business");
    }
  };

  const handleCategoryChange = (e) => {
    const selectedSlug = e.target.value;
    setSelectedCategory(selectedSlug);
    setSelectedSubcategory("");
    const category = subcategoriesData.find((cat) => cat.id == selectedSlug);
    setFilteredSubcategories(category ? category.subcategories : []);
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  const handleSubcategoryFocus = () => {
    if (!selectedCategory) setShowWarning(true);
    else setShowWarning(false);
  };

  if (!business) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-start justify-center p-4 overflow-y-auto sm:items-center">
        <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl transition-all mt-25">
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
            ].map(({ label, name }) => (
              <div key={name}>
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
                value={selectedCategory}
                onChange={handleCategoryChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border rounded-xl"
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
                value={selectedSubcategory}
                onChange={handleSubcategoryChange}
                onFocus={handleSubcategoryFocus}
                disabled={!isEditing || !filteredSubcategories.length}
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
            <div className="sm:col-span-2">
              <label className="block text-gray-600 font-medium mb-1">Timing</label>
              <div className="space-y-1">
                {Array.isArray(formData.timing) && formData.timing.length > 0 ? (
                  formData.timing.map((item, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <span className="w-20">{item.day}</span>
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
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium"
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
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium"
              >
                Edit Business
              </button>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
