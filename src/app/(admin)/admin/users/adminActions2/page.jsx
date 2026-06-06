// "use client";

// import React, { useEffect, useState } from "react";
// import Pagination from "../../components/usercomp/Pagination";
// import { apiGet } from "@/lib/apiClient";
// import DownloadAdminActions from "../../components/ActionsDownloadReport";

// export default function AdminActionsPage() {
//   const [actions, setActions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [query, setQuery] = useState("");
//   const [stats, setStats] = useState({
//     totalBusinesses: 0,
//     verifiedBusinesses: 0,
//     pendingBusinesses: 0,
//     subAdmins: 0,
//     approvedBySubAdmin: 0,
//     todayCreated: 0,
//     dailyStats: [],
//   });
//   const limit = 15;

//   // Debounce search
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setQuery(searchTerm);
//       setCurrentPage(1);
//     }, 500);

//     return () => clearTimeout(handler);
//   }, [searchTerm]);

//   // Fetch actions
//   useEffect(() => {
//     const fetchActions = async () => {
//       try {
//         setLoading(true);
//         const res = await apiGet(
//           `/businesses/admin/actions?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(query)}`
//         );
//         setActions(res?.actions || []);
//         setTotalPages(res?.totalPages || 1);
//       } catch (err) {
//         setError(err.message || "Failed to fetch admin actions");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchActions();
//   }, [currentPage, query]);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//           const res = await apiGet("/dashboard");
//         setStats(res);
//       } catch (err) {
//         console.error(err);
//       }
//     };
  
//     fetchStats();
//   }, []);

//   const handlePageChange = (page) => setCurrentPage(page);

//   const handleSearchEnter = (e) => {
//     if (e.key === "Enter") {
//       setQuery(searchTerm);
//       setCurrentPage(1);
//     }
//   };

//   const handleSearchClick = () => {
//     setQuery(searchTerm);
//     setCurrentPage(1);
//   };

//   const handleClearSearch = () => {
//     setSearchTerm("");
//     setQuery("");
//     setCurrentPage(1);
//   };

//   const formatDate = (timestamp) =>
//     timestamp ? new Date(timestamp).toLocaleString() : "-";

//   return (
//     <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
//   <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
   
//     <h1 className="text-2xl font-semibold text-gray-800"> Admin Actions </h1>


//    {/*download excel */}
//     <div className="flex items-center gap-2 flex-wrap mb-3">
//       <DownloadAdminActions />
//     </div>
//   </div>


//    {/* Dashboard Stats */}
//    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">

// <div className="bg-white rounded-xl p-4 shadow">
//   <p className="text-sm text-gray-500">Total Businesses</p>
//   <h2 className="text-2xl font-bold">
//     {stats.totalBusinesses}
//   </h2>
// </div>

// <div className="bg-green-50 rounded-xl p-4 shadow">
//   <p className="text-sm text-gray-500">Verified</p>
//   <h2 className="text-2xl font-bold text-green-600">
//     {stats.verifiedBusinesses}
//   </h2>
// </div>

// <div className="bg-yellow-50 rounded-xl p-4 shadow">
//   <p className="text-sm text-gray-500">Pending</p>
//   <h2 className="text-2xl font-bold text-yellow-600">
//     {stats.pendingBusinesses}
//   </h2>
// </div>

// <div className="bg-blue-50 rounded-xl p-4 shadow">
//   <p className="text-sm text-gray-500">Sub Admins</p>
//   <h2 className="text-2xl font-bold text-blue-600">
//     {stats.subAdmins}
//   </h2>
// </div>

// <div className="bg-purple-50 rounded-xl p-4 shadow">
//   <p className="text-sm text-gray-500">Approved</p>
//   <h2 className="text-2xl font-bold text-purple-600">
//     {stats.approvedBySubAdmin}
//   </h2>
// </div>

// <div className="bg-red-50 rounded-xl p-4 shadow">
//   <p className="text-sm text-gray-500">Today's Created</p>
//   <h2 className="text-2xl font-bold text-red-600">
//     {stats.todayCreated}
//   </h2>
// </div>

// </div>


