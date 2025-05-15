import React, { useState } from 'react'

export default function UsersndMsg() {
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const handleMessageSubmit=()=>{}
  return (
    <div className="mt-10 bg-white rounded-xl shadow p-6 max-w-2xl mx-auto">
    <h2 className="text-xl font-semibold mb-4 text-blue-800">Send an Enquiry</h2>
    <form onSubmit={handleMessageSubmit}>
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
        {submitting ? "Sending..." : "Send Message"}
      </button>
  
      {successMsg && <p className="text-green-600 mt-3">{successMsg}</p>}
    </form>
  </div>
  
  )
}
