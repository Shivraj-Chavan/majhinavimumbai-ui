"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { apiPost } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { login as reduxLogin } from '@/redux/slice/userSlice';
import { handleLoginSuccess } from "../navbar/Navbar";

export default function PopUp({ showModal, setShowModal, authPurpose }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const otpInputRef = useRef(null);

// Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);
// Auto-focus OTP field
  useEffect(() => {
    if (otpSent && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [otpSent]);
 // Auto-clear status message
  useEffect(() => {
    if (statusMessage.message) {
      const timer = setTimeout(() => setStatusMessage({ type: "", message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setErrors((prev) => ({ ...prev, name: "" }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setOtp(value);
      setErrors((prev) => ({ ...prev, otp: "" }));
    }
  };

  const getFriendlyMessage = (msg) => {
    const lower = msg?.toLowerCase();
    if (!lower) return "Something went wrong. Please try again.";

    if (lower.includes("invalid otp")) return "The OTP entered is incorrect.";
    if (lower.includes("expired")) return "OTP has expired. Please request a new one.";
    if (lower.includes("too many attempts")) return "Too many attempts. Try again after some time.";
    if (lower.includes("already verified")) return "Your number is already verified.";
    if (lower.includes("wait")) return "Please wait before requesting a new OTP.";
    if (lower.includes("not registered")) return "This number is not registered.";
    if (lower.includes("too many requests")) return "Too many requests. Try again later.";
    if (lower.includes("token not found")) return "Authentication failed. Please try again.";
    if (lower.includes("invalid phone")) return "Please enter a valid 10-digit phone number.";

    return "OTP verification failed. Please try again.";
  };

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setErrors({ phone: "Phone number must be 10 digits" });
      return;
    }
    setErrors({});
    setStatusMessage({});
    setIsSendingOtp(true);
    
    try {
      const response = await apiPost("/otp/send", { phone });
      console.log("OTP Sent Response:", response.data);
      setStatusMessage({ type: "success", message: "OTP sent successfully!" });
      setCountdown(30);
      setOtpSent(true);
    } catch (error) {
      console.error("OTP Send Error:", error);
      const backendMsg = error?.response?.data?.message || error.message;
      setStatusMessage({
        type: "error",
        // message: error.response?.data?.message || "Failed to send OTP.",
        message: getFriendlyMessage(backendMsg),
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (phone.length !== 10) newErrors.phone = "Phone number must be 10 digits";
    if (!otp || otp.length !== 6) newErrors.otp = "OTP must be 6 digits";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const data = await apiPost("otp/verify", { name: name, phone: phone, otp: otp });
      console.log("Verifying OTP:", {name, phone, otp });
      console.log("OTP Verify Full Response:", data);

       // Extract token and role from the response
      // const { token, role } = data;
      // const user = response?.data?.user;

      const { token, role } = data;
      console.log("Extracted Role:", role);

      // Create a minimal user object yourself if needed
      const user = { name, phone };

      if (!token) throw new Error("Token not found in response");

       // Store token, role, and OTP verification status in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("authRole", role);
      // localStorage.setItem("authUser", JSON.stringify(user));
      // localStorage.setItem("otpVerified", "true");

      // Redux login
      dispatch(reduxLogin({ user, token }));
      
      // handleLoginSuccess(user, token); // Callback to parent (like Navbar)
      setStatusMessage({ type: "success", message: "OTP verified successfully!" });
     // Clear form and close modal 
      setTimeout(() => {
        setPhone("");
        setOtp("");
        setOtpSent(false);
        setCountdown(0);
        setStatusMessage({ type: "", message: "" });
        console.log("Redirecting based on role:", role);
        setShowModal(false);

        if (role === "admin") {
          console.log("Going to /admin");
          router.push("/admin");
        } else if (role === "user") {
          router.push("/");
        } else {
          if (authPurpose === "business") {
            router.push("/businessRegister");
          } else {
            router.push("/"); 
          }
        }
    }, 1000);

    } catch (error) {
      console.error("OTP Verify Error:", error);
      const backendMsg = error?.response?.data?.message || error.message;
      setStatusMessage({
        type: "error",
        // message: error?.response?.data?.message || error.message || "OTP verification failed.",
        message: getFriendlyMessage(backendMsg),
      });
      setOtp("");
    }
  };

  return (
    showModal && (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-white/20 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-11/12 max-w-md relative">
          
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-orange-600 font-bold"
          >
            &times;
          </button>

          <p className="italic text-lg text-center font-bold text-blue-700">Welcome</p>
          <h1 className="text-2xl font-semibold mb-4 text-center">Verify Your Number</h1>

         {/* Status Message */}
          {statusMessage.message && (
            <div className={`text-center text-sm font-medium mb-4 px-4 py-2 rounded ${
                statusMessage.type === "success" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
              }`}>
              {statusMessage.message}
            </div>
          )}

          <form className="space-y-6 mt-5" onSubmit={handleSubmit}>
          <div>
              <label className="block text-lg font-medium">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
                className={`w-full mt-2 px-4 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md focus:ring-2 focus:ring-orange-500 outline-none`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-lg font-medium">Phone Number</label>
              <div className={`flex items-center mt-2 border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } rounded-lg overflow-hidden w-full focus-within:ring-2 focus-within:ring-orange-500`}>
                <span className="px-3 text-gray-500 border-r border-gray-300 bg-white">+91</span>
                <input
                  type="tel"
                  className="w-full px-4 py-2 outline-none"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter Your Phone Number"
                />
                {phone.length === 10 && <FaCheckCircle className="text-green-500 mx-2" />}
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Send OTP Button */}
            {phone.length === 10 && !otpSent && (
              <button
                type="button"
                onClick={handleSendOtp}
                className={`w-full text-white py-2 rounded-md transition ${
                  phone.length === 10 && !otpSent ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={phone.length !== 10 || otpSent}
              >
                Send OTP
              </button>
            )}

            {otpSent && (
              <>
                <div>
                  <label className="block text-lg font-medium">OTP</label>
                  <input
                    type="text"
                    ref={otpInputRef}
                    value={otp}
                    onChange={handleOtpChange}
                    className={`w-full mt-2 px-4 py-2 border ${
                      errors.otp ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:ring-2 focus:ring-orange-500 outline-none`}
                    placeholder="Enter Your OTP"
                  />
                  {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition"
                >
                  Submit
                </button>

                    {/* Resend OTP */}
                <div className="text-right mt-2">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-600">
                      Resend OTP in <span className="font-medium text-orange-600">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-md text-blue-700 underline hover:text-blue-500 hover:font-semibold"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    )
  );
}
