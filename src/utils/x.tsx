import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, Filter } from 'lucide-react';

// Generate random data for customers
const generateCustomers = (count:any) => {
  let firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa', 'William', 'Jennifer'];
  let lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'business.net'];
  const addedByList = ['Admin', 'Sales Team', 'Marketing', 'Support', 'Manager'];
  const customers = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${domains[Math.floor(Math.random() * domains.length)]}`;
    const phone = `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const score = Math.floor(Math.random() * 100);
    const lastMessageAt = new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString();
    const addedBy = addedByList[Math.floor(Math.random() * addedByList.length)];
    const avatar = `https://i.pravatar.cc/40?img=${(i % 70) + 1}`;
    
    customers.push({ id: i + 1, name, phone, email, score, lastMessageAt, addedBy, avatar });
  }
  return customers;
};

export const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const ROWS_PER_PAGE = 30;
  const searchTimeoutRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Initialize data on mount
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      // Generate data in chunks to avoid blocking UI
      const data = generateCustomers(1000000);
      setCustomers(data);
      setFilteredData(data);
      setDisplayedData(data.slice(0, ROWS_PER_PAGE));
      setIsLoading(false);
    };
    initData();
  }, []);

  // Debounced search handler
  const handleSearch = useCallback((value) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      const term = value.toLowerCase().trim();
      
      if (!term) {
        setFilteredData(customers);
        setDisplayedData(customers.slice(0, ROWS_PER_PAGE));
        setCurrentPage(1);
        return;
      }

      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.phone.includes(term)
      );
      
      setFilteredData(filtered);
      setDisplayedData(filtered.slice(0, ROWS_PER_PAGE));
      setCurrentPage(1);
    }, 250);
  }, [customers]);

  // Sort handler
  const handleSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });

    const sorted = [...filteredData].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      // Handle date sorting
      if (key === 'lastMessageAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      // Handle numeric sorting
      if (key === 'score' || key === 'id') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }

      // Handle string sorting
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredData(sorted);
    setDisplayedData(sorted.slice(0, ROWS_PER_PAGE));
    setCurrentPage(1);
  }, [filteredData, sortConfig]);

  // Infinite scroll handler
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    
    // Load more when user scrolls to bottom (with 100px threshold)
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      const nextPage = currentPage + 1;
      const start = 0;
      const end = nextPage * ROWS_PER_PAGE;
      
      if (end <= filteredData.length) {
        setDisplayedData(filteredData.slice(start, end));
        setCurrentPage(nextPage);
      }
    }
  }, [currentPage, filteredData]);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Get sort icon
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p>Loading 1,000,000 customer records...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Customers</h1>
        <div style={styles.controls}>
          <div style={styles.searchContainer}>
            <Search size={20} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
            />
          </div>
          <div style={styles.filterContainer}>
            <button 
              style={styles.filterButton}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filters
              <ChevronDown size={16} />
            </button>
            {showFilters && (
              <div style={styles.filterDropdown}>
                <div style={styles.filterItem}>Score Range (Coming Soon)</div>
                <div style={styles.filterItem}>Date Range (Coming Soon)</div>
                <div style={styles.filterItem}>Added By (Coming Soon)</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.statsBar}>
        <span>Showing {displayedData.length.toLocaleString()} of {filteredData.length.toLocaleString()} customers</span>
      </div>

      <div 
        style={styles.tableContainer}
        onScroll={handleScroll}
        ref={scrollContainerRef}
      >
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th} onClick={() => handleSort('id')}>
                <div style={styles.thContent}>
                  ID {getSortIcon('id')}
                </div>
              </th>
              <th style={styles.th} onClick={() => handleSort('name')}>
                <div style={styles.thContent}>
                  Customer {getSortIcon('name')}
                </div>
              </th>
              <th style={styles.th} onClick={() => handleSort('phone')}>
                <div style={styles.thContent}>
                  Phone {getSortIcon('phone')}
                </div>
              </th>
              <th style={styles.th} onClick={() => handleSort('email')}>
                <div style={styles.thContent}>
                  Email {getSortIcon('email')}
                </div>
              </th>
              <th style={styles.th} onClick={() => handleSort('score')}>
                <div style={styles.thContent}>
                  Score {getSortIcon('score')}
                </div>
              </th>
              <th style={styles.th} onClick={() => handleSort('lastMessageAt')}>
                <div style={styles.thContent}>
                  Last Message {getSortIcon('lastMessageAt')}
                </div>
              </th>
              <th style={styles.th} onClick={() => handleSort('addedBy')}>
                <div style={styles.thContent}>
                  Added By {getSortIcon('addedBy')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedData.map((customer) => (
              <tr key={customer.id} style={styles.tr}>
                <td style={styles.td}>{customer.id}</td>
                <td style={styles.td}>
                  <div style={styles.customerCell}>
                    <img src={customer.avatar} alt={customer.name} style={styles.avatar} />
                    <span>{customer.name}</span>
                  </div>
                </td>
                <td style={styles.td}>{customer.phone}</td>
                <td style={styles.td}>{customer.email}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.scoreBadge,
                    backgroundColor: customer.score >= 70 ? '#d4edda' : customer.score >= 40 ? '#fff3cd' : '#f8d7da',
                    color: customer.score >= 70 ? '#155724' : customer.score >= 40 ? '#856404' : '#721c24'
                  }}>
                    {customer.score}
                  </span>
                </td>
                <td style={styles.td}>{formatDate(customer.lastMessageAt)}</td>
                <td style={styles.td}>{customer.addedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '20px',
  },
  loader: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    padding: '20px 30px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #dee2e6',
  },
  title: {
    margin: '0 0 20px 0',
    fontSize: '28px',
    fontWeight: '600',
    color: '#212529',
  },
  controls: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  searchContainer: {
    position: 'relative',
    flex: '1',
    maxWidth: '500px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6c757d',
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px 10px 40px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  filterContainer: {
    position: 'relative',
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#fff',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
    transition: 'all 0.2s',
  },
  filterDropdown: {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: '5px',
    backgroundColor: '#fff',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1000,
    minWidth: '200px',
  },
  filterItem: {
    padding: '12px 16px',
    borderBottom: '1px solid #e9ecef',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#6c757d',
  },
  statsBar: {
    padding: '12px 30px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #dee2e6',
    fontSize: '14px',
    color: '#6c757d',
  },
  tableContainer: {
    flex: '1',
    overflow: 'auto',
    backgroundColor: '#fff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    position: 'sticky',
    top: 0,
    backgroundColor: '#f8f9fa',
    zIndex: 10,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#495057',
    borderBottom: '2px solid #dee2e6',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  thContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  tr: {
    borderBottom: '1px solid #e9ecef',
    transition: 'background-color 0.15s',
    cursor: 'pointer',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#212529',
  },
  customerCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  scoreBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
  },
};

// Add keyframe animation for loader
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  tr:hover {
    background-color: #f8f9fa !important;
  }
  
  input:focus {
    border-color: #80bdff !important;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25) !important;
  }
  
  button:hover {
    background-color: #f8f9fa !important;
  }
  
  th:hover {
    background-color: #e9ecef !important;
  }
`;
document.head.appendChild(styleSheet);

export default CustomersList;