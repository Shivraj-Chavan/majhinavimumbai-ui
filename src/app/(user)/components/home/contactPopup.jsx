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
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const { name, value } = e.target;

    // For phone input
    if (name === "phone") {
      // Remove non-digit characters
      const cleanedValue = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: cleanedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

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
      console.log('contact:', formData);
      toast.success("Submitted successfully");
      setFormData({ companyName: '', username: '', phone: '', enquiry: '' });
      setShowContact(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!showContact) return null;

  return (
    <div>
      {showContact && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-white/20 backdrop-blur-sm overflow-y-auto px-4 py-8 ">
          <div className="relative bg-white mt-10 rounded-lg shadow-lg w-full max-w-lg p-6 sm:p-8 ">
            
            <button 
              onClick={() => setShowContact(false)} 
              className="absolute top-3 right-4 text-3xl text-gray-500 hover:text-orange-600 font-bold"
            >
              &times; 
            </button>

            <h1 className="text-2xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
              <IoMdContact className="text-3xl" /> Contact Us
            </h1>

            <form className="space-y-6 mt-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-lg font-medium">Company Name</label>
                <div className="flex items-center mt-2 border border-gray-300 rounded-lg overflow-hidden w-full">
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-4 py-2" placeholder="Company*" required/>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium">Your Name</label>
                <div className="flex items-center mt-2 border border-gray-300 rounded-lg overflow-hidden w-full">
                  <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2" placeholder="Username*" required/>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium">Phone Number</label>
                <input  type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md" placeholder="Phone*" maxLength='10' required/>
              </div>

              <div>
                <label className="block text-lg font-medium">Enquiry</label>
                <textarea name="enquiry" value={formData.enquiry} onChange={handleChange} className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md" placeholder="Enquiry*" rows="4" required/>
              </div>

              <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"> Submit </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
