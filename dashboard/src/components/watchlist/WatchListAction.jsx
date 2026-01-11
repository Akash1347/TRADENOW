import React, { useContext } from "react";
import { Tooltip, Grow } from "@mui/material";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import GeneralContext from "../../contexts/GeneralContext";
import DeleteIcon from '@mui/icons-material/Delete';

function WatchListAction({ uid, onRemove , price, isMarketOpen}) {
  const generalContext = useContext(GeneralContext);

  const isDisabled = !isMarketOpen && price === "0.00";

  const handleBuyClick = () => {
    if (!isDisabled) {
      generalContext.openBuyWindow(uid , price);
    }
  };

  const handleSellClick = () => {
    if (!isDisabled) {
      generalContext.openSellWindow(uid , price);
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
        <Tooltip
          title={isDisabled ? "Market Closed" : "Sell (S)"}
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleSellClick}
        >
          <button className="sell" disabled={isDisabled} style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>Sell</button>
        </Tooltip>
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
