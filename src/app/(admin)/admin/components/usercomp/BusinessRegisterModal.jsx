import React, { useState, useEffect } from 'react';
import { Dialog } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";

export default function BusinessRegisterModal({ isOpen, onClose, business }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (business) setFormData(business);
  }, [business]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await apiPut("/users/profile", formData);
      toast.success("Business updated successfully!");
      console.log("Updated Data:", response);
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update business");
    }
  };

  if (!business) return null;

  const fields = [
    { label: "Owner Id", name: "owner_id" },
    { label: "Name", name: "name" },
    { label: "Phone", name: "phone" },
    { label: "Email", name: "email" },
    { label: "Category", name: "category_id" },
    { label: "Subcategory", name: "subcategory_id" },
    { label: "Address", name: "address" },
    { label: "Area", name: "area" },
    { label: "Pincode", name: "pin_code" },
    { label: "Landmark", name: "landmark" },
    { label: "Sector", name: "sector" },
    { label: "Whatsapp Number", name: "wp_number" },
    { label: "Timings", name: "timings" },
    { label: "Website", name: "website" },
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-start justify-center p-4 overflow-y-auto sm:items-center">
        <Dialog.Panel className="w-full max-w-3xl  transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 mt-0 md:mt-30 sm:mt-0 shadow-2xl transition-all">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <Dialog.Title className="text-xl sm:text-2xl font-semibold text-gray-800">
              Business Details
            </Dialog.Title>
            <button onClick={onClose}>
              <IoMdClose className="text-2xl text-gray-500 hover:text-red-600 transition" />
            </button>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block font-medium text-gray-600 mb-1">
                  {field.label}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : field.name === "website" && formData.website ? (
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-words"
                  >
                    {formData.website}
                  </a>
                ) : (
                  <div className="text-gray-800 break-words">
                    {formData[field.name] || "N/A"}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium shadow transition w-full sm:w-auto"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => { setIsEditing(false); setFormData(business); }}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-full font-medium shadow transition w-full sm:w-auto"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium shadow transition w-full sm:w-auto"
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
