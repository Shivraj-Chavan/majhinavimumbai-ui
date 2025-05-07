"use client";

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/apiClient';

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const isLoggedIn = useSelector((state) => state.user?.isLoggedIn);

  const dummyUser = {
    name: 'Food Truck',
    email: 'foodtruck@gmail.com',
    profileImage: '/resto.jpeg',
    fullName: 'Prachi Babar',
    phone: '887656787',
    website: 'https://foodtruck.com',
    createdAt: '2025-07-05',
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    } else {
      setUser(dummyUser);
      setLoading(false);
    }
  }, [isLoggedIn, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Updated user data:', user);
  };

  if (!isLoggedIn) return <div className="text-center py-10">Redirecting to home...</div>;
  if (loading || !user) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 shadow">
            <img src={user?.profileImage || '/default-avatar.png'} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
            {isEditing && (
              <input type="file" accept="image/*" className="absolute bottom-0 left-0 opacity-0 w-full h-full cursor-pointer" onChange={handleImageChange}/>
            )}
          </div>
          {isEditing ? (
            <>
              <input type="text" name="name" value={user.name} onChange={handleChange} className="mt-4 text-xl font-bold text-center border-b border-gray-300 focus:outline-none"/>
              <input type="email" name="email" value={user.email} onChange={handleChange} className="text-gray-500 text-sm mt-1 border-b border-gray-300 focus:outline-none"/>
              <input type="url" name="website" value={user.website} onChange={handleChange} className="text-blue-500 mt-1 text-sm border-b border-gray-300 focus:outline-none"/>
            </>
          ) : (
            <>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              {user.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 text-sm">
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
              <input type="text" name="fullName" value={user.fullName} onChange={handleChange} className="w-full bg-transparent border-b border-gray-300 focus:outline-none"/>
            ) : (
              <p className="text-gray-800">{user.fullName}</p>
            )}
          </div>
          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">Phone Number</h3>
            {isEditing ? (
              <input type="text" name="phone" value={user.phone} onChange={handleChange} className="w-full bg-transparent border-b border-gray-300 focus:outline-none"/>
            ) : (
              <p className="text-gray-800">{user.phone}</p>
            )}
          </div>
          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">Joined On</h3>
            <p className="text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Save
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
