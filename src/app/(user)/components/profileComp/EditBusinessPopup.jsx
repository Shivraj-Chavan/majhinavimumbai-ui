"use client";

import { useState } from "react";
import Input from "../businessRegistercomp/Input";
import FileUpload from "../profileComp/FileUpload";
import { Editor, EditorProvider } from "react-simple-wysiwyg";
import { apiPost } from "@/lib/apiClient";

export default function EditBusinessPopup({ business, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: business.name || "",
    description: business.description || "",
    hours: business.hours || "",
    website: business.website || "",
    contactNumber: business.contactNumber || "",
    whatsappNumber: business.whatsappNumber || "",
    location: business.location || "",
    photos: [],
    logo: null,
    menuItems: business.menuItems || [{ name: '', price: '' }],
  });

  const handleChange = (e) => {
    const target = e.target;
    const name = target?.name;
  
    if (!name) return;
  
    if (target.type === "file") {
      if (target.multiple) {
        const selectedFiles = Array.from(target.files);
        if (selectedFiles.length > 20) {
          alert("You can upload a maximum of 20 photos.");
          return;
        }
        setFormData((prev) => ({ ...prev, [name]: selectedFiles }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: target.files[0] }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: target.value }));
    }
  };
  
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => { const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
          setFormData((prev) => ({ ...prev, location: coords }));
        },
        () => { alert("Unable to fetch location."); }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "photos") {
          value.forEach((photo) => form.append("photos", photo));
        } else if (value) {
          form.append(key, value);
        }
      });

      const res = await apiPut(`/businesses/${business.id}`, form);
      console.log(form);
  
      onSave(res.data);
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
    setFormData((prev) => ({ ...prev, menuItems: [...prev.menuItems, { name: '', price: '' }],}));
  };
  
  const removeMenuItem = (index) => {
    const updatedItems = [...formData.menuItems];
    updatedItems.splice(index, 1);
    setFormData((prev) => ({ ...prev, menuItems: updatedItems }));
  };

  // Converts a File object to a base64 string
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); 
    reader.onerror = reject;
    reader.readAsDataURL(file); // converts to base64 format
  });
}

  const handleUploadPhotos = async () => {
    if (!formData.photos || formData.photos.length === 0) {
      alert("Please select photos to upload.");
      return;
    }
  
    try {
      const base64Images = await Promise.all(
        formData.photos.map(file => fileToBase64(file))
      );
  
      const payload = {
        user_id: currentUser.id, // make sure this is defined
        images: base64Images,
      };
  
      const res = await apiPost(`/businesses/${business.id}`, payload);
  
      if (response?.success) {
        alert("Photos uploaded successfully");
        console.log("Saved images:", res.images);
      } else {
        console.error(res);
        alert(response?.msg || "Photo upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Something went wrong during image upload.");
    }
  };
  
  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-md flex justify-center items-center z-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-6 md:p-8 relative overflow-y-auto max-h-[95vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl">
          &times;
        </button>

        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
          Edit Your Business
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Business Name" name="name" value={formData.name} onChange={handleChange} placeholder="Bussiness Name" />

           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <div>
               <EditorProvider>
                 <Editor value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}/>
                 </EditorProvider>
                </div>
                
          <Input label="Business Hours" name="hours" value={formData.hours} onChange={handleChange} placeholder="e.g. 9am - 6pm" />
          <Input label="Website URL" name="website" value={formData.website} onChange={handleChange} placeholder="https://cncwebworld.com" />
           
           <div className="flex gap-4">
          <Input label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="e.g., 9898676545" />
          <Input label="WhatsApp Number" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="e.g., 8476509632" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Bussiness Location</label>
            <div className="flex items-center gap-2">
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Location"/>
              <button type="button" onClick={handleGetLocation} className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                Get Location
              </button>
            </div>
          </div>

          <div className="flex gap-4 items-end">
          <FileUpload label="Upload Photos (max 20)" name="photos" onChange={handleChange} accept="image/*" multiple={true}/>
          
          <button type="button" onClick={handleUploadPhotos} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition">
            Upload Selected Photos
          </button>
        </div>

          {/* {formData.photos.length > 0 && (
            <p className="text-xs text-gray-500">{formData.photos.length} photo(s) selected</p>
          )} */}

           {/* Menu Upload (File) */}
            {/* <FileUpload label="Upload Menu (PDF or Image)" name="menu" onChange={handleChange} accept=".pdf,image/*"/>  */}

            {/* Typed Menu Items */}
            <div className="mt-4">
            <h3 className="text-md font-semibold text-gray-700 mb-2">Add Menu Items</h3>
            {formData.menuItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                <input type="text" value={item.name} onChange={(e) => handleMenuItemChange(index, 'name', e.target.value)} placeholder="Item Name" className="w-full border px-3 py-2 rounded-md" />
                <input type="number" value={item.price} onChange={(e) => handleMenuItemChange(index, 'price', e.target.value)} placeholder="Price" className="w-32 border px-3 py-2 rounded-md"/>

                <button type="button" onClick={() => removeMenuItem(index)} className="text-red-600 text-lg font-bold px-2">
                    &times;
                </button>
                </div>
            ))}
            <button type="button" onClick={addMenuItem} className="text-sm mt-1 text-blue-600 hover:underline">+ Add Another Item </button>
            </div>

            <div className="flex justify-between gap-4 mt-6">
            <button type="button" onClick={onClose} className="w-1/2 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition">
                Cancel
            </button>

            <button type="submit" className="w-1/2 bg-orange-600 text-white font-semibold py-2 rounded-lg hover:bg-orange-700 transition">
                Save Changes
            </button>
            </div>

        </form>
      </div>

    </div>
  );
}
