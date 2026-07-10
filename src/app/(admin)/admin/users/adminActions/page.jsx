"use client";

import React, { useEffect, useState } from "react";
import Pagination from "../../components/usercomp/Pagination";
import { apiGet } from "@/lib/apiClient";
import DownloadAdminActions from "../../components/ActionsDownloadReport";
import axios from "axios";
import CONFIG from "@/constance";


export default function AdminActionsPage() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalActions, setTotalActions] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [admins, setAdmins] = useState([]);
const [selectedTargetType, setSelectedTargetType] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

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

  //  const [adminStats, setAdminStats] = useState({
  //   totalBusinesses: 0,
  //     monthlyBusinesses: 0,
  //     totalUsers: 0,
  //     monthlyUsers: 0,
  //   });

    const [adminStats, setAdminStats] = useState({
      todayBusinesses: 0,
      monthlyBusinesses: 0,
      totalBusinesses: 0,
      todayUsers: 0,
      monthlyUsers: 0,
      totalUsers: 0,
    });
  
  // const adminStatCards = [
  //   { label: "Sub-admin Total Businesses", value: stats.totalBusinesses, bg: "bg-white", text: "text-gray-800", dot: "bg-gray-400" },
  //   {
  //     label: "Businesses created this month",
  //     value: adminStats.monthlyBusinesses,
  //     bg: "bg-blue-50",
  //     text: "text-blue-600",
  //     dot: "bg-blue-500",
  //   },
  //   {
  //     label: "Total Businesses",
  //     value: adminStats.totalBusinesses,
  //     bg: "bg-green-50",
  //     text: "text-green-600",
  //     dot: "bg-green-500",
  //   },
  //   {
  //     label: "Users created current month",
  //     value: adminStats.monthlyUsers,
  //     bg: "bg-purple-50",
  //     text: "text-purple-600",
  //     dot: "bg-purple-500",
  //   },
  //   {
  //     label: "Total Users",
  //     value: adminStats.totalUsers,
  //     bg: "bg-emerald-50",
  //     text: "text-emerald-600",
  //     dot: "bg-emerald-500",
  //   },
  //   { label: "Verified", value: stats.verifiedBusinesses, bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  // ];
  


    
  
const initialMonthDate  = new Date(2026, 5); // June 2026 (0-based month index)
const currentDate = new Date();

const monthOptions = [];

const tempDate = new Date(initialMonthDate );

while (tempDate <= currentDate) {
  monthOptions.push({
    month: tempDate.getMonth() + 1,
    year: tempDate.getFullYear(),
    label: tempDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    }),
  });

  tempDate.setMonth(tempDate.getMonth() + 1);
}

const current = monthOptions[monthOptions.length - 1];

