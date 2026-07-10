// "use client";

// import React, { useEffect, useState } from "react";
// import { apiDelete, apiGet } from "@/lib/apiClient";
// import { FaRegEye } from "react-icons/fa";
// import BusinessRegisterModal from "../../components/usercomp/BusinessRegisterModal";
// import Pagination from "../../components/usercomp/Pagination";
// import ManageBusinessImagesModal from "../../components/usercomp/ManageBusinessImagesModal";
// import { toast } from "react-toastify";

// export default function BusinessUsersPage() {
//   const [businessUsers, setBusinessUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBusiness, setSelectedBusiness] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [imageModalOpen, setImageModalOpen] = useState(false);
//   const [selectedImageBusiness, setSelectedImageBusiness] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const limit = 20;

//   // Common fetch function (handles both search + normal list)
//   const fetchBusinessUsers = async (page = 1, query = "") => {
//     try {
//       setLoading(true);
//       let url = `/businesses?isVerified=true&page=${page}&limit=${limit}`;
//       if (query) {
//         url += `&name=${encodeURIComponent(query)}`;
//       }

//       const response = await apiGet(url);
//       console.log("Businesses response:", response);

//       setBusinessUsers(response.data);
//       setTotalPages(response.totalPages || 1);
//     } catch (error) {
//       console.error("Error fetching business users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial + pagination load
//   useEffect(() => {
//     fetchBusinessUsers(currentPage, searchTerm);
//   }, [currentPage]);

//   const handleSearch = () => {
//     setCurrentPage(1); // reset to first page
//     fetchBusinessUsers(1, searchTerm);
//   };

//   const handleClearSearch = () => {
//     setSearchTerm("");
//     setCurrentPage(1);
//     fetchBusinessUsers(1, "");
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

//   const handleOpenImageManager = (business) => {
//     setSelectedImageBusiness(business);
//     setImageModalOpen(true);
//   };

//   const handleCloseImageManager = () => {
//     setImageModalOpen(false);
//     setSelectedImageBusiness(null);
//   };

//   const handleDelete = async (id) => {
//     console.log("Deleting business with ID:", id);
//     if (!id) {
//       alert("Invalid business ID");
//       return;
//     }

//     try {
//       const data = await apiDelete(`/businesses/${id}`);
//       toast.success(data.msg || "Business deleted");
//       setBusinessUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

//       if (businessUsers.length <= limit) {
//         setCurrentPage((prevPage) => prevPage + 1);
//       }
//     } catch (err) {
//       console.log("API Error:", err);
//       toast.error(err.message);
//     }
//   };

//   const updateVerifiedBusinessList = (updatedBusiness) => {
//     setBusinessUsers((prevUsers) => {
//       const existing = prevUsers.filter((user) => user.id !== updatedBusiness.id);
//       return [...existing, updatedBusiness];
//     });
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
//       {/* Searchbar */}
//       <div className="relative flex justify-center w-full">
//         <div className="sm:flex items-center gap-3 border border-gray-100 shadow rounded-lg bg-white max-w-xl mb-3 w-full px-2 py-2">
//           <div className="flex w-full">
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search by business name..."
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
//           </div>
//         </div>
//       </div>

//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">Business Users</h2>
//       <ManageBusinessImagesModal
//         isOpen={imageModalOpen}
//         onClose={handleCloseImageManager}
//         business={selectedImageBusiness}
//       />

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
//                   <th className="px-4 py-3 text-center">Action</th>
//                 </tr> 
//               </thead> 
//               <tbody className="bg-white/30 backdrop-blur-md ">
//                 {businessUsers.map((user, index) => (
//                   <tr key={index} className="hover:bg-white/50 transition-all duration-300 gap-3">
//                     <td className="px-4 py-3 font-medium text-gray-800">{(currentPage - 1) * limit + (index + 1)}</td>
//                     <td className="px-4 py-3">{user.name}</td>
//                     <td className="px-4 py-3">{user.phone}</td>
//                     <td className="px-4 py-3 flex justify-center gap-3">
//                     <button
//                       className="bg-yellow-500 flex align-center hover:bg-yellow-600 text-white text-md px-4 py-1 mx-1 rounded-full font-medium shadow-md transition duration-200"
//                       onClick={() => handleOpenImageManager(user)}
//                     >
//                       Manage Images
//                     </button>
//                    <button onClick={() => openModal(user)} className="bg-blue-500 gap-2 items-center flex hover:bg-blue-600 text-white text-md px-4 py-2 rounded-full font-medium shadow-md transition duration-200">
//                         <FaRegEye /> View
//                       </button>

