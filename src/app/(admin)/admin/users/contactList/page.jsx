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
  const limit = 10;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await apiGet(`/contact?page=${currentPage}&limit=${limit}`);
        console.log('Contact List:', res);
        setContacts(res?.contacts);
        setLoading(false);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        setError(err.message || "Failed to fetch contacts");
        setLoading(false);
      }
    };

    fetchContacts();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

    //view/unview
    const handleToggleView = async (id, currentStatus) => {
      console.log({currentStatus})
      if(currentStatus) return 
      const updatedContacts = contacts.map((contact) =>
        contact.id === id ? { ...contact, viewed: !currentStatus } : contact
      );
      setContacts(updatedContacts); 
      console.log(updatedContacts)
  
      try {
        await apiPost(`/contact/${id}/toggle-view`, { viewed: !currentStatus });
        console.log("Status updated successfully");
      } catch (err) {
        console.error("Failed to update status:", err);
  
        setContacts(contacts);
        alert("Failed to update view status. Please try again.");
      }
    };

  return (
    <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Contact Submissions</h2>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : contacts.length === 0 ? (
        <div className="text-center text-gray-500">No contacts found.</div>
      ) : (
        <div className="w-full overflow-x-auto">
          {/* Desktop View */}
          <div className="hidden md:block">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-white/60 text-gray-700 uppercase text-md rounded-t-lg">
                <tr>
                  <th className="px-4 py-3">Sr. No</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Enquiry</th>
                  <th className="px-4 py-3">Submitted At</th>
                  <th className="px-4 py-3">View/Unview</th>
                </tr>
              </thead>
              <tbody className="bg-white/30 backdrop-blur-md">
                {contacts.map((contact, index) => (
                  <tr key={contact.id} className="hover:bg-white/50 transition-all duration-300">
                    <td className="px-4 py-3 font-medium text-gray-800">{index + 1}</td>
                    <td className="px-4 py-3">{contact.company_name}</td>
                    <td className="px-4 py-3">{contact.user_name}</td>
                    <td className="px-4 py-3">{contact.phone}</td>
                    <td className="px-4 py-3">{contact.enquiry}</td>
                    <td className="text-sm text-gray-500 mt-2"> {new Date(contact.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          handleToggleView(contact.id, contact.viewed)
                        }
                        className={`px-3 py-1 rounded-xl text-white text-sm font-medium transition-colors duration-300 ${
                          contact.viewed
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                      <div className="flex items-center gap-2">
                      {contact.viewed ? (
                        <span className="flex items-center gap-1 font-medium text-white">
                          <FaRegEye className="text-lg" />
                          Viewed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-white font-medium">
                          <LuEyeClosed className="text-lg" />
                          Unviewed
                        </span>
                      )}
                    </div>
                      </button>
                    </td>
                  </tr>
                  
                ))}
              </tbody>
            </table>
          </div>

       
        </div>
      )}

      {/* Pagination */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
