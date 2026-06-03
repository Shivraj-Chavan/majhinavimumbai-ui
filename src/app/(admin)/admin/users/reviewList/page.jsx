// "use client";

// import { useEffect, useState } from "react";
// import { apiDelete, apiGet } from "@/lib/apiClient";
// import { toast } from "react-toastify";
// import Pagination from "../../components/usercomp/Pagination";

// export default function RaisedReviewsPage() {
//   const [raisedReviews, setRaisedReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);
//     const [currentPage, setCurrentPage] = useState(1);

//   const fetchRaisedReviews = async () => {
//     try {
//       setLoading(true);
//       const res = await apiGet("/reviews/raised_reviews");
//       console.log("Raised reviews fetched:", res);
//       setRaisedReviews(res);
//     } catch (err) {
//       toast.error("Failed to fetch raised reviews");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAdminDelete = async (reviewId) => {
//     if (!confirm("Are you sure you want to delete this review permanently?")) return;
//     console.log(" Deletion cancelled by admin");
//     try {
//       await apiDelete(`/reviews/${reviewId}`);
//       console.log("Review deleted successfully:", reviewId);
//       toast.success("Review deleted");
//       setRaisedReviews((prev) => prev.filter((r) => r.id !== reviewId));
//     } catch (err) {
//       toast.error("Failed to delete review");
//     }
//   };

//   useEffect(() => {
//     fetchRaisedReviews();
//   }, []);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="p-6 bg-gradient-to-br from-white/30 to-white/30 backdrop-blur-md rounded-2xl shadow-lg">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">Raised Reviews for Deletion</h2>

//       {loading ? (
//         <div className="text-center text-gray-600">Loading...</div>
//       ) : raisedReviews.length === 0 ? (
//         <div className="text-center text-gray-500">No raised reviews found.</div>
//       ) : (
//         <div className="w-full overflow-x-auto">
//           {/* Desktop Table */}
//           <div className="hidden md:block">
//             <table className="min-w-full text-sm text-left">
//               <thead className="bg-white/60 text-gray-700 uppercase text-md rounded-t-lg">
//                 <tr>
//                   <th className="px-4 py-3">SR. NO</th>
//                   <th className="px-4 py-3">Reviewer</th>
//                   <th className="px-4 py-3">Comment</th>
//                   <th className="px-4 py-3">Business</th>
//                   <th className="px-4 py-3">Date</th>
//                   <th className="px-4 py-3 text-center">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white/30 backdrop-blur-md">
//                 {raisedReviews.map((review, index) => (
//                   <tr key={review.id} className="hover:bg-white/50 transition-all duration-300">
//                     <td className="px-4 py-3">{index + 1}</td>
//                     <td className="px-4 py-3">{review.name}</td>
//                     <td className="px-4 py-3 max-w-xs truncate">{review.comment}</td>
//                     <td className="px-4 py-3">{review.business_name}</td>
//                     <td className="px-4 py-3">{new Date(review.created_at).toLocaleDateString()}</td>
//                     <td className="px-4 py-3 text-center">
//                       <button
//                         onClick={() => handleAdminDelete(review.id)}
//                         className="bg-red-500 hover:bg-red-600 text-white text-md px-4 py-1 rounded-full font-medium shadow-md transition duration-200"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Cards */}
//           <div className="md:hidden">
//             {raisedReviews.map((review, index) => (
//               <div key={review.id} className="mb-4 p-4 bg-white rounded-lg shadow-md">
//                 <p className="text-sm text-gray-500">#{index + 1}</p>
//                 <h3 className="text-lg font-semibold">{review.name}</h3>
//                 <p className="text-sm mt-1 text-gray-700">Business: {review.business_name}</p>
//                 <p className="text-sm text-gray-600 mt-1">Date: {new Date(review.created_at).toLocaleDateString()}</p>
//                 <p className="text-sm text-gray-800 mt-2">Comment: {review.comment}</p>
//                 <div className="mt-4 flex justify-end">
//                   <button
//                     onClick={() => handleAdminDelete(review.id)}
//                     className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium shadow-md transition duration-200"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Pagination */}
//             <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { apiDelete, apiGet } from "@/lib/apiClient";
import { toast } from "react-toastify";
import Pagination from "../../components/usercomp/Pagination";

export default function RaisedReviewsPage() {
  const [raisedReviews, setRaisedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRaisedReviews, setTotalRaisedReviews] = useState(0);

  const fetchRaisedReviews = async () => {
    try {
      setLoading(true);
      const res = await apiGet("/reviews/raised_reviews");
      console.log("Raised reviews fetched:", res);
      setRaisedReviews(res);
      setTotalRaisedReviews(
        res?.total ||
        res?.count ||
        res?.reviews?.length ||
        res?.length ||
        0
      );
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
      await apiDelete(`/reviews/${reviewId}`);
      console.log("Review deleted successfully:", reviewId);
      toast.success("Review deleted");
      setRaisedReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  useEffect(() => {
    fetchRaisedReviews();
  }, []);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="p-4 sm:p-5">
   
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
  <div>
    <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
    Raised Reviews for Deletion
    </h2>
    <p className="text-sm text-gray-500 mt-1">
    Reviews reported by users and awaiting admin action.
    </p>
  </div>

  <div className="bg-white border border-blue-100 rounded-xl px-4 py-2 shadow-sm">
    <p className="text-xs text-gray-500 uppercase tracking-wide">
      Total : <span className="text-blue-700 font-bold text-lg">{totalRaisedReviews.toLocaleString()}</span> 
    </p>
  </div>
</div>
    

      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-12">#</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Reviewer</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Comment</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Business</th>
              <th className="px-2 py-1.5 text-left font-semibold text-gray-500 uppercase tracking-wider w-28">Date</th>
              <th className="px-2 py-1.5 text-center font-semibold text-gray-500 uppercase tracking-wider w-20">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Loading…
                  </span>
                </td>
              </tr>
            ) : raisedReviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 text-xs">No raised reviews found</td>
              </tr>
            ) : (
              raisedReviews.map((review, index) => (
                <tr key={review.id} className="hover:bg-blue-50/40 transition-colors duration-150">
                  <td className="px-2 py-1 text-gray-400 font-mono">{index + 1}</td>
                  <td className="px-2 py-1 font-medium text-gray-800">{review.name ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-500 max-w-xs truncate">{review.comment ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-500">{review.business_name ?? "—"}</td>
                  <td className="px-2 py-1 text-gray-400 whitespace-nowrap">
                    {new Date(review.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-2 py-1 text-center">
                    <button
                      onClick={() => handleAdminDelete(review.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-[11px] font-medium transition-colors"
                    >
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-400 text-xs gap-1.5">
            <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading…
          </div>
        ) : raisedReviews.length === 0 ? (
          <div className="text-center text-gray-400 py-10 text-xs">No raised reviews found</div>
        ) : (
          raisedReviews.map((review, index) => (
            <div key={review.id} className="bg-white rounded-lg border border-gray-100 shadow-sm px-3.5 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">#{index + 1}</span>
                  <span className="text-xs font-semibold text-gray-800 truncate">{review.name ?? "—"}</span>
                </div>
                <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-col gap-0.5 mb-2.5">
                {review.business_name && (
                  <p className="text-[11px] text-gray-500">{review.business_name}</p>
                )}
                {review.comment && (
                  <p className="text-[11px] text-gray-600 line-clamp-2">{review.comment}</p>
                )}
              </div>

              <button
                onClick={() => handleAdminDelete(review.id)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs font-medium transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Delete Review
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="mt-3">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}