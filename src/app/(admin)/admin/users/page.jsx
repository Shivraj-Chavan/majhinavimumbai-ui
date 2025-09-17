"use client";

import React, { useCallback, useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/apiClient";
import { FaUserEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Pagination from "@/app/(admin)/admin/components/usercomp/Pagination";
import PopupEditUser from "../components/usercomp/PopupEditUser";
import { toast } from "react-toastify";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // searchTerm = what's in the input; appliedQuery = what API actually uses
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedQuery, setAppliedQuery] = useState(""); // only updates on Search

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const q = appliedQuery.trim();
      const data = await apiGet(
        `/users?page=${currentPage}&limit=${usersPerPage}&q=${encodeURIComponent(q)}`
      );

      // Expecting { users, totalPages, total, page }
      const list = data?.users ?? [];
      const pages =
        data?.totalPages ??
        (typeof data?.total === "number"
          ? Math.max(1, Math.ceil(data.total / usersPerPage))
          : 1);

      setUsers(list);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [appliedQuery, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchClick = () => {
    setCurrentPage(1);
    setAppliedQuery(searchTerm); // triggers fetch via useEffect
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") handleSearchClick();
  };

  const handleClearSearch = () => {
    if (!appliedQuery && !searchTerm) return;
    setSearchTerm("");
    setAppliedQuery("");
    setCurrentPage(1);
  };

  const handleEditOpen = (user) => {
    setSelectedUser(user);
    setShowPopup(true);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await apiPut(`/users/${id}/profile`, updatedData);
      toast.success("User updated successfully");
      // Re-fetch current page to keep server as source of truth
      fetchUsers();
      setShowPopup(false);
    } catch (err) {
      console.error("Update failed:", err?.response?.data || err?.message);
      toast.error("Failed to update user");
    }
  };

  const handleAddBusinessClick = (userId) => {
    router.push(`users/businessRegister?ownerId=${userId}`);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
      {/* Search Box */}
      <div className="relative flex justify-center w-full mb-4">
        <div className="flex items-center gap-2 border border-gray-200 shadow rounded-lg bg-white max-w-xl w-full px-2 py-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchEnter}
            placeholder="Search by name, email or business..."
            className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none border border-gray-300"
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
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Management</h2>

      {/* Desktop Table View */}
      <div className="w-full overflow-x-auto hidden md:block">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-white/60 text-gray-700 uppercase text-xs rounded-t-lg">
            <tr>
              <th className="px-4 py-3">Sr. No</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white/30 backdrop-blur-md">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-600">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-600">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={`user-${user?.id ?? index}`}
                  className="hover:bg-white/50 transition-all duration-300 relative"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {(currentPage - 1) * usersPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3">{user?.name ?? "-"}</td>
                  <td className="px-4 py-3">{user?.email ?? "-"}</td>
                  <td className="px-4 py-3">{user?.phone ?? "-"}</td>
                  <td className="px-4 py-3 space-x-2 flex items-center justify-center">
                    <span
                      className={`h-8 px-3 rounded-md text-sm font-semibold flex items-center justify-center ${
                        !user?.is_active
                          ? "bg-gray-500 hover:bg-gray-400"
                          : "bg-orange-500 hover:bg-orange-400"
                      } text-white`}
                    >
                      {!user?.is_active ? "Inactive" : "Active"}
                    </span>

                    <button
                      onClick={() => handleEditOpen(user)}
                      className="h-8 bg-blue-600 hover:bg-blue-500 text-white px-3 rounded text-sm flex items-center justify-center"
                      title="Edit User"
                    >
                      <FaUserEdit />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBusinessClick(user.id)}
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-xs"
                    >
                      Add Business
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {loading ? (
          <div className="text-center text-gray-600 py-4">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-600 py-4">No users found</div>
        ) : (
          users.map((user, index) => (
            <div
              key={`mobile-user-${user?.id ?? index}`}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">{user?.name ?? "-"}</h3>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    user?.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {user?.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                <strong>Email:</strong> {user?.email ?? "-"}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditOpen(user)}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm flex justify-center items-center"
                >
                  <FaUserEdit className="mr-1" /> Edit
                </button>

                <button
                  onClick={() => handleAddBusinessClick(user.id)}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-sm"
                >
                  Add Business
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Popup for editing user */}
      <PopupEditUser
        user={selectedUser}
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
