"use client";

import React, { useEffect, useState } from "react";
import { apiGet } from "@/lib/apiClient";

export default function BusinessUsersPage() {
  const [businessUsers, setBusinessUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessUsers = async () => {
      try {
        const data = await apiGet("/businesses");
        setBusinessUsers(data);
      } catch (error) {
        console.error("Error fetching business users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessUsers();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Business Users</h1>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : businessUsers.length === 0 ? (
        <div className="text-center text-gray-500">No business users found.</div>
      ) : (
        <>
          <div className="hidden md:block border rounded-xl shadow overflow-hidden">
            <div className="grid grid-cols-5 bg-gray-100 text-sm font-semibold text-gray-700">
              <div className="p-4 border-r">Name</div>
              <div className="p-4 border-r">Phone</div>
              <div className="p-4 border-r">Email</div>
              <div className="p-4 border-r">Category</div>
              <div className="p-4">Subcategory</div>
            </div>
            {businessUsers.map((user, index) => (
              <div key={index} className="grid grid-cols-5 border-t bg-gray-50 hover:bg-gray-100 transition">
                <div className="p-4 border-r">{user.name}</div>
                <div className="p-4 border-r">{user.phone}</div>
                <div className="p-4 border-r">{user.email}</div>
                <div className="p-4 border-r">{user.category}</div>
                <div className="p-4">{user.subcategory}</div>
              </div>
            ))}
          </div>

          {/* Small Screens */}
          <div className="md:hidden grid gap-4">
            {businessUsers.map((user, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 p-4" >
                <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Phone: {user.phone}</p>
                <p className="text-sm text-gray-600">Email: {user.email}</p>
                <p className="text-sm text-gray-600">Category: {user.category}</p>
                <p className="text-sm text-gray-600">Subcategory: {user.subcategory}</p>

                <div className="mt-4 flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-md text-xs font-medium shadow-md transition duration-200">
                    View / Edit / Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
