"use client";

import React, { useEffect, useState } from "react";
import { apiGet } from "@/lib/apiClient";

export default function ContactListPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await apiGet("/contact");
        console.log('Contact List:', res);
        setContacts(res);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch contacts");
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

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
                    <td className="px-4 py-3">{new Date(contact.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {contacts.map((contact, index) => (
              <div key={contact.id} className="mb-4 p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">{contact.company_name}</h3>
                <p className="text-sm text-gray-600 mt-1"><strong>Name:</strong> {contact.user_name}</p>
                <p className="text-sm text-gray-600 mt-1"><strong>Phone:</strong> {contact.phone}</p>
                <p className="text-sm text-gray-600 mt-1"><strong>Enquiry:</strong> {contact.enquiry}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Submitted:</strong> {new Date(contact.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
