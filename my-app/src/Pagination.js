import React, { useState, useEffect } from "react";
import "./Pagination.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const [inputPage, setInputPage] = useState(currentPage);

  useEffect(() => {
    setInputPage(currentPage); // Sync input with current page
  }, [currentPage]);

  const handlePageInput = (e) => {
    const value = e.target.value;
    if (value === "" || (/^\d+$/.test(value) && +value <= totalPages)) {
      setInputPage(value);
    }
  };

  const handlePageEnter = (e) => {
    if (e.key === "Enter") {
      const page = parseInt(inputPage);
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    }
  };

  return (
    <div className="pagination-container">
      <div className="pagination-box">
        {/* Hide 'Previous' on first page */}
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="pagination-btn"
          >
            ⬅ Previous
          </button>
        )}

        <span className="pagination-text">
          <input
            type="text"
            value={inputPage}
            onChange={handlePageInput}
            onKeyDown={handlePageEnter}
            className="pagination-input"
          />{" "}
          of {totalPages}
        </span>

        {/* Hide 'Next' on last page */}
        {currentPage < totalPages && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="pagination-btn"
          >
            Next ➡
          </button>
        )}
      </div>
    </div>
  );
}

export default Pagination;
