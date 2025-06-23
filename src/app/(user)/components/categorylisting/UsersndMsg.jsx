'use client';

import React, { useState, useEffect } from 'react';
import { VscFeedback } from "react-icons/vsc";
import PopUp from '../home/popUp';
import { apiPost } from '@/lib/apiClient';
import Star from '@/app/(user)/components/categorylisting/Star'
import { toast } from 'react-toastify';

export default function UsersndMsg({ setReviews ,businessId}) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [authPurpose] = useState("login");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginSuccess = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setShowLoginPopup(false);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
  
    setSubmitting(true);
    try {
      const response = await apiPost('/reviews', {
        rating,
        comment: message,
        business_id:businessId,
      });
      console.log(response);
  
      // Update reviews list immediately
      setReviews(prev => [
        {
          user: "You", 
          avatar: "/image.png", 
          rating,
          comment: message,
          date: new Date().toISOString()
        },
        ...prev
      ]);
  
      setMessage('');
      toast.success("Feedback sent successfully!")
      // setSuccessMsg('Message sent successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Failed to send review:', error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleFeedbackClick = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
    }
  };

  const handleCancel = () => {
    setMessage(""); 
  };

  return (
    <>
    {isLoggedIn ? (
      <div className="mt-10 bg-white rounded-xl shadow-xl p-6 max-w-2xl mx-auto">
        <form onSubmit={handleMessageSubmit}>
          <Star rating={rating} setRating={setRating} />
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Feedback</h2>
  
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Write your feedback here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
  
          <div className="mt-4 flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
            >
              {submitting ? "Sending..." : "Send Feedback"}
            </button>
  
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
  
          {successMsg && <p className="text-green-600 mt-3">{successMsg}</p>}
        </form>
      </div>
    ) : (
      <div className="text-center mt-10">
        <button
          onClick={handleFeedbackClick}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-lg transition-all hover:scale-105"
        >
          <VscFeedback className="text-lg" />
          Feedback
        </button>
      </div>
    )}
  
    {showLoginPopup && (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-white/20 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-xl max-w-sm w-full relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl font-bold"
            onClick={() => setShowLoginPopup(false)}
          >
            &times;
          </button>
          <h3 className="text-lg font-bold mb-4">Login Required</h3>
          <PopUp
            showModal={showLoginPopup}
            setShowModal={setShowLoginPopup}
            authPurpose={authPurpose}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      </div>
    )}
  </>
  
  );
}
