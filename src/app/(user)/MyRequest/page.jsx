'use client';

import { apiDelete, apiGet } from '@/lib/apiClient';
import { useEffect, useState } from 'react';

export default function MyRequestPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await apiGet(`/reviews/${businessId}`); 
        console.log('Fetched reviews:', data);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    try {
      console.log(`Attempting to delete review: ${id}`);
      const res = await apiDelete(`/reviews/${id}`);
  
      if (!res.ok) {
        throw new Error("Failed to delete review");
      }
  
      const filtered = reviews.filter((r) => r._id !== id);
      setReviews(filtered);
      console.log("Deleted review with id:", id);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };
  
  return (
    <div className="p-4 max-w-5xl mx-auto">
  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-800">My Feedback Requests</h2>

  {reviews.length === 0 ? (
    <div className="flex flex-col items-center text-gray-500 py-10">
      <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5"
        viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      <p className="text-lg">No reviews yet.</p>
    </div>
  ) : (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <div key={review._id} className="bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition duration-300 ease-in-out">
          <div className="flex items-center justify-between mb-3">
            <span className="text-yellow-500 font-bold text-lg">⭐ {review.rating}</span>
            <button onClick={() => handleDelete(review._id)} className="text-red-500 hover:text-red-700 transition duration-150 text-sm font-medium" >
              Delete
            </button>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
          <p className="mt-4 text-right text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )}
</div>

  );
}
