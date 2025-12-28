import { useEffect, useState, useContext, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { UserContext } from "./components/userContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function App() {
  const { userData } = useContext(UserContext); // { email: "..." }

  const [input, setInput] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [prices, setPrices] = useState({});

  const socketRef = useRef(null); // important

  /* ===============================
     INIT SOCKET WHEN USERID EXISTS
  =============================== */
  useEffect(() => {
    if (!userData?.userId) return;

    socketRef.current = io(BACKEND_URL, {
      query: { userId: userData.userId }
    });

    socketRef.current.on("price-update", (trade) => {
      setPrices(prev => ({
        ...prev,
        [trade.s]: trade.p
      }));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userData?.userId]);

  /* ===============================
     LOAD WATCHLIST FROM DB (EMAIL)
  =============================== */
  useEffect(() => {
    if (!userData?.email) return;

    async function loadWatchlist() {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/api/watchlist/${userData.email}`
        );

        const symbols = res.data.map(item => item.symbol);
        setWatchlist(symbols);
      } catch (err) {
        console.error("Failed to load watchlist", err);
      }
    }

    loadWatchlist();
  }, [userData?.email]);

  /* ===============================
     ADD SYMBOL
  =============================== */
  const addSymbol = async () => {
    if (!input.trim() || !userData?.email) return;
    const symbol = input.toUpperCase();

    try {
      await axios.post(`${BACKEND_URL}/api/watchlist/add`, {
        symbol
      }, { withCredentials: true });

      setWatchlist(prev =>
        prev.includes(symbol) ? prev : [...prev, symbol]
      );

      socketRef.current.emit("add-symbol", symbol);
      setInput("");
    } catch (err) {
      console.error("Add failed", err.response?.data || err.message);
    }
  };

  /* ===============================
     REMOVE SYMBOL
  =============================== */
  const removeSymbol = async (symbol) => {
    if (!userData?.email) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/watchlist/`, {
        data: { symbol },
        withCredentials: true
      });

      setWatchlist(prev => prev.filter(s => s !== symbol));
      socketRef.current.emit("remove-symbol", symbol);

      setPrices(prev => {
        const copy = { ...prev };
        delete copy[symbol];
        return copy;
      });
    } catch (err) {
      console.error("Remove failed", err.response?.data || err.message);
    }
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      <h2>📈 Live Watchlist</h2>

      <div style={{ marginBottom: 16 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="AAPL"
        />
        <button onClick={addSymbol} style={{ marginLeft: 8 }}>
          Add
        </button>
      </div>

      {watchlist.length === 0 && (
        <p>No stocks in watchlist</p>
      )}

      <ul>
        {watchlist.map(symbol => (
          <li key={symbol} style={{ marginBottom: 8 }}>
            <strong>{symbol}</strong>{" "}
            {prices[symbol]
              ? `: ${prices[symbol]}`
              : "(waiting for price)"}
            <button
              onClick={() => removeSymbol(symbol)}
              style={{ marginLeft: 10 }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
