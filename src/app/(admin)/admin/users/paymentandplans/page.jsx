// "use client";

// import { useEffect, useState } from "react";
// import { apiGet } from "@/lib/apiClient";
// import { toast } from "react-toastify";
// import Pagination from "../../components/usercomp/Pagination";

// export default function AdminEnquiries() {
//   const [enquiries, setEnquiries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [searchInput, setSearchInput] = useState("");
//   const limit = 20;

//   useEffect(() => {
//     const fetchEnquiries = async () => {
//       try {
//         setLoading(true);
//         const res = await apiGet(
//           `/businesses/payments?page=${currentPage}&limit=${limit}&search=${search}`
//         );
//         setEnquiries(res.data);
//         setTotalPages(res.totalPages);
//       } catch (err) {
//         toast.error("Failed to load payments");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEnquiries();
//   }, [currentPage, search]);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1); 
//     setSearch(searchInput.trim());
//   };

//   const handleReset = () => {
//     setSearch("");
//     setSearchInput("");
//     setCurrentPage(1);
//   };

//   return (
//     <div className="p-2 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">
//         Payments & Plans
//       </h2>

//       {/* 🔍 Search Box */}
//       <form
//         onSubmit={handleSearch}
//         className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-4"
//       >
//         <input
//           type="text"
//           placeholder="Search by name or phone"
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
//         />
//         <div className="flex gap-2">
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
//           >
//             Search
//           </button>
//           <button
//             type="button"
//             onClick={handleReset}
//             className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all"
//           >
//             Reset
//           </button>
//         </div>
//       </form>

