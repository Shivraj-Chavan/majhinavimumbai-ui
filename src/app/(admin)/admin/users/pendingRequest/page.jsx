// "use client";

// import React, { useEffect, useState } from "react";
// import { apiGet, apiPut } from "@/lib/apiClient";
// import { FaRegEye } from "react-icons/fa";
// import BusinessRegisterModal from "../../components/usercomp/BusinessRegisterModal";
// import Pagination from "../../components/usercomp/Pagination";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";

// export default function BusinessUsersPage() {
//   const [businessUsers, setBusinessUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBusiness, setSelectedBusiness] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const limit = 20;

//     // Get user role from Redux
//     const currentUser = useSelector((state) => state.auth?.user);
//     const userRole = currentUser?.role?.toLowerCase() || null;
//     const canEdit = ["admin", "sub-admin"].includes(userRole);
  

//   // 🔹 Unified fetch function (works for both normal + search)
//   const fetchBusinessUsers = async (page = currentPage, name = searchTerm) => {
//     try {
//       setLoading(true);
//       let url = `/businesses?isVerified=false&page=${page}&limit=${limit}`;
//       if (name) url += `&name=${encodeURIComponent(name)}`;

//       const response = await apiGet(url);
//       setBusinessUsers(response.data || []);
//       setTotalPages(response.totalPages || 1);
//     } catch (error) {
//       console.error("Error fetching business users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Initial + on page change
//   useEffect(() => {
//     fetchBusinessUsers(currentPage, searchTerm);
//   }, [currentPage]);

//   // 🔹 Search handler
//   const handleSearch = () => {
//     setCurrentPage(1);
//     fetchBusinessUsers(1, searchTerm);
//   };

//   // 🔹 Clear search
//   const handleClearSearch = () => {
//     if (!searchTerm) return;
//     setSearchTerm("");
//     setCurrentPage(1);
//     fetchBusinessUsers(1, "");
//   };

//   const fetchSuggestions = async (query) => {
//     if (!query.trim()) {
//       setSuggestions([]);
//       setShowDropdown(false);
//       return;
//     }
//     try {
//       // Example suggestion API
//       // const res = await apiGet(`/businesses/search?q=${encodeURIComponent(query)}`);
//       // const data = res.data || [];
//       const data = []; // <- keep empty if not using suggestion API
//       setSuggestions(data);
//       setShowDropdown(data.length > 0);
//     } catch (err) {
//       console.error("Suggestion fetch failed:", err);
//       setSuggestions([]);
//       setShowDropdown(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//     fetchSuggestions(value);
//   };

//   const handleSuggestionClick = (name) => {
//     setSearchTerm(name);
//     setCurrentPage(1);
//     fetchBusinessUsers(1, name);
//     setShowDropdown(false);
//   };

//   const openModal = (business) => {
//     setSelectedBusiness(business);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setSelectedBusiness(null);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleVerified = async (id) => {
//     if (!canEdit) return toast.info("You are not authorized to verify businesses.");
//     try {
//       const response = await apiPut(`/businesses/${id}`, { isVerified: true });
//       if (response && response.success) {
//         setBusinessUsers((prev) => prev.filter((biz) => biz.id !== id));
//         toast.success("Business verified successfully");
//         await fetchBusinessUsers(currentPage, searchTerm);
//         closeModal();
//       } else {
//         toast.error("Failed to verify business");
//       }
//     } catch (error) {
//       console.error("Error verifying business:", error);
//       toast.error("Failed to verify the business");
//     }
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
//       {/* Searchbar */}
//       <div className="relative flex justify-center w-full">
//         <div className="sm:flex items-center gap-3 border border-gray-100 shadow rounded-lg bg-white max-w-xl mb-3 w-full px-2 py-2">
//           <div className="flex w-full relative">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={handleInputChange}
//               placeholder="Search by business name..."
//               onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
//               className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none border border-gray-300"
//             />
//             <button
//               onClick={handleSearch}
//               className="px-4 py-2 bg-blue-600 text-white"
//             >
//               Search
//             </button>
//             <button
//               onClick={handleClearSearch}
//               className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-r-lg text-gray-700 text-sm"
//               title="Clear"
//             >
//               Clear
//             </button>
//             {/* Dropdown Suggestions */}
//             {showDropdown && (
//               <ul className="absolute z-10 top-12 left-0 bg-white rounded-b-md shadow-md max-h-60 overflow-y-auto w-full border border-t-0 border-gray-200">
//                 {suggestions.map((item) => (
//                   <li
//                     key={item.id}
//                     onClick={() => handleSuggestionClick(item.name)}
//                     className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                   >
//                     {item.name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>

