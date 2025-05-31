"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PopUp from "@/app/(user)/components/home/popUp";
import { apiGet, apiPut } from "@/lib/apiClient";

export default function ProfilePage() {
  const isLoggedIn = useSelector((state) => state.user?.isLoggedIn);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [token, setToken] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await apiGet("/users/me");
        console.log("Fetched user:", res);
        setUser(res);
      } catch (err) {
        console.error(err);
        setError("Could not load profile.");
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
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!token || !isLoggedIn) return <PopUp onClose={() => location.reload()} />;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4 sm:px-8">
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
                // onChange={handleChange}
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
    </div>
  );
}