//       {loading ? (
//         <div className="text-center text-gray-600">Loading...</div>
//       ) : enquiries.length === 0 ? (
//         <div className="text-center text-gray-500">
//           No Payments & Plans found.
//         </div>
//       ) : (
//         <div className="w-full overflow-x-auto">
//           {/* Desktop View */}
//           <div className="hidden md:block">
//             <table className="min-w-full text-sm text-left">
//               <thead className="bg-white/60 p-2 text-gray-700 uppercase text-md rounded-t-lg">
//                 <tr>
//                   <th className="px-2 py-1.5">No</th>
//                   <th className="px-2 py-1.5">Business</th>
//                   <th className="px-2 py-1.5">Phone</th>
//                   <th className="px-2 py-1.5">Plan Name</th>
//                   <th className="px-2 py-1.5">Amount</th>
//                   <th className="px-2 py-1.5">Status</th>
//                   <th className="px-2 py-1.5">Time</th>
//                   <th className="px-2 py-1.5">Start Date</th>
//                   <th className="px-2 py-1.5">End Date</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white/30 backdrop-blur-md">
//                 {enquiries.map((enq, i) => (
//                   <tr
//                     key={enq.transaction_id}
//                     className="hover:bg-white/50 transition-all duration-300"
//                   >
//                     <td className="px-2 py-1.5 font-medium text-gray-800">
//                       {(currentPage - 1) * limit + i + 1}
//                     </td>
//                     <td className="px-2 py-1.5">{enq.business_name}</td>
//                     <td className="px-2 py-1.5">{enq.business_phone}</td>
//                     <td className="px-2 py-1.5">{enq.plan_name}</td>
//                     <td className="px-2 py-1.5">{enq.amount}</td>
//                     <td className="px-2 py-1.5">
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                         enq.payment_status === "completed" ? "bg-green-100 text-green-700" : enq.payment_status === "pending"
//                           ? "bg-red-100 text-red-700": "bg-gray-100 text-gray-700"
//                       }`}
//                     >
//                       {enq.payment_status.charAt(0).toUpperCase() + enq.payment_status.slice(1)}
//                     </span>
//                   </td>
//                     <td className="px-2 py-1.5">
//                       {new Date(enq.payment_time).toLocaleString()}
//                     </td>
//                     <td className="px-2 py-1.5">
//                       {enq.plan_start
//                         ? new Date(enq.plan_start).toLocaleDateString()
//                         : "-"}
//                     </td>
//                     <td className="px-2 py-1.5">
//                       {enq.plan_end
//                         ? new Date(enq.plan_end).toLocaleDateString()
//                         : "-"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
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
import { apiGet } from "@/lib/apiClient";
import { toast } from "react-toastify";
import Pagination from "../../components/usercomp/Pagination";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const limit = 20;

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        setLoading(true);
        const res = await apiGet(
          `/businesses/payments?page=${currentPage}&limit=${limit}&search=${search}`
        );
        setEnquiries(res.data);
        setTotalPages(res.totalPages);
      } catch (err) {
        toast.error("Failed to load payments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, [currentPage, search]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearch(searchInput.trim());
  };

  const handleReset = () => {
    setSearch("");
    setSearchInput("");
    setCurrentPage(1);
  };

  const statusStyle = (status) => {
    if (status === "completed") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    if (status === "pending") return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    return "bg-gray-100 text-gray-500 ring-1 ring-gray-200";
  };

  const statusDot = (status) => {
    if (status === "completed") return "bg-emerald-500";
    if (status === "pending") return "bg-amber-400";
    return "bg-gray-400";
  };

  return (
    <div className="p-4 sm:p-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

      <div>
        <h2 className="text-base font-semibold text-gray-800 tracking-tight">
          Payments & Plans
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Monitor subscriptions, payment activity, and plan performance.
        </p>
      </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-lg shadow-sm px-2 py-1.5 w-full sm:w-auto sm:min-w-[320px]">
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or phone…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-grow text-xs bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 min-w-0"
          />
          {(searchInput || search) && (
            <button type="button" onClick={handleReset} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0" title="Reset">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button type="submit" className="ml-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors shrink-0">
            Search
          </button>
        </form>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-12">#</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Business</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-28">Phone</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-20">Amount</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-24">Status</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-36">Time</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-24">Start</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-24">End</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-400 text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Loading…
                  </span>
                </td>
              </tr>
            ) : enquiries.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-400 text-xs">No payments found</td>
              </tr>
            ) : (
              enquiries.map((enq, i) => (
                <tr key={enq.transaction_id} className="hover:bg-blue-50/40 transition-colors duration-150">
                  <td className="px-2 py-1 text-gray-400 font-mono">{(currentPage - 1) * limit + i + 1}</td>
                  <td className="px-2 py-1 font-medium text-gray-800">{enq.business_name ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-500">{enq.business_phone ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-700">{enq.plan_name ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-700 font-medium">{enq.amount ?? "—"}</td>
                  <td className="px-2 py-1">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${statusStyle(enq.payment_status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(enq.payment_status)}`} />
                      {enq.payment_status.charAt(0).toUpperCase() + enq.payment_status.slice(1)}
                    </span>
                  </td>
                  <td className="px-2 py-1 text-gray-400 whitespace-nowrap">{new Date(enq.payment_time).toLocaleString()}</td>
                  <td className="px-2 py-1 text-gray-400 whitespace-nowrap">{enq.plan_start ? new Date(enq.plan_start).toLocaleDateString() : "—"}</td>
                  <td className="px-2 py-1 text-gray-400 whitespace-nowrap">{enq.plan_end ? new Date(enq.plan_end).toLocaleDateString() : "—"}</td>
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
        ) : enquiries.length === 0 ? (
          <div className="text-center text-gray-400 py-10 text-xs">No payments found</div>
        ) : (
          enquiries.map((enq, i) => (
            <div key={enq.transaction_id} className="bg-white rounded-lg border border-gray-100 shadow-sm px-3.5 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">#{(currentPage - 1) * limit + i + 1}</span>
                  <span className="text-xs font-semibold text-gray-800 truncate">{enq.business_name ?? "—"}</span>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ml-2 ${statusStyle(enq.payment_status)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot(enq.payment_status)}`} />
                  {enq.payment_status.charAt(0).toUpperCase() + enq.payment_status.slice(1)}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                {enq.business_phone && <p className="text-[11px] text-gray-400">{enq.business_phone}</p>}
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[11px] text-gray-600">{enq.plan_name ?? "—"}</p>
                  <p className="text-[11px] font-semibold text-gray-700">{enq.amount ?? "—"}</p>
                </div>
                {enq.plan_start && enq.plan_end && (
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(enq.plan_start).toLocaleDateString()} → {new Date(enq.plan_end).toLocaleDateString()}
                  </p>
                )}
                <p className="text-[10px] text-gray-400">{new Date(enq.payment_time).toLocaleString()}</p>
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