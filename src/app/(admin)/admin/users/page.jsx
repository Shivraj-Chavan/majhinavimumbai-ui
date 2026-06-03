// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { apiGet, apiPut } from "@/lib/apiClient";
// import { FaUserEdit } from "react-icons/fa";
// import { useRouter } from "next/navigation";
// import Pagination from "@/app/(admin)/admin/components/usercomp/Pagination";
// import PopupEditUser from "../components/usercomp/PopupEditUser";
// import { toast } from "react-toastify";

// export default function Page() {
//   const [users, setUsers] = useState([]);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(1);
//   const usersPerPage = 10;

//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);

//   // searchTerm = what's in the input; appliedQuery = what API actually uses
//   const [searchTerm, setSearchTerm] = useState("");
//   const [appliedQuery, setAppliedQuery] = useState(""); // only updates on Search

//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const fetchUsers = useCallback(async () => {
//     try {
//       setLoading(true);
//       const q = appliedQuery.trim();
//       const data = await apiGet(
//         `/users?page=${currentPage}&limit=${usersPerPage}&q=${encodeURIComponent(q)}`
//       );

//       // Expecting { users, totalPages, total, page }
//       const list = data?.users ?? [];
//       const pages =
//         data?.totalPages ??
//         (typeof data?.total === "number"
//           ? Math.max(1, Math.ceil(data.total / usersPerPage))
//           : 1);

//       setUsers(list);
//       setTotalPages(pages);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       toast.error("Failed to fetch users");
//     } finally {
//       setLoading(false);
//     }
//   }, [appliedQuery, currentPage]);

//   useEffect(() => {
//     fetchUsers();
//   }, [fetchUsers]);

//   const handleSearchClick = () => {
//     setCurrentPage(1);
//     setAppliedQuery(searchTerm); // triggers fetch via useEffect
//   };

//   const handleSearchEnter = (e) => {
//     if (e.key === "Enter") handleSearchClick();
//   };

//   const handleClearSearch = () => {
//     if (!appliedQuery && !searchTerm) return;
//     setSearchTerm("");
//     setAppliedQuery("");
//     setCurrentPage(1);
//   };

//   const handleEditOpen = (user) => {
//     setSelectedUser(user);
//     setShowPopup(true);
//   };
  
//   const handleUpdate = async (id, updatedData) => {
//     try {
//       await apiPut(`/users/${id}/profile`, updatedData);
//       toast.success("User updated successfully");
//       // Re-fetch current page to keep server as source of truth
//       fetchUsers();
//       setShowPopup(false);
//     } catch (err) {
//       console.error("Update failed:", err?.response?.data || err?.message);
//       toast.error("Failed to update user");
//     }
//   };

//   const handleAddBusinessClick = (userId) => {
//     router.push(`users/businessRegister?ownerId=${userId}`);
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
//       {/* Search Box */}
//       <div className="relative flex justify-center w-full mb-4">
//         <div className="flex items-center gap-2 border border-gray-200 shadow rounded-lg bg-white max-w-xl w-full px-2 py-2">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             onKeyDown={handleSearchEnter}
//             placeholder="Search by name, email or business..."
//             className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none border border-gray-300"
//           />
//           <button
//             onClick={handleSearchClick}
//             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
//           >
//             Search
//           </button>
//           <button
//             onClick={handleClearSearch}
//             className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm"
//             title="Clear"
//           >
//             Clear
//           </button>
//         </div>
//       </div>

//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Management</h2>

