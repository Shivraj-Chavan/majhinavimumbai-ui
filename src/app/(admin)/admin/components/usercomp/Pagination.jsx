// import React from 'react';

// export default function Pagination({ currentPage, totalPages, onPageChange }) {
//   const pageWindowSize = 5;

//   // Compute sliding window range
//   const halfWindow = Math.floor(pageWindowSize / 2);
//   let start = Math.max(currentPage - halfWindow, 1);
//   let end = start + pageWindowSize - 1;

//   // Adjust start if end exceeds totalPages
//   if (end > totalPages) {
//     end = totalPages;
//     start = Math.max(end - pageWindowSize + 1, 1);
//   }

//   const visiblePages = [];
//   for (let i = start; i <= end; i++) {
//     visiblePages.push(i);
//   }

//   return (
//     <div className="flex justify-center mt-6">
//       <div className="flex space-x-2">
//         {/* Previous Page */}
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="px-3 py-1 bg-blue-500 text-white rounded-full disabled:opacity-50"
//         >
//           Prev
//         </button>

//         {/* Page Numbers */}
//         {visiblePages.map((page) => (
//           <button
//             key={page}
//             onClick={() => onPageChange(page)}
//             className={`px-3 py-1 rounded-full ${
//               currentPage === page ? 'bg-blue-700' : 'bg-blue-500'
//             } text-white`}
//           >
//             {page}
//           </button>
//         ))}

//         {/* Next Page */}
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="px-3 py-1 bg-blue-500 text-white rounded-full disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }
import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageWindowSize = 5;
  const halfWindow = Math.floor(pageWindowSize / 2);

  if (totalPages < 1 || currentPage < 1 || currentPage > totalPages) {
    return null; // Guard clause for invalid inputs
  }

  let start = Math.max(currentPage - halfWindow, 1);
  let end = start + pageWindowSize - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(end - pageWindowSize + 1, 1);
  }

  const visiblePages = [];
  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="flex space-x-2">
        {/* Prev */}
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-500 text-white rounded-full disabled:opacity-50"
        >
          Prev
        </button>

        {/* Page Numbers */}
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-full text-white ${
              currentPage === page ? 'bg-blue-700' : 'bg-blue-500'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-blue-500 text-white rounded-full disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
