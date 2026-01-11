import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Home from './components/pages/Home.jsx'
import Apps from './components/trading/Apps.jsx'
import Orders from './components/trading/Orders.jsx'
import Funds from './components/trading/Funds.jsx'
import Holdings from './components/trading/Holdings.jsx'
import Positions from './components/trading/Positions.jsx'
import NotFound from './components/actionWindow/NotFound.jsx'
//import VerifyAccount from "./components/verifyAccount.jsx";
import VerifyAccount from "./components/trading/VerifyAccount.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer />
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Home />} />

        {/* <Route path="/apps" element={<Apps />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/funds" element={<Funds />} />
        <Route path="/holdings" element={<Holdings />} />
        <Route path="/positions" element={<Positions />} />

        <Route path="*" element={<NotFound />} /> */}


      </Routes>
    </BrowserRouter>
  </StrictMode>
);