//       {/* Desktop Table View */}
//       <div className="w-full overflow-x-auto hidden md:block">
//         <table className="min-w-full text-sm text-left">
//           <thead className="bg-white/60 text-gray-700 uppercase text-xs rounded-t-lg">
//             <tr>
//               <th className="px-4 py-3">Sr. No</th>
//               <th className="px-4 py-3">Name</th>
//               <th className="px-4 py-3">Email</th>
//               <th className="px-4 py-3">Phone</th>
//               <th className="px-4 py-3 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white/30 backdrop-blur-md">
//             {loading ? (
//               <tr>
//                 <td colSpan={4} className="text-center py-6 text-gray-600">
//                   Loading...
//                 </td>
//               </tr>
//             ) : users.length === 0 ? (
//               <tr>
//                 <td colSpan={4} className="text-center py-6 text-gray-600">
//                   No users found
//                 </td>
//               </tr>
//             ) : (
//               users.map((user, index) => (
//                 <tr
//                   key={`user-${user?.id ?? index}`}
//                   className="hover:bg-white/50 transition-all duration-300 relative"
//                 >
//                   <td className="px-4 py-3 font-medium text-gray-800">
//                     {(currentPage - 1) * usersPerPage + index + 1}
//                   </td>
//                   <td className="px-4 py-3">{user?.name ?? "-"}</td>
//                   <td className="px-4 py-3">{user?.email ?? "-"}</td>
//                   <td className="px-4 py-3">{user?.phone ?? "-"}</td>
//                   <td className="px-4 py-3 space-x-2 flex items-center justify-center">
//                     <span
//                       className={`h-8 px-3 rounded-md text-sm font-semibold flex items-center justify-center ${
//                         !user?.is_active
//                           ? "bg-gray-500 hover:bg-gray-400"
//                           : "bg-orange-500 hover:bg-orange-400"
//                       } text-white`}
//                     >
//                       {!user?.is_active ? "Inactive" : "Active"}
//                     </span>

//                     <button
//                       onClick={() => handleEditOpen(user)}
//                       className="h-8 bg-blue-600 hover:bg-blue-500 text-white px-3 rounded text-sm flex items-center justify-center"
//                       title="Edit User"
//                     >
//                       <FaUserEdit />
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() => handleAddBusinessClick(user.id)}
//                       className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-xs"
//                     >
//                       Add Business
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Card View */}
//       <div className="block md:hidden space-y-4">
//         {loading ? (
//           <div className="text-center text-gray-600 py-4">Loading...</div>
//         ) : users.length === 0 ? (
//           <div className="text-center text-gray-600 py-4">No users found</div>
//         ) : (
//           users.map((user, index) => (
//             <div
//               key={`mobile-user-${user?.id ?? index}`}
//               className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
//             >
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="font-semibold text-gray-800">{user?.name ?? "-"}</h3>
//                 <span
//                   className={`text-xs font-semibold px-2 py-1 rounded ${
//                     user?.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
//                   }`}
//                 >
//                   {user?.is_active ? "Active" : "Inactive"}
//                 </span>
//               </div>

//               <p className="text-sm text-gray-600 mb-2">
//                 <strong>Email:</strong> {user?.email ?? "-"}
//               </p>

//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleEditOpen(user)}
//                   className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm flex justify-center items-center"
//                 >
//                   <FaUserEdit className="mr-1" /> Edit
//                 </button>

