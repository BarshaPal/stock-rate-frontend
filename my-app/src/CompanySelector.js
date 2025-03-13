import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './CompanySelector.css';

const CompanySelector = ({ companies, selectedCompany, handleChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedCompanyName, setSelectedCompanyName] = useState('');
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (selectedCompany) {
      const company = companies.find(c => c.symbol === selectedCompany);
      if (company) {
        setSelectedCompanyName(company.name);
      }
    }
  }, [selectedCompany, companies]);

  const handleRemoveCompany = () => {
    setShowConfirmDelete(true);
  };
  
  const handleCompanySelect = (symbol) => {
    handleChange({ target: { value: symbol } });
    const company = companies.find(c => c.symbol === symbol);
    if (company) {
      setSelectedCompanyName(company.name);
    }
    setShowModal(false);
  };

  // Filter and sort
  let filteredCompanies = companies.filter((company) =>
    (company.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (company.country?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (company.currency?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  );

  if (sortAlphabetically) {
    filteredCompanies = [...filteredCompanies].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  const visibleCompanies = filteredCompanies.slice(0, visibleCount);

  const confirmDelete = () => {
    handleChange({ target: { value: '' } }); // Clear in parent
    setSelectedCompanyName(''); // Clear locally
    setShowConfirmDelete(false); // Hide prompt
  };
  
  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };
  
  
  // Scroll listener to load more
  const handleScroll = () => {
    const container = modalContentRef.current;
    if (container) {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
        // Close to bottom
        if (visibleCount < filteredCompanies.length) {
          setVisibleCount((prev) => prev + 10);
        }
      }
    }
  };

  useEffect(() => {
    const container = modalContentRef.current;
    if (container && showModal) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [showModal, visibleCount, filteredCompanies]);

  return (
    <div className={`selector-wrapper ${selectedCompany ? 'shifted' : ''}`}>
      {!selectedCompany && <h1 className="heading">Currency Converter</h1>}

      <div className="dropdown-wrapper">
        <div className="input-wrapper">
        <div className="input-wrapper">
  <input
    type="text"
    placeholder="Select a company"
    className="dropdown"
    value={selectedCompanyName}
    readOnly
    onClick={() => setShowModal(true)}
  />
  {selectedCompanyName ? (
    <button className="remove-button" onClick={handleRemoveCompany}>
      ✖
    </button>
  ) : (
    <button className="search-button" onClick={() => setShowModal(true)}>
      <FontAwesomeIcon icon={faSearch} />
    </button>
  )}
</div>

        </div>
      </div>



      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalContentRef}>
            <div className="modal-header">
              <h3>Select A Company</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>✖</button>
            </div>

            <div className="modal-controls">
              <input
                type="text"
                placeholder="Search by name, country, or currency"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(10); // Reset pagination on new search
                }}
                className="search-input"
              />
              <label className="sort-label">
                <input
                  type="checkbox"
                  checked={sortAlphabetically}
                  onChange={() => {
                    setSortAlphabetically(!sortAlphabetically);
                    setVisibleCount(10); // Reset pagination on sort
                  }}
                />
                Sort A-Z
              </label>
            </div>

            <table className="company-table">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Country</th>
                  <th>Currency</th>
                </tr>
              </thead>
              <tbody>
                {visibleCompanies.map((company) => (
                  <tr key={company.symbol} onClick={() => handleCompanySelect(company.symbol)}>
                    <td>{company.name}</td>
                    <td>{company.country}</td>
                    <td>{company.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Optional static Load More fallback */}
            {visibleCount < filteredCompanies.length && (
              <div className="load-more-text" onClick={() => setVisibleCount(visibleCount + 10)}>
                Load More
              </div>
            )}
          </div>
        </div>
      )}

{showConfirmDelete && (
  <div className="modal-overlay">
    <div className="confirm-modal">
      <p>All your data will get deleted. Are you sure?</p>
      <div className="confirm-buttons">
        <button className="yes-button" onClick={confirmDelete}>Yes</button>
        <button className="no-button" onClick={cancelDelete}>No</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CompanySelector;
