"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/apiClient";
import { toast } from "react-toastify";

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await apiGet("/enquiries/all");
        console.log("Enquiries", res);
        setEnquiries(res);
      } catch (err) {
        toast.error("Failed to load enquiries");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Business Enquiries</h2>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : enquiries.length === 0 ? (
        <div className="text-center text-gray-500">No enquiries found.</div>
      ) : (
        <div className="w-full overflow-x-auto">
          {/* Desktop View */}
          <div className="hidden md:block">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-white/60 text-gray-700 uppercase text-md rounded-t-lg">
                <tr>
                  <th className="px-4 py-3">Sr. No</th>
                  <th className="px-4 py-3">Business</th>
                  {/* <th className="px-4 py-3">Email</th> */}
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">User Email</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white/30 backdrop-blur-md">
                {enquiries.map((enq, i) => (
                  <tr key={enq.enquiry_id} className="hover:bg-white/50 transition-all duration-300">
                    <td className="px-4 py-3 font-medium text-gray-800">{i + 1}</td>
                    <td className="px-4 py-3">{enq.business_name}</td>
                    {/* <td className="px-4 py-3">{enq.business_email}</td> */}
                    <td className="px-4 py-3">{enq.business_phone}</td>
                    <td className="px-4 py-3">{enq.user_name}</td>
                    <td className="px-4 py-3">{enq.user_email}</td>
                    <td className="px-4 py-3">{enq.message}</td>
                    <td className="px-4 py-3">{new Date(enq.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {enquiries.map((enq, i) => (
              <div key={enq.enquiry_id} className="mb-4 p-4 bg-white rounded-lg shadow-md">
                <p className="text-sm text-gray-600">#{i + 1}</p>
                <h3 className="text-lg font-semibold text-gray-800">
                  {enq.user_name} ➝ {enq.business_name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">User Email: {enq.user_email}</p>
                {/* <p className="text-sm text-gray-600">Business Email: {enq.business_email}</p> */}
                <p className="text-sm text-gray-600">Business Phone: {enq.business_phone}</p>
                <p className="text-sm text-gray-700 mt-2">Message: {enq.message}</p>
                <p className="text-sm text-gray-500 mt-2">Date: {new Date(enq.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
