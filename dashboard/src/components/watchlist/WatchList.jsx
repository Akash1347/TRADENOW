import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import WatchListItem from "./WatchListItem.jsx";
import { DoughnutChart } from "../charts/DoughnoutChart.jsx";
import { UserContext } from "../../contexts/userContext";
import GeneralContext from "../../contexts/GeneralContext";
import { showToast } from "../ui/toast.jsx";
import "./Watchlist.css";
import SearchElements from "../ui/SearchElements.jsx";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function WatchList() {
  const { userData, userWatchlist, removeUserWatchlist } = useContext(UserContext);
  const generalContext = useContext(GeneralContext);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [search, setSearch] = useState([]);
  const [watchlistItems, setWatchlistItems] = useState([]);

  // Function to check if US market is open
  const isMarketOpen = () => {
    const now = new Date();
    // Convert to ET (UTC-5)
    const etOffset = -5 * 60; // ET is UTC-5
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const etTime = new Date(utc + (etOffset * 60000));

    const day = etTime.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const hours = etTime.getHours();
    const minutes = etTime.getMinutes();

    // Market open: Mon-Fri, 9:30 AM - 4:00 PM ET
    if (day >= 1 && day <= 5) {
      const currentMinutes = hours * 60 + minutes;
      const openMinutes = 9 * 60 + 30; // 9:30
      const closeMinutes = 16 * 60; // 4:00
      return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
    }
    return false;
  };

  // Initialize socket connection when userId exists
  useEffect(() => {
    // Make sure we have a userId before connecting
    if (!userData?.userId) {
      console.log("No userId available, cannot establish socket connection");
      return;
    }

    const userId = userData.userId;
    console.log("Connecting to socket with userId:", userId);

    // Establish socket connection
    socketRef.current = io(BACKEND_URL, {
      query: { userId: userId }  // ✅ Now sending userId as backend expects
    });

    // Connection successful
    socketRef.current.on("connect", () => {
      console.log("Socket connected successfully:", socketRef.current.id);
      setIsConnected(true);
    });

    // Connection error
    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    // Listen for price updates
    socketRef.current.on("price-update", (trade) => {
      console.log("Received price update:", trade);

      setWatchlistItems((currentList) => {
        if (!Array.isArray(currentList)) {
          console.warn("currentList is not an array:", currentList);
          return currentList;
        }

        return currentList.map((item) => {
          if (item.symbol === trade.s) {
            const oldPrice = parseFloat(item.price);
            const newPrice = parseFloat(trade.p);

            // Calculate percentage change
            const percentChange = oldPrice !== 0
              ? (((newPrice - oldPrice) / oldPrice) * 100).toFixed(2)
              : 0;

            return {
              ...item,
              price: newPrice.toFixed(2),
              isDown: newPrice < oldPrice,
              percent: `${percentChange >= 0 ? '+' : ''}${percentChange}%`,
              lastUpdate: new Date(trade.t).toLocaleTimeString()
            };
          }
          return item;
        });
      });
    });

    // Cleanup on unmount or userId change
    return () => {
      console.log("Cleaning up socket connection");
      socketRef.current?.disconnect();
      setIsConnected(false);
    };
  }, [userData?.userId, userData?._id]);

  // Function to fetch watchlist data
  const fetchWatchlist = async () => {
    if (!userData?.email) {
      console.log("No email, skipping watchlist fetch");
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/api/watchlist/${userData.email}`);

      console.log("Watchlist response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        console.log("Watchlist fetched successfully:", response.data.length, "items");
        // Note: We don't set local state here anymore - context handles it
      } else if (response.data && response.data.success === false) {
        console.error("Auth error:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching watchlist:", err);
      if (err.response?.status === 401) {
        console.error("Authentication required");
      }
    }
  };

  // Load watchlist from database
  useEffect(() => {
    fetchWatchlist();
  }, [userData?.email]);

  // Listen for storage changes to refresh watchlist
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'watchlist-updated') {
        console.log("Watchlist updated, refreshing...");
        fetchWatchlist();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync watchlistItems with userWatchlist from context
  useEffect(() => {
    if (userWatchlist && Array.isArray(userWatchlist)) {
      setWatchlistItems(userWatchlist.map(symbol => ({
        symbol: symbol,
        name: symbol,
        price: "0.00",
        percent: "0.00%",
        isDown: false,
        lastUpdate: null
      })));
    } else {
      setWatchlistItems([]);
    }
  }, [userWatchlist]);

  // Add symbol functionality


  // Search functionality
  const searchBox = async () => {
    if (input.trim()) {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/watchlist/search?q=${input}`);
        setSearch(res.data.result || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearch([]);
      }
    } else {
      setSearch([]);
    }
  };

  // Remove symbol functionality
  const removeSymbol = async (symbol) => {
    console.log("removeSymbol called with:", symbol);
    console.log("userData:", userData);

    if (!userData?.userId && !userData?._id) {
      console.error("User not authenticated");
      return;
    }

    console.log("Proceeding with removal of:", symbol);

    try {
      const response = await axios.delete(`${BACKEND_URL}/api/watchlist/`, {
        data: { symbol },
        withCredentials: true
      });

      console.log("Remove symbol response:", response.data);

      // Remove from context state
      removeUserWatchlist(symbol);

      // Tell socket to unsubscribe from this symbol
      if (socketRef.current && isConnected) {
        socketRef.current.emit("remove-symbol", symbol);
        console.log("Emitted remove-symbol event for:", symbol);
      }
    } catch (err) {
      console.error("Remove failed:", err.response?.data || err.message);
      alert("Failed to remove symbol. Please try again.");
    }
  };



  // Prepare chart data only if we have watchlist items
  const chartData = (userWatchlist && Array.isArray(userWatchlist) && userWatchlist.length > 0) ? {
    labels: userWatchlist.map((item) => item),
    datasets: [
      {
        label: "Price",
        data: userWatchlist.map((stock, index) => Math.max(index + 1, 0.01)), // Simple data since we don't have prices in context
        backgroundColor: [
          "rgba(46, 204, 113, 0.75)",  // green
          "rgba(52, 152, 219, 0.75)",  // blue
          "rgba(241, 196, 15, 0.75)",  // yellow
          "rgba(231, 76, 60, 0.75)",   // red
          "rgba(155, 89, 182, 0.75)",  // purple
          "rgba(26, 188, 156, 0.75)",  // teal
        ].slice(0, userWatchlist.length), // Limit colors to number of items
        borderColor: [
          "rgba(46, 204, 113, 1)",
          "rgba(52, 152, 219, 1)",
          "rgba(241, 196, 15, 1)",
          "rgba(231, 76, 60, 1)",
          "rgba(155, 89, 182, 1)",
          "rgba(26, 188, 156, 1)",
        ].slice(0, userWatchlist.length), // Limit colors to number of items
        borderWidth: 2,
        hoverOffset: 12,
      },
    ],
  } : null;

  return (
    <div className="watchlist-container">
      <div className="search-container mt-2">
        <div className="input-wrapper">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search eg: AAPL, BTCUSDT, ETH"
            className="search-input-field"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              searchBox();
            }}
            onBlur={() => {
              setTimeout(() => {
                setSearch([]);
              }, 150); // delay so user can click dropdown items
            }}

          />
        </div>

      </div>

      {/* Display search results when available */}
      {search.length > 0 && (
        <div className="search-results">
          <SearchElements data={search} />
        </div>
      )}

      <ul className="list">
        {(!watchlistItems || watchlistItems.length === 0) ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>
            No stocks in watchlist. Add some to get started!
          </p>
        ) : (
          watchlistItems.map((stock, index) => (
            <WatchListItem
              stock={stock}
              key={stock.symbol || index}
              onRemove={() => removeSymbol(stock.symbol)}
              isMarketOpen={isMarketOpen()}
            />
          ))
        )}
      </ul>

      {chartData && <DoughnutChart data={chartData} />}
    </div>
  );
}

export default WatchList;
