"use client";

import React from "react";
import { CiLocationArrow1 } from "react-icons/ci";

const nodeNames = [
  "Airoli Node",
  "Ghansoli Node",
  "Kopar Khairane Node",
  "Vashi – Sanpada – Turbhe",
  "Nerul Node",
  "Seawoods – CBD Belapur",
  "Kharghar Node",
  "Kamothe – Kalamboli",
  "Taloja Node",
  "Panvel Region",
  "Ulwe Node",
  "Dronagiri Node (JNPT belt)",
  "Uran Town & Surrounding Villages"
];

export default function LocationDropdown({ location, setLocation, showDropdown, setShowDropdown, dropdownRef }) {
  return (
    <div ref={dropdownRef} className="relative">
      <div
        style={{ width: "160px" }}
        className="text-sm flex outline-none items-center bg-white px-3 py-0 rounded-l-lg cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <CiLocationArrow1 className="text-gray-500 text-xl mr-2" />
        <span>{location || "Select Location"}</span>
      </div>

      {showDropdown && (
        <ul className="absolute left-0 top-10 w-full bg-white rounded-md z-10 mt-[-34px] md:mt-[-5] max-h-48 overflow-y-auto shadow-lg">
          {/* Default option */}
          <li
            className="px-3 py-1 hover:bg-gray-200 cursor-pointer text-gray-500 italic"
            onClick={() => {
              setLocation("");
              setShowDropdown(false);
            }}
          >
            - Select Location -
          </li>

          {/* List of nodes */}
          {nodeNames?.map((city, index) => (
            <li
              key={index}
              className="px-3 py-1 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                setLocation(city);
                setShowDropdown(false);
              }}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
