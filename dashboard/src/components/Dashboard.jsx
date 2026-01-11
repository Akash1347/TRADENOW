import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";

import Apps from "./Apps";
import Funds from './Funds'
import Holdings from "./Holdings";

import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import VerifyAccount from "./VerifyAccount";
import { GeneralContextProvider } from "./GeneralContext";
import { UserContext } from "./userContext";
import { Navigate } from "react-router-dom";
import { showToast } from "./toast.jsx";
import StockPage from "./StockPage.jsx";
 
 
 

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
            </Routes>
          </div>
        </GeneralContextProvider>
    </div>
  );
};

export default Dashboard;
