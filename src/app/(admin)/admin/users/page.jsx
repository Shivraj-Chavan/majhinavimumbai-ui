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
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  // const [showForm, setShowForm] = useState(false);
  const [owner, setOwner] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedOwner = localStorage.getItem("owner");
    if (storedOwner) {
      setOwner(JSON.parse(storedOwner));
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiGet("/users");
        console.log("Fetched users:", data);  
  
        // const verifiedUsers = data.filter(user => user.details && user.details.isVerified === true);
        // console.log("Verified users:", verifiedUsers);
        // setUsers(verifiedUsers);
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

  useEffect(() => {
    const fetchBusinessesForActiveUsers = async () => {
      const allBusinesses = [];
  
      // for (const user of users) {
      //   if (user.is_active) {
      //     try {
      //       console.log(`user ID: ${user.id}`);
      //       const response = await apiGet(`/users/${user.id}`);
      //       console.log("Response for user:", response);
      //       const userBusinesses = response.businesses || [];
      //       allBusinesses.push(...userBusinesses.map(b => ({ ...b, ownerId: user.id })));
      //     } catch (err) {
      //       console.error(`Failed to fetch businesses for user ${user.id}:`, err);
      //     }
      //   }
      // }
      console.log("Fetched businesses:", allBusinesses);
      setBusinesses(allBusinesses);
    };
  
    if (users.length > 0) {
      fetchBusinessesForActiveUsers();
    }
  }, [users]);

  const handleUpdate = async (id, updatedData) => {
    console.log("Clicked update for:",id, "with data:", updatedData); 
    try {
      const response = await apiPut(`/${id}/profile`, updatedData);
      console.log("Response after update:", response);
      toast.success("User updated successfully");
  
      setUsers((prevUsers) =>
        prevUsers.map((user) =>user.id === id ? { ...user, ...response.data } : user )
      );
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update user");
    }
  };
  
  const handleAddBusinessClick = (userId) => {
  router.push(`users/businessRegister?ownerId=${userId}`);
  };

  const handleBlock = async (id) => {  
    if (!id) {
      alert('User ID is required');
      return; 
    }
    setIsLoading(true);
  
    try {
      console.log('Blocking user with ID:', id);
      const response = await apiPut(`/block/${id}`);  
  
      if (response.ok) {
        const data = await response.json();
        console.log(data); 
        alert('User blocked successfully');
      } else {
        const data = await response.json();
        console.log(data); 
        alert(data.message || 'Failed to block user');
      }
    } catch (error) {
      console.log('Error occurred while blocking the user:', error);
      alert('An error occurred while blocking the user');
    } finally {
      setIsLoading(false);
    }
  };
  
  // const handleStatusChange = (id, value) => {
  //   if (!value) return;
  //   const updatedStatus = value === "active";
  //   const updatedUser = users.find((user) => user.id === id);
  //   handleUpdate(id, { ...updatedUser, is_active: updatedStatus });
  //   console.log(`User ${id} status changed to ${value}`);
  // };

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
                 <tr key={`user-${user.id}-${index}`} className="hover:bg-white/50 transition-all duration-300 relative">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {(currentPage - 1) * usersPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3 space-x-2 flex items-center justify-center">

                  <button onClick={() => { 
                    const newStatus = user.is_active === 1 || user.is_active === true ? 0 : 1; 
                    console.log("Toggling status to:", newStatus); 
                    handleUpdate(user.id, { is_active: newStatus });}}
                    className={`h-8 px-3 rounded-md text-sm font-semibold ${ user.is_active === 1 || user.is_active === true
                    ? "bg-gray-500 hover:bg-gray-400" : "bg-orange-500 hover:bg-orange-400" } text-white`}>
                    {user.is_active === 1 || user.is_active === true ? "Inactive" : "Active"}
                    </button>

                  <button
                    onClick={() => handleEditOpen(user)}
                    className="h-8 bg-blue-600 hover:bg-blue-500 text-white px-3 rounded text-sm flex items-center justify-center"
                  >
                    <FaUserEdit/>
                  </button>

                  <button
                    type="button"
                    onClick={()=>handleAddBusinessClick(user.id)}
                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-xs"
                  >
                    Add Business
                  </button>

                  <button type="button" className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded text-xs"
                    onClick={() => handleBlock(user.id)} disabled={isLoading} >
                    {isLoading ? 'Blocking...' : 'Block'}
                  </button>
  
                </td>
                </tr>
              ))}
            </tbody>
          </table>
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
