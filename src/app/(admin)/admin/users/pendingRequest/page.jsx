"use client";

import { apiGet } from '@/lib/apiClient';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../../components/usercomp/Pagination';


const PendingRequestsPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiGet("/users");
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setUsers((prev) => prev.map((user) =>user.id === id ? { ...user, status: newStatus } : user ));
    toast.success(`User marked as ${newStatus}`);
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Verified: 'bg-green-100 text-green-800',
    Unverified: 'bg-red-100 text-red-800',
  };

  // Pagination Logic
  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
  <h1 className="text-2xl font-semibold mb-4 text-gray-800"> Pending Requests</h1>
  
  <div className="w-full overflow-x-auto">
    <div className="hidden md:block">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-white/60 text-gray-700 uppercase text-xs rounded-t-lg">
          <tr>
            <th className="px-4 py-3">SR.No</th>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white/30 backdrop-blur-md">
          {currentUsers.map((user, index) => (
            <tr key={user.id} className="hover:bg-white/50 transition-all duration-300">
              <td className="px-4 py-3 font-medium text-gray-800">
                {(currentPage - 1) * usersPerPage + index + 1}
              </td>
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3">{user.phone}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[user.status] || 'bg-gray-200 text-gray-700'}`}>
                  {user.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <select value={user.status} onChange={(e) => handleStatusChange(user.id, e.target.value)}
                  className="border-gray-300 rounded px-3 py-1 text-sm focus:ring focus:ring-indigo-200"
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Unverified">Unverified</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="mt-4">
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
    </div>
  )}

  <ToastContainer position="top-right" autoClose={2000} />
</div>

  );
};

export default PendingRequestsPage;