//       <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-4">
//         Pending User Request
//       </h2>

//       {loading ? (
//         <div className="text-center text-gray-600">Loading...</div>
//       ) : businessUsers.length === 0 ? (
//         <div className="text-center text-gray-500">No business users found.</div>
//       ) : (
//         <div className="w-full overflow-x-auto">
//           {/* Desktop View */}
//           <div className="hidden md:block">
//             <table className="min-w-full text-sm text-left">
//               <thead className="bg-white/60 text-gray-700 uppercase text-md rounded-t-lg">
//                 <tr>
//                   <th className="px-4 py-3">SR. NO</th>
//                   <th className="px-4 py-3">Business Name</th>
//                   <th className="px-4 py-3">Phone</th>
//                   <th className="px-4 py-3">Email</th>
//                   <th className="px-4 py-3 text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white/30 backdrop-blur-md">
//                 {businessUsers.map((user, index) => (
//                   <tr
//                     key={index}
//                     className="hover:bg-white/50 transition-all duration-300 gap-3"
//                   >
//                     <td className="px-4 py-3 font-medium text-gray-800">
//                       {(currentPage - 1) * limit + (index + 1)}
//                     </td>
//                     <td className="px-4 py-3">{user?.name}</td>
//                     <td className="px-4 py-3">{user?.phone}</td>
//                     <td className="px-4 py-3">{user?.email}</td>
//                     <td className="px-4 py-3 text-center">
//                       <button
//                         onClick={() => openModal(user)}
//                         className="bg-blue-500 hover:bg-blue-600 text-white text-md px-4 py-2 rounded-full font-medium shadow-md transition duration-200"
//                       >
//                         <FaRegEye />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile View */}
//           <div className="md:hidden">
//             {businessUsers.map((user, index) => (
//               <div
//                 key={index}
//                 className="mb-4 p-4 bg-white rounded-lg shadow-md"
//               >
//                 <h3 className="text-lg font-semibold">{user.name}</h3>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Email: {user.email}
//                 </p>
//                 <div className="mt-4 flex justify-end">
//                   <button
//                     onClick={() => openModal(user)}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-md font-medium shadow-md transition duration-200"
//                   >
//                     <FaRegEye />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination */}
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       )}

//       {/* Modal */}
//       <BusinessRegisterModal
//         isOpen={modalOpen}
//         onClose={closeModal}
//         business={selectedBusiness}
//         onVerified={handleVerified}
//         isAdmin={canEdit}
//       />
//     </div>
//   );
// }






"use client";

