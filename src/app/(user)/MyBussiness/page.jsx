"use client";

import { useState, useEffect } from "react";
import EditBusinessPopup from "@/app/(user)/components/profileComp/EditBusinessPopup";
import PopUp from "../components/home/popUp";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcFinePrint } from "react-icons/fc";
import { apiGet, apiPut } from "@/lib/apiClient";

export default function MyBusinessPage() {
  const [businesses, setBusinesses] = useState([]); 
  const [businessToEdit, setBusinessToEdit] = useState(null);
  const [token, setToken] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      router.push("/login");
      return;
    }
    
    const fetchBusiness = async () => {
      try {

        const res = await apiGet(`/businesses/user`);
        console.log("businesses:", res);

        if (res.businesses) {
          setBusinesses(res.businesses);
        } else {
          console.warn("Unexpected response format:", res);
          setBusinesses([]);
        }
      } catch (err) {
        console.error("Failed to load businesses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, []);

  const handleLoginSuccess = () => {
    const newToken = localStorage.getItem("token");
    if (newToken) {
      setToken(newToken);
    }
  };

  const handleSubmit = async (updatedBusinessData) => {
    try {
      const res = await apiPut(`/businesses/${businessToEdit.id}`, updatedBusinessData);
      console.log("Updating Business", res);
  
      if (res.business) {
        handleUpdate(res.business); 
      } else {
        alert("Update succeeded, but response format is unexpected.");
      }
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update business info.");
    }
  };
  
  const handleUpdate = (updatedData) => {
    console.log("Updated data:", updatedData);
    
    setBusinesses((prev) => {
      console.log("Before update:", prev);
      
      const updatedList = prev.map((b) => {
        if (b.id === updatedData.id) {
          console.log(`Replacing business with id ${b.id}`);
          return updatedData;
        }
        return b;
      });
      
      console.log("After update:", updatedList);
      return updatedList;
    });
  
    setShowEditPopup(false);
    setBusinessToEdit(null);
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading your business profiles...</p>;
  if (!token) return <PopUp onClose={handleLoginSuccess} />;
  if (!Array.isArray(businesses)) {
    return <p className="text-center mt-10 text-red-500">Invalid response format.</p>;
  }
  
  if (businesses.length === 0) {return <p>No businesses found.</p>;}

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
  <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
    My Business Profiles
  </h1>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {businesses.map((business) => (
      <div
        key={business.id}
        className="bg-white rounded-2xl shadow-lg p-6 space-y-6 flex flex-col justify-between"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden shadow-md">
            <img
              src={business.logoUrl || "/image.png"}
              alt="Business Logo"
              className="object-contain w-full h-full"
            />
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{business.name}</h2>
            <div
              className="text-gray-600 text-sm mt-1 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: business.description || "<p>No description provided.</p>",
              }}
            />
          </div>

          <div>
            {business.isVerified ? (
              <span className="text-green-600 font-semibold text-sm bg-green-100 px-4 py-1.5 rounded-full border border-green-300">
                Verified
              </span>
            ) : (
              <span className="text-red-600 font-semibold text-sm bg-red-100 px-4 py-1.5 rounded-full border border-red-300">
                Unverified
              </span>
            )}
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="flex justify-center gap-3">
          <Link href={`/listinginfo/${business.slug}`}>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm shadow flex items-center">
              <FcFinePrint className="text-xl mr-1" />
              View Details
            </button>
          </Link>

          <button onClick={() => { setBusinessToEdit(business); setShowEditPopup(true);}} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm shadow">
            Edit
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* Edit Popup */}
  {showEditPopup && businessToEdit && (
    <EditBusinessPopup business={businessToEdit} onClose={() => { setShowEditPopup(false); setBusinessToEdit(null); }}onSave={handleSubmit}/>
  )}
</div>

  );
}