const [selectedMonth, setSelectedMonth] = useState(current.month);
const [selectedYear, setSelectedYear] = useState(current.year);


  const downloadExcel = async () => {
    if (!startDate || !endDate) {
      alert("Please select Start Date and End Date");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      console.log({
        adminId: selectedAdmin,
        startDate,
        endDate,
        targetType: selectedTargetType,
      });
  
      const response = await axios.get(`${CONFIG.API_BASE_URL}/subadmin/export-actions`, {
        params: {
          adminId: selectedAdmin || null,
          startDate,
          endDate,
          targetType: selectedTargetType,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
  
      link.href = url;
      link.download = `SubAdminReport_${startDate}_${endDate}.xlsx`;
  
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }
  };


  const adminStatCards = [
    {
      label: "Today's Businesses",
      value: adminStats.todayBusinesses,
      bg: "bg-cyan-50",
      text: "text-cyan-600",
      dot: "bg-cyan-500",
    },
    {
      label: "Monthly Businesses",
      value: adminStats.monthlyBusinesses,
      bg: "bg-blue-50",
      text: "text-blue-600",
      dot: "bg-blue-500",
    },
    {
      label: "Total Businesses",
      value: adminStats.totalBusinesses,
      bg: "bg-green-50",
      text: "text-green-600",
      dot: "bg-green-500",
    },
    {
      label: "Today's Users",
      value: adminStats.todayUsers,
      bg: "bg-orange-50",
      text: "text-orange-600",
      dot: "bg-orange-500",
    },
    {
      label: "Monthly Users",
      value: adminStats.monthlyUsers,
      bg: "bg-purple-50",
      text: "text-purple-600",
      dot: "bg-purple-500",
    },
    {
      label: "Total Users",
      value: adminStats.totalUsers,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      dot: "bg-emerald-500",
    },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const adminId = selectedAdmin || "";
  
    const fetchAdminStats = async () => {
      try {
        // const res = await apiGet(`/dashboard/admin-stats?admin_id=${ADMIN_ID}`)  
        // setAdminStats(res);

  const url = selectedAdmin
  ? `/dashboard/admin-stats?admin_id=${selectedAdmin}&month=${selectedMonth}&year=${selectedYear}`
  : `/dashboard/admin-stats?month=${selectedMonth}&year=${selectedYear}`;

const res = await apiGet(url);

setAdminStats(res);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchAdminStats();
  }, [selectedAdmin , selectedMonth, selectedYear]);

  const fetchAdmins = async () => {
    try {
      const res = await apiGet("/businesses/admin/admins-list");
     console.log("fetchAdmins",res)
      if (res.success) {
        setAdmins(res.admins || []);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);
        // const ADMIN_ID = 3460;
        const ADMIN_ID = selectedAdmin || "";
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
  }, [currentPage, query , selectedAdmin]);

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
  const formatDate = (timestamp) => timestamp ? new Date(timestamp)?.toLocaleString() : "—";



  const statCards = [
    // { label: "Total Businesses", value: stats.totalBusinesses, bg: "bg-white", text: "text-gray-800", dot: "bg-gray-400" },
    // { label: "Verified", value: stats.verifiedBusinesses, bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
    // { label: "Pending", value: stats.pendingBusinesses, bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" },
    // { label: "Sub Admins", value: stats.subAdmins, bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
    // { label: "Approved", value: stats.approvedBySubAdmin, bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-500" },
    // { label: "Today's Created", value: stats.todayCreated, bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  ];

  return (
    <div className="p-4 sm:p-5">
     {/* Header Row */}
{/* Header */}
<div className="mb-4">
  <h2 className="text-xl font-semibold text-gray-800">Sub Admin</h2>
  <p className="text-sm text-gray-500 mt-0.5">
    Track and monitor sub-admin actions and activity across the platform
  </p>
</div>

{/* Right Section */}
<div className="flex flex-wrap items-center gap-2">
  {/* Month */}
  <select
    value={`${selectedMonth}-${selectedYear}`}
    onChange={(e) => {
      const [month, year] = e.target.value.split("-");
      setSelectedMonth(Number(month));
      setSelectedYear(Number(year));
    }}
    className="h-9 min-w-[150px] rounded-md border border-gray-300 px-2.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
  >
    {monthOptions.map((item) => (
      <option
        key={`${item.month}-${item.year}`}
        value={`${item.month}-${item.year}`}
      >
        {item.label}
      </option>
    ))}
  </select>

  {/* Total Actions */}
  <div className="h-9 flex items-center bg-white border border-blue-100 rounded-md px-3 shadow-sm whitespace-nowrap">
    <p className="text-xs text-gray-500 uppercase tracking-wide">
      Total Actions
      <span className="ml-1.5 text-blue-700 text-sm font-bold">
        {totalActions?.toLocaleString()}
      </span>
    </p>
  </div>

  {/* Sub Admin */}
  <select
    value={selectedAdmin}
    onChange={(e) => {
      setSelectedAdmin(e.target.value);
      setCurrentPage(1);
    }}
    className="h-9 min-w-[190px] rounded-md border border-gray-300 px-2.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
  >
    <option value="">All Sub Admins</option>
    {admins.map((admin) => (
      <option key={admin.id} value={admin.id}>
        {admin.name} ({admin.role})
      </option>
    ))}
  </select>

  {/* Target Type */}
  <select
    value={selectedTargetType}
    onChange={(e) => setSelectedTargetType(e.target.value)}
    className="h-9 min-w-[110px] rounded-md border border-gray-300 px-2.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
  >
    <option value="">All Types</option>
    <option value="user">User</option>
    <option value="business">Business</option>
  </select>

  {/* Date Range */}
  <div className="flex items-center gap-1.5">
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="h-9 rounded-md border border-gray-300 px-2.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
    <span className="text-gray-400 text-sm">–</span>
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="h-9 rounded-md border border-gray-300 px-2.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>

  {/* Export */}
  <button
    onClick={downloadExcel}
    className="h-9 px-4 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 shadow-sm transition-colors"
  >
    Export Excel
  </button>
</div>

{/* Search */}
<div className="mt-3">
  <div className="flex items-center mb-5 gap-2 border border-gray-200 bg-white rounded-md shadow-sm px-3 h-12 w-full lg:max-w-md">
    <svg
      className="w-4 h-4 text-gray-400 shrink-0"
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
      className="flex-1 bg-transparent outline-none text-sm"
    />
    {searchTerm && (
      <button
        onClick={handleClearSearch}
        className="text-gray-400 hover:text-gray-700 shrink-0"
      >
        ✕
      </button>
    )}
    <button
      onClick={handleSearchClick}
      className="px-3 h-7 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 shrink-0"
    >
      Search
    </button>
  </div>
</div>

{/* Search */}
{/* <div className="mt-4">
  <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg shadow-sm px-3 py-2 w-full lg:max-w-md">

    <svg
      className="w-4 h-4 text-gray-400"
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
      className="flex-1 bg-transparent outline-none text-sm"
    />

    {searchTerm && (
      <button
        onClick={handleClearSearch}
        className="text-gray-400 hover:text-gray-700"
      >
        ✕
      </button>
    )}

    <button
      onClick={handleSearchClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Search
    </button>

  </div>
</div> */}
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
        {value?.toLocaleString()}
      </p>
    </div>
  ))}
</div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
  {statCards.map(({ label, value, bg, text, dot }) => (
    <div
      key={label}
      className={`${bg} rounded-xl border border-gray-100 shadow-sm px-4 py-3`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <p className="text-[11px] text-gray-500 font-medium truncate">
          {label}
        </p>
      </div>

      <p className={`text-2xl font-bold ${text}`}>
        {value?.toLocaleString()}
      </p>

      <p className="text-[10px] text-gray-400 mt-1 truncate">
        Majhi Navi Mumbai
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Business Name</th>
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
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {action.target_type === "business"
                      ? action.business_name
                      : action.target_type === "user"
                      ? action.target_user_name
                      : "-"}
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