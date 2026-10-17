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
//   const [totalContacts, setTotalContacts] = useState(0);
//   const limit = 20;

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const res = await apiGet(`/contact?page=${currentPage}&limit=${limit}`);
//         setContacts(res?.contacts);
//         setLoading(false);
//         setTotalContacts(res?.total || 0);
//         setTotalPages(res.totalPages || 1);
//       } catch (err) {
//         setError(err.message || "Failed to fetch contacts");
//         setLoading(false);
//       }
//     };
//     fetchContacts();
//   }, [currentPage]);

//   const handlePageChange = (page) => setCurrentPage(page);

//   const handleToggleView = async (id, currentStatus) => {
//     if (currentStatus) return;
//     const updatedContacts = contacts.map((c) =>
//       c.id === id ? { ...c, viewed: !currentStatus } : c
//     );
//     setContacts(updatedContacts);
//     try {
//       await apiPost(`/contact/${id}/toggle-view`, { viewed: !currentStatus });
//     } catch (err) {
//       console.error("Failed to update status:", err);
//       setContacts(contacts);
//       alert("Failed to update view status. Please try again.");
//     }
//   };

//   return (
//     <div className="p-4 sm:p-5">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
//   <div>
//     <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
//       Contact Submissions
//     </h2>
//     <p className="text-sm text-gray-500 mt-1">
//       View and manage customer enquiries and contact requests.
//     </p>
//   </div>

//   <div className="bg-white border border-blue-100 rounded-xl px-4 py-2 shadow-sm">
//     <p className="text-xs text-gray-500 uppercase tracking-wide">
//       Total Users : <span className="text-blue-700 font-bold text-lg">{totalContacts.toLocaleString()}</span> 
//     </p>
//   </div>
// </div>


//       {/* Desktop Table */}
//       <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
//         <table className="min-w-full text-xs">
//           <thead>
//             <tr className="bg-gray-50 border-b border-gray-100">
//               <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-12">#</th>
//               <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Company</th>
//               <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Name</th>
//               <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-28">Phone</th>
//               <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Enquiry</th>
//               <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-36">Submitted At</th>
//               <th className="px-2 py-1.5 text-center font-semibold text-gray-500 uppercase tracking-wider w-24">Status</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-50">
//             {loading ? (
//               <tr>
//                 <td colSpan={7} className="text-center py-10 text-gray-400 text-xs">
//                   <span className="inline-flex items-center gap-1.5">
//                     <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//                     </svg>
//                     Loading…
//                   </span>
//                 </td>
//               </tr>
//             ) : error ? (
//               <tr>
//                 <td colSpan={7} className="text-center py-10 text-red-400 text-xs">{error}</td>
//               </tr>
//             ) : contacts.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="text-center py-10 text-gray-400 text-xs">No contacts found</td>
//               </tr>
//             ) : (
//               contacts.map((contact, index) => (
//                 <tr key={contact.id} className="hover:bg-blue-50/40 transition-colors duration-150">
//                   <td className="px-2 py-1 text-gray-400 font-mono">{(currentPage - 1) * limit + index + 1}</td>
//                   <td className="px-2 py-1 font-medium text-gray-800 max-w-[120px] truncate">{contact.company_name ?? "—"}</td>
//                   <td className="px-2 py-1 text-gray-700 max-w-[100px] truncate">{contact.user_name ?? "—"}</td>
//                   <td className="px-2 py-1 text-gray-500">{contact.phone ?? "—"}</td>
//                   <td className="px-2 py-1 text-gray-500 max-w-[180px] truncate">{contact.enquiry ?? "—"}</td>
//                   <td className="px-2 py-1 text-gray-400 whitespace-nowrap">
//                     {new Date(contact.created_at).toLocaleString()}
//                   </td>
//                   <td className="px-2 py-1 text-center">
//                     <button
//                       onClick={() => handleToggleView(contact.id, contact.viewed)}
//                       className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
//                         contact.viewed
//                           ? "bg-emerald-500 hover:bg-emerald-600 text-white cursor-default"
//                           : "bg-red-500 hover:bg-red-600 text-white"
//                       }`}
//                     >
//                       {contact.viewed ? (
//                         <><FaRegEye className="w-2.5 h-2.5" /> Viewed</>
//                       ) : (
//                         <><LuEyeClosed className="w-2.5 h-2.5" /> Unviewed</>
//                       )}
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Card View */}
//       <div className="block md:hidden space-y-2">
//         {loading ? (
//           <div className="flex items-center justify-center py-10 text-gray-400 text-xs gap-1.5">
//             <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
//             </svg>
//             Loading…
//           </div>
//         ) : error ? (
//           <div className="text-center text-red-400 py-10 text-xs">{error}</div>
//         ) : contacts.length === 0 ? (
//           <div className="text-center text-gray-400 py-10 text-xs">No contacts found</div>
//         ) : (
//           contacts.map((contact, index) => (
//             <div key={contact.id} className="bg-white rounded-lg border border-gray-100 shadow-sm px-3.5 py-3">
//               <div className="flex items-center justify-between mb-1.5">
//                 <div className="flex items-center gap-2 min-w-0">
//                   <span className="text-[10px] text-gray-400 font-mono shrink-0">#{(currentPage - 1) * limit + index + 1}</span>
//                   <span className="text-xs font-semibold text-gray-800 truncate">{contact.company_name ?? "—"}</span>
//                 </div>
//                 <button
//                   onClick={() => handleToggleView(contact.id, contact.viewed)}
//                   className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ml-2 transition-colors ${
//                     contact.viewed
//                       ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 cursor-default"
//                       : "bg-red-50 text-red-600 ring-1 ring-red-200"
//                   }`}
//                 >
//                   {contact.viewed ? (
//                     <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Viewed</>
//                   ) : (
//                     <><span className="w-1.5 h-1.5 rounded-full bg-red-400" />Unviewed</>
//                   )}
//                 </button>
//               </div>

