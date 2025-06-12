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
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [token, setToken] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await apiGet("/users/me");
        setUser(res);
        setIsAuthenticated(true); 
      } catch (err) {
        console.error(err);
        setError("Could not load profile.");
        setIsAuthenticated(false); 
        setShowPopup(true);       
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

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
      toast.success("Profile Updated !")
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
  
      <div className="mt-8 space-y-4">
        {/* Full Name */}
        <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
          <div className="h-4 bg-gray-300 w-1/3 rounded mb-2" />
          <div className="h-5 bg-gray-200 w-2/3 rounded" />
        </div>
  
        {/* Phone Number */}
        <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
          <div className="h-4 bg-gray-300 w-1/3 rounded mb-2" />
          <div className="h-5 bg-gray-200 w-1/2 rounded" />
        </div>
  
        {/* Joined Date */}
        <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
          <div className="h-4 bg-gray-300 w-1/3 rounded mb-2" />
          <div className="h-5 bg-gray-200 w-1/4 rounded" />
        </div>
      </div>
  
      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <div className="w-24 h-10 bg-gray-300 rounded-lg" />
        <div className="w-24 h-10 bg-gray-300 rounded-lg" />
      </div>
    </div>
  );
  
  if (!token || !isLoggedIn) return <PopUp onClose={() => location.reload()} />;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4 sm:px-8">
      {loading ? (
        <ProfileSkeleton />
      ) : user ? (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-blue-300 shadow">
              <img
                src={previewImage || user?.profileImage || "/person.jpg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
              )}
            </div>

            {isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="mt-4 font-bold text-xl text-center border-b border-gray-300"
                />
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="text-sm mt-1 text-gray-500 border-b border-gray-300"
                />
                <input
                  type="url"
                  name="website"
                  value={user.website}
                  onChange={handleChange}
                  className="text-sm text-blue-500 mt-1 border-b border-gray-300"
                />
              </>
            ) : (
              <>
                <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline mt-2"
                  >
                    {user.website}
                  </a>
                )}
              </>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Full Name</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={user.fullName}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-300"
                />
              ) : (
                <p className="text-gray-800">{user.fullName}</p>
              )}
            </div>
            <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Phone Number</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-300"
                />
              ) : (
                <p className="text-gray-800">{user.phone}</p>
              )}
            </div>
            <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-600">Joined On</h3>
              <p className="text-gray-800">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
