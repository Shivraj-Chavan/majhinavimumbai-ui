"use client";

import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/apiClient";
import { FaRegEye } from "react-icons/fa";
import BusinessRegisterModal from "../../components/usercomp/BusinessRegisterModal";
import Pagination from "../../components/usercomp/Pagination";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function BusinessUsersPage() {
  const [businessUsers, setBusinessUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const limit = 10;

    // Get user role from Redux
    const currentUser = useSelector((state) => state.auth?.user);
    const userRole = currentUser?.role?.toLowerCase() || null;
    const canEdit = ["admin", "sub-admin"].includes(userRole);
  

  // 🔹 Unified fetch function (works for both normal + search)
  const fetchBusinessUsers = async (page = currentPage, name = searchTerm) => {
    try {
      setLoading(true);
      let url = `/businesses?isVerified=false&page=${page}&limit=${limit}`;
      if (name) url += `&name=${encodeURIComponent(name)}`;

      const response = await apiGet(url);
      setBusinessUsers(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error fetching business users:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Initial + on page change
  useEffect(() => {
    fetchBusinessUsers(currentPage, searchTerm);
  }, [currentPage]);

  // 🔹 Search handler
  const handleSearch = () => {
    setCurrentPage(1);
    fetchBusinessUsers(1, searchTerm);
  };

  // 🔹 Clear search
  const handleClearSearch = () => {
    if (!searchTerm) return;
    setSearchTerm("");
    setCurrentPage(1);
    fetchBusinessUsers(1, "");
  };

  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    try {
      // Example suggestion API
      // const res = await apiGet(`/businesses/search?q=${encodeURIComponent(query)}`);
      // const data = res.data || [];
      const data = []; // <- keep empty if not using suggestion API
      setSuggestions(data);
      setShowDropdown(data.length > 0);
    } catch (err) {
      console.error("Suggestion fetch failed:", err);
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (name) => {
    setSearchTerm(name);
    setCurrentPage(1);
    fetchBusinessUsers(1, name);
    setShowDropdown(false);
  };

  const openModal = (business) => {
    setSelectedBusiness(business);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBusiness(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleVerified = async (id) => {
    if (!canEdit) return toast.info("You are not authorized to verify businesses.");
    try {
      const response = await apiPut(`/businesses/${id}`, { isVerified: true });
      if (response && response.success) {
        setBusinessUsers((prev) => prev.filter((biz) => biz.id !== id));
        toast.success("Business verified successfully");
        await fetchBusinessUsers(currentPage, searchTerm);
        closeModal();
      } else {
        toast.error("Failed to verify business");
      }
    } catch (error) {
      console.error("Error verifying business:", error);
      toast.error("Failed to verify the business");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
      {/* Searchbar */}
      <div className="relative flex justify-center w-full">
        <div className="sm:flex items-center gap-3 border border-gray-100 shadow rounded-lg bg-white max-w-xl mb-3 w-full px-2 py-2">
          <div className="flex w-full relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search by business name..."
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none border border-gray-300"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white"
            >
              Search
            </button>
            <button
              onClick={handleClearSearch}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-r-lg text-gray-700 text-sm"
              title="Clear"
            >
              Clear
            </button>
            {/* Dropdown Suggestions */}
            {showDropdown && (
              <ul className="absolute z-10 top-12 left-0 bg-white rounded-b-md shadow-md max-h-60 overflow-y-auto w-full border border-t-0 border-gray-200">
                {suggestions.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSuggestionClick(item.name)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-4">
        Pending User Request
      </h2>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : businessUsers.length === 0 ? (
        <div className="text-center text-gray-500">No business users found.</div>
      ) : (
        <div className="w-full overflow-x-auto">
          {/* Desktop View */}
          <div className="hidden md:block">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-white/60 text-gray-700 uppercase text-md rounded-t-lg">
                <tr>
                  <th className="px-4 py-3">SR. NO</th>
                  <th className="px-4 py-3">Business Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white/30 backdrop-blur-md">
                {businessUsers.map((user, index) => (
                  <tr
                    key={index}
                    className="hover:bg-white/50 transition-all duration-300 gap-3"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {(currentPage - 1) * limit + (index + 1)}
                    </td>
                    <td className="px-4 py-3">{user?.name}</td>
                    <td className="px-4 py-3">{user?.phone}</td>
                    <td className="px-4 py-3">{user?.email}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openModal(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-md px-4 py-2 rounded-full font-medium shadow-md transition duration-200"
                      >
                        <FaRegEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {businessUsers.map((user, index) => (
              <div
                key={index}
                className="mb-4 p-4 bg-white rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Email: {user.email}
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => openModal(user)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-md font-medium shadow-md transition duration-200"
                  >
                    <FaRegEye />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modal */}
      <BusinessRegisterModal
        isOpen={modalOpen}
        onClose={closeModal}
        business={selectedBusiness}
        onVerified={handleVerified}
        isAdmin={canEdit}
      />
    </div>
  );
}
