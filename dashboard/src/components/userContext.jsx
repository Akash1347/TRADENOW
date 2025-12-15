import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(
        `${backend_url}/api/auth/me`,
        { withCredentials: true }
      );

      if (data.success) {
        setUserData(data.user || data.userData);
      }
    } catch {
      setUserData(null);
    }
  };

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

  return (
    <UserContext.Provider value={{ isLoggedIn, userData ,setIsLoggedIn}}>
      {children}
    </UserContext.Provider>
  );
}
