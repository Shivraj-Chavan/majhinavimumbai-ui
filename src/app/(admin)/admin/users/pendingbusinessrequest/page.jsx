// "use client";

// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { apiDelete, apiGet, apiPut } from "@/lib/apiClient";
// import { FaRegEye } from "react-icons/fa";
// import BusinessRegisterModal from "../../components/usercomp/BusinessRegisterModal";
// import Pagination from "../../components/usercomp/Pagination";
// import CONFIG from "@/constance";
// import Image from "next/image";
// import { useSelector } from "react-redux";

// export default function PendingUpdates() {
//   const [updates, setUpdates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedBusiness, setSelectedBusiness] = useState(null);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [businessUsers, setBusinessUsers] = useState([]);

//   const limit = 20;
//   // useEffect(() => {
//   //   const fetchBusinessUsers = async () => {
//   //     try {
//   //       setLoading(true);
//   //       const response = await apiGet(`/businesses?isVerified=true&page=${currentPage}&limit=${limit}`);
//   //       setBusinessUsers(response.data); 
//   //       setTotalPages(response.totalPages); 
//   //     } catch (error) {
//   //       console.error("Error fetching business users:", error);
//   //     } finally { 
//   //       setLoading(false);
//   //     }
//   //   };
  
//   //   fetchBusinessUsers();
//   // }, [currentPage]);

//   const currentUser = useSelector((state) => state.auth?.user);
//   const userRole = currentUser?.role?.toLowerCase() || null;
//   const canEdit = ["admin", "sub-admin"].includes(userRole);
    
  
//   const fetchUpdates = async (page = currentPage) => {
//     try {
//       setLoading(true);
//       const res = await apiGet(`/businesses/admin/pending?page=${page}&limit=${limit}`);
//       const data = res?.data?.data || res?.data || [];
//       const pages = res?.data?.totalPages || 1;
//       setUpdates(data);
//       setTotalPages(pages);
//     } catch (err) {
//       toast.error("Failed to fetch pending updates.");
//       setUpdates([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUpdates(currentPage);
//   }, [currentPage]);

//   const openModal = (business) => {
//     setSelectedBusiness(business);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedBusiness(null);
//   };

//   const handleApprove = async (id) => {
//     try {
//       const res = await apiPut(`/businesses/admin/approve/${id}`);
//       toast.success("Update approved!");
//       fetchUpdates(currentPage);
//     } catch (err) {
//       toast.error("Approval failed");
//     }
//   };

//   const handleReject = async (id) => {
//     if (!confirm("Are you sure you want to reject this update?")) return;
//     try {
//       await apiDelete(`/businesses/admin/reject/${id}`);
//       toast.success("Update rejected.");
//       fetchUpdates(currentPage);
//     } catch (err) {
//       toast.error("Rejection failed");
//     }
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const openImagePreview = (imgUrl) => {
//     setPreviewImage(imgUrl);
//   };

//   const closeImagePreview = () => {
//     setPreviewImage(null);
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg max-w-7xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">Pending Business Updates</h2>
//       {/* <span className="text-sm text-gray-500 italic">
//           Role: {userRole.toUpperCase()}
//         </span> */}

//       {loading ? (
//         <div className="text-center text-gray-600">Loading...</div>
//       ) : updates.length === 0 ? (
//         <div className="text-center text-gray-500">No pending updates.</div>
//       ) : (
//         <div className="w-full overflow-x-auto">
//           <table className="min-w-full text-sm text-left">
//             <thead className="bg-white/60 text-gray-700 uppercase text-md rounded-t-lg">
//               <tr>
//                 <th className="px-4 py-3">SR. NO</th>
//                 <th className="px-4 py-3">Business Name</th>
//                 <th className="px-4 py-3">Phone</th>
//                 <th className="px-4 py-3">Photos</th>
//                 <th className="px-4 py-3">Email</th>
//                 <th className="px-4 py-3">Website</th>
//                 <th className="px-4 py-3">Action</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white/30 backdrop-blur-md">
//               {updates.map((update, index) => (
//                 <tr key={update.id} className="hover:bg-white/50 transition-all duration-300">
//                   <td className="px-4 py-3 font-medium">{index + 1}</td>
//                   <td className="px-4 py-3">{update.name}</td>
//                   <td className="px-4 py-3">{update.phone}</td>
//                   <td className="px-4 py-3">
//                     <div className="flex gap-1">
//                       {update.images && update.images.length > 0 ? (
//                         update.images.slice(0, 2).map((img, idx) => {
//                           const imageUrl = typeof img === "string" ? img : img?.url;
//                           const fullImageUrl = imageUrl?.startsWith("http")
//                             ? imageUrl
//                             : `${CONFIG.IMAGE_BASE_URL}${imageUrl}`;
//                           return (
//                             <Image
//                               key={idx}
//                               src={fullImageUrl}
//                               onClick={() => openImagePreview(fullImageUrl)}
//                               alt={`image-${idx}`}
//                               width={48}    
//                               height={48}
//                               className="w-12 h-12 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
//                             />
//                           );
//                         })
//                       ) : (
//                         <span className="text-gray-400 text-sm">No images</span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-4 py-3">{update.email || "N/A"}</td>
//                   <td className="px-4 py-3">{update.website || "N/A"}</td>
//                   <td className="px-4 py-3 space-x-2">
//                     <button
//                       onClick={() => openModal(update)}
//                       className="bg-blue-500 hover:bg-blue-600 text-white text-md px-4 py-2 rounded-full font-medium shadow-md transition duration-200"
//                     >
//                       <FaRegEye />
//                     </button>
//                     <button
//                       onClick={() => handleApprove(update.id)}
//                       className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm shadow-md"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => handleReject(update.id)}
//                       className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm shadow-md"
//                     >
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal Component */}
//       <BusinessRegisterModal
//         isOpen={modalOpen}
//         onClose={(shouldRefresh) => {
//           setModalOpen(false);
//           setSelectedBusiness(null);
//           if (shouldRefresh) fetchUpdates(currentPage); // <-- refresh list
//         }}
//         business={selectedBusiness}
//         // isAdmin={true}
//         isAdmin={canEdit}
//       />

