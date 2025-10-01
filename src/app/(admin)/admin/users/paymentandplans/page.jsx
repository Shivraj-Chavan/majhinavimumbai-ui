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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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

  return (
    <div className="p-2 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Payments & Plans
      </h2>

      {/* 🔍 Search Box */}
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-4"
      >
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all"
          >
            Reset
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : enquiries.length === 0 ? (
        <div className="text-center text-gray-500">
          No Payments & Plans found.
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          {/* Desktop View */}
          <div className="hidden md:block">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-white/60 p-2 text-gray-700 uppercase text-md rounded-t-lg">
                <tr>
                  <th className="px-2 py-1.5">No</th>
                  <th className="px-2 py-1.5">Business</th>
                  <th className="px-2 py-1.5">Phone</th>
                  <th className="px-2 py-1.5">Plan Name</th>
                  <th className="px-2 py-1.5">Amount</th>
                  <th className="px-2 py-1.5">Status</th>
                  <th className="px-2 py-1.5">Time</th>
                  <th className="px-2 py-1.5">Start Date</th>
                  <th className="px-2 py-1.5">End Date</th>
                </tr>
              </thead>
              <tbody className="bg-white/30 backdrop-blur-md">
                {enquiries.map((enq, i) => (
                  <tr
                    key={enq.transaction_id}
                    className="hover:bg-white/50 transition-all duration-300"
                  >
                    <td className="px-2 py-1.5 font-medium text-gray-800">
                      {(currentPage - 1) * limit + i + 1}
                    </td>
                    <td className="px-2 py-1.5">{enq.business_name}</td>
                    <td className="px-2 py-1.5">{enq.business_phone}</td>
                    <td className="px-2 py-1.5">{enq.plan_name}</td>
                    <td className="px-2 py-1.5">{enq.amount}</td>
                    <td className="px-2 py-1.5">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        enq.payment_status === "completed" ? "bg-green-100 text-green-700" : enq.payment_status === "pending"
                          ? "bg-red-100 text-red-700": "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {enq.payment_status.charAt(0).toUpperCase() + enq.payment_status.slice(1)}
                    </span>
                  </td>
                    <td className="px-2 py-1.5">
                      {new Date(enq.payment_time).toLocaleString()}
                    </td>
                    <td className="px-2 py-1.5">
                      {enq.plan_start
                        ? new Date(enq.plan_start).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-2 py-1.5">
                      {enq.plan_end
                        ? new Date(enq.plan_end).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
