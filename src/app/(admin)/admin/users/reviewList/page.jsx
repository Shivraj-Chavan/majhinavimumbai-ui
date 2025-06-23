"use client";

import { useEffect, useState } from "react";
import { apiDelete, apiGet } from "@/lib/apiClient";
import { toast } from "react-toastify";

export default function RaisedReviewsPage() {
  const [raisedReviews, setRaisedReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRaisedReviews = async () => {
    try {
      setLoading(true);
      const res = await apiGet("/reviews/raised_reviews");
      console.log("Raised reviews fetched:", res);
      setRaisedReviews(res);
    } catch (err) {
      toast.error("Failed to fetch raised reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDelete = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review permanently?")) return;
    console.log(" Deletion cancelled by admin");
    try {
      await apiDelete(`/reviews/${adminreviewId}`);
      console.log("Review deleted successfully:", adminreviewId);
      toast.success("Review deleted");
      setRaisedReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  useEffect(() => {
    fetchRaisedReviews();
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Raised Reviews for Deletion</h2>

      {loading ? (
        <div className="text-center text-gray-600">Loading...</div>
      ) : raisedReviews.length === 0 ? (
        <div className="text-center text-gray-500">No raised reviews found.</div>
      ) : (
        <div className="w-full overflow-x-auto">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-white/60 text-gray-700 uppercase text-md rounded-t-lg">
                <tr>
                  <th className="px-4 py-3">SR. NO</th>
                  <th className="px-4 py-3">Reviewer</th>
                  <th className="px-4 py-3">Comment</th>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white/30 backdrop-blur-md">
                {raisedReviews.map((review, index) => (
                  <tr key={review.id} className="hover:bg-white/50 transition-all duration-300">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{review.name}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{review.comment}</td>
                    <td className="px-4 py-3">{review.business_name}</td>
                    <td className="px-4 py-3">{new Date(review.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleAdminDelete(review.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-md px-4 py-1 rounded-full font-medium shadow-md transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {raisedReviews.map((review, index) => (
              <div key={review.id} className="mb-4 p-4 bg-white rounded-lg shadow-md">
                <p className="text-sm text-gray-500">#{index + 1}</p>
                <h3 className="text-lg font-semibold">{review.name}</h3>
                <p className="text-sm mt-1 text-gray-700">Business: {review.business_name}</p>
                <p className="text-sm text-gray-600 mt-1">Date: {new Date(review.created_at).toLocaleDateString()}</p>
                <p className="text-sm text-gray-800 mt-2">Comment: {review.comment}</p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleAdminDelete(review.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium shadow-md transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
