"use client";

import { useEffect, useState } from "react";
import Input from "../businessRegistercomp/Input";
import TextEditor from "./TextEditor";
import { apiGet, apiPut } from "@/lib/apiClient";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import CONFIG from './../../../../constance'
export default function EditBusinessPopup({ business, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    timing: [],
    website: "",
    phone: "",
    wp_number: "",
    area: "",
    landmark: "",
    sector: "",
    address: "",
    pin_code: "",
    wp_number: "",
  });

  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUser=async()=>{
      try {
        const userRes = await apiGet("/users/me");
        setCurrentUser(userRes);
      } catch (err) {
        toast.error("Failed to fetch user");
      }
    }
    loadUser()    
  }, []);

  useEffect(() => {
    return () => {
      selectedPhotos.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [selectedPhotos]);

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || "",
        description: business.description || "",
        website: business.website || "",
        phone: business.phone || "",
        wp_number: business.wp_number || "",
        timing: (() => {
          try {
            const parsed = Array.isArray(business.timing)
              ? business.timing
              : JSON.parse(business.timing || "[]");
            console.log({parsed})
            return parsed.filter((t) => t.day && typeof t.day === "string");
          } catch {
            return [];
          }
        })(),
        address: business.address || "",
        area: business.area || "",
        sector: business.sector || "",
        landmark: business.landmark || "",
        pin_code:business.pin_code || "",

      });

      const fullPhotoUrls = (business.images || []).map((image) =>
        image.url.startsWith("http") ? image.url : `${CONFIG.IMAGE_BASE_URL}${image.url}`
      );
      setExistingPhotos(fullPhotoUrls);
      setSelectedPhotos([]);
    }
  }, [business]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    // Handle website validation
      let updatedValue = value;
      if (name === "website") {
        if (value && !value.startsWith("http://") && !value.startsWith("https://")) {
          updatedValue = `http://${value}`;
        }
      }

    if (type === "file" && name === "photos") {
      const newFiles = Array.from(files);
  
      // Validate file size
      for (let file of newFiles) {
        if (file.size > 5 * 1024 * 1024) { // 5MB in bytes
          toast.error(`File "${file.name}" exceeds 5MB size limit`);
          return;
        }
      }
    
      // Check total image count (existing + new)
      if (existingPhotos.length + selectedPhotos.length + newFiles.length > 2) {
        toast.error("Max 2 photos allowed (existing + new)");
        return;
      }
    
      const filesWithPreview = newFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );
    
      setSelectedPhotos((prev) => [...prev, ...filesWithPreview]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleWebsiteBlur = (e) => {
    const { name, value } = e.target;
    if (name === "website" && value && !value.startsWith("http://") && !value.startsWith("https://")) {
      setFormData((prev) => ({
        ...prev,
        [name]: `http://${value}`,
      }));
    }
  };
  

  // Delete Selected or Existing Photos
  const handleDeletePhoto = (index) => {URL.revokeObjectURL(selectedPhotos[index].preview);
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingPhoto = async (index) => {
    if (!window.confirm("Delete this photo?")) return

    try {
      const photoToDelete = existingPhotos[index];
      const token = localStorage.getItem("token");

      await axios.delete(`${CONFIG.API_BASE_URL}/businesses/${business.id}/photos`, {
        data: { photoUrl: photoToDelete },
        headers: { Authorization: `Bearer ${token}` },
      });

      setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
      toast.success("Photo deleted");
    } catch (error) {
      toast.error("Failed to delete photo");
    }
  };

  const handleGetLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        setFormData((prev) => ({ ...prev, location: coords }));
      },
      () => toast.error("Failed to get location")
    );
  };

  useEffect(()=>{
      console.log({currentUser})
  },[currentUser])
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered");
    console.log({currentUser})
    if (!currentUser) {
      toast.error("User not loaded yet");
      return;
    }

    try {

      const payload = {
        owner_id: business.owner_id,
        name: formData.name,
        description: formData.description,
        timing: JSON.stringify(formData.timing),
        website: formData.website,
        phone: formData.phone,
        wp_number: formData.wp_number,
        area: formData.area,
        category_id: business.category_id,
        subcategory_id: business.subcategory_id,
        landmark: business.landmark,
        sector: business.sector,
        address: business.address,
        pin_code: business.pin_code,
        slug: business.slug,
      };
      console.log("Payload being submitted:", payload);

      const isAdmin = currentUser.role === "admin";
      console.log("Current user role:", currentUser.role);

      const endpoint = isAdmin ? `/businesses/${business.id}` : `/businesses/update/${business.id}`;
      // console.log(`Sending ${isAdmin ? "ADMIN" : "OWNER"} update to: ${endpoint}`);
  
      await apiPut(endpoint, payload);
      console.log(`Sending ${isAdmin ? "ADMIN" : "OWNER"} update to: ${endpoint}`);

      toast.success('Business data submitted successfully')
      console.log("Business data submitted successfully");

      // Photo upload
      if (selectedPhotos.length > 0) {
        const formPhotos = new FormData();
        selectedPhotos.forEach((file) => formPhotos.append("photos", file));
        formPhotos.append("user_id", business.owner_id);

        const token = localStorage.getItem("token");
        const photoUploadUrl = isAdmin ? `${CONFIG.API_BASE_URL}/businesses/${business.id}/photos` : `${CONFIG.API_BASE_URL}/businesses/update/${business.id}/photos`;
        // console.log(`Uploading to: ${photoUploadUrl}`);

        await axios.post(photoUploadUrl, formPhotos, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      toast.success(isAdmin ? "Business updated successfully" : "Edit submitted for admin review");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  };
  const updateTiming = (day, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.timing || [])];
      const index = updated.findIndex((t) => t.day === day);
      if (index >= 0) {
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
  
        if (field === "closed" && value === true) {
          updated[index].open = "";
          updated[index].close = "";
        }
      } else {
        const newEntry = { day, open: "", close: "", closed: false, [field]: value };
        if (field === "closed" && value === true) {
          newEntry.open = "";
          newEntry.close = "";
        }
        updated.push(newEntry);
      }
  
      return { ...prev, timing: updated };
    });
  };
  
  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-md flex justify-center items-center z-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-6 md:p-8 relative overflow-y-auto max-h-[95vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl" aria-label="Close">
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Business</h2>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <Input label="Business Name" name="name" value={formData.name} onChange={handleChange} required />
          <div>
        <label htmlFor="description" className="block mb-1 font-medium">
          Business Details
        </label>
        {/* <textarea
          id="description"
          name="description"
          rows={5}
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full border px-3 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        /> */}

         <div>
            {!showTextarea ? (
              <div>
                <div className="text-sm text-gray-800 whitespace-pre-wrap">
                  {formData.description.length > 100 ? (
                    <>
                      {descriptionPreview}...
                      <button
                        onClick={() => setShowTextarea(true)}
                        className="ml-1 text-blue-500 underline text-sm"
                      >
                        Read More
                      </button>
                    </>
                  ) : (
                    formData.description || "No description"
                  )}
                </div>
              </div>
            ) : (
              <div>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setShowTextarea(false)}
                  className="mt-1 text-blue-500 underline text-sm"
                >
                  Read Less
                </button>
              </div>
            )}
          </div>
        </div>

      {/* Timing Section (REPLACED input with custom logic) */}
        <div>
          <label className="block mb-1 font-medium">Business Timings</label>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
          const timing = formData?.timing?.find((t) => t.day === day) || { open: "", close: "", closed: false };

            return (
              <div key={day} className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-2">
                <span className="w-24 font-medium text-gray-700">{day}</span>
                <input
                  type="time"
                  value={timing.open}
                  disabled={timing.closed}
                  onChange={(e) => updateTiming(day, "open", e.target.value)}
                  className="border px-2 py-1 rounded w-32 disabled:bg-gray-100"
                />
                <input
                  type="time"
                  value={timing.close}
                  disabled={timing.closed}
                  onChange={(e) => updateTiming(day, "close", e.target.value)}
                  className="border px-2 py-1 rounded w-32 disabled:bg-gray-100"
                />
                <label className="flex items-center gap-1 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={timing.closed}
                    onChange={(e) => updateTiming(day, "closed", e.target.checked)}
                  />
                  Closed
                </label>
              </div>
            );
          })}
        </div>
          <Input label="Website" name="website" value={formData.website} onChange={handleChange} onBlur={handleWebsiteBlur} />
          <div className="flex gap-5">
            {/* <Input label="Contact" name="phone" type="tel" value={formData.phone} onChange={handleChange} /> */}
            {/* <Input label="WhatsApp" name="wp_number" type="tel" value={formData.wp_number} onChange={handleChange} /> */}

            {/* Phone Input with +91 prefix */}
          <div className="md:col-span-6">
            <label className="block font-medium text-gray-700 mb-1">Contact</label>
            <div className="flex border border-gray-300 rounded-md overflow-hidden items-center  w-[320px]">
              <span className="text-gray-700 text-md px-[9px] border-r border-gray-300">+91</span>
              <input
                type="tel"
                name="phone"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => {
                  const input = e.target.value.replace(/\D/g, "");
                  if (input.length <= 10) {
                    handleChange({ target: { name: "phone", value: input } });
                  }
                }}
                className="w-full px-2 py-2 text-md focus:outline-none"
                placeholder="Enter 10-digit number"
              />
            </div>
          </div>

          {/* WhatsApp Input with +91 prefix */}
          <div className="md:col-span-6">
            <label className="block font-medium text-gray-700 mb-1">WhatsApp</label>
            <div className="flex border border-gray-300 rounded-md overflow-hidden items-center  w-[320px]">
              <span className="text-gray-700 text-md px-[9px] border-r border-gray-300">+91</span>
              <input
                type="tel"
                name="wp_number"
                maxLength={10}
                value={formData.wp_number}
                onChange={(e) => {
                  const input = e.target.value.replace(/\D/g, "");
                  if (input.length <= 10) {
                    handleChange({ target: { name: "wp_number", value: input } });
                  }
                }}
                className="w-full px-2 py-2 text-md focus:outline-none"
                placeholder="Enter 10-digit number"
              />
            </div>
          </div>

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

          {existingPhotos.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">Existing Photos</label>
              <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-4">
                {existingPhotos.map((url, idx) => (
                  <div key={idx} className="relative group w-28 h-28">
                    <img src={url} alt={`existing-photo-${idx}`} className="object-cover w-full h-full rounded border border-gray-200" />
                    <button type="button" onClick={() => handleDeleteExistingPhoto(idx)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition" aria-label="Delete existing photo">
                      <MdDelete size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Add New Photos (max total 2)</label>
            <input type="file" name="photos" accept="image/*" multiple onChange={handleChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            {selectedPhotos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 max-h-48 overflow-auto">
                {selectedPhotos.map((file, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded overflow-hidden border border-gray-300">
                    <img src={file.preview} alt={`preview-${idx}`} className="object-cover w-full h-full" />
                    <button type="button" onClick={() => handleDeletePhoto(idx)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full" aria-label="Delete selected photo">
                      <MdDelete size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="block w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition">
            Update Business
          </button>
        </form>
      </div>
    </div>
  );
}
