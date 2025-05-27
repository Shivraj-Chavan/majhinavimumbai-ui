"use client";

import { useState } from "react";
import Input from "../businessRegistercomp/Input";
import FileUpload from "../profileComp/FileUpload";
import { Editor, EditorProvider } from "react-simple-wysiwyg";
import { apiPost, apiPut } from "@/lib/apiClient";

export default function EditBusinessPopup({ business, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: business?.name || "",
    description: business?.description || "",
    hours: business?.hours || "",
    website: business?.website || "",
    contactNumber: business?.contactNumber || "",
    whatsappNumber: business?.whatsappNumber || "",
    location: business?.location || "",
    photos: [],
    logo: null,
    menuItems: business?.menuItems || [{ name: "", price: "" }],
  });

  const handleChange = (e) => {
    const { name, type, files, value, multiple } = e.target;
    if (!name) return;

    if (type === "file") {
      const selectedFiles = Array.from(files);
      if (multiple && selectedFiles.length > 20) {
        alert("You can upload a maximum of 20 photos.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: multiple ? selectedFiles : files[0],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
        menuItems: formData.menuItems,
        category_id: business.category_id,      
        subcategory_id: business.subcategory_id 
      };

      const res = await apiPut(`/businesses/${business.id}`, payload);
      console.log("Updated business:", res.data);
      onSave(res.data || res);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Something went wrong while updating. Please try again.");
    }
  };

  const handleMenuItemChange = (index, field, value) => {
    const updatedItems = [...formData.menuItems];
    updatedItems[index][field] = value;
    setFormData((prev) => ({ ...prev, menuItems: updatedItems }));
  };

  const addMenuItem = () => {
    setFormData((prev) => ({
      ...prev,
      menuItems: [...prev.menuItems, { name: "", price: "" }],
    }));
  };

  const removeMenuItem = (index) => {
    const updatedItems = [...formData.menuItems];
    updatedItems.splice(index, 1);
    setFormData((prev) => ({ ...prev, menuItems: updatedItems }));
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleUploadPhotos = async () => {
    if (!formData.photos?.length) {
      alert("Please select photos to upload.");
      return;
    }

    try {
      const base64Images = await Promise.all(
        formData.photos.map((file) => fileToBase64(file))
      );

      const payload = {
        user_id: business.owner_id,
        images: base64Images,
      };

      const res = await apiPost(`/businesses/${business.id}/photos`, payload);
      onSave(res.data);

      alert(res.success ? "Photos uploaded successfully" : res.msg || "Failed");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong during image upload.");
    }
  };

  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-md flex justify-center items-center z-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-6 md:p-8 relative overflow-y-auto max-h-[95vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Business</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Business Name" name="name" value={formData.name} onChange={handleChange} required />
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <EditorProvider>
            <Editor value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} />
          </EditorProvider>
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

          <div className="flex gap-4 items-end">
            <FileUpload label="Photos (max 20)" name="photos" onChange={handleChange} accept="image/*" multiple />
            <button type="button" onClick={handleUploadPhotos} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Upload Photos
            </button>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Menu Items</h3>
            {formData.menuItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input type="text" placeholder="Item" value={item.name} onChange={(e) => handleMenuItemChange(index, "name", e.target.value)} className="flex-1 border px-2 py-1 rounded" />
                <input type="number" placeholder="Price" value={item.price} onChange={(e) => handleMenuItemChange(index, "price", e.target.value)} className="w-24 border px-2 py-1 rounded" />
                <button type="button" onClick={() => removeMenuItem(index)} className="text-red-600 text-xl font-bold px-2">&times;</button>
              </div>
            ))}
            <button type="button" onClick={addMenuItem} className="text-blue-600 hover:underline text-sm">+ Add Menu Item</button>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">
            Update Business
          </button>
        </form>
      </div>
    </div>
  );
}
