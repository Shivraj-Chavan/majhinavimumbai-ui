"use client";

import React, { useEffect, useState } from "react";
import Pagination from "../../components/usercomp/Pagination";
import { apiGet } from "@/lib/apiClient";
import DownloadAdminActions from "../../components/ActionsDownloadReport";

export default function AdminActionsPage() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const limit = 10;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch actions
  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);
        const res = await apiGet(
          `/businesses/admin/actions?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(query)}`
        );
        setActions(res?.actions || []);
        setTotalPages(res?.totalPages || 1);
      } catch (err) {
        setError(err.message || "Failed to fetch admin actions");
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, [currentPage, query]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      setQuery(searchTerm);
      setCurrentPage(1);
    }
  };

  const handleSearchClick = () => {
    setQuery(searchTerm);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setQuery("");
    setCurrentPage(1);
  };

  const formatDate = (timestamp) =>
    timestamp ? new Date(timestamp).toLocaleString() : "-";

  return (
    <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
  <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
   
    <h1 className="text-2xl font-semibold text-gray-800">  Admin Actions </h1>

   {/*download excel */}
    <div className="flex items-center gap-2 flex-wrap mb-3">
      <DownloadAdminActions />
    </div>
  </div>

      {/* Search Bar */}
      <div className="mb-4 flex justify-center gap-2 flex-wrap">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchEnter}
          placeholder="Search by admin, action, target or business..."
          className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none border border-gray-300 min-w-[200px]"
        />
        <button
          onClick={handleSearchClick}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Search
        </button>
        <button
          onClick={handleClearSearch}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm"
          title="Clear"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : actions.length === 0 ? (
        <div className="text-center text-gray-500">No actions found.</div>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-white/60 text-gray-700 uppercase text-md">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Admin</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target Type</th>
                <th className="px-4 py-3">Target ID</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white/30 backdrop-blur-md">
              {actions.map((action, index) => (
                <tr
                  key={action.id}
                  className="hover:bg-white/50 transition-all duration-300"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {index + 1 + (currentPage - 1) * limit}
                  </td>
                  <td className="px-4 py-3">{action.admin_name || action.admin_id}</td>
                  <td className="px-4 py-3">{action.action}</td>
                  <td className="px-4 py-3">{action.target_type}</td>
                  <td className="px-4 py-3">{action.target_id || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(action.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
