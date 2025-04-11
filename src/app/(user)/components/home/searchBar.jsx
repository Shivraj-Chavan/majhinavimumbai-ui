"use client";

import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import Button from "../form/Button";

export default React.memo(function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className=" flex justify-center rounded-r-lg w-full ">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for services..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="outline-none px-3 py-5 h-5 w-4/4 bg-white text-gray-700"
      />

      {/* Search Button */}
    <Button className="bg-blue-500 max-w-1/5 text-center hover:bg-blue-600 text-white text-lg px-4 py-3 rounded ">
        <FiSearch />
      </Button>
    </div>
  );
}
)