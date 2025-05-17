"use client";

import React, { useState } from 'react'
import { BsClockHistory } from 'react-icons/bs'
import { MdArrowDropDown } from 'react-icons/md'

export default function Info({business, hours}) {
  const [showHours, setShowHours] = useState(false);

  return (
    <div className="mb-8">
    <p className="text-lg font-semibold text-gray-800">
      <strong>Price Range:</strong> <span className="text-blue-700">{business.priceRange}</span>
    </p>
  
    <div
      onClick={() => setShowHours(!showHours)}
      className="flex items-center gap-2 mt-3 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
    >
      <BsClockHistory className="text-xl" />
      <span className="font-medium text-md">Hours</span>
      <MdArrowDropDown
        className={`text-2xl transition-transform duration-200 ${
          showHours ? "rotate-180" : ""
        }`}
      />
    </div>
  
    {showHours && business.timings?.length > 0 && (
      <div className="ml-6 mt-3 space-y-1 text-sm text-gray-700">
        {business.timings.map((t, i) => (
          <p key={i} className="flex gap-2">
            <span className="w-24 font-medium text-gray-800">{t.day}:</span>
            <span>{t.openTime} - {t.closeTime}</span>
          </p>
        ))}
      </div>
    )}
  </div>
  
  )
}
