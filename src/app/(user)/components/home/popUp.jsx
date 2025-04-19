"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";

export default function PopUp({ showModal, setShowModal }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });

  // Countdown logic
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-hide status messages
  useEffect(() => {
    if (statusMessage.message) {
      const timer = setTimeout(() => setStatusMessage({ type: "", message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setOtp(value);
      setErrors((prev) => ({ ...prev, otp: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (phone.length !== 10) newErrors.phone = "Phone number must be 10 digits";
    if (phone.length >= 5 && otp.length !== 4) newErrors.otp = "OTP must be 4 digits";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await axios.post("http://185.230.64.102:5000/api/otp/verify", {
        phone, otp,
       });
      setStatusMessage({ type: "success", message: "OTP verified successfully!" });
      setTimeout(() => {
        setPhone("");
        setOtp("");
        setOtpSent(false);
        setCountdown(0);
        setShowModal(false);
        setStatusMessage({ type: "", message: "" });
      }, 1500);
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error?.response?.data?.message || "OTP verification failed.",
      });
      setOtp("");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post("http://185.230.64.102:5000/api/otp/send", {
        phone,
      });
      console.log(response);
      setStatusMessage({ type: "success", message: "OTP sent successfully!" });
      setCountdown(30);
      setOtpSent(true);
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error.response?.data?.message || "Failed to send OTP.",
      });
      setOtp("");
    }
  };

  return (
    showModal && (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-white/20 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-11/12 max-w-md relative">
          {/* Close Button */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-orange-600 font-bold"
          >
            &times;
          </button>

          <p className="italic text-lg text-center font-bold text-blue-700">Welcome</p>
          <h1 className="text-2xl font-semibold mb-4 text-center">Verify your Number</h1>

          {/* Status Message */}
          {statusMessage.message && (
            <div
              className={`text-center text-sm font-medium mb-4 px-4 py-2 rounded ${
                statusMessage.type === "success" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100" }`}>
              {statusMessage.message}
            </div>
          )}

          <form className="space-y-6 mt-5" onSubmit={handleSubmit}>
            {/* Phone Number */}
            <div>
              <label className="block text-lg font-medium">Phone Number</label>
              <div
                className={`flex items-center mt-2 border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } rounded-lg overflow-hidden w-full focus-within:ring-2 focus-within:ring-orange-500`}
              >
                <span className="px-3 text-gray-500 border-r border-gray-300 bg-white">+91</span>
                <input
                  type="tel"
                  className="w-full px-4 py-2 outline-none"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter your Phone Number"
                />
                {phone.length === 10 && <FaCheckCircle className="text-green-500 mx-2" />}
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* OTP input shows after 5 digits */}
            {phone.length >= 5 && (
              <div>
                <label className="block text-lg font-medium">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  className={`w-full mt-2 px-4 py-2 border ${
                    errors.otp ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-orange-500 outline-none`}
                  placeholder="Enter your OTP"
                />
                {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
            >
              Submit
            </button>

            {/* Resend OTP */}
            {phone.length >= 5 && (
              <div className="text-right mt-2">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-600">
                    Resend OTP in{" "}
                    <span className="font-medium text-orange-600">{countdown}s</span>
                  </p>
                ) : (
                  <button type="button" onClick={handleResendOtp} className="text-md text-blue-700 underline hover:text-blue-500 hover:font-semibold" >
                    Resend OTP
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    )
  );
}