//       {/* Image Preview Overlay */}
//       {previewImage && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100]"
//           onClick={closeImagePreview}
//         >
//           <Image
//             src={previewImage}
//             alt="Preview"
//             width={600}      
//             height={400} 
//             className="max-w-full max-h-full rounded-lg shadow-lg"
//           />
//         </div>
//       )}

//       {/* Pagination */}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPageChange={handlePageChange}
//       />
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiDelete, apiGet, apiPut } from "@/lib/apiClient";
import { FaRegEye } from "react-icons/fa";
import BusinessRegisterModal from "../../components/usercomp/BusinessRegisterModal";
import Pagination from "../../components/usercomp/Pagination";
import CONFIG from "@/constance";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function PendingUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);
  const [totalUpdates, setTotalUpdates] = useState(0);

  const limit = 20;

  const currentUser = useSelector((state) => state.auth?.user);
  const userRole = currentUser?.role?.toLowerCase() || null;
  const canEdit = ["admin", "sub-admin"].includes(userRole);

  const fetchUpdates = async (page = currentPage) => {
    try {
      setLoading(true);
      const res = await apiGet(`/businesses/admin/pending?page=${page}&limit=${limit}`);
      const data = res?.data?.data || res?.data || [];
      const pages = res?.data?.totalPages || 1;
      setUpdates(data);
      setTotalPages(pages);
      setTotalUpdates(
        res?.data?.total ||
        res?.total ||
        data.length ||
        0
      );
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

  const openModal = (business) => { setSelectedBusiness(business); setModalOpen(true); };
  const closeModal = (shouldRefresh) => {
    setModalOpen(false);
    setSelectedBusiness(null);
    if (shouldRefresh) fetchUpdates(currentPage);
  };

  const handleApprove = async (id) => {
    try {
      await apiPut(`/businesses/admin/approve/${id}`);
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

  const handlePageChange = (page) => setCurrentPage(page);
  const openImagePreview = (imgUrl) => setPreviewImage(imgUrl);
  const closeImagePreview = () => setPreviewImage(null);

  return (
    <div className="p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
  <div>
    <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
    Pending Business Updates
    </h2>
    <p className="text-sm text-gray-500 mt-1">
    Review and approve pending business profile changes.
    </p>
  </div>

  <div className="bg-white border border-blue-100 rounded-xl px-4 py-2 shadow-sm">
    <p className="text-xs text-gray-500 uppercase tracking-wide">
      Total Users : <span className="text-blue-700 font-bold text-lg">{totalUpdates.toLocaleString()}</span> 
    </p>
  </div>
</div>
      

      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-12">#</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Business Name</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-28">Phone</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-24">Photos</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Website</th>
              <th className="px-2 py-1.5 text-center font-semibold text-gray-500 uppercase tracking-wider w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400 text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Loading…
                  </span>
                </td>
              </tr>
            ) : updates.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400 text-xs">No pending updates</td>
              </tr>
            ) : (
              updates.map((update, index) => (
                <tr key={update.id} className="hover:bg-blue-50/40 transition-colors duration-150">
                  <td className="px-2 py-1 text-gray-400 font-mono">{(currentPage - 1) * limit + index + 1}</td>
                  <td className="px-2 py-1 font-medium text-gray-800">{update.name ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-500">{update.phone ?? "—"}</td>
                  <td className="px-2 py-1">
                    <div className="flex gap-1">
                      {update.images && update.images.length > 0 ? (
                        update.images.slice(0, 2).map((img, idx) => {
                          const imageUrl = typeof img === "string" ? img : img?.url;
                          const fullImageUrl = imageUrl?.startsWith("http") ? imageUrl : `${CONFIG.IMAGE_BASE_URL}${imageUrl}`;
                          return (
                            <Image
                              key={idx}
                              src={fullImageUrl}
                              onClick={() => openImagePreview(fullImageUrl)}
                              alt={`image-${idx}`}
                              width={32}
                              height={32}
                              className="w-8 h-8 object-cover rounded border border-gray-200 cursor-pointer hover:scale-110 transition"
                            />
                          );
                        })
                      ) : (
                        <span className="text-gray-300 italic">None</span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-1 text-gray-500 max-w-[140px] truncate">{update.email || "—"}</td>
                  <td className="px-2 py-1 text-gray-500 max-w-[120px] truncate">{update.website || "—"}</td>
                  <td className="px-2 py-1">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openModal(update)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-medium transition-colors"
                        title="View"
                      >
                        <FaRegEye className="w-2.5 h-2.5" />
                        View
                      </button>
                      <button
                        onClick={() => handleApprove(update.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-medium transition-colors"
                      >
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(update.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-[11px] font-medium transition-colors"
                      >
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-400 text-xs gap-1.5">
            <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading…
          </div>
        ) : updates.length === 0 ? (
          <div className="text-center text-gray-400 py-10 text-xs">No pending updates</div>
        ) : (
          updates.map((update, index) => (
            <div key={update.id} className="bg-white rounded-lg border border-gray-100 shadow-sm px-3.5 py-3">
              {/* Top row */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">#{(currentPage - 1) * limit + index + 1}</span>
                  <span className="text-xs font-semibold text-gray-800 truncate">{update.name ?? "—"}</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ml-2 bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Pending
                </span>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-0.5 mb-2">
                {update.phone && <p className="text-[11px] text-gray-400">{update.phone}</p>}
                {update.email && <p className="text-[11px] text-gray-500 truncate">{update.email}</p>}
                {update.website && <p className="text-[11px] text-gray-400 truncate">{update.website}</p>}
              </div>

              {/* Images */}
              {update.images && update.images.length > 0 && (
                <div className="flex gap-1.5 mb-2.5">
                  {update.images.slice(0, 3).map((img, idx) => {
                    const imageUrl = typeof img === "string" ? img : img?.url;
                    const fullImageUrl = imageUrl?.startsWith("http") ? imageUrl : `${CONFIG.IMAGE_BASE_URL}${imageUrl}`;
                    return (
                      <Image
                        key={idx}
                        src={fullImageUrl}
                        onClick={() => openImagePreview(fullImageUrl)}
                        alt={`image-${idx}`}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded border border-gray-200 cursor-pointer hover:scale-105 transition"
                      />
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => openModal(update)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
                >
                  <FaRegEye className="w-3 h-3" /> View
                </button>
                <button
                  onClick={() => handleApprove(update.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
                <button
                  onClick={() => handleReject(update.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs font-medium transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="mt-3">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}

      {/* Business Modal */}
      <BusinessRegisterModal
        isOpen={modalOpen}
        onClose={closeModal}
        business={selectedBusiness}
        isAdmin={canEdit}
      />

      {/* Image Preview Overlay */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] cursor-pointer"
          onClick={closeImagePreview}
        >
          <Image
            src={previewImage}
            alt="Preview"
            width={600}
            height={400}
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}