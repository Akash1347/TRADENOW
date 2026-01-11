import React, { useState, useContext } from 'react';
import { UserContext } from './userContext';
import axios from 'axios';
import { showToast } from './toast.jsx';

function AddWatchlistButton({ symbol }) {
  const { userData, addUserWatchlist, userWatchlist } = useContext(UserContext);
  const [isAdding, setIsAdding] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Check if symbol is already in watchlist (defensive check)
  const isInWatchlist = userWatchlist && Array.isArray(userWatchlist)
    ? userWatchlist.includes(symbol?.toUpperCase())
    : false;

  const addSymbol = async () => {
    if (!symbol?.trim()) {
      console.log("No symbol provided");
      showToast("No symbol provided", "error");
      return;
    }

    if (!userData?.userId && !userData?._id) {
      console.error("User not authenticated");
      showToast("Please login to add to watchlist", "error");
      return;
    }

    const symbolToAdd = symbol.toUpperCase();
    console.log("Adding symbol:", symbolToAdd);
    setIsAdding(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/watchlist/add`,
        { symbol: symbolToAdd },
        { withCredentials: true }
      );

      console.log("Add symbol response:", response.data);

      if (response.data.success) {
        addUserWatchlist(symbolToAdd); // Update local context
        showToast(`${symbolToAdd} added to watchlist`, "success");
      } else {
        showToast("Failed to add symbol to watchlist", "error");
      }

    } catch (err) {
      console.error("Add failed:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || "Failed to add symbol. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={addSymbol}
      disabled={isAdding || isInWatchlist}
      className="add-watchlist-btn"
      style={{
        padding: '8px 16px',
        backgroundColor: isInWatchlist ? '#4caf50' : '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: (isAdding || isInWatchlist) ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        margin: '0 8px',
        opacity: isInWatchlist ? 0.7 : 1
      }}
    >
      {isAdding ? 'Adding...' : isInWatchlist ? '✓ In Watchlist' : 'Add to Watchlist'}
    </button>
  );
}

export default AddWatchlistButton
