import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userWatchlist, setUserWatchlist] = useState([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const loadUserWatchlist = async () => {
    if (!userData?.email) return;

    setWatchlistLoading(true);
    try {
      const response = await axios.get(`${backend_url}/api/watchlist/${userData.email}`);
      if (response.data && Array.isArray(response.data)) {
        const symbols = response.data.map(item => item.symbol);
        setUserWatchlist(symbols);
        console.log("Loaded watchlist:", symbols);
      }
    } catch (error) {
      console.error("Error loading watchlist:", error);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(
        `${backend_url}/api/auth/me`,
        { withCredentials: true }
      );

      if (data.success) {
        setUserData(data.user || data.userData);
        // Load watchlist after user data is set
        loadUserWatchlist();
      }
    } catch {
      setUserData(null);
    }
  };

  const addUserWatchlist = (symbol) => {
    setUserWatchlist((prevWatchlist) => {
      if (!prevWatchlist.includes(symbol)) {
        return [...prevWatchlist, symbol];
      }
      return prevWatchlist;
    });
  };

  const removeUserWatchlist = (symbol) => {
    setUserWatchlist((prevWatchlist) =>
      prevWatchlist.filter((item) => item !== symbol)
    );
  }

  const getAuthState = async () => {
    try {
      // First check localStorage for login status (set during login)
      const localLoginStatus = localStorage.getItem('isLoggedIn');
      if (localLoginStatus === 'true') {
        console.log('Found login status in localStorage');
        setIsLoggedIn(true);
        getUserData();
        return;
      }

      // Fallback to cookie-based authentication
      const { data } = await axios.post(
        `${backend_url}/api/auth/authenticate`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      } else {
        setIsLoggedIn(false);
      }
    } catch {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  // Load watchlist when userData is available
  useEffect(() => {
    if (userData?.email) {
      loadUserWatchlist();
    }
  }, [userData?.email]);

  return (
    <UserContext.Provider value={{ isLoggedIn, userData, setIsLoggedIn, setUserData, userWatchlist, watchlistLoading, addUserWatchlist, removeUserWatchlist }}>
      {children}
    </UserContext.Provider>
  );
}
