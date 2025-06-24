"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PopUp from "@/app/(user)/components/home/popUp";
import { apiGet, apiPut } from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const isLoggedIn = useSelector((state) => state.user?.isLoggedIn);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [tempPhone, setTempPhone] = useState(""); // For local phone change
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        router.push("/");
        return;
      }

      try {
        const res = await apiGet("/users/me");
        setUser(res);
        console.log("Fetched user in parent:", res);
        // setCurrentUserId(res?.id);
        setTempPhone(res.phone); // Set initial phone value
      } catch (err) {
        console.error(err);
        setError("Could not load profile.");
        setShowPopup(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setUser((prev) => ({ ...prev, profileImageFile: file }));
    }
  };

  const handleSave = async () => {
    try {
      await apiPut(`/users/${user.id}/profile`, user);
      setIsEditing(false);
      toast.success("Profile Updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  const ProfileSkeleton = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 animate-pulse">
      <div className="text-center">
        <div className="w-28 h-28 mx-auto rounded-full bg-gray-300 mb-4" />
        <div className="h-6 bg-gray-300 w-1/2 mx-auto rounded mb-2" />
        <div className="h-4 bg-gray-200 w-1/3 mx-auto rounded mb-2" />
        <div className="h-4 bg-gray-200 w-1/4 mx-auto rounded" />
      </div>
    </div>
  );

  if (!isLoggedIn && !loading) return <PopUp onClose={() => location.reload()} />;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-10 px-4 sm:px-8">
    {loading ? (
      <ProfileSkeleton />
    ) : user ? (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
        {/* Header with Tiranga gradient */}
        <div className="h-24 bg-gradient-to-r from-orange-200 via-white to-green-200 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-300/20 via-transparent to-green-300/20"></div>
        </div>

        <div className="px-8 pb-8 -mt-12 relative">
          {/* Profile Picture */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-orange-100 to-green-100">
              <img
                src={previewImage || user?.profileImage || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group">
                  <div className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>

            {/* Editable User Info */}
            {isEditing ? (
              <div className="mt-6 space-y-3">
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="text-2xl font-bold text-center border-b-2 border-orange-200 focus:border-green-400 bg-transparent outline-none px-2 py-1 text-gray-800"
                  placeholder="Full Name"
                />
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="block mx-auto text-center border-b border-orange-200 focus:border-green-400 bg-transparent outline-none px-2 py-1 text-gray-600"
                  placeholder="Email Address"
                />
                <input
                  type="url"
                  name="website"
                  value={user.website}
                  onChange={handleChange}
                  className="block mx-auto text-center border-b border-orange-200 focus:border-green-400 bg-transparent outline-none px-2 py-1 text-green-600"
                  placeholder="Website URL"
                />
              </div>
            ) : (
              <div className="mt-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h2>
                <div className="flex items-center justify-center text-gray-600 mb-2">
                  <div className="w-4 h-4 mr-2 text-orange-500" />
                  <span>{user.email}</span>
                </div>
                {user.website && (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 mr-2 text-green-500" />
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 hover:underline transition-colors"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Details Section */}
          <div className="mt-8 space-y-4">
            <div className="bg-gradient-to-r from-orange-50 to-orange-25 rounded-xl p-5 border border-orange-100 shadow-sm">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                <h3 className="text-sm font-semibold text-orange-700 uppercase tracking-wide">Full Name</h3>
              </div>
              <p className="text-gray-800 font-medium text-lg">{user.name}</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-25 rounded-xl p-5 border border-green-100 shadow-sm">
              <div className="flex items-center mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide">Phone Number</h3>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  className="w-full bg-transparent border-b border-green-200 focus:border-green-400 outline-none text-lg font-medium text-gray-800 py-1"
                  placeholder="Phone Number"
                />
              ) : (
                <p className="text-gray-800 font-medium text-lg">{tempPhone}</p>
              )}
            </div>

            <div className="bg-gradient-to-r from-orange-50 via-white to-green-50 rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Member Since</h3>
              </div>
              {/* <p className="text-gray-800 font-medium text-lg">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "long", 
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Date not available"}
              </p> */}
              <span className="text-md text-black font-bold"> {new Date(user.created_at).toLocaleDateString()} </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setTempPhone(user.phone);
                    setPreviewImage(null);
                  }}
                  className="flex items-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200 shadow-sm"
                >
                  <p className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  <button className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                <button className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    ) : null}
  </div>
  );
}