//               <div className="flex flex-col gap-0.5">
//                 <p className="text-[11px] text-gray-600">{contact.user_name ?? "—"}</p>
//                 {contact.phone && <p className="text-[11px] text-gray-400">{contact.phone}</p>}
//                 {contact.enquiry && (
//                   <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{contact.enquiry}</p>
//                 )}
//                 <p className="text-[10px] text-gray-400 mt-1">
//                   {new Date(contact.created_at).toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && !loading && (
//         <div className="mt-3">
//           <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
//         </div>
//       )}
//     </div>
//   );
// }















"use client";

import React, { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/apiClient";
import Pagination from "../../components/usercomp/Pagination";
import { LuEyeClosed } from "react-icons/lu";
import { FaRegEye } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

// Max characters shown before "Read more" appears
const DESKTOP_LIMIT = 30;
const MOBILE_LIMIT = 80;

export default function ContactListPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [selectedContact, setSelectedContact] = useState(null); // for popup
  const limit = 20;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await apiGet(`/contact?page=${currentPage}&limit=${limit}`);
        setContacts(res?.contacts || []);
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

  // Close popup on Escape + lock background scroll while open
  useEffect(() => {
    if (!selectedContact) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSelectedContact(null);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedContact]);

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
            Total Users :{" "}
            <span className="text-blue-700 font-bold text-lg">
              {totalContacts.toLocaleString()}
            </span>
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
              contacts.map((contact, index) => {
                const isLong = (contact.enquiry?.length || 0) > DESKTOP_LIMIT;
                return (
                  <tr key={contact.id} className="hover:bg-blue-50/40 transition-colors duration-150">
                    <td className="px-2 py-1 text-gray-400 font-mono">{(currentPage - 1) * limit + index + 1}</td>
                    <td className="px-2 py-1 font-medium text-gray-800 max-w-[120px] truncate">{contact.company_name ?? "—"}</td>
                    <td className="px-2 py-1 text-gray-700 max-w-[100px] truncate">{contact.user_name ?? "—"}</td>
                    <td className="px-2 py-1 text-gray-500">{contact.phone ?? "—"}</td>
                    <td className="px-2 py-1 text-gray-500 max-w-[220px]">
                      {contact.enquiry ? (
                        <div className="flex items-center gap-1.5">
                          <span className="truncate">{contact.enquiry}</span>
                          {isLong && (
                            <button
                              onClick={() => setSelectedContact(contact)}
                              className="shrink-0 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                            >
                              Read more
                            </button>
                          )}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
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
                );
              })
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
          contacts.map((contact, index) => {
            const isLong = (contact.enquiry?.length || 0) > MOBILE_LIMIT;
            return (
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
                    <div className="mt-0.5">
                      <p className="text-[11px] text-gray-500 line-clamp-2 break-words">{contact.enquiry}</p>
                      {isLong && (
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="text-[11px] text-blue-600 hover:text-blue-800 font-medium mt-0.5"
                        >
                          Read more
                        </button>
                      )}
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(contact.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="mt-3">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}

      {/* Enquiry Popup */}
      {selectedContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedContact(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-modal-title"
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-100">
              <div className="min-w-0">
                <h3 id="enquiry-modal-title" className="text-base font-semibold text-gray-800">
                  Enquiry Details
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {selectedContact.company_name ?? "—"}
                  {selectedContact.user_name ? ` • ${selectedContact.user_name}` : ""}
                  {selectedContact.phone ? ` • ${selectedContact.phone}` : ""}
                </p>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                aria-label="Close"
                className="shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body (scrolls if message is very long) */}
            <div className="px-5 py-4 overflow-y-auto">
              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                {selectedContact.enquiry}
              </p>
              <p className="text-[11px] text-gray-400 mt-4">
                Submitted: {new Date(selectedContact.created_at).toLocaleString()}
              </p>
            </div>

            {/* Modal footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedContact(null)}
                className="px-4 py-1.5 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}