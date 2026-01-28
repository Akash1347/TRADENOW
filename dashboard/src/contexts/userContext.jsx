import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userWatchlist, setUserWatchlist] = useState([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  const loadUserWatchlist = async () => {
    if (!userData?.email) return;

    setWatchlistLoading(true);
    try {
      const response = await axios.get(`${backend_url}/api/watchlist/${userData.email}`);
      if (response.data && Array.isArray(response.data)) {
        const symbols = response.data.map(item => item.symbol);
        setUserWatchlist(symbols);
      }
    } catch (error) {
      console.error("Error loading watchlist:", error);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const loadUserOrderHistory = async () => {
    if (!userData?.userId) return;
    console.log("Loading user order history for userId:", userData.userId);
    try{
      const response = await axios.get(`${backend_url}/api/getdata/orders`, {
        withCredentials: true
      });
      console.log("User order history response:", response);
      if (response.data && response.data.success) {
        setOrderHistory(response.data.data);
        console.log("User order history loaded:", response.data.data);
      } else {
        console.error("Failed to load user order history:", response.data?.message);
      }
    }catch(error){
      console.error("Error loading user order history:", error);
      console.error("Error details:", error.response?.data || error.message || error);
    }
  }

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
        // Always verify with backend first, don't trust localStorage
        const response = await axios.get(
            `${backend_url}/api/auth/me`,
            { 
              withCredentials: true,
              timeout: 5000, // Add timeout to prevent hanging
              validateStatus: function (status) {
                // Consider any status other than 200 as an error
                return status === 200;
              }
            }
        );

        if (response.data.success) {
            // Backend confirms user is authenticated
            setIsLoggedIn(true);
            // Update localStorage to match backend state
            localStorage.setItem('isLoggedIn', 'true');
            setUserData(response.data.user || response.data.userData);
            // Load watchlist after user data is set
            if (response.data.user?.email || response.data.userData?.email) {
              loadUserWatchlist();
            }
        } else {
            // Backend says user is not authenticated
            // Clear all user data when not authenticated
            setIsLoggedIn(false);
            setUserData(null);
            setUserWatchlist([]);
            localStorage.removeItem('isLoggedIn');
        }
    } catch (error) {
        // If any error occurs (network error, 401, 403, etc.), consider user as logged out
        // Clear all user data on any error
        setIsLoggedIn(false);
        setUserData(null);
        setUserWatchlist([]);
        localStorage.removeItem('isLoggedIn');
    }
  };

  useEffect(() => {
    // Check authentication state on mount
    getAuthState();
    
    // Also check authentication state when the page becomes visible (after tab switch or window focus)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        getAuthState();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Load watchlist when userData is available
  useEffect(() => {
    if (userData?.email) {
      loadUserWatchlist();
      loadUserOrderHistory();
    }
  }, [userData?.email]);

  return (
    <UserContext.Provider value={{ isLoggedIn, userData, setIsLoggedIn, setUserData, userWatchlist, watchlistLoading, addUserWatchlist, removeUserWatchlist, setUserWatchlist, orderHistory }}>
      {children}
    </UserContext.Provider>
  );
}
