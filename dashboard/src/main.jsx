import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Home from './components/Home.jsx'
import Apps from './components/Apps.jsx'
import Orders from './components/Orders.jsx'
import Funds from './components/Funds.jsx'
import Holdings from './components/Holdings.jsx'
import Positions from './components/Positions.jsx'
import NotFound from './components/NotFound.jsx'
//import VerifyAccount from "./components/verifyAccount.jsx";
import VerifyAccount from "./components/VerifyAccount.jsx";

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
