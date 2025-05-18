import React from "react";
import { FcApproval, FcFilledFilter, FcFlashOn, FcHighPriority, FcRating } from "react-icons/fc";

export default function FilterBar() {
  const dropdownArrow = (
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
      <svg
        className="w-4 h-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  const dropdownClass ="appearance-none border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] pr-10";

  return (
    <div className="flex flex-wrap gap-3  justify-center items-center sm:justify-start mb-8 overflow-x-visible pb-2 scrollbar-hide">
      {/* Sort By */}
      {/* <div className="relative">
        <select className={dropdownClass}>
          <option>Sort by</option>
          <option>Top Rated</option>
          <option>Most Reviewed</option>
          <option>Newest</option>
        </select>
        {dropdownArrow}
      </div> */}

      {/* Top Rated */}
      {/* <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full border border-blue-500 text-blue-500 hover:bg-blue-100 transition">
        <FcRating className="text-lg" />
        Top Rated
      </button> */}

      {/* Ratings */}
      {/* <div className="relative">
        <select className={dropdownClass + " min-w-[130px]"}>
          <option>Ratings</option>
          <option>4.5+ Stars</option>
          <option>4.0+ Stars</option>
          <option>3.5+ Stars</option>
        </select>
        {dropdownArrow}
      </div> */}

      {/* All Filters */}
      <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-600 text-gray-800 hover:bg-gray-200 transition">
        <FcFilledFilter className="text-lg" />
         Filters
      </button>
    </div>
  );
}