import React from 'react';
import './SearchElements.css';
import {useNavigate} from 'react-router-dom';

function SearchElements({ data }) {
    const navigate = useNavigate();
  return (
    <div className="search-list">
      {data.map((item, index) => (
        <div 
          key={index}
          className="d-flex justify-content-between align-items-center p-2 search-item"
        onClick={() => {navigate(`/stock?symbol=${item.symbol}`);}}
        >
          <p className="fw-semibold m-0">
            {item.description} - {item.symbol}
          </p>
        </div>
      ))}
    </div>
  );
}

export default SearchElements;