//                       <button
//                         className="bg-red-500 flex align-center hover:bg-red-600 text-white text-md px-4 py-1 mx-3 rounded-full font-medium shadow-md transition duration-200"
//                         onClick={() => {
//                           if (confirm("Are you sure you want to delete this business?")) {
//                             handleDelete(user?.id);}
//                         }}
//                       >
//                         Delete
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
//               <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-md">
//                 <h3 className="text-lg font-semibold">{user.name}</h3>
//                 <p className="text-sm text-gray-600 mt-1">Phone: {user.phone}</p>
//                 <div className="mt-4 flex justify-end">
//                   <button onClick={() => openModal(user)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-md font-medium shadow-md transition duration-200">
//                     <FaRegEye /> View
//                   </button>

//                   <button
//                         className="bg-red-500 hover:bg-red-600 text-white text-md px-4 py-1 mx-3 rounded-full font-medium shadow-md transition duration-200"
//                         onClick={() => {
//                           if (confirm("Are you sure you want to delete this business?")) {
//                             handleDelete(user?.id);}
//                         }}
//                       >
//                         Delete
//                       </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination Component */}
//           <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
//         </div>
//       )}

//       {/* Modal Component */}
//       <BusinessRegisterModal isOpen={modalOpen} onClose={closeModal} business={selectedBusiness} updateVerifiedBusinessList={updateVerifiedBusinessList}/>
//     </div>
//   );
// }





"use client";

import React, { useEffect, useState } from "react";
import { apiDelete, apiGet } from "@/lib/apiClient";
import { FaRegEye } from "react-icons/fa";
import BusinessRegisterModal from "../../components/usercomp/BusinessRegisterModal";
import Pagination from "../../components/usercomp/Pagination";
import ManageBusinessImagesModal from "../../components/usercomp/ManageBusinessImagesModal";
import { toast } from "react-toastify";
import {
  Users,
  UserPlus,
  CalendarDays,
  Building2,
  Store,
  TrendingUp,
} from "lucide-react";

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
   const [totalBusinessUsers, setTotalBusinessUsers] = useState(0);
  const limit = 20;

  const [stats, setStats] = useState({
    totalUsers: 0,
    todayUsers: 0,
    monthlyUsers: 0,
    totalBusinesses: 0,
    todayBusinesses: 0,
    monthlyBusinesses: 0,
  });
  
  const fetchDashboardStats = async (id) => {
    const res = await apiGet(`/dashboard/admin-stats?admin_id=${id}`);
  
    setStats({
      totalUsers: res.totalUsers || 0,
      todayUsers: res.todayUsers || 0,
      monthlyUsers: res.monthlyUsers || 0,
      totalBusinesses: res.totalBusinesses || 0,
      todayBusinesses: res.todayBusinesses || 0,
      monthlyBusinesses: res.monthlyBusinesses || 0,
    })
      // setStats(res);
    
  };

  const [adminId, setAdminId] = useState(null);

useEffect(() => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  setAdminId(admin?.id);
}, []);

