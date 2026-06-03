// "use client";

// import React, { useEffect, useState } from "react";
// import { apiGet, apiPost } from "@/lib/apiClient";
// import Pagination from "../../components/usercomp/Pagination";
// import { LuEyeClosed } from "react-icons/lu";
// import { FaRegEye } from "react-icons/fa";

// export default function ContactListPage() {
//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const limit = 20;

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const res = await apiGet(`/contact?page=${currentPage}&limit=${limit}`);
//         console.log('Contact List:', res);
//         setContacts(res?.contacts);
//         setLoading(false);
//         setTotalPages(res.totalPages || 1);
//       } catch (err) {
//         setError(err.message || "Failed to fetch contacts");
//         setLoading(false);
//       }
//     };

//     fetchContacts();
//   }, [currentPage]);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//     //view/unview
//     const handleToggleView = async (id, currentStatus) => {
//       console.log({currentStatus})
//       if(currentStatus) return 
//       const updatedContacts = contacts.map((contact) =>
//         contact.id === id ? { ...contact, viewed: !currentStatus } : contact
//       );
//       setContacts(updatedContacts); 
//       console.log(updatedContacts)
  
//       try {
//         await apiPost(`/contact/${id}/toggle-view`, { viewed: !currentStatus });
//         console.log("Status updated successfully");
//       } catch (err) {
//         console.error("Failed to update status:", err);
  
//         setContacts(contacts);
//         alert("Failed to update view status. Please try again.");
//       }
//     };

//   return (
//     <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Contact Submissions</h2>

//       {loading ? (
//         <div className="text-center text-gray-600">Loading...</div>
//       ) : error ? (
//         <div className="text-center text-red-500">{error}</div>
//       ) : contacts.length === 0 ? (
//         <div className="text-center text-gray-500">No contacts found.</div>
//       ) : (
//         <div className="w-full overflow-x-auto">
//           {/* Desktop View */}
//           <div className="hidden md:block">
//             <table className="min-w-full text-sm text-left">
//               <thead className="bg-white/60 text-gray-700 uppercase text-md rounded-t-lg">
//                 <tr>
//                   <th className="px-4 py-3">Sr. No</th>
//                   <th className="px-4 py-3">Company</th>
//                   <th className="px-4 py-3">Name</th>
//                   <th className="px-4 py-3">Phone</th>
//                   <th className="px-4 py-3">Enquiry</th>
//                   <th className="px-4 py-3">Submitted At</th>
//                   <th className="px-4 py-3">View/Unview</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white/30 backdrop-blur-md">
//                 {contacts.map((contact, index) => (
//                   <tr key={contact.id} className="hover:bg-white/50 transition-all duration-300">
//                     <td className="px-4 py-3 font-medium text-gray-800">{index + 1}</td>
//                     <td className="px-4 py-3">{contact.company_name}</td>
//                     <td className="px-4 py-3">{contact.user_name}</td>
//                     <td className="px-4 py-3">{contact.phone}</td>
//                     <td className="px-4 py-3">{contact.enquiry}</td>
//                     <td className="text-sm text-gray-500 mt-2"> {new Date(contact.created_at).toLocaleString()}</td>
//                     <td className="px-4 py-3">
//                       <button
//                         onClick={() =>
//                           handleToggleView(contact.id, contact.viewed)
//                         }
//                         className={`px-3 py-1 rounded-xl text-white text-sm font-medium transition-colors duration-300 ${
//                           contact.viewed
//                             ? "bg-green-500 hover:bg-green-600"
//                             : "bg-red-500 hover:bg-red-600"
//                         }`}
//                       >
//                       <div className="flex items-center gap-2">
//                       {contact.viewed ? (
//                         <span className="flex items-center gap-1 font-medium text-white">
//                           <FaRegEye className="text-lg" />
//                           Viewed
//                         </span>
//                       ) : (
//                         <span className="flex items-center gap-1 text-white font-medium">
//                           <LuEyeClosed className="text-lg" />
//                           Unviewed
//                         </span>
//                       )}
//                     </div>
//                       </button>
//                     </td>
//                   </tr>
                  
//                 ))}
//               </tbody>
//             </table>
//           </div>

       
//         </div>
//       )}

//       {/* Pagination */}
//         <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
//     </div>
//   );
// }



