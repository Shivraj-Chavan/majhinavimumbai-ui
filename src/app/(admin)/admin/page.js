"use client";

import React, { useEffect, useState } from "react";
// import { apiGet } from "@/lib/apiClient"; 

export default function Page() {
  const users = [
    { id: 1, name: "abc", email: "abc@gmail.com", contact: "9876543210" },
    { id: 2, name: "xyz", email: "xyz@gmail.com", contact: "9876543210" },
    { id: 3, name: "rst", email: "rst@gmail.com", contact: "9876543210" },
  ];

  // const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const data = await apiGet("/api/users");
  //       setUsers(data);
  //     } catch (error) {
  //       console.log("Error fetching users:", error);
  //     }
  //   };

  //   fetchUsers();
  // }, []);

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
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white/30 backdrop-blur-md">
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-white/50 transition-all duration-300 relative">
                  <td className="px-4 py-3 font-medium text-gray-800">{index + 1}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.contact}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-xs font-medium shadow-md transition duration-200">
                      View / Edit / Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* smaller screens */}
        <div className="md:hidden">
          {users.map((user) => (
            <div key={user.id} className="mb-4 p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-600">Email: {user.email}</p>
              <p className="text-sm text-gray-600">Contact: {user.contact}</p>
              <div className="mt-3 flex justify-between">
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md text-xs font-medium shadow-md transition duration-200">
                  View / Edit / Delete 
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
