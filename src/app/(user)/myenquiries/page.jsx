"use client";

import Pagination from '@/app/(admin)/admin/components/usercomp/Pagination';
import { apiGet } from '@/lib/apiClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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

export default function Enquiries() {
  const [groupedEnquiries, setGroupedEnquiries] = useState({});
  const [loading, setLoading] = useState(true);
   const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
  
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/");
    } else {
      const fetchEnquiries = async () => {
        try {
          const res = await apiGet('/enquiries/owner');  
          console.log('Api get owner response:',res);
          setGroupedEnquiries(res);
        } catch (error) {
          console.error(error);
          toast.error("Failed to load enquiries");
        } finally {
          setLoading(false);
        }
      };
      fetchEnquiries();
    }
  }, [router]);
  

  const businessIds = Object.keys(groupedEnquiries);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-blue-800 text-center mb-10">
        All Received Enquiries
      </h1>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : businessIds.length === 0 ? (
        <p className="text-center text-gray-500">"Currently, no enquiries have been made for any business." </p>
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
                        <p className="font-bold text-gray-800">{enq.name}</p>
                        <p className="text-sm text-gray-500">{enq.email}</p>
                        {/* <p className="text-sm text-gray-500">{enq.phone}</p> */}

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

      {/* Pagination */}
       <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
