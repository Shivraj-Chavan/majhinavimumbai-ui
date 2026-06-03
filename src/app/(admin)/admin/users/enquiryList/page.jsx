// "use client";

// import { useEffect, useState } from "react";
// import { apiGet } from "@/lib/apiClient";
// import { toast } from "react-toastify";
// import Pagination from "../../components/usercomp/Pagination";

// export default function AdminEnquiries() {
//   const [enquiries, setEnquiries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);
//     const [currentPage, setCurrentPage] = useState(1);
//     const limit= 10;

//   useEffect(() => {
//     const fetchEnquiries = async () => {
//       try {
//         const res = await apiGet(`/enquiries/all?page=${currentPage}&limit=${limit}`);
//         console.log("Enquiries", res);
//         setEnquiries(res);
//         setTotalPages(res.totalPages);
//       } catch (err) {
//         toast.error("Failed to load enquiries");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEnquiries();
//   }, [currentPage]);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Business Enquiries</h2>

//       {loading ? (
//         <div className="text-center text-gray-600">Loading...</div>
//       ) : enquiries.length === 0 ? (
//         <div className="text-center text-gray-500">No enquiries found.</div>
//       ) : (
//         <div className="w-full overflow-x-auto">
//           {/* Desktop View */}
//           <div className="hidden md:block">
//             <table className="min-w-full text-sm text-left">
//               <thead className="bg-white/60 text-gray-700 uppercase text-md rounded-t-lg">
//                 <tr>
//                   <th className="px-4 py-3">Sr. No</th>
//                   <th className="px-4 py-3">Business</th>
//                   {/* <th className="px-4 py-3">Email</th> */}
//                   <th className="px-4 py-3">Phone</th>
//                   <th className="px-4 py-3">User</th>
//                   <th className="px-4 py-3">User Email</th>
//                   <th className="px-4 py-3">Message</th>
//                   <th className="px-4 py-3">Date</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white/30 backdrop-blur-md">
//                 {enquiries?.data?.map((enq, i) => (
//                   <tr key={enq.enquiry_id} className="hover:bg-white/50 transition-all duration-300">
//                     <td className="px-4 py-3 font-medium text-gray-800">{i + 1}</td>
//                     <td className="px-4 py-3">{enq.business_name}</td>
//                     {/* <td className="px-4 py-3">{enq.business_email}</td> */}
//                     <td className="px-4 py-3">{enq.business_phone}</td>
//                     <td className="px-4 py-3">{enq.user_name}</td>
//                     <td className="px-4 py-3">{enq.user_email}</td>
//                     <td className="px-4 py-3">{enq.message}</td>
//                     <td className="px-4 py-3">{new Date(enq.created_at).toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile View */}
//           <div className="md:hidden">
//             {enquiries?.data?.map((enq, i) => (
//               <div key={enq.enquiry_id} className="mb-4 p-4 bg-white rounded-lg shadow-md">
//                 <p className="text-sm text-gray-600">#{i + 1}</p>
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   {enq.user_name} ➝ {enq.business_name}
//                 </h3>
//                 <p className="text-sm text-gray-600 mt-1">User Email: {enq.user_email}</p>
//                 {/* <p className="text-sm text-gray-600">Business Email: {enq.business_email}</p> */}
//                 <p className="text-sm text-gray-600">Business Phone: {enq.business_phone}</p>
//                 <p className="text-sm text-gray-700 mt-2">Message: {enq.message}</p>
//                 <p className="text-sm text-gray-500 mt-2">Date: {new Date(enq.created_at).toLocaleString()}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Pagination */}
//           <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
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
  const limit = 10;

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await apiGet(`/enquiries/all?page=${currentPage}&limit=${limit}`);
        console.log("Enquiries", res);
        setEnquiries(res);
        setTotalPages(res.totalPages);
      } catch (err) {
        toast.error("Failed to load enquiries");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, [currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="p-4 sm:p-5">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-800 tracking-tight">All Business Enquiries</h2>
        <p className="text-sm text-gray-500">
        Track incoming business enquiries and customer interactions.
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-12">#</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Business</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-28">Phone</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">User Email</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-36">Date</th>
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
            ) : enquiries?.data?.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400 text-xs">No enquiries found</td>
              </tr>
            ) : (
              enquiries?.data?.map((enq, i) => (
                <tr key={enq.enquiry_id} className="hover:bg-blue-50/40 transition-colors duration-150">
                  <td className="px-2 py-1 text-gray-400 font-mono">{i + 1}</td>
                  <td className="px-2 py-1 font-medium text-gray-800">{enq.business_name ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-500">{enq.business_phone ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-700">{enq.user_name ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-500 max-w-[160px] truncate">{enq.user_email ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-500 max-w-[200px] truncate">{enq.message ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-400 whitespace-nowrap">
                    {new Date(enq.created_at).toLocaleString()}
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
        ) : enquiries?.data?.length === 0 ? (
          <div className="text-center text-gray-400 py-10 text-xs">No enquiries found</div>
        ) : (
          enquiries?.data?.map((enq, i) => (
            <div key={enq.enquiry_id} className="bg-white rounded-lg border border-gray-100 shadow-sm px-3.5 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">#{i + 1}</span>
                  <span className="text-xs font-semibold text-gray-800 truncate">
                    {enq.user_name} → {enq.business_name}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5 mb-1">
                <p className="text-[11px] text-gray-500 truncate">{enq.user_email ?? "—"}</p>
                {enq.business_phone && (
                  <p className="text-[11px] text-gray-400">{enq.business_phone}</p>
                )}
                {enq.message && (
                  <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5">{enq.message}</p>
                )}
                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(enq.created_at).toLocaleString()}
                </p>
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
