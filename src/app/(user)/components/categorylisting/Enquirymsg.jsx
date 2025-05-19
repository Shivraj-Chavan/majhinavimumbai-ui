import React, { useState, useEffect } from 'react';
import PopUp from '../home/popUp';

export default function Enquirymsg() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [authPurpose, setAuthPurpose] = useState("login");

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccessMsg("Message sent successfully!");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="mt-10 bg-white rounded-xl shadow-xl p-6 max-w-2xl mx-auto">
      {isLoggedIn ? (
        <form onSubmit={handleMessageSubmit}>
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Enquiry</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Write your message or enquiry here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
          >
            {submitting ? "Sending..." : "Send Enquiry"}
          </button>

          {successMsg && <p className="text-green-600 mt-3">{successMsg}</p>}
        </form>
      ) : (
        <div className="text-center">
          <button
            onClick={() => setShowLoginPopup(true)}
            className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition"
          >
            Send Enquiry
          </button>
        </div>
      )}

      {/* Login Popup */}
      {showLoginPopup && (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">

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
      />
    </div>
  </div>
)}

    </div>
  );
}