"use client";

import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/apiClient";
import Pagination from "../../components/usercomp/Pagination";
import { LuEyeClosed } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa";

export default function ContactListPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const limit = 20;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await apiGet(`/contact?page=${currentPage}&limit=${limit}`);
        setContacts(res?.contacts);
        setLoading(false);
        setTotalContacts(res?.total || 0);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        setError(err.message || "Failed to fetch contacts");
        setLoading(false);
      }
    };
    fetchContacts();
  }, [currentPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleToggleView = async (id, currentStatus) => {
    if (currentStatus) return;
    const updatedContacts = contacts.map((c) =>
      c.id === id ? { ...c, viewed: !currentStatus } : c
    );
    setContacts(updatedContacts);
    try {
      await apiPost(`/contact/${id}/toggle-view`, { viewed: !currentStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
      setContacts(contacts);
      alert("Failed to update view status. Please try again.");
    }
  };

  return (
    <div className="p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
  <div>
    <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
      Contact Submissions
    </h2>
    <p className="text-sm text-gray-500 mt-1">
      View and manage customer enquiries and contact requests.
    </p>
  </div>

  <div className="bg-white border border-blue-100 rounded-xl px-4 py-2 shadow-sm">
    <p className="text-xs text-gray-500 uppercase tracking-wide">
      Total Users : <span className="text-blue-700 font-bold text-lg">{totalContacts.toLocaleString()}</span> 
    </p>
  </div>
</div>


      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-12">#</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-28">Phone</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Enquiry</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-36">Submitted At</th>
              <th className="px-2 py-1.5 text-center font-semibold text-gray-500 uppercase tracking-wider w-24">Status</th>
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
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-red-400 text-xs">{error}</td>
              </tr>
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400 text-xs">No contacts found</td>
              </tr>
            ) : (
              contacts.map((contact, index) => (
                <tr key={contact.id} className="hover:bg-blue-50/40 transition-colors duration-150">
                  <td className="px-2 py-1 text-gray-400 font-mono">{(currentPage - 1) * limit + index + 1}</td>
                  <td className="px-2 py-1 font-medium text-gray-800 max-w-[120px] truncate">{contact.company_name ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-700 max-w-[100px] truncate">{contact.user_name ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-500">{contact.phone ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-500 max-w-[180px] truncate">{contact.enquiry ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-400 whitespace-nowrap">
                    {new Date(contact.created_at).toLocaleString()}
                  </td>
                  <td className="px-2 py-1 text-center">
                    <button
                      onClick={() => handleToggleView(contact.id, contact.viewed)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        contact.viewed
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white cursor-default"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {contact.viewed ? (
                        <><FaRegEye className="w-2.5 h-2.5" /> Viewed</>
                      ) : (
                        <><LuEyeClosed className="w-2.5 h-2.5" /> Unviewed</>
                      )}
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
        ) : error ? (
          <div className="text-center text-red-400 py-10 text-xs">{error}</div>
        ) : contacts.length === 0 ? (
          <div className="text-center text-gray-400 py-10 text-xs">No contacts found</div>
        ) : (
          contacts.map((contact, index) => (
            <div key={contact.id} className="bg-white rounded-lg border border-gray-100 shadow-sm px-3.5 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">#{(currentPage - 1) * limit + index + 1}</span>
                  <span className="text-xs font-semibold text-gray-800 truncate">{contact.company_name ?? "—"}</span>
                </div>
                <button
                  onClick={() => handleToggleView(contact.id, contact.viewed)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ml-2 transition-colors ${
                    contact.viewed
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 cursor-default"
                      : "bg-red-50 text-red-600 ring-1 ring-red-200"
                  }`}
                >
                  {contact.viewed ? (
                    <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Viewed</>
                  ) : (
                    <><span className="w-1.5 h-1.5 rounded-full bg-red-400" />Unviewed</>
                  )}
                </button>
              </div>

              <div className="flex flex-col gap-0.5">
                <p className="text-[11px] text-gray-600">{contact.user_name ?? "—"}</p>
                {contact.phone && <p className="text-[11px] text-gray-400">{contact.phone}</p>}
                {contact.enquiry && (
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{contact.enquiry}</p>
                )}
                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(contact.created_at).toLocaleString()}
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