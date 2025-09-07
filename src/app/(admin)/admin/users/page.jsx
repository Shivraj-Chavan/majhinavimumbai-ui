"use client";

import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/apiClient";
import { FaUserEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Pagination from "@/app/(admin)/admin/components/usercomp/Pagination"; 
import PopupEditUser from "../components/usercomp/PopupEditUser";
import { toast } from "react-toastify";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Fetch all users initially
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await apiGet("/users");
        console.log("Fetched users:", data);
        setUsers(data);
        setFilteredUsers(data); // initially both are same
      } catch (error) {
        console.log("Error fetching users:", error);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle search input change (live filtering)
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter((user) =>
      user.name?.toLowerCase().includes(value.toLowerCase()) ||
      user.email?.toLowerCase().includes(value.toLowerCase()) ||
      user.business_name?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  // Optional: Backend search
  const searchBusinessUser = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    try {
      setLoading(true);
      const response = await apiGet(`/users/search?q=${encodeURIComponent(searchTerm)}`);
      console.log("Search API response:", response);

      setFilteredUsers(response.data || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(1);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = (user) => {
    setSelectedUser(user);
    setShowPopup(true);
  };

  const handleUpdate = async (id, updatedData) => {
    console.log("Clicked update for:", id, "with data:", updatedData);
    try {
      const response = await apiPut(`/users/${id}/profile`, updatedData);
      console.log("Response after update:", response);
      toast.success("User updated successfully");

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? { ...user, ...response } : user))
      );
      setFilteredUsers((prevFiltered) =>
        prevFiltered.map((user) => (user.id === id ? { ...user, ...response } : user))
      );

      setShowPopup(false);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      toast.error("Failed to update user");
    }
  };

  const handleAddBusinessClick = (userId) => {
    router.push(`users/businessRegister?ownerId=${userId}`);
  };

  // Pagination
  const totalPage = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
     {/* Search Box */}
<div className="relative flex justify-center w-full mb-4">
  <div className="flex items-center gap-3 border border-gray-200 shadow rounded-lg bg-white max-w-xl w-full px-2 py-2">
    <input
      type="text"
      value={searchTerm}
      onChange={handleInputChange}
      placeholder="Search by name, email or business..."
      className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none border border-gray-300"
    />
    <button
      onClick={searchBusinessUser}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
    >
      Search
    </button>
  </div>
</div>
     
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Management</h2>

      {/* Desktop Table View */}
      <div className="w-full overflow-x-auto hidden md:block">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-white/60 text-gray-700 uppercase text-xs rounded-t-lg">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white/30 backdrop-blur-md">
            {currentUsers.map((user, index) => (
              <tr
                key={`user-${user.id}-${index}`}
                className="hover:bg-white/50 transition-all duration-300 relative"
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {(currentPage - 1) * usersPerPage + index + 1}
                </td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 space-x-2 flex items-center justify-center">
                  <button
                    className={`h-8 px-3 rounded-md text-sm font-semibold ${
                      !user?.is_active
                        ? "bg-gray-500 hover:bg-gray-400"
                        : "bg-orange-500 hover:bg-orange-400"
                    } text-white`}
                  >
                    {!user?.is_active ? "Inactive" : "Active"}
                  </button>

                  <button
                    onClick={() => handleEditOpen(user)}
                    className="h-8 bg-blue-600 hover:bg-blue-500 text-white px-3 rounded text-sm flex items-center justify-center"
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
            ))}

            {currentUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-600">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {currentUsers.length > 0 ? (
          currentUsers.map((user, index) => (
            <div
              key={`mobile-user-${user.id}-${index}`}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    user?.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {user?.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                <strong>Email:</strong> {user.email}
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
        ) : (
          <div className="text-center text-gray-600 py-4">
            No users found
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPage > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPage}
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
