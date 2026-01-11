import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";

import Apps from "../trading/Apps";
import Funds from '../trading/Funds'
import Holdings from "../trading/Holdings";

import Orders from "../trading/Orders";
import Positions from "../trading/Positions";
import Summary from "./Summary";
import WatchList from "../watchlist/WatchList";
import VerifyAccount from "../trading/VerifyAccount";
import { GeneralContextProvider } from "../../contexts/GeneralContext";
import { UserContext } from "../../contexts/userContext";
import { Navigate } from "react-router-dom";
import { showToast } from "../ui/toast.jsx";
import StockPage from "./StockPage.jsx";
import NotFound from "../actionWindow/NotFound.jsx";




const Dashboard = () => {
  const {userData} = useContext(UserContext);

  useEffect(() => {
    if (!userData?.userId) return;

    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      query: { userId: userData.userId },
      withCredentials: true,
    });

    socket.on("notification", (data) => {
      console.log("Received notification:", data);
      showToast(data.message, data.type);
    });

    return () => {
      socket.disconnect();
    };
  }, [userData?.userId]);

  return (
    <div className="dashboard-container">
        <GeneralContextProvider>
          <WatchList />

          <div className="content">
            <Routes>
              <Route exact path="/" element={<Summary />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/holdings" element={<Holdings />} />
              <Route path="/positions" element={<Positions />} />
              <Route path="/funds" element={<Funds />} />
              <Route path="/apps" element={<Apps />} />
              <Route path="/verifyAccount" element={userData === null || userData.isVerified ? (<Navigate to="/" replace />) : (<VerifyAccount />)} />
              <Route path="/stock" element={<StockPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </GeneralContextProvider>
    </div>
  );
};

export default Dashboard;
