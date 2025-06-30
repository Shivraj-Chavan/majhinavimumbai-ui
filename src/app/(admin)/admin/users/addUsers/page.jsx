"use client";

import { apiPost } from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function AddUserForm() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});

  // Show toast after reload if flagged
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("userCreated") === "true") {
      toast.success("User Created Successfully!");
      localStorage.removeItem("userCreated");
    }
  }, []);

  const validate = () => {
    const newErrors = {};

    // only 10 digits
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits (numbers only).";
    }

    // Email valid format
    if (formData.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await apiPost("/users/users", formData); 
      localStorage.setItem("userCreated", "true")
      toast.success('User Created Successfully!')
      window.location.reload();
      console.log("User created:", res);
    } catch (error) {
      toast.error("Failed to create user.");
      console.error("Error creating user:", error);
      setErrors({ api: "Failed to create user. Please try again." });
    }
  };

  return (
    <div className="mt-10 bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New User</h2>
      {errors.api && <p className="text-red-500 mb-2">{errors.api}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
      <ToastContainer position="top-right" autoClose={3000} />
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Name (optional)</label>
          <input
            type="text"
            name="name"
            className="w-full border px-4 py-2 rounded-md"
            placeholder="Enter name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number *</label>
          <input
            type="text"
            name="phone"
            className="w-full border px-4 py-2 rounded-md"
            placeholder="10-digit mobile"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Email (optional)</label>
          <input
            type="email"
            name="email"
            className="w-full border px-4 py-2 rounded-md"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
