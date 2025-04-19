"use client";

import React from "react";

export default function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`text-white font-semibold px-4 py-2 rounded-lg transition duration-200 ease-in-out ${className}`}
    >
      {children}
    </button>
  );
}
