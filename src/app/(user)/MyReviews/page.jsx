'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiDelete } from '@/lib/apiClient';

export default function AllReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await apiGet('/reviews'); 
        console.log(res); 
        setReviews(res);
      } catch (err) {
        console.error('Failed to fetch all reviews:', err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllReviews();
  }, []);
  

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await apiDelete(`/reviews/${reviewId}`);
      alert('Review deleted successfully!');
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Failed to delete review');
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">All Reviews</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <div className="flex justify-between items-center mb-2">
                <span className="text-yellow-500 font-bold">⭐ {review.rating}</span>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              <p className="text-right text-xs text-gray-400 mt-2">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
