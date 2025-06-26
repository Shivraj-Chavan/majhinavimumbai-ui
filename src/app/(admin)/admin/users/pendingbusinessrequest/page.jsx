"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiDelete, apiGet, apiPut } from "@/lib/apiClient";
import { FaRegEye } from "react-icons/fa";
import BusinessRegisterModal from "../../components/usercomp/BusinessRegisterModal";

export default function PendingUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const fetchUpdates = async () => {
    try {
      const res = await apiGet("/businesses/admin/pending");
      console.log("Pending updates response:", res.data);
  
      if (Array.isArray(res.data)) {
        setUpdates(res.data); 
      } else if (res.data && Array.isArray(res.data.data)) {
        setUpdates(res.data.data); 
      } else {
        setUpdates([]);
      }
    } catch (err) {
      toast.error("Failed to fetch pending updates.");
      setUpdates([]); 
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUpdates();
  }, []);

  const openModal = (business) => {
    setSelectedBusiness(business); 
    setModalOpen(true); 
  };
 
  const closeModal = () => {  
    setModalOpen(false);  
    setSelectedBusiness(null);
  }; 
 
  const handleApprove = async (id) => {
    try {
      await apiPut(`/businesses/admin/approve/${id}`);
      console.log("API response:", res);
      toast.success("Update approved!");
      fetchUpdates(); 
    } catch (err) {
      console.error("Approval error response:", err.response?.data);
      toast.error("Approval failed");
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Are you sure you want to reject this update?")) return;
    try {
      await apiDelete(`/businesses/admin/reject/${id}`);
      toast.success("Update rejected.");
      fetchUpdates();
    } catch (err) {
      toast.error("Rejection failed");
    }
  };

  const updateVerifiedBusinessList = (updatedBusiness) => {
    setBusinessUsers((prevUsers) => {
      const existing = prevUsers.filter((user) => user.id !== updatedBusiness.id);  // Add the new verified business and remove it from the pending list 
      return [...existing, updatedBusiness];
    });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg max-w-7xl mx-auto">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Pending Business Updates</h2>

    {loading ? (
      <div className="text-center text-gray-600">Loading...</div>
    ) : !updates || updates.length === 0 ? (
      <div className="text-center text-gray-500">No pending updates.</div>
    ) : (
      <div className="w-full overflow-x-auto">
        {/* Desktop View */}
        <div className="hidden md:block">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-white/60 text-gray-700 uppercase text-md rounded-t-lg">
              <tr>
                <th className="px-4 py-3">SR. NO</th>
                <th className="px-4 py-3">Business Name</th>
                <th className="px-4 py-3">Phone</th>
                {/* <th className="px-4 py-3">WhatsApp</th> */}
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Website</th>
                {/* <th className="px-4 py-3">Timing</th> */}
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white/30 backdrop-blur-md">
              {updates.map((update, index) => (
                <tr key={update.id} className="hover:bg-white/50 transition-all duration-300">
                  <td className="px-4 py-3 font-medium">{index + 1}</td>
                  <td className="px-4 py-3">{update.name}</td>
                  <td className="px-4 py-3">{update.phone}</td>
                  {/* <td className="px-4 py-3">{update.wp_number}</td> */}
                  <td className="px-4 py-3">{update.email || "N/A"}</td>
                  <td className="px-4 py-3">{update.website || "N/A"}</td>
                  {/* <td className="px-4 py-3">{update.timing || "N/A"}</td> */}
                  <td className="px-4 py-3 space-x-2">
                 <button onClick={() => openModal(update)} className="bg-blue-500 hover:bg-blue-600 text-white text-md px-4 py-2 rounded-full font-medium shadow-md transition duration-200">
                  <FaRegEye />
                   </button>

                    <button onClick={() => handleApprove(update.id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full text-sm shadow-md">
                      Approve
                    </button>
                    <button onClick={() => handleReject(update.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm shadow-md">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {updates.map((update, index) => (
            <div key={update.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">{update.name}</h3>
              <p className="text-sm"><strong>Phone:</strong> {update.phone}</p>
              {/* <p className="text-sm"><strong>WhatsApp:</strong> {update.wp_number}</p> */}
              <p className="text-sm"><strong>Email:</strong> {update.email || "N/A"}</p>
              <p className="text-sm"><strong>Website:</strong> {update.website || "N/A"}</p>
              {/* <p className="text-sm"><strong>Timing:</strong> {update.timing || "N/A"}</p> */}
              <div className="mt-4 flex gap-2 justify-end">
                <button onClick={() => openModal(update)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-md font-medium shadow-md transition duration-200">
                  <FaRegEye />
                 </button>
                <button onClick={() => handleApprove(update.id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm shadow-md">
                  Approve
                </button>
                <button onClick={() => handleReject(update.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm shadow-md">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Modal Component */}
          <BusinessRegisterModal isOpen={modalOpen} onClose={closeModal} business={selectedBusiness} updateVerifiedBusinessList={updateVerifiedBusinessList}/>
  </div>
  );
}
