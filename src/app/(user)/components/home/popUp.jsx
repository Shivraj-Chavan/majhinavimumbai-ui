"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { apiPost, apiPut } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { login as reduxLogin } from '@/redux/slice/userSlice';
import ProfileCompletionPopup from "./profileCompletion";
import { toast } from "react-toastify";

export default function PopUp({ showModal, setShowModal, authPurpose }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [useremail, setEmail] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [profileErrors, setProfileErrors] = useState({});
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);


  const otpInputRef = useRef(null);

  const Spinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-white inline-block ml-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      ></path>
    </svg>
  );
  

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
    const value = e.target.value;
  
    // Allow only letters and spaces
    const regex = /^[a-zA-Z\s]*$/;
  
    if (regex.test(value)) {
      setName(value);
      setErrors((prev) => ({ ...prev, name: "" }));
    } else {
      setErrors((prev) => ({ ...prev, name: "Only letters and spaces are allowed." }));
    }
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
    return "OTP verification failed. Please try again.";
  };

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setErrors({ phone: "Phone number must be 10 digits" });
      return;
    }
      let errorMap = {};
    
      if (Object.keys(errorMap).length > 0) {
        setErrors(errorMap);
        return;
      }
    
      setErrors({});
      setStatusMessage({});
      setIsSendingOtp(true);
    
    try {
      const response = await apiPost("/otp/send", {name:"", phone });
      console.log("OTP Sent Response:", response.data);
      setStatusMessage({ type: "success", message: "OTP sent successfully via Phone!" });
      setCountdown(30);
      setOtpSent(true);
    } catch (error) {
      console.error("OTP Send Error:", error);
      const backendMsg = error?.response?.data?.msg || error.msg;
      setStatusMessage({
        type: "error",
        // message: error.response?.data?.message || "Failed to send OTP.",
        message: backendMsg || "Failed to send OTP.",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
   
    if (!otp || otp.length !== 6) newErrors.otp = "OTP must be 6 digits";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsVerifyingOtp(true); // <--- add before try

    try {
      const data = await apiPost("otp/verify", { name:"", phone: phone, otp: otp });
      console.log("Verifying OTP:", { phone, otp });
      console.log("OTP Verify Full Response:", data);

       // Extract token and role from the response
      // const { token, role } = data;
      // const user = response?.data?.user;

      const { token, role, isNewUser, name: backendName ,userEmail } = data;
      console.log("Extracted Role:", role);
      setEmail(userEmail)

      // Create a minimal user object yourself if needed
      const user = { name:"", phone };

      if (!token) throw new Error("Token not found in response");

       // Store token, role, and OTP verification status in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("authRole", role);
      // Redux login
      dispatch(reduxLogin({ user, token }));
      
      setStatusMessage({ type: "success", message: "OTP verified successfully!" });
      toast.success("Logged In successfully!");
     // Clear form fields
    setPhone("");
    setOtp("");
    setOtpSent(false);
    setCountdown(0);

    // Close OTP modal first
    // setShowModal(false);

     // Close OTP modal before deciding what to show
     
     // Decide what to do next
     if (isNewUser || !backendName || backendName.trim() === "") {
      // setShowModal(false);     
      setShowProfileCompletion(true);    
          
      } else {
        setShowProfileCompletion(false);
        setShowModal(false);
        // setShowProfileCompletion(false);
        // EXISTING USER → redirect based on role/authPurpose
        if (role === "admin") router.push("/admin");
        else if (role === "user") router.push("/");
        else if (authPurpose === "business") router.push("/businessRegister");
        else router.push("/");
      }
    

    } catch (error) {
      console.error("OTP Verify Error:", error);
      const backendMsg = error?.response?.data?.msg || error.msg;
      setStatusMessage({
        type: "error",
        // message: error?.response?.data?.message || error.message || "OTP verification failed.",
        message: backendMsg || "OTP verification failed.",
      });
      setOtp("");
    } finally {
      setIsVerifyingOtp(false);
    }
    
  };

  const handleProfileSubmit = async (e, formData) => {
    e.preventDefault();
    console.log("handleProfileSubmit triggered", formData);
  
    // Validation directly on formData
    let errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
  
    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;
  
    try {
      setIsSubmittingProfile(true);
  
      // Make API call with formData
      const response = await apiPut("/users/profile", formData);
  
      console.log("Backend response:", response.data);
  
      //  Success message
      // toast.success("Profile completed successfully!");
  
      //  Close the popup
      setShowProfileCompletion(false);
      setShowModal(false);
  
      //  Redirect to homepage after profile update
      router.push("/");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmittingProfile(false);
    }
  };
    

  return (
    showModal && (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-white/20 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-11/12 max-w-md relative">
  
          {/* Close Button */}
          <button
            onClick={() => {
              setShowModal(false);
              setShowProfileCompletion(false);
            }}
            className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-orange-600 font-bold cursor-pointer"
          >
            &times;
          </button>
  
          {/* If profile completion needed, show popup instead of OTP */}
          {showProfileCompletion ? (
            <ProfileCompletionPopup
              profileData={profileData}
              setProfileData={setProfileData}
              profileErrors={profileErrors}
              setProfileErrors={setProfileErrors}
              onSubmit={handleProfileSubmit}
              initialData={{ name: "", email:useremail|| "" }}
              onUpdated={(updatedData) => {
                console.log("Profile updated successfully:", updatedData);
              }}
            />
          ) : (
            <>
              <p className="italic text-lg text-center font-bold text-blue-700">Welcome</p>
              <h1 className="text-2xl font-semibold mb-4 text-center">Verify Your Phone Number</h1>
  
              {/* Status Message */}
              {statusMessage.message && (
                <div
                  className={`text-center text-sm font-medium mb-4 px-4 py-2 rounded ${
                    statusMessage.type === "success"
                      ? "text-green-600 bg-green-100"
                      : "text-red-600 bg-red-100"
                  }`}
                >
                  {statusMessage.message}
                </div>
              )}
  
              {/* OTP Form */}
              <form className="space-y-6 mt-5" onSubmit={handleSubmit}>
                {/* Phone Number Input */}
                <div>
                  <label className="block text-lg font-medium">Phone Number</label>
                  <div
                    className={`flex items-center mt-2 border cursor-pointer ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-lg overflow-hidden w-full focus-within:ring-2 focus-within:ring-orange-500`}
                  >
                    <span className="px-3 text-gray-500 border-r border-gray-300 bg-white">+91</span>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 outline-none cursor-pointer"
                      value={phone}
                      onChange={handlePhoneChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && phone.length === 10 && !otpSent) {
                          e.preventDefault();
                          handleSendOtp();
                        }
                      }}
                      placeholder="Enter Your Phone Number"
                    />
                    {phone.length === 10 && <FaCheckCircle className="text-green-500 mx-2" />}
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
  
                {/* Send OTP */}
                {phone.length === 10 && !otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && phone.length === 10 && !otpSent) {
                        e.preventDefault();
                        handleSendOtp();
                      }
                    }}
                    className={`w-full text-white py-2 rounded-md transition ${
                      phone.length === 10 && !otpSent
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                    disabled={phone.length !== 10 || otpSent}
                  >
                    Send OTP
                  </button>
                )}
  
                {/* OTP Field + Verify Button */}
                {otpSent && (
                  <>
                    <div>
                      <label className="block text-lg font-medium">OTP</label>
                      <input
                        type="text"
                        ref={otpInputRef}
                        value={otp}
                        onChange={handleOtpChange}
                        className={`w-full mt-2 px-4 py-2 border cursor-pointer ${
                          errors.otp ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:ring-2 focus:ring-orange-500 outline-none`}
                        placeholder="Enter Your OTP"
                      />
                      {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                    </div>
  
                    <button
                      type="submit"
                      className={`w-full py-2 rounded-md transition text-white ${
                        isVerifyingOtp
                          ? "bg-orange-400 cursor-not-allowed"
                          : "bg-orange-500 hover:bg-orange-600"
                      }`}
                      disabled={isVerifyingOtp}
                    >
                      {isVerifyingOtp ? <>Verifying <Spinner /></> : "Submit"}
                    </button>
  
                    {/* Resend OTP */}
                    <div className="text-right mt-2">
                      {countdown > 0 ? (
                        <p className="text-sm text-gray-600">
                          Resend OTP in{" "}
                          <span className="font-medium text-orange-600">{countdown}s</span>
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
            </>
          )}
        </div>
      </div>
    )
  );
}