import React, { useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/apiClient";
import { FaRegEye } from "react-icons/fa";
import BusinessRegisterModal from "../../components/usercomp/BusinessRegisterModal";
import Pagination from "../../components/usercomp/Pagination";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function BusinessUsersPage() {
  const [businessUsers, setBusinessUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [totalBusinesses, setTotalBusinesses] = useState(0);

  const limit = 20;

  const currentUser = useSelector((state) => state.auth?.user);
  const userRole = currentUser?.role?.toLowerCase() || null;
  const canEdit = ["admin", "sub-admin"].includes(userRole);

  const fetchBusinessUsers = async (page = currentPage, name = searchTerm) => {
    try {
      setLoading(true);
      let url = `/businesses?isVerified=false&page=${page}&limit=${limit}`;
      if (name) url += `&name=${encodeURIComponent(name)}`;
      const response = await apiGet(url);
      setBusinessUsers(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotalBusinesses(response.total || 0);

    } catch (error) {
      console.error("Error fetching business users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessUsers(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchBusinessUsers(1, searchTerm);
  };

  const handleClearSearch = () => {
    if (!searchTerm) return;
    setSearchTerm("");
    setCurrentPage(1);
    fetchBusinessUsers(1, "");
  };

  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    try {
      const data = [];
      setSuggestions(data);
      setShowDropdown(data.length > 0);
    } catch (err) {
      console.error("Suggestion fetch failed:", err);
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (name) => {
    setSearchTerm(name);
    setCurrentPage(1);
    fetchBusinessUsers(1, name);
    setShowDropdown(false);
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

  const handleVerified = async (id) => {
    if (!canEdit) return toast.info("You are not authorized to verify businesses.");
    try {
      const response = await apiPut(`/businesses/${id}`, { isVerified: true });
      if (response && response.success) {
        setBusinessUsers((prev) => prev.filter((biz) => biz.id !== id));
        toast.success("Business verified successfully");
        await fetchBusinessUsers(currentPage, searchTerm);
        closeModal();
      } else {
        toast.error("Failed to verify business");
      }
    } catch (error) {
      console.error("Error verifying business:", error);
      toast.error("Failed to verify the business");
    }
  };

  return (
    <div className="p-4 sm:p-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-xl  font-semibold text-gray-800 tracking-tight">
          Pending Business Requests
        </h2>

        <div className="ms-96 bg-white border border-blue-100 rounded-xl px-4 py-1 shadow-sm ">
    <p className="text-xs text-gray-500 uppercase tracking-wide">
      Total Users : <span className="text-blue-700 font-bold text-lg">{totalBusinesses.toLocaleString()}</span> 
    </p>
  
  </div>

        {/* Search Box */}
        <div className="relative flex items-center gap-1.5 border border-gray-200 bg-white rounded-lg shadow-sm px-2 py-1.5 w-full sm:w-auto sm:min-w-[320px]">
          <svg
            className="w-3.5 h-3.5 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Search by business name…"
            className="flex-grow text-xs bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 min-w-0"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              title="Clear"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={handleSearch}
            className="ml-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors shrink-0"
          >
            Search
          </button>

          {/* Dropdown Suggestions */}
          {showDropdown && (
            <ul className="absolute z-10 top-full left-0 mt-1 bg-white rounded-lg shadow-md max-h-52 overflow-y-auto w-full border border-gray-100">
              {suggestions.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSuggestionClick(item.name)}
                  className="px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-12">#</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Business Name</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-32">Phone</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-2 py-1.5 text-center font-semibold text-gray-500 uppercase tracking-wider w-20">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400 text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Loading…
                  </span>
                </td>
              </tr>
            ) : businessUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400 text-xs">
                  No pending business requests found
                </td>
              </tr>
            ) : (
              businessUsers.map((user, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50/40 transition-colors duration-150"
                >
                  <td className="px-2 py-1 text-gray-400 font-mono">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  <td className="px-2 py-1 font-medium text-gray-800">{user?.name ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-500">{user?.phone ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-500 max-w-[200px] truncate">{user?.email ?? "—"}</td>
                  <td className="px-2 py-1 text-center">
                    <button
                      onClick={() => openModal(user)}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-medium transition-colors"
                      title="View Business"
                    >
                      <FaRegEye className="w-2.5 h-2.5" />
                      View
                    </button>
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
        ) : businessUsers.length === 0 ? (
          <div className="text-center text-gray-400 py-10 text-xs">No pending business requests found</div>
        ) : (
          businessUsers.map((user, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-100 shadow-sm px-3.5 py-3"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">
                    #{(currentPage - 1) * limit + index + 1}
                  </span>
                  <span className="text-xs font-semibold text-gray-800 truncate">
                    {user?.name ?? "—"}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ml-2 bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Pending
                </span>
              </div>

              <div className="flex flex-col gap-0.5 mb-2.5">
                <p className="text-[11px] text-gray-500 truncate">{user?.email ?? "—"}</p>
                {user?.phone && (
                  <p className="text-[11px] text-gray-400">{user.phone}</p>
                )}
              </div>

              <button
                onClick={() => openModal(user)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
              >
                <FaRegEye className="w-3 h-3" />
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="mt-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modal */}
      <BusinessRegisterModal
        isOpen={modalOpen}
        onClose={closeModal}
        business={selectedBusiness}
        onVerified={handleVerified}
        isAdmin={canEdit}
      />
    </div>
  );
} 