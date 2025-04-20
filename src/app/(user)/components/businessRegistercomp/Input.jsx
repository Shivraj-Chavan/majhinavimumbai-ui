import React from 'react'

export default function Input({label, type }) {
  return (
        <div>
          <label className="font-semibold text-gray-700 font-opensans">{label}</label>
          <input
            type={type || "text"}
            required
            placeholder={`${label}*`}
            className="p-2 w-full mt-1 px-4 py-2 border font-opensans border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      );
}
