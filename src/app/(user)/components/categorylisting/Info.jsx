"use client";

import React, { useState } from 'react'
import { BsClockHistory } from 'react-icons/bs'
import { MdArrowDropDown } from 'react-icons/md'

export default function Info({business, hours}) {
  const [showHours, setShowHours] = useState(false);

  return (
    <div className="mb-8">
        <p> <strong>Price Range:</strong> {business.priceRange} </p>

        <div onClick={() => setShowHours(!showHours)} className="flex items-center gap-2 mt-2 cursor-pointer">
          <BsClockHistory className="text-blue-500" />
          <span className="font-medium">Hours</span>
          <MdArrowDropDown className={`transition ${showHours ? "rotate-180" : ""}`}/>
        </div>
        {showHours && (
          <div className="ml-6 mt-2 text-sm text-gray-700">
            {Object.entries(hours).map(([day, time]) => (
              <p key={day}> <strong>{day}:</strong> {time} </p>
            ))}
          </div>
        )}
      </div>
  )
}
