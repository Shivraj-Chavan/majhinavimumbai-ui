'use client';

import { apiDelete, apiGet } from '@/lib/apiClient';
import { useEffect, useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function AllReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const res = await apiGet('/reviews');
        console.log('All reviews',res);
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
    console.log('reviewId:', reviewId);
    if (!window.confirm('Are you sure you want to delete this review?')) return;
  
    try {
      await apiDelete(`/reviews/${reviewId}`);
      console.log('Delete request successful for reviewId:', reviewId);
      alert('Review deleted successfully!');
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      console.log('Updated reviews after deletion:', updated);
    } catch (err) {
      console.error('Error deleting review:', err);
      // alert('Failed to delete review');
    }
  };
  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
  
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-amber-500 text-xl" />);
    }
  
    if (hasHalfStar && fullStars < 5) {
      stars.push(<FaStarHalfAlt key="half" className="text-amber-400 text-xl" />);
    }
  
    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300 text-xl" />);
    }
  
    return <div className="flex gap-0.5">{stars}</div>;
  };

  
  // Skeleton
  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="bg-white p-5 rounded-xl shadow animate-pulse space-y-4">
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-100 rounded w-1/3 mt-2"></div>
      </div>
    ));
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-10 text-center text-blue-800">All Reviews</h2>

      {loading ? (
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
       {renderSkeletons()}
     </div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-2">
               {/* Rating */}
                <div className="flex flex-row gap-4">
                  <div>{renderStars(review.rating)}</div>
                  <span className="text-sm text-gray-600 font-medium">{review.rating}/5 reviews</span>
                </div>
                <button onClick={() => handleDelete(review.id)} className="text-red-500 hover:text-red-700 text-sm">
                  Delete
                </button>
              </div>

               {/* Business name here */}
              <p className="text-sm font-semibold text-blue-700 mb-1">
                { review.name || "Unknown Business"}
              </p>

              {/* Comment and Date */}
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
