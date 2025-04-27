import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex justify-center mt-6">
      <div className="flex space-x-2">
        {/* Previous Page Button */}
        <button className="px-3 py-1 bg-blue-500 text-white rounded-full" onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>

        {/* Page Numbers */}
        {pageNumbers?.map((page, index) => page === '...' ? (
            <span key={index} className="px-3 py-1 text-white">...</span>
          ) : (
            <button key={page} className={`px-3 py-1 ${currentPage === page ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-full`}  onClick={() => handlePageClick(page)} >
              {page}
            </button>
          )
        )}

        {/* Next Page Button */}
        <button className="px-3 py-1 bg-blue-500 text-white rounded-full" onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages} >
          Next
        </button>
      </div>
    </div>
  );
}