//                 <button
//                   onClick={() => handleAddBusinessClick(user.id)}
//                   className="flex-1 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded text-sm"
//                 >
//                   Add Business
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && !loading && (
//         <div className="mt-4">
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={(page) => setCurrentPage(page)}
//           />
//         </div>
//       )}

//       {/* Popup for editing user */}
//       <PopupEditUser
//         user={selectedUser}
//         isOpen={showPopup}
//         onClose={() => setShowPopup(false)}
//         onUpdate={handleUpdate}
//       />
//     </div>
//   );
// }



"use client";

import React, { useCallback, useEffect, useState } from "react";
import { apiGet, apiPut } from "@/lib/apiClient";
import { FaUserEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Pagination from "@/app/(admin)/admin/components/usercomp/Pagination";
import PopupEditUser from "../components/usercomp/PopupEditUser";
import { toast } from "react-toastify";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;

  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const q = appliedQuery.trim();
      const data = await apiGet(
        `/users?page=${currentPage}&limit=${usersPerPage}&q=${encodeURIComponent(q)}`
      );
      setTotalUsers(data?.total || 0);

      const list = data?.users ?? [];
      const pages =
        data?.totalPages ??
        (typeof data?.total === "number"
          ? Math.max(1, Math.ceil(data.total / usersPerPage))
          : 1);

      setUsers(list);
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [appliedQuery, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchClick = () => {
    setCurrentPage(1);
    setAppliedQuery(searchTerm);
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") handleSearchClick();
  };

  const handleClearSearch = () => {
    if (!appliedQuery && !searchTerm) return;
    setSearchTerm("");
    setAppliedQuery("");
    setCurrentPage(1);
  };

  const handleEditOpen = (user) => {
    setSelectedUser(user);
    setShowPopup(true);
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await apiPut(`/users/${id}/profile`, updatedData);
      toast.success("User updated successfully");
      fetchUsers();
      setShowPopup(false);
    } catch (err) {
      console.error("Update failed:", err?.response?.data || err?.message);
      toast.error("Failed to update user");
    }
  };

  const handleAddBusinessClick = (userId) => {
    router.push(`users/businessRegister?ownerId=${userId}`);
  };

  return (
    <div className="p-4 sm:p-5">
     {/* Header Row */}
<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">

{/* Left Side */}
<div className="flex items-center gap-4 flex-wrap">
  <div>
    <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
      User Management
    </h2>
    <p className="text-sm text-gray-500 mt-1">
      Manage users, monitor activity, and oversee account access across the platform.
    </p>
  </div>

  <div className="ms-46 bg-white border border-blue-100 rounded-xl px-4 py-1 shadow-sm ">
    <p className="text-xs text-gray-500 uppercase tracking-wide">
      Total Users : <span className="text-blue-700 font-bold text-lg">{totalUsers.toLocaleString()}</span> 
    </p>
  
  </div>
</div>

{/* Search Box */}
<div className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-lg shadow-sm px-2 py-1 w-full lg:w-auto lg:min-w-[320px]">
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
    placeholder="Search name, email or business..."
    className="flex-grow text-xs bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 min-w-0"
  />

  {(searchTerm || appliedQuery) && (
    <button
      onClick={handleClearSearch}
      className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
      title="Clear"
    >
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  )}

  <button
    onClick={handleSearchClick}
    className="ml-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors shrink-0"
  >
    Search
  </button>
</div>

</div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-12">
                #
              </th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-32">
                Phone
              </th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-24">
                Status
              </th>
              <th className="px-3 py-2.5 text-center font-semibold text-gray-500 uppercase tracking-wider w-36">
                Actions
              </th>
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
                    Loading users…
                  </span>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 text-xs">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={`user-${user?.id ?? index}`}
                  className="hover:bg-blue-50/40 transition-colors duration-150"
                >
                  <td className="px-3 py-2 text-gray-400 font-mono">
                    {(currentPage - 1) * usersPerPage + index + 1}
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-800">
                    {user?.name ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-gray-500 max-w-[200px] truncate">
                    {user?.email ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-gray-500">
                    {user?.phone ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        user?.is_active
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user?.is_active ? "bg-emerald-500" : "bg-gray-400"
                        }`}
                      />
                      {user?.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleEditOpen(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-medium transition-colors"
                        title="Edit User"
                      >
                        <FaUserEdit className="w-2.5 h-2.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddBusinessClick(user.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-medium transition-colors"
                      >
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Business
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
        ) : users.length === 0 ? (
          <div className="text-center text-gray-400 py-10 text-xs">No users found</div>
        ) : (
          users.map((user, index) => (
            <div
              key={`mobile-user-${user?.id ?? index}`}
              className="bg-white rounded-lg border border-gray-100 shadow-sm px-3.5 py-3"
            >
              {/* Top row: name + status */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">
                    #{(currentPage - 1) * usersPerPage + index + 1}
                  </span>
                  <span className="text-xs font-semibold text-gray-800 truncate">
                    {user?.name ?? "—"}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ml-2 ${
                    user?.is_active
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-gray-100 text-gray-500 ring-1 ring-gray-200"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${user?.is_active ? "bg-emerald-500" : "bg-gray-400"}`} />
                  {user?.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Email + phone */}
              <div className="flex flex-col gap-0.5 mb-2.5">
                <p className="text-[11px] text-gray-500 truncate">{user?.email ?? "—"}</p>
                {user?.phone && (
                  <p className="text-[11px] text-gray-400">{user.phone}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditOpen(user)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors"
                >
                  <FaUserEdit className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleAddBusinessClick(user.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Business
                </button>
              </div>
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
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Edit Popup */}
      <PopupEditUser
        user={selectedUser}
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}