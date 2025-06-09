"use client";

import { apiGet } from '@/lib/apiClient';
import { useEffect, useState } from 'react';

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow p-5">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="h-5 w-24 bg-gray-300 rounded mb-1"></div>
          <div className="h-3 w-32 bg-gray-300 rounded"></div>
        </div>
        <div className="h-3 w-16 bg-gray-300 rounded"></div>
      </div>
      <div className="h-16 bg-gray-300 rounded"></div>
    </div>
  );
}

export default function OwnerEnquiriesPage() {
  const [groupedEnquiries, setGroupedEnquiries] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
        console.log("Fetching enquiries for owner...");
      try {
        const res = await apiGet('/owner');
        console.log("API Response:", res.data);
        setGroupedEnquiries(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  const businessIds = Object.keys(groupedEnquiries);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-blue-800 text-center mb-10">
        All Received Enquiries
      </h1>

      {loading ? (
        // Show skeleton loaders (3 columns grid with 3 skeleton cards)
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : businessIds.length === 0 ? (
        <p className="text-center text-gray-500">No enquiries for any business yet.</p>
      ) : (
        businessIds.map((id) => {
          const { name, enquiries } = groupedEnquiries[id];
          return (
            <section key={id} className="mb-12">
              <h2 className="text-2xl font-semibold text-orange-600 mb-4 border-b pb-1">
                {name}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-800">{enq.username}</p>
                        <p className="text-sm text-gray-500">{enq.email}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(enq.created_at).toLocaleDateString()}
                        <br />
                        {new Date(enq.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{enq.message}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
