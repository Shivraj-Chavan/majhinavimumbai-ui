"use client";

import { apiPost } from '@/lib/apiClient';
import React, { useState } from 'react';
import { IoMdContact } from "react-icons/io";
import { toast } from 'react-toastify';

export default function PopUp({ showContact, setShowContact }) {
  const [formData, setFormData] = useState({
    companyName: '',
    username: '',
    phone: '',
    enquiry: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue = name === "phone" ? value.replace(/\D/g, '') : value;
    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
  };

  const validateForm = () => {
    const { companyName, username, phone, enquiry } = formData;
    if (!companyName || !username || !phone || !enquiry) {
      toast.error("All fields are required.");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await apiPost('/contact/contact', formData);
      toast.success("Submitted successfully!");
      setFormData({ companyName: '', username: '', phone: '', enquiry: '' });
      setShowContact(false);
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    }
  };

  if (!showContact) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm overflow-y-auto px-4 py-8">
      <div className="relative bg-white mt-12 w-full max-w-lg rounded-xl shadow-xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={() => setShowContact(false)}
          className="absolute top-3 right-4 text-3xl text-gray-500 hover:text-orange-600 font-bold"
        >
          &times;
        </button>

        {/* Heading */}
        <h1 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2 text-orange-600">
          <IoMdContact className="text-3xl" />
          Contact Us
        </h1>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Company Name */}
          <div>
            <label className="block text-base font-medium mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company*"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {/* User Name */}
          <div>
            <label className="block text-base font-medium mb-1">Your Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username*"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-base font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone*"
              maxLength="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {/* Enquiry */}
          <div>
            <label className="block text-base font-medium mb-1">Enquiry</label>
            <textarea
              name="enquiry"
              value={formData.enquiry}
              onChange={handleChange}
              placeholder="Your message*"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-medium py-2 rounded-lg transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
