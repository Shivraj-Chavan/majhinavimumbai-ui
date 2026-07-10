"use client";
import { useEffect, useState } from "react";
import {
  UserPlus,
  Printer,
  Search,
  Trash2,
  Edit2,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  PlusSquare,
  X,
} from "lucide-react";
import Link from "next/link";
import { apiGet, apiPost, apiPut } from "@/lib/apiClient";
import { encrypt } from "@/lib/crypto";

/* ----------------------------------------------------------------
   Sub Admin Form Modal (used for BOTH create and edit)
---------------------------------------------------------------- */
function SubAdminFormModal({ mode, initialData, onClose, onSaved }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    // password: "",
    is_blocked: initialData?.is_blocked ? "1" : "0",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone) {
      setError("Name, email and phone are required.");
      return;
    }
    // if (!isEdit && !form.password) {
    //   setError("Password is required to create a sub admin.");
    //   return;
    // }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        is_blocked: Number(form.is_blocked),
      };
    //   if (form.password) payload.password = form.password;

      let saved;
      if (isEdit) {
        saved = await apiPut(`/subadmin/${initialData?.id}`, payload);
      } else {
        saved = await apiPost('/subadmin', payload);
      }

      onSaved(saved?.data || { ...initialData, ...payload });
    } catch (err) {
      console.error("Failed to save sub admin", err);
      setError(
        err?.response?.data?.message ||
          "Something went wrong while saving. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Sub Admin" : "Add Sub Admin"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setForm((prev) => ({ ...prev, phone: value }));
              }}
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]{10}"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter 10-digit phone number"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isEdit ? "New Password (optional)" : "Password"}
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={isEdit ? "Leave blank to keep current password" : "Set a password"}
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="is_blocked"
              value={form.is_blocked}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="0">Active</option>
              <option value="1">Blocked</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md disabled:opacity-60"
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Sub Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Main Page
---------------------------------------------------------------- */
export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [subadmins, setSubadmins] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  // const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedSubadmin, setSelectedSubadmin] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  

  const fetchSubadmins = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      });
      if (filterStatus === "blocked") queryParams.append("is_blocked", "1");
      if (filterStatus === "active") queryParams.append("is_blocked", "0");

      const { data, pagination } = await apiGet(
        `/subadmin?${queryParams.toString()}`
      );
      setSubadmins(Array.isArray(data) ? data.sort((a, b) => b.id - a.id) : []);
      setTotalPages(pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch sub admins", err);
      setSubadmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubadmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage, searchTerm, filterStatus, refreshKey]);

  const handleUserAdded = () => {
    setIsOpen(false);
    setRefreshKey((k) => k + 1);
  };

  const handleUserUpdated = () => {
    setSelectedSubadmin(null);
    setRefreshKey((k) => k + 1);
  };

  // const requestDelete = (user) => {
  //   setDeleteTarget(user);
  //   setShowConfirm(true);
  // };

  const handleConfirm = async (confirmed) => {
    setShowConfirm(false);
  
    if (!confirmed || !selectedSubadmin) return;
  
    try {
        await apiPatch(`/subadmin/${selectedSubadmin.id}/block`);
  
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error(err);
    }
  
    setSelectedSubadmin(null);
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 top-0 z-10">
        <div className="px-4 py-3 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Sub Admin Management
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage all Sub Admins
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {/* <button
              onClick={handlePrint}
              className="px-3 sm:px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base w-full sm:w-auto"
            >
              <Printer size={18} />
              <span>Print</span>
            </button> */}
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base w-full sm:w-auto"
            >
              <UserPlus size={18} />
              <span>Add Sub Admin</span>
            </button>

            {isOpen && (
              <SubAdminFormModal
                mode="create"
                onClose={() => setIsOpen(false)}
                onSaved={handleUserAdded}
              />
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[140px] text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </header>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table Wrapper */}
            <div className="overflow-x-auto hidden sm:block">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Sub Admin ({subadmins.length})
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subadmins.map((user) => {
                    const data = encrypt(
                      JSON.stringify({ id: user.id, name: user.name })
                    );
                    return (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Phone size={14} />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <Calendar size={14} className="inline mr-2" />
                          {user.created_at}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              user.is_blocked
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.is_blocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              onClick={() => {
                                setShowConfirm(false);
                                setSelectedSubadmin(user);
                              }}
                            >
                              <Edit2 size={16} />
                            </button>
                            {/* <button
                              onClick={() => requestDelete(user)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button> */}
                          
                            <Link
                              href={`/admin/add-business?d=${encodeURIComponent(
                                data
                              )}`}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                            >
                              <PlusSquare size={16} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-3 p-3">
              {subadmins.map((user) => {
                const data = encrypt(
                  JSON.stringify({ id: user.id, name: user.name })
                );
                return (
                  <div
                    key={user.id}
                    className="p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">
                        {user.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.is_blocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.is_blocked ? "Blocked" : "Active"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        {user.phone}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar size={14} />
                        {user.created_at}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                       onClick={() => {
                        setShowConfirm(false);
                        setSelectedSubadmin(user);
                      }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      {/* <button
                        onClick={() => requestDelete(user)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button> */}
                      {/* <button
                        onClick={() => {
                          setSelectedSubadmin(user);
                          setShowConfirm(true);
                        }}
                        className={`p-2 rounded-lg ${
                          user.is_blocked
                            ? "text-green-600 hover:bg-green-50"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {user.is_blocked ? "Unblock" : "Block"}
                      </button> */}
                      <Link
                        href={`/admin/add-business?d=${encodeURIComponent(
                          data
                        )}`}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                      >
                        <PlusSquare size={16} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {[5, 10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <div className="flex justify-center sm:justify-end items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 2),
                    Math.min(totalPages, currentPage + 1)
                  )
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
{/* 
      {showConfirm && (
        <ConfirmDialog
        text={`Are you sure you want to ${
          selectedSubadmin?.is_blocked ? "unblock" : "block"
        } "${selectedSubadmin?.name}"?`}
          onConfirm={handleConfirm}
          onCancel={handleConfirm}
        />
      )} */}

        {selectedSubadmin && (
        <SubAdminFormModal
            mode="edit"
            initialData={selectedSubadmin}
            onClose={() => setSelectedSubadmin(null)}
            onSaved={handleUserUpdated}
        />
        )}
    </div>
  );
}