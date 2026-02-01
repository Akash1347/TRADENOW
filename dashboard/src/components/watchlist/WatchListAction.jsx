import React, { useContext, useState, useEffect } from "react";
import { Tooltip, Grow } from "@mui/material";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import GeneralContext from "../../contexts/GeneralContext";
import DeleteIcon from '@mui/icons-material/Delete';

function WatchListAction({ uid, onRemove , price, isMarketOpen, getUserStockQuantity }) {
  const generalContext = useContext(GeneralContext);

  const isDisabled = !isMarketOpen && price === "0.00";
  
  // Check if user owns this stock
  const [userStockQuantity, setUserStockQuantity] = useState(0);
  const [canSell, setCanSell] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchQuantity = async () => {
      if (getUserStockQuantity) {
        setIsLoading(true);
        try {
          const quantity = await getUserStockQuantity(uid);
          setUserStockQuantity(quantity);
          setCanSell(quantity > 0);
        } catch (error) {
          setUserStockQuantity(0);
          setCanSell(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchQuantity();
  }, [uid, getUserStockQuantity]);

  const handleSellClick = () => {
    if (!isDisabled && canSell) {
      // Pass the stock quantity to the sell window
      generalContext.openSellWindow(uid, price, userStockQuantity);
    }
  };

  const handleBuyClick = () => {
    if (!isDisabled) {
      generalContext.openBuyWindow(uid , price);
    }
  };

  const handleChart = () => {
    generalContext.openChart(uid);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(uid);
    }
  };

  return (
    <span className="actions">
      <span>
        <Tooltip
          title={isDisabled ? "Market Closed" : "Buy (B)"}
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleBuyClick}
        >
          <button className="buy" disabled={isDisabled} style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>Buy</button>
        </Tooltip>
        {canSell && (
          <Tooltip
            title={isDisabled ? "Market Closed" : "Sell (S)"}
            placement="top"
            arrow
            TransitionComponent={Grow}
            onClick={handleSellClick}
          >
            <button className="sell" disabled={isDisabled} style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>Sell</button>
          </Tooltip>
        )}
        <Tooltip
          title="analytics"
          placement="top"
          onClick={handleChart}
          arrow
          TransitionComponent={Grow}
        >
          <QueryStatsIcon className="chart-button"/>
        </Tooltip>
        <Tooltip
          title="Remove"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleRemove}
        >
          <button
            className="remove-button"
            style={{
              background: '#ff2727',
              color: '#ffffffda',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              marginLeft:'10px',
            }}
          >
            <DeleteIcon/>
          </button>
        </Tooltip>
      </span>
    </span>
  );
}

export default WatchListAction;
