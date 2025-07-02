"use client";

import React, { useState } from 'react';
import { BsClockHistory } from 'react-icons/bs';
import { MdArrowDropDown } from 'react-icons/md';

export default function Info({ hours }) {
  const [showHours, setShowHours] = useState(false);

  return (
    <div className="mb-8">
      <div
        onClick={() => setShowHours(!showHours)}
        className="flex items-center gap-2 mt-3 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
      >
        <BsClockHistory className="text-xl" />
        <span className="font-medium text-md">Hours</span>
        <MdArrowDropDown
          className={`text-2xl transition-transform duration-200 ${showHours ? "rotate-180" : ""}`}
        />
      </div>

      {hours?.length > 0 ? (
      hours.map((t, i) => (
        <p key={i} className="flex gap-2">
          <span className="w-24 font-medium text-gray-800">{t?.day || "N/A"}:</span>
          <span>
            {t?.openTime && t?.closeTime ? `${t.openTime} - ${t.closeTime}` : "Closed"}
          </span>
        </p>
      ))
    ) : (
      <p className="ml-6 mt-3 text-sm text-gray-500">No timing data available.</p>
    )}

    </div>
  );
}
