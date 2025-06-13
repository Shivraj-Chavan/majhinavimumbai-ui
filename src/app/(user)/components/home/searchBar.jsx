"use client";

import React, { useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Button from "../form/Button";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSuggestions, setQuery, clearSuggestions } from "@/redux/slice/searchSlice";

export default React.memo(function SearchBar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { query, filteredSuggestions, loading, error } = useSelector((state) => state.search);

  useEffect(() => {
    dispatch(fetchAllSuggestions());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearSuggestions());
    };
  }, [dispatch]);

  // Handle Search
  const handleSearch = () => {
    if (query.trim()) {
      const selectedService = filteredSuggestions.find(
        (s) => s.name.toLowerCase() === query.trim().toLowerCase()
      );

      if (selectedService) {
        const url = `/${selectedService.category}/${selectedService.slug}`;
        router.push(url);
      } else {
        router.push(`/listing?query=${query.trim()}`);
      }

      dispatch(setQuery("")); 
      dispatch(clearSuggestions()); 
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative flex justify-center rounded-r-lg w-full">
      <input
        type="text"
        placeholder="Search for services..."
        value={query}
        onChange={(e) => dispatch(setQuery(e.target.value))}
        onKeyDown={handleKeyPress}
        className="outline-none px-3 py-5 h-12 w-full bg-white text-gray-700 rounded-l-lg"
      />

      <Button onClick={handleSearch} className="bg-blue-500 max-w-1/5 text-center hover:bg-blue-600 text-white text-lg cursor-pointer px-4 py-3 rounded-r-lg">
        <FiSearch />
      </Button>

      {/* Suggestions List */}
      {query && !loading && !error && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-md mt-2 z-10">
          <ul>
            {filteredSuggestions.slice(0, 5).map((suggestion, index) => ( 
              <li key={index} className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => {
                  const url = `/${suggestion.category}/${suggestion.slug}`;
                  router.push(url);
                }}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* {loading && <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-md mt-2 z-10 p-2">Loading...</div>} */}
      {error && <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-md mt-2 z-10 p-2 text-red-500">{error}</div>}
      {query && !loading && !error && filteredSuggestions.length === 0 && (
        <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-md mt-2 z-10 p-2 text-gray-500">
          No results found
        </div>
      )}
    </div>
  );
});
