"use client";

import React from 'react';
import Button from '../form/Button';

export default function PopUp({showModal, setShowModal}) {

  return (
    <div>
     
      {/* Login Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-white/20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-11/12 max-w-md relative">

            {/* Close Button */}
            <Button onClick={() => setShowModal(false)} className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-orange-600 " >
              &times;
            </Button>

            <p className='italic text-lg text-center font-bold text-blue-700'>Welcome</p>

            <h1 className="text-2xl font-semibold mb-4 text-center">Verify your Number</h1>

            {/* Login Form */}
            <form className="space-y-6 mt-5 ">

            <div>
                <label className="block text-lg font-medium">Phone Number</label>
                <div className="flex items-center mt-2 border border-gray-300 rounded-lg overflow-hidden w-full">
                <span className="px-3 text-gray-500 border-r border-gray-300 bg-white">+91</span>
                <input type="tel" className="w-full px-4 py-2" placeholder="Enter your Phone Number" />
              </div>
              </div>

              <div>
                <label className="block text-lg font-medium">OTP</label>
                <input type="number" className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md" placeholder="Enter your OTP"/>
              </div>

              {/* Login Button */}
              <Button  className="w-full bg-orange-500 text-white rounded-md hover:bg-orange-600 "> Submit </Button>

              {/* Forgot Password */}
              <div className="text-right mt-2">
                <Button onClick={() => alert("OTP resent")} className="text-sm text-blue-600 underline hover:text-blue-800"> Resend OTP </Button>
              </div>

            </form>
          </div>
        </div>
      )}

      </div>
  );
}
