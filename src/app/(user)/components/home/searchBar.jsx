"use client";

import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Button from "../form/Button";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/apiClient";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      try {
        const res = await apiGet(`/businesses/search?q=${encodeURIComponent(query)}`);
        console.log("Suggestions:", res.data);
        const data = res.data || [];
        setSuggestions(data);
        setShowDropdown(data.length > 0);
      } catch (err) {
        console.error("Suggestion fetch failed:", err);
        setSuggestions([]);
        setShowDropdown(false);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(delay);
  }, [query]);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?query=${encodeURIComponent(trimmed)}`);
      setQuery("");
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSuggestionClick = (name) => {
    router.push(`/search?query=${encodeURIComponent(name)}`);
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative flex justify-center w-full">
      <input
        type="text"
        placeholder="Search for services..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        className="outline-none px-3 py-5 h-12 w-full bg-white text-gray-700 rounded-l-lg"
      />

      <Button
        onClick={handleSearch}
        className="bg-blue-500 max-w-1/5 text-center hover:bg-blue-600 text-white text-lg cursor-pointer px-4 py-3 rounded-r-lg"
      >
        <FiSearch />
      </Button>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute left-0 top-full w-full bg-white border border-gray-200 rounded-xl shadow-lg z-[999] mt-1 max-h-64 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSuggestionClick(item.name)}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 "
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
