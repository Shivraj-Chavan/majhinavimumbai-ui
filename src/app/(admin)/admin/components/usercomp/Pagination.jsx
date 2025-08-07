import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageWindowSize = 5;

  // Compute sliding window range
  const halfWindow = Math.floor(pageWindowSize / 2);
  let start = Math.max(currentPage - halfWindow, 1);
  let end = start + pageWindowSize - 1;

  // Adjust start if end exceeds totalPages
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(end - pageWindowSize + 1, 1);
  }

  const visiblePages = [];
  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }

  return (
    <div className="flex justify-center mt-6">
      <div className="flex space-x-2">
        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
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
            className={`px-3 py-1 rounded-full ${
              currentPage === page ? 'bg-blue-700' : 'bg-blue-500'
            } text-white`}
          >
            {page}
          </button>
        ))}

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-blue-500 text-white rounded-full disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
