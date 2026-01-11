import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import WatchListAction from "./WatchListAction";

function WatchListItem({ stock, onRemove, isMarketOpen }) {
  const [showWatchlistAction, setShowWatchlistAction] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);

  const handleMouseEnter = (e) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setShowWatchlistAction(true);
  };

  const handleMouseLeave = (e) => {
    // Delay hiding to give user time to click
    const timeout = setTimeout(() => {
      setShowWatchlistAction(false);
    }, 300);
    setHideTimeout(timeout);
  };

  const isZeroPriceAndMarketClosed = stock.price === "0.00" && !isMarketOpen;

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="watch-list-row" style={{fontSize:"1rem"}}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          {isZeroPriceAndMarketClosed ? (
            <span className="price">Market Closed</span>
          ) : (
            <>
              <span className="percent">{stock.percent}</span>
              {stock.isDown ? (
                <KeyboardArrowDownIcon className="down" />
              ) : (
                <KeyboardArrowUpIcon className="up" />
              )}
              <span className="price">{stock.price}</span>
            </>
          )}
        </div>
      </div>
      {showWatchlistAction && (
        <WatchListAction uid={stock.name} price={stock.price} onRemove={onRemove} />
      )}
    </li>
  );
}

export default WatchListItem;
