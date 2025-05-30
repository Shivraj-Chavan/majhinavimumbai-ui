"use client";

import { useEffect, useState } from "react";
import Input from "../businessRegistercomp/Input";
import TextEditor from "./TextEditor";
import { apiPost, apiPut } from "@/lib/apiClient";
import { MdDelete } from "react-icons/md";
import axios from "axios";

export default function EditBusinessPopup({ business, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hours: "",
    website: "",
    contactNumber: "",
    whatsappNumber: "",
    location: "",
  });

  const [selectedPhotos, setSelectedPhotos] = useState([]);

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || "",
        description: business.description || "",
        hours: business.hours || "",
        website: business.website || "",
        contactNumber: business.contactNumber || "",
        whatsappNumber: business.whatsappNumber || "",
        location: business.location || "",
      });
    }
  }, [business]);

  const handleChange = (e) => {
    const { name, value, files, type, multiple } = e.target;

    if (type === "file" && name === "photos") {
      const newFiles = Array.from(files);
      if (selectedPhotos.length + newFiles.length > 20) {
        alert("You can upload a maximum of 20 photos.");
        return;
      }
      setSelectedPhotos((prev) => [...prev, ...newFiles]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDeletePhoto = (index) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGetLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
        setFormData((prev) => ({ ...prev, location: coords }));
      },
      () => alert("Unable to fetch location.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        owner_id: business.owner_id,
        name: formData.name,
        description: formData.description,
        hours: formData.hours,
        website: formData.website,
        phone: formData.contactNumber,
        wp_number: formData.whatsappNumber,
        location: formData.location,
        category_id: business.category_id,
        subcategory_id: business.subcategory_id,
      };

      const updateRes = await apiPut(`/businesses/${business.id}`, payload);
      console.log("Business updated:", updateRes);

      if (selectedPhotos.length > 0) {
        const formPhotos = new FormData();
        selectedPhotos.forEach((file) => formPhotos.append("photos", file));
        formPhotos.append("user_id", business.owner_id);

        const token = localStorage.getItem('token');
        const photoRes = await axios.post(`http://69.62.84.113:5005/api/businesses/${business.id}/photos`, formPhotos, {
          headers: {
            Authorization: `Bearer ${token}`, // only if needed
          },
        });
    
        console.log("Photos uploaded:", photoRes.data);

        // const photoRes = await apiPost(`/businesses/${business.id}/photos`, formPhotos);
        // console.log("Photos uploaded:", photoRes);
      }

      alert("Business updated successfully!");
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Something went wrong while updating. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-md flex justify-center items-center z-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-6 md:p-8 relative overflow-y-auto max-h-[95vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl">
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Business</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Business Name" name="name" value={formData.name} onChange={handleChange} required />
          <TextEditor label="Description" value={formData.description} onChange={(val) => setFormData((prev) => ({ ...prev, description: val }))} />
          <Input label="Hours" name="hours" value={formData.hours} onChange={handleChange} />
          <Input label="Website" name="website" value={formData.website} onChange={handleChange} />
          <div className="flex gap-4">
            <Input label="Contact" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
            <Input label="WhatsApp" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} />
          </div>

          <div>
            <label className="block mb-1 text-sm">Location</label>
            <div className="flex gap-2">
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="flex-1 border px-4 py-2 rounded" />
              <button type="button" onClick={handleGetLocation} className="px-3 py-2 bg-blue-500 text-white rounded text-sm">
                Get Location
              </button>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-1">Photos (max 20)</label>
            <input type="file" name="photos" accept="image/*" multiple onChange={handleChange} className="block" />

            {selectedPhotos.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 mt-4">
                {selectedPhotos.map((file, idx) => (
                  <div key={idx} className="relative group w-28 h-28">
                    <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="object-cover w-full h-full rounded border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <MdDelete size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">
            Update Business
          </button>
        </form>
      </div>
    </div>
  );
}
