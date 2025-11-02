"use client";

import React, { useEffect, useState } from "react";
import { apiDelete, apiGet } from "@/lib/apiClient";
import { FaRegEye } from "react-icons/fa";
import BusinessRegisterModal from "../../components/usercomp/BusinessRegisterModal";
import Pagination from "../../components/usercomp/Pagination";
import ManageBusinessImagesModal from "../../components/usercomp/ManageBusinessImagesModal";
import { toast } from "react-toastify";

export default function BusinessUsersPage() {
  const [businessUsers, setBusinessUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageBusiness, setSelectedImageBusiness] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  // Common fetch function (handles both search + normal list)
  const fetchBusinessUsers = async (page = 1, query = "") => {
    try {
      setLoading(true);
      let url = `/businesses?isVerified=true&page=${page}&limit=${limit}`;
      if (query) {
        url += `&name=${encodeURIComponent(query)}`;
      }

      const response = await apiGet(url);
      console.log("Businesses response:", response);

      setBusinessUsers(response.data);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Error fetching business users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial + pagination load
  useEffect(() => {
    fetchBusinessUsers(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1); // reset to first page
    fetchBusinessUsers(1, searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    fetchBusinessUsers(1, "");
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

  const handleOpenImageManager = (business) => {
    setSelectedImageBusiness(business);
    setImageModalOpen(true);
  };

  const handleCloseImageManager = () => {
    setImageModalOpen(false);
    setSelectedImageBusiness(null);
  };

  const handleDelete = async (id) => {
    console.log("Deleting business with ID:", id);
    if (!id) {
      alert("Invalid business ID");
      return;
    }

    try {
      const data = await apiDelete(`/businesses/${id}`);
      toast.success(data.msg || "Business deleted");
      setBusinessUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

      if (businessUsers.length <= limit) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    } catch (err) {
      console.log("API Error:", err);
      toast.error(err.message);
    }
  };

  const updateVerifiedBusinessList = (updatedBusiness) => {
    setBusinessUsers((prevUsers) => {
      const existing = prevUsers.filter((user) => user.id !== updatedBusiness.id);
      return [...existing, updatedBusiness];
    });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
      {/* Searchbar */}
      <div className="relative flex justify-center w-full">
        <div className="sm:flex items-center gap-3 border border-gray-100 shadow rounded-lg bg-white max-w-xl mb-3 w-full px-2 py-2">
          <div className="flex w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by business name..."
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
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Business Users</h2>
      <ManageBusinessImagesModal
        isOpen={imageModalOpen}
        onClose={handleCloseImageManager}
        business={selectedImageBusiness}
      />

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
                  <th className="px-4 py-3 text-center">Action</th>
                </tr> 
              </thead> 
              <tbody className="bg-white/30 backdrop-blur-md ">
                {businessUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-white/50 transition-all duration-300 gap-3">
                    <td className="px-4 py-3 font-medium text-gray-800">{(currentPage - 1) * limit + (index + 1)}</td>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.phone}</td>
                    <td className="px-4 py-3 flex justify-center gap-3">
                    <button
                      className="bg-yellow-500 flex align-center hover:bg-yellow-600 text-white text-md px-4 py-1 mx-1 rounded-full font-medium shadow-md transition duration-200"
                      onClick={() => handleOpenImageManager(user)}
                    >
                      Manage Images
                    </button>
                   <button onClick={() => openModal(user)} className="bg-blue-500 gap-2 items-center flex hover:bg-blue-600 text-white text-md px-4 py-2 rounded-full font-medium shadow-md transition duration-200">
                        <FaRegEye /> View
                      </button>

                      <button
                        className="bg-red-500 flex align-center hover:bg-red-600 text-white text-md px-4 py-1 mx-3 rounded-full font-medium shadow-md transition duration-200"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this business?")) {
                            handleDelete(user?.id);}
                        }}
                      >
                        Delete
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
              <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Phone: {user.phone}</p>
                <div className="mt-4 flex justify-end">
                  <button onClick={() => openModal(user)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-md font-medium shadow-md transition duration-200">
                    <FaRegEye /> View
                  </button>

                  <button
                        className="bg-red-500 hover:bg-red-600 text-white text-md px-4 py-1 mx-3 rounded-full font-medium shadow-md transition duration-200"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this business?")) {
                            handleDelete(user?.id);}
                        }}
                      >
                        Delete
                      </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Component */}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
        </div>
      )}

      {/* Modal Component */}
      <BusinessRegisterModal isOpen={modalOpen} onClose={closeModal} business={selectedBusiness} updateVerifiedBusinessList={updateVerifiedBusinessList}/>
    </div>
  );
}
