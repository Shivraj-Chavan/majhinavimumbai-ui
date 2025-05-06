"use client";

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { apiGet } from '@/lib/apiClient';

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const isLoggedIn = useSelector((state) => state.user?.isLoggedIn);

  const dummyUser = {
    name: 'xyz23',
    email: 'xyz@example.com',
    profileImage: '/profile.jpg', 
    fullName: 'xyz abc',
    phone: '887656787',
    website: 'https://xyz.com',
    createdAt: '2025-03-12',
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    } else {
      console.log('Using dummy data...');
      setUser(dummyUser);
      setLoading(false);
    }
  }, [isLoggedIn, router]);
  
  
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       if (!isLoggedIn) {
//         console.log("User not logged in. Redirecting...");
//         router.push('/');
//         return;
//       }

//       try {
//         console.log("Fetching user profile...");
//         const res = await apiGet('/users/profile');
//         console.log("Profile fetched successfully:", res.data);
//         setUser(res.data);
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//         router.push('/');
//       } finally {y
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [isLoggedIn, router]);

  console.log("isLoggedIn:", isLoggedIn);
  console.log("user data:", user);

  if (!isLoggedIn) return <div className="text-center py-10">Redirecting to home...</div>;
  if (loading || !user) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 shadow">
            <img
              src={user?.profileImage || '/default-avatar.png'}
              alt="Profile"
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2 text-sm"
            >
              {user.website}
            </a>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">Full Name</h3>
            <p className="text-gray-800">{user.fullName}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">Phone Number</h3>
            <p className="text-gray-800">{user.phone}</p>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">Joined On</h3>
            <p className="text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
