"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiDelete, apiGet, apiPut } from "@/lib/apiClient";
import { FaRegEye } from "react-icons/fa";
import BusinessRegisterModal from "../../components/usercomp/BusinessRegisterModal";
import Pagination from "../../components/usercomp/Pagination";
import CONFIG from "@/constance";

export default function PendingUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchUpdates = async (page = 1) => {
    try {
      setLoading(true);
      const res = await apiGet("/businesses/admin/pending");
      const data = res?.data?.data || res?.data || [];
      const pages = res?.data?.totalPages || 1;
      setUpdates(data);
      setTotalPages(pages);
    } catch (err) {
      toast.error("Failed to fetch pending updates.");
      setUpdates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates(currentPage);
  }, [currentPage]);

  const openModal = (business) => {
    setSelectedBusiness(business);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBusiness(null);
  };

  const handleApprove = async (id) => {
    try {
      const res = await apiPut(`/businesses/admin/approve/${id}`);
      toast.success("Update approved!");
      fetchUpdates(currentPage);
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Are you sure you want to reject this update?")) return;
    try {
      await apiDelete(`/businesses/admin/reject/${id}`);
      toast.success("Update rejected.");
      fetchUpdates(currentPage);
    } catch (err) {
      toast.error("Rejection failed");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openImagePreview = (imgUrl) => {
    setPreviewImage(imgUrl);
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Pending Business Updates</h2>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : updates.length === 0 ? (
        <div className="text-center text-gray-500">No pending updates.</div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-white/60 text-gray-700 uppercase text-md rounded-t-lg">
              <tr>
                <th className="px-4 py-3">SR. NO</th>
                <th className="px-4 py-3">Business Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Photos</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Website</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white/30 backdrop-blur-md">
              {updates.map((update, index) => (
                <tr key={update.id} className="hover:bg-white/50 transition-all duration-300">
                  <td className="px-4 py-3 font-medium">{index + 1}</td>
                  <td className="px-4 py-3">{update.name}</td>
                  <td className="px-4 py-3">{update.phone}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {update.images && update.images.length > 0 ? (
                        update.images.slice(0, 2).map((img, idx) => {
                          const imageUrl = typeof img === "string" ? img : img?.url;
                          const fullImageUrl = imageUrl?.startsWith("http")
                            ? imageUrl
                            : `${CONFIG.IMAGE_BASE_URL}${imageUrl}`;
                          return (
                            <img
                              key={idx}
                              src={fullImageUrl}
                              onClick={() => openImagePreview(fullImageUrl)}
                              alt={`image-${idx}`}
                              className="w-12 h-12 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
                            />
                          );
                        })
                      ) : (
                        <span className="text-gray-400 text-sm">No images</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">{update.email || "N/A"}</td>
                  <td className="px-4 py-3">{update.website || "N/A"}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => openModal(update)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-md px-4 py-2 rounded-full font-medium shadow-md transition duration-200"
                    >
                      <FaRegEye />
                    </button>
                    <button
                      onClick={() => handleApprove(update.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm shadow-md"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(update.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm shadow-md"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Component */}
      <BusinessRegisterModal
        isOpen={modalOpen}
        onClose={closeModal}
        business={selectedBusiness}
      />

      {/* Image Preview Overlay */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100]"
          onClick={closeImagePreview}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
