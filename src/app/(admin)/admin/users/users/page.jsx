"use client";

import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/apiClient";
import { FaUserEdit } from "react-icons/fa";

import { useRouter } from "next/navigation";
import Pagination from "@/app/(admin)/admin/components/usercomp/Pagination"; 
import PopupEditUser from "../../components/usercomp/PopupEditUser";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiGet("/users");
        setUsers(data);
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditOpen = (user) => {
    setSelectedUser(user);
    setShowPopup(true);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await apiPut("/users/profile", updatedData);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, ...updatedData } : user
        )
      );
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleStatusChange = (id, value) => {
    const updatedStatus = value === "active";
    const updatedUser = users.find((user) => user.id === id);
    handleUpdate(id, { ...updatedUser, is_active: updatedStatus });
  };

  // Pagination Logic
  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Management</h2>
      <div className="w-full overflow-x-auto">
        
        <div className="hidden md:block">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-white/60 text-gray-700 uppercase text-xs rounded-t-lg">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white/30 backdrop-blur-md">
              {currentUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-white/50 transition-all duration-300 relative">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {(currentPage - 1) * usersPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3 space-x-2 flex items-center justify-center">
                    <select
                      value={user.is_active ? "active" : "inactive"}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                      className="px-3 py-1 rounded-md bg-orange-400 outline-none text-sm shadow"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>

                    <button
                      onClick={() => handleEditOpen(user)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs"
                    >
                      <FaUserEdit />
                    </button>

                    <button type="button"
                      onClick={() => router.push("/admin/businessRegister")}
                      className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Add Business
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Smaller screens */}
        <div className="md:hidden">
          {currentUsers.map((user, index) => (
            <div key={user.id} className="mb-4 p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-md text-gray-600">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-md text-gray-600">
                <strong>Phone:</strong> {user.phone}
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <select
                  value={user.is_active ? "active" : "inactive"}
                  onChange={(e) => handleStatusChange(user.id, e.target.value)}
                  className="px-3 py-1 rounded-md bg-orange-400 outline-none text-sm shadow"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <button
                  onClick={() => handleEditOpen(user)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs"
                >
                  <FaUserEdit />
                </button>

                <button type="button"
                  onClick={() => router.push("/admin/businessRegister")}
                  className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-xs"
                >
                  Add Business
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
      )}

      {/* Popup for editing user */}
      <PopupEditUser user={selectedUser} isOpen={showPopup} onClose={() => setShowPopup(false)} onUpdate={handleUpdate}/>
    </div>
  );
}
