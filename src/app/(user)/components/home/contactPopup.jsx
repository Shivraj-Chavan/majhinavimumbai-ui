"use client";

import React from 'react';
import { IoMdContact } from "react-icons/io";

export default function PopUp({showContact, setShowContact}) {

  return (
    <div>
      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 mt-15 flex justify-center items-center bg-white/20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-11/12 max-w-md relative">

            {/* Close Button */}
            <button onClick={() => setShowContact(false)} className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-orange-600 font-bold" >
              &times;
            </button>

            <h1 className="text-2xl font-semibold mb-4 text-center flex items-center justify-center gap-2"><IoMdContact className="text-3xl" /> Contact Us</h1>

            {/* Contact Form */}
            <form className="space-y-6 mt-5 ">

            <div>
                <label className="block text-lg font-medium">Company Name</label>
                <div className="flex items-center mt-2 border border-gray-300 rounded-lg overflow-hidden w-full">
                <input type="name" className="w-full px-4 py-2" placeholder="Company*" />
              </div>
              </div>

            <div>
                <label className="block text-lg font-medium">Your Name</label>
                <div className="flex items-center mt-2 border border-gray-300 rounded-lg overflow-hidden w-full">
                <input type="name" className="w-full px-4 py-2" placeholder="Username*" />
              </div>
              </div>

              <div>
                <label className="block text-lg font-medium">Phone Number</label>
                <input type="email" className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md" placeholder="Phone*"/>
              </div>

              <div>
                <label className="block text-lg font-medium">Enquiry</label>
                <textarea type="text" className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md" placeholder="Enquiry*"/>
              </div>

              {/* Contact Button */}
              <button type="button" className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition">
                Submit
              </button>

            </form>
          </div>
        </div>
      )}

      </div>
  );
}
