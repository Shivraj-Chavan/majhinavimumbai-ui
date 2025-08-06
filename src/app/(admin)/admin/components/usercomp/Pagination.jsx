import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageWindowSize = 5;

  const getPageWindowStart = () => {
    // Integer division to get window start index (0-based)
    return Math.floor((currentPage - 1) / pageWindowSize) * pageWindowSize + 1;
  };

  const start = getPageWindowStart();
  const end = Math.min(start + pageWindowSize - 1, totalPages);

  const visiblePages = [];
  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }

  const handlePrevBlock = () => {
    const prevStart = Math.max(start - pageWindowSize, 1);
    onPageChange(prevStart);
  };

  const handleNextBlock = () => {
    const nextStart = start + pageWindowSize;
    if (nextStart <= totalPages) {
      onPageChange(nextStart);
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="flex space-x-2">
        {/* Prev Block */}
        <button
          onClick={handlePrevBlock}
          disabled={start === 1}
          className="px-3 py-1 bg-blue-500 text-white rounded-full disabled:opacity-50"
        >
          Prev
        </button>

        {/* Visible Page Buttons */}
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

        {/* Next Block */}
        <button
          onClick={handleNextBlock}
          disabled={end === totalPages}
          className="px-3 py-1 bg-blue-500 text-white rounded-full disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
