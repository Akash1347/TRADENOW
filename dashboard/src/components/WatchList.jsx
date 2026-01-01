import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import WatchListItem from "./WatchListItem";
import { DoughnutChart } from "./DoughnoutChart";
import { UserContext } from "./userContext";
import GeneralContext from "./GeneralContext";
import { showToast } from "./toast.jsx";
import "./Watchlist.css";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function WatchList() {
  const { userData } = useContext(UserContext);
  const generalContext = useContext(GeneralContext);
  const [watchlist, setWatchlist] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

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

      setWatchlist((currentList) =>
        currentList.map((item) => {
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
        })
      );
    });

    // Cleanup on unmount or userId change
    return () => {
      console.log("Cleaning up socket connection");
      socketRef.current?.disconnect();
      setIsConnected(false);
    };
  }, [userData?.userId, userData?._id]);

  // Load watchlist from database
  useEffect(() => {
    if (!userData?.email) {
      console.log("No email, skipping watchlist fetch");
      return;
    }

    async function fetchWatchlist() {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/watchlist/${userData.email}`);

        console.log("Watchlist response:", response.data);

        if (response.data && Array.isArray(response.data)) {
          const enrichedWatchlist = response.data.map(item => ({
            symbol: item.symbol,
            name: item.symbol,
            price: "0.00", // Will be updated by socket
            percent: "0.00%",
            isDown: false,
            lastUpdate: null
          }));
          setWatchlist(enrichedWatchlist);
        } else if (response.data && response.data.success === false) {
          console.error("Auth error:", response.data.message);
          setWatchlist([]);
        }
      } catch (err) {
        console.error("Error fetching watchlist:", err);
        if (err.response?.status === 401) {
          console.error("Authentication required");
        }
        setWatchlist([]);
      }
    }

    fetchWatchlist();
  }, [userData?.email]);

  // Add symbol functionality
  const addSymbol = async () => {
    if (!input.trim()) {
      console.log("No symbol entered");
      return;
    }

    if (!userData?.userId && !userData?._id) {
      console.error("User not authenticated");
      return;
    }

    const symbol = input.toUpperCase();
    console.log("Adding symbol:", symbol);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/watchlist/add`,
        { symbol },
        { withCredentials: true }
      );

      console.log("Add symbol response:", response.data);

      // Add to local state if not already present
      setWatchlist(prev => {
        const exists = prev.some(item => item.symbol === symbol);
        if (!exists) {
          const newItem = {
            symbol,
            name: symbol,
            price: "0.00",
            percent: "0.00%",
            isDown: false,
            lastUpdate: null
          };

          // Tell socket to subscribe to this symbol
          if (socketRef.current && isConnected) {
            socketRef.current.emit("add-symbol", symbol);
            console.log("Emitted add-symbol event for:", symbol);
          }

          return [...prev, newItem];
        }
        return prev;
      });

      setInput("");
    } catch (err) {
      console.error("Add failed:", err.response?.data || err.message);
      alert("Failed to add symbol. Please try again.");
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

      // Remove from local state
      setWatchlist(prev => prev.filter(item => item.symbol !== symbol));

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

  // Handle Enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSymbol();
    }
  };

  // Prepare chart data only if we have watchlist items
  const chartData = watchlist.length > 0 ? {
    labels: watchlist.map((item) => item.symbol),
    datasets: [
      {
        label: "Price",
        data: watchlist.map((stock) => {
          const price = parseFloat(stock.price);
          return isNaN(price) ? 0 : Math.max(price, 0.01); // Ensure positive values for chart
        }),
        backgroundColor: [
          "rgba(46, 204, 113, 0.75)",  // green
          "rgba(52, 152, 219, 0.75)",  // blue
          "rgba(241, 196, 15, 0.75)",  // yellow
          "rgba(231, 76, 60, 0.75)",   // red
          "rgba(155, 89, 182, 0.75)",  // purple
          "rgba(26, 188, 156, 0.75)",  // teal
        ].slice(0, watchlist.length), // Limit colors to number of items
        borderColor: [
          "rgba(46, 204, 113, 1)",
          "rgba(52, 152, 219, 1)",
          "rgba(241, 196, 15, 1)",
          "rgba(231, 76, 60, 1)",
          "rgba(155, 89, 182, 1)",
          "rgba(26, 188, 156, 1)",
        ].slice(0, watchlist.length), // Limit colors to number of items
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
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <button onClick={addSymbol} className="search-add-btn">
          Add
        </button>
      </div>

      <ul className="list">
        {watchlist.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center' }}>
            No stocks in watchlist. Add some to get started!
          </p>
        ) : (
          watchlist.map((stock, index) => (
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
