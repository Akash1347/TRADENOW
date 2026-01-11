import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "../../contexts/GeneralContext";
import { showToast } from "../ui/toast.jsx";

import "./BuyActionWindow.css";

const SellActionWindow = ({ uid, price }) => {
  const { closeSellWindow } = useContext(GeneralContext);

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(price);
  const [orderType, setOrderType] = useState("MARKET");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSellClick = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(backendUrl + "/api/order/sell", {
        symbol: uid,
        quantity: parseInt(stockQuantity),
        price: parseFloat(stockPrice),
        side: "SELL",
        orderType: orderType
      }, { withCredentials: true });

      if (response.data.success) {
        showToast(`Sell order placed successfully for ${stockQuantity} shares of ${uid}`, "success");
        closeSellWindow();
      } else {
        showToast(response.data.message || "Failed to place order", "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to place order";

      if (errorMessage.includes("Insufficient holdings")) {
        showToast(errorMessage, "error");
        // Don't close the window so user can adjust quantity
      } else {
        showToast(errorMessage, "error");
        closeSellWindow();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    closeSellWindow();
  };

  const handleMarketClick = () => {
    setOrderType("MARKET");
    setStockPrice(price);
  }

  return (
    <div className="container" id="sell-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
              required
            />
          </fieldset>
          <input
            type="radio"
            name="orderType"
            id="market"
            value="MARKET"
            checked={orderType === "MARKET"}
            onChange={handleMarketClick}
          />
          <label htmlFor="market">Market</label>
          <input
            type="radio"
            name="orderType"
            id="limit"
            value="LIMIT"
            checked={orderType === "LIMIT"}
            onChange={(e) => setOrderType(e.target.value)}
          />
          <label htmlFor="limit">Limit</label>
          {
            orderType === "LIMIT" && (
              <fieldset>
                <legend>Price</legend>
                <input
                  type="number"
                  name="price"
                  id="price"
                  step="0.05"
                  onChange={(e) => setStockPrice(e.target.value)}
                  value={stockPrice}
                  required
                />
              </fieldset>
            )

          }
        </div>
      </div>

      <div className="buttons">
        <span>Margin required {price}</span>
        <div>
          <button className="btn btn-blue" onClick={handleSellClick}>
            Sell
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