useEffect(() => {
  if (adminId) {
    fetchDashboardStats(adminId);
  }
}, [adminId]);
  

  const fetchBusinessUsers = async (page = 1, query = "") => {
    try {
      setLoading(true);
      let url = `/businesses?isVerified=true&page=${page}&limit=${limit}`;
      if (query) url += `&name=${encodeURIComponent(query)}`;
      const response = await apiGet(url);
      setBusinessUsers(response.data);
      setTotalBusinessUsers(response.total || 0);
      setTotalPages(response.totalPages || 1);
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
    setSearchTerm("");
    setCurrentPage(1);
    fetchBusinessUsers(1, "");
  };

  const openModal = (business) => { setSelectedBusiness(business); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setSelectedBusiness(null); };
  const handlePageChange = (page) => setCurrentPage(page);
  const handleOpenImageManager = (business) => { setSelectedImageBusiness(business); setImageModalOpen(true); };
  const handleCloseImageManager = () => { setImageModalOpen(false); setSelectedImageBusiness(null); };

  const handleDelete = async (id) => {
    if (!id) { alert("Invalid business ID"); return; }
    try {
      const data = await apiDelete(`/businesses/${id}`);
      toast.success(data.msg || "Business deleted");
      setBusinessUsers((prev) => prev.filter((user) => user.id !== id));
      if (businessUsers.length <= limit) setCurrentPage((p) => p + 1);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateVerifiedBusinessList = (updatedBusiness) => {
    setBusinessUsers((prev) => {
      const existing = prev.filter((user) => user.id !== updatedBusiness.id);
      return [...existing, updatedBusiness];
    });
  };


  // const dashboardCards = [
  //   {
  //     title: "Total Users",
  //     value: stats.totalUsers,
  //     icon: Users,
  //     color: "bg-blue-500",
  //   },
  //   {
  //     title: "Today's Users",
  //     value: stats.todayUsers,
  //     icon: UserPlus,
  //     color: "bg-green-500",
  //   },
  //   {
  //     title: "Monthly Users",
  //     value: stats.monthlyUsers,
  //     icon: CalendarDays,
  //     color: "bg-purple-500",
  //   },
  //   {
  //     title: "Total Businesses",
  //     value: stats.totalBusinesses,
  //     icon: Building2,
  //     color: "bg-orange-500",
  //   },
  //   {
  //     title: "Today's Businesses",
  //     value: stats.todayBusinesses,
  //     icon: Store,
  //     color: "bg-red-500",
  //   },
  //   {
  //     title: "Monthly Businesses",
  //     value: stats.monthlyBusinesses,
  //     icon: TrendingUp,
  //     color: "bg-indigo-500",
  //   },
  // ];



  return (
    <div className="p-4 sm:p-5">
      <ManageBusinessImagesModal
        isOpen={imageModalOpen}
        onClose={handleCloseImageManager}
        business={selectedImageBusiness}
      />

      {/* Header Row */}
     
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
  <div>
    <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
     Bussiness Users
    </h2>
    <p className="text-sm text-gray-500 mt-1">
      View and Verify business Request and business Images.
    </p>
  </div>

  <div className="ms-2 bg-white border border-blue-100 rounded-xl px-4 py-2 shadow-sm ">
    <p className="text-xs text-gray-500 uppercase tracking-wide">
      Total Users : <span className="text-blue-700 font-bold text-lg">{totalBusinessUsers.toLocaleString()}</span> 
    </p>
  </div>


  {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-5 mb-6">
  {dashboardCards.map((card, index) => {
    const Icon = card.icon;

    return (
      <div
        key={index}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">
              {card.title}
            </p>

            <h3 className="mt-2 text-3xl font-bold text-gray-800">
              {Number(card.value).toLocaleString()}
            </h3>
          </div>

          <div
            className={`${card.color} w-14 h-14 rounded-xl flex items-center justify-center`}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
    );
  })}
</div> */}

        {/* Search Box */}
        <div className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-lg shadow-sm px-2 py-1.5 w-full sm:w-auto sm:min-w-[320px]">
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by business name…"
            className="flex-grow text-xs bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 min-w-0"
          />
          {searchTerm && (
            <button onClick={handleClearSearch} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0" title="Clear">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button onClick={handleSearch} className="ml-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors shrink-0">
            Search
          </button>
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
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-32">Created On</th>
              <th className="px-2 py-1.5 text-center font-semibold text-gray-500 uppercase tracking-wider w-56">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-400 text-xs">
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
                <td colSpan={4} className="text-center py-10 text-gray-400 text-xs">No business users found</td>
              </tr>
            ) : (
              businessUsers.map((user, index) => (
                <tr key={index} className="hover:bg-blue-50/40 transition-colors duration-150">
                  <td className="px-2 py-1 text-gray-400 font-mono">{(currentPage - 1) * limit + index + 1}</td>
                  <td className="px-2 py-1 font-medium text-gray-800">{user?.name ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-500">{user?.phone ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-500">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                  <td className="px-2 py-1">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenImageManager(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-[11px] font-medium transition-colors"
                      >
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4-4 4 4 4-6 4 6M3 7h18M3 20h18" />
                        </svg>
                        Images
                      </button>
                      <button
                        onClick={() => openModal(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-medium transition-colors"
                      >
                        <FaRegEye className="w-2.5 h-2.5" />
                        View
                      </button>
                      <button
                        onClick={() => { if (confirm("Are you sure you want to delete this business?")) handleDelete(user?.id); }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-[11px] font-medium transition-colors"
                      >
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Delete
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
        ) : businessUsers.length === 0 ? (
          <div className="text-center text-gray-400 py-10 text-xs">No business users found</div>
        ) : (
          businessUsers.map((user, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-100 shadow-sm px-3.5 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">#{(currentPage - 1) * limit + index + 1}</span>
                  <span className="text-xs font-semibold text-gray-800 truncate">{user?.name ?? "—"}</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ml-2 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Verified
                </span>
              </div>
              {user?.phone && <p className="text-[11px] text-gray-400 mb-2.5">{user.phone}</p>}
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleOpenImageManager(user)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-xs font-medium transition-colors"
                >
                  Images
                </button>
                <button
                  onClick={() => openModal(user)}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
                >
                  <FaRegEye className="w-3 h-3" /> View
                </button>
                <button
                  onClick={() => { if (confirm("Are you sure you want to delete this business?")) handleDelete(user?.id); }}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs font-medium transition-colors"
                >
                  Delete
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

      <BusinessRegisterModal
        isOpen={modalOpen}
        onClose={closeModal}
        business={selectedBusiness}
        updateVerifiedBusinessList={updateVerifiedBusinessList}
      />
    </div>
  );
}