//       {/* Search Bar */}
//       <div className="mb-4 flex justify-center gap-2 flex-wrap">
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onKeyDown={handleSearchEnter}
//           placeholder="Search by admin, action, target or business..."
//           className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none border border-gray-300 min-w-[200px]"
//         />
//         <button
//           onClick={handleSearchClick}
//           className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
//         >
//           Search
//         </button>
//         <button
//           onClick={handleClearSearch}
//           className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm"
//           title="Clear"
//         >
//           Clear
//         </button>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <div className="text-center text-gray-600">Loading...</div>
//       ) : error ? (
//         <div className="text-center text-red-500">{error}</div>
//       ) : actions.length === 0 ? (
//         <div className="text-center text-gray-500">No actions found.</div>
//       ) : (
//         <div className="w-full overflow-x-auto rounded-lg">
//           <table className="min-w-full text-sm text-left border border-gray-200">
//             <thead className="bg-white/60 text-gray-700 uppercase text-md">
//               <tr>
//                 <th className="px-4 py-3">ID</th>
//                 <th className="px-4 py-3">Admin</th>
//                 <th className="px-4 py-3">Action</th>
//                 <th className="px-4 py-3">Target Type</th>
//                 <th className="px-4 py-3">Target ID</th>
//                 <th className="px-4 py-3">Timestamp</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white/30 backdrop-blur-md">
//               {actions.map((action, index) => (
//                 <tr
//                   key={action.id}
//                   className="hover:bg-white/50 transition-all duration-300"
//                 >
//                   <td className="px-4 py-3 font-medium text-gray-800">
//                     {index + 1 + (currentPage - 1) * limit}
//                   </td>
//                   <td className="px-4 py-3">{action.admin_name || action.admin_id}</td>
//                   <td className="px-4 py-3">{action.action}</td>
//                   <td className="px-4 py-3">{action.target_type}</td>
//                   <td className="px-4 py-3">{action.target_id || "-"}</td>
//                   <td className="px-4 py-3 text-sm text-gray-500">
//                     {formatDate(action.created_at)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Pagination */}
//       <div className="mt-4">
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={handlePageChange}
//         />
//       </div>
//     </div>
//   );
// }




"use client";

import React, { useEffect, useState } from "react";
import Pagination from "../../components/usercomp/Pagination";
import { apiGet } from "@/lib/apiClient";
import DownloadAdminActions from "../../components/ActionsDownloadReport";

