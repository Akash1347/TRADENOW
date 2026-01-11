import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { showToast } from "./toast.jsx";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid, price }) => {
  const { closeBuyWindow } = useContext(GeneralContext);

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(price);
  const [orderType, setOrderType] = useState("MARKET");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleBuyClick = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(backendUrl + "/api/order/buy", {
        symbol: uid,
        quantity: parseInt(stockQuantity),
        price: parseFloat(stockPrice),
        side: "BUY",
        orderType: orderType
      }, { withCredentials: true });

      if (response.data.success) {
        showToast(`Buy order placed successfully for ${stockQuantity} shares of ${uid}`, "success");
        closeBuyWindow();
      } else {
        showToast(response.data.message || "Failed to place order", "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to place order";

      if (errorMessage === "Insufficient balance") {
        showToast(`Insufficient balance. Required: $${(parseFloat(stockPrice) * parseInt(stockQuantity)).toFixed(2)}`, "error");
        // Don't close the window so user can adjust
      } else {
        showToast(errorMessage, "error");
        closeBuyWindow();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  const handleMarketClick = () => {
    setOrderType("MARKET");
    setStockPrice(price);
  }

  return (
    <div className="container" id="buy-window" draggable="true">
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
          <button className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </button>
          <button className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
