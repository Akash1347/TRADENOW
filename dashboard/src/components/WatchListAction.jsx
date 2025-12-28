import React, { useContext } from "react";
import { Tooltip, Grow } from "@mui/material";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import GeneralContext from "./GeneralContext";
import DeleteIcon from '@mui/icons-material/Delete';

function WatchListAction({ uid, onRemove , price}) {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(uid , price);
  };

  const handleSellClick = () => {
    generalContext.openSellWindow(uid , price);
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
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleBuyClick}
        >
          <button className="buy">Buy</button>
        </Tooltip>
        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleSellClick}
        >
          <button className="sell">Sell</button>
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
