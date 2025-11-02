"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import Button from "../form/Button";
import { usePathname, useRouter } from "next/navigation";
import { apiGet } from "@/lib/apiClient";

export default function SearchBar({value}) {
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef(null);
  const [query, setQuery] = useState(value || "");
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

  // Clear search bar when route changes
  useEffect(() => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  }, [pathname]);

  // useEffect(() => {
  //   const handleRouteChangeComplete = () => {
  //     setQuery("");
  //     setSuggestions([]);
  //     setShowDropdown(false);
  //   };

  //   router.events?.on("routeChangeComplete", handleRouteChangeComplete);

  //   return () => {
  //     router.events?.off("routeChangeComplete", handleRouteChangeComplete);
  //   };
  // }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (containerRef.current && !containerRef.current.contains(e.target)) {
  //       setShowDropdown(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  return (
    <div ref={containerRef}  className="relative flex justify-center w-full">
      <input
        type="text"
        placeholder="Search for services..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        className="outline-none cursor-pointer px-3 py-5 h-12 w-full bg-white text-gray-700 rounded-l-lg"
      />
    <Button
        onClick={handleSearch}
        className="absolute text-sm right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 !rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm transition-all duration-200"
      >
        🔍
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
