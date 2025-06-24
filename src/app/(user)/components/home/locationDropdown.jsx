"use client";

import React from "react";
import { CiLocationArrow1 } from "react-icons/ci";

const locations = ["Navi Mumbai", "Panvel","Nerul","Taloja","Ulwe","Koparkhairne","Seawoods","Juinagar","Sanpada","Thane", "Kharghar", "Kamothe", "Vashi", "Airoli","Mansarovar","Khandeshwar","Belapur"];

export default function LocationDropdown({ location, setLocation, showDropdown, setShowDropdown, dropdownRef }) {
  return (
    <div ref={dropdownRef} className="relative"  >
      <div style={{width:"160px",}}
        className="text-sm flex outline-none items-center bg-white px-3 py-2.5 rounded-l-lg  cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <CiLocationArrow1 className="text-gray-500 text-xl mr-2" />
        <span>{location}</span>
      </div>

      {showDropdown && (
        <ul className="absolute left-0 top-10 w-full bg-white  rounded-md shadow-lg z-10">
          {locations.map((city, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
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