export default function AdminActions2() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalActions, setTotalActions] = useState(0);
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    verifiedBusinesses: 0,
    pendingBusinesses: 0,
    subAdmins: 0,
    approvedBySubAdmin: 0,
    todayCreated: 0,
    dailyStats: [],
  });
  const limit = 20;
   const [adminStats, setAdminStats] = useState({
      totalCreatedBusinesses: 0,
      todayCreatedBusinesses: 0,
      totalCreatedUsers: 0,
      todayCreatedUsers: 0,
    });
  
  const adminStatCards = [
    { label: "Sub-admin Total Businesses", value: stats.totalBusinesses, bg: "bg-white", text: "text-gray-800", dot: "bg-gray-400" },
    {
      label: "Today's Businesses",
      value: adminStats.todayCreatedBusinesses,
      bg: "bg-blue-50",
      text: "text-blue-600",
      dot: "bg-blue-500",
    },
    {
      label: "Total Businesses",
      value: adminStats.totalCreatedBusinesses,
      bg: "bg-green-50",
      text: "text-green-600",
      dot: "bg-green-500",
    },
    {
      label: "Today's Users",
      value: adminStats.todayCreatedUsers,
      bg: "bg-purple-50",
      text: "text-purple-600",
      dot: "bg-purple-500",
    },
    {
      label: "Total Users",
      value: adminStats.totalCreatedUsers,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      dot: "bg-emerald-500",
    },
    { label: "Verified", value: stats.verifiedBusinesses, bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  ];
  

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

    useEffect(() => {
      const ADMIN_ID = 240;
    
      const fetchAdminStats = async () => {
        try {
          const res = await apiGet(`/dashboard/admin-stats?admin_id=${ADMIN_ID}`)
          setAdminStats(res);
    
        } catch (err) {
          console.error(err);
        }
      };
    
      fetchAdminStats();
    }, []);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);
        const ADMIN_ID = 240;

        const res = await apiGet(
          `/businesses/admin/actions?page=${currentPage}&limit=${limit}&admin_id=${ADMIN_ID}&search=${encodeURIComponent(query)}`
        );
        setActions(res?.actions || []);
        setTotalPages(res?.totalPages || 1);
        setTotalActions(res?.totalCount || 0);
      } catch (err) {
        setError(err.message || "Failed to fetch admin actions");
      } finally {
        setLoading(false);
      }
    };
    fetchActions();
  }, [currentPage, query]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiGet("/dashboard");
        setStats(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleSearchEnter = (e) => { if (e.key === "Enter") { setQuery(searchTerm); setCurrentPage(1); } };
  const handleSearchClick = () => { setQuery(searchTerm); setCurrentPage(1); };
  const handleClearSearch = () => { setSearchTerm(""); setQuery(""); setCurrentPage(1); };
  const formatDate = (timestamp) => timestamp ? new Date(timestamp).toLocaleString() : "—";

  const statCards2 = [
    { label: "Total Businesses", value: stats.totalBusinesses, bg: "bg-white", text: "text-gray-800", dot: "bg-gray-400" },
    ]

  // const statCards = [
  //   { label: "Total Businesses", value: stats.totalBusinesses, bg: "bg-white", text: "text-gray-800", dot: "bg-gray-400" },
   
  //   { label: "Pending", value: stats.pendingBusinesses, bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" },
  //   { label: "Sub Admins", value: stats.subAdmins, bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  //   { label: "Approved", value: stats.approvedBySubAdmin, bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-500" },
  //   { label: "Today's Created", value: stats.todayCreated, bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  // ];

  return (
    <div className="p-4 sm:p-5">
     {/* Header Row */}
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">

{/* Left Section */}
<div>
  <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
    Admin Actions
  </h1>
  <p className="text-sm text-gray-500 mt-1">
    Track all administrative activities and system changes.
  </p>

</div>

{/* Right Section */}
<div className="flex flex-wrap items-center gap-3">

  {/* Total Actions */}
  <div className="bg-white border border-blue-100 rounded-xl px-4 py-2 shadow-sm">
    <p className="text-xs text-gray-500 uppercase tracking-wide">
      Total Actions : <span className="text-blue-700 text-md font-bold">{totalActions.toLocaleString()}</span>
    </p>
  </div>

  {/* Search Bar */}
  <div className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-lg shadow-sm px-2 py-1.5 w-full sm:w-auto sm:min-w-[350px]">
    <svg
      className="w-3.5 h-3.5 text-gray-400 shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
      />
    </svg>

    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={handleSearchEnter}
      placeholder="Search by admin, action, target or business..."
      className="flex-grow text-xs bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 min-w-0"
    />

    {searchTerm && (
      <button
        onClick={handleClearSearch}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        ✕
      </button>
    )}

    <button
      onClick={handleSearchClick}
      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
    >
      Search
    </button>
  </div>

  <DownloadAdminActions />
</div>

</div>

<div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-5">
  {adminStatCards.map(({ label, value, bg, text, dot }) => (
    <div
      key={label}
      className={`${bg} rounded-xl border border-gray-100 shadow-sm px-4 py-3`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <p className="text-[11px] text-gray-500 font-medium">
          {label}
        </p>
      </div>

      <p className={`text-xl font-bold ${text}`}>
        {value.toLocaleString()}
      </p>
    </div>
  ))}
</div>


      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-12">#</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Admin</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-28">Target Type</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-24">Target ID</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-36">Timestamp</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Loading…
                  </span>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-red-400 text-xs">{error}</td>
              </tr>
            ) : actions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 text-xs">No actions found</td>
              </tr>
            ) : (
              actions.map((action, index) => (
                <tr key={action.id} className="hover:bg-blue-50/40 transition-colors duration-150">
                  <td className="px-2 py-1 text-gray-400 font-mono">{index + 1 + (currentPage - 1) * limit}</td>
                  <td className="px-2 py-1 font-medium text-gray-800">{action.admin_name || action.admin_id}</td>
                  <td className="px-2 py-1 text-gray-700">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono text-[10px]">
                      {action.action}
                    </span>
                  </td>
                  <td className="px-2 py-1 text-gray-500">{action.target_type}</td>
                  <td className="px-2 py-1 text-gray-400 font-mono">{action.target_id || "—"}</td>
                  <td className="px-2 py-1 text-gray-400 whitespace-nowrap">{formatDate(action.created_at)}</td>
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
        ) : error ? (
          <div className="text-center text-red-400 py-10 text-xs">{error}</div>
        ) : actions.length === 0 ? (
          <div className="text-center text-gray-400 py-10 text-xs">No actions found</div>
        ) : (
          actions.map((action, index) => (
            <div key={action.id} className="bg-white rounded-lg border border-gray-100 shadow-sm px-3.5 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">#{index + 1 + (currentPage - 1) * limit}</span>
                  <span className="text-xs font-semibold text-gray-800 truncate">{action.admin_name || action.admin_id}</span>
                </div>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono text-[10px] shrink-0 ml-2">
                  {action.action}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                {action.target_type && <p className="text-[11px] text-gray-500">Type: {action.target_type}</p>}
                {action.target_id && <p className="text-[11px] text-gray-400 font-mono">ID: {action.target_id}</p>}
                <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(action.created_at)}</p>
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
    </div>
  );
}