"use client";

import { useEffect, useState } from "react";
import Input from "../businessRegistercomp/Input";
import TextEditor from "./TextEditor";
import { apiGet, apiPut } from "@/lib/apiClient";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditBusinessPopup({ business, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    timing: "",
    website: "",
    contactNumber: "",
    whatsappNumber: "",
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
    (async () => {
      try {
        const userRes = await apiGet("/users/me");
        setCurrentUser(userRes);
      } catch (err) {
        toast.error("Failed to fetch user");
      }
    })();
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
        contactNumber: business.contactNumber || "",
        wp_number: business.wp_number || "",
        timing: business.timing || "",
        address: business.address || "",
        area: business.area || "",
        sector: business.sector || "",
        landmark: business.landmark || "",
        pin_code:business.pin_code || "",

      });

      const fullPhotoUrls = (business.images || []).map((image) =>
        image.url.startsWith("http") ? image.url : `http://69.62.84.113:5005${image.url}`
      );
      setExistingPhotos(fullPhotoUrls);
      setSelectedPhotos([]);
    }
  }, [business]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && name === "photos") {
      const newFiles = Array.from(files).map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

      if (existingPhotos.length + selectedPhotos.length + newFiles.length > 2) {
        toast.error("Max 2 photos allowed (existing + new)");
        newFiles.forEach((file) => URL.revokeObjectURL(file.preview));
        return;
      }

      setSelectedPhotos((prev) => [...prev, ...newFiles]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Delete Selected or Existing Photos
  const handleDeletePhoto = (index) => {URL.revokeObjectURL(selectedPhotos[index].preview);
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingPhoto = async (index) => {
    if (!window.confirm("Delete this photo?")) return;

    try {
      const photoToDelete = existingPhotos[index];
      const token = localStorage.getItem("token");

      await axios.delete(`http://69.62.84.113:5005/businesses/${business.id}/photos`, {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("User not loaded yet");
      return;
    }

    try {
      const payload = {
        owner_id: business.owner_id,
        name: formData.name,
        description: formData.description,
        hours: formData.timing,
        website: formData.website,
        phone: formData.contactNumber,
        wp_number: formData.whatsappNumber,
        area: formData.area,
        category_id: business.category_id,
        subcategory_id: business.subcategory_id,
        landmark: business.landmark,
        sector: business.sector,
        address: business.address,
        pin_code: business.pin_code,
        wp_number: business.wp_number,
      };
      console.log("Payload being submitted:", payload)

      const isAdmin = currentUser.role === "admin";
      const endpoint = isAdmin ? `/businesses/${business.id}` : `/businesses/update/${business.id}`;
      console.log(`Sending ${isAdmin ? "ADMIN" : "OWNER"} update to: ${endpoint}`);
      alert('Business data submitted successfully')
      await apiPut(endpoint, payload);
      console.log("Business data submitted successfully");

      if (selectedPhotos.length > 0) {
        const formPhotos = new FormData();
        selectedPhotos.forEach((file) => formPhotos.append("photos", file));
        formPhotos.append("user_id", business.owner_id);

        const token = localStorage.getItem("token");
        const photoUploadUrl = isAdmin ? `http://69.62.84.113:5005/businesses/${business.id}/photos` : `http://69.62.84.113:5005/businesses/update/${business.id}/photos`;
        console.log(`Uploading to: ${photoUploadUrl}`);

        await axios.post(photoUploadUrl, formPhotos, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      toast.success(isAdmin ? "Business updated" : "Edit submitted for approval");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
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
          <TextEditor label="Description" value={formData.description} onChange={(val) => setFormData((prev) => ({ ...prev, description: val }))} />
          <Input label="Hours" name="hours" type="text" value={formData.hours} onChange={handleChange} />
          <Input label="Website" name="website" value={formData.website} onChange={handleChange} />
          <div className="flex gap-4">
            <Input label="Contact" name="contactNumber" type="tel" value={formData.contactNumber} onChange={handleChange} />
            <Input label="WhatsApp" name="whatsappNumber" type="tel" value={formData.whatsappNumber} onChange={handleChange} />
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
