import React, { useState, useContext } from "react";
import { watchlist } from "../data/data";
import { Tooltip, Grow } from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import GeneralContext from "./GeneralContext";


function WatchList(){
  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts">{watchlist.length}</span>
      </div>

      <ul className="list">

        {
            watchlist.map((stock ,index) => {
                return(
                    // <p>{stock.name}</p>
                    <WatchListItem stock={stock} key = {index}/>

                );
            })
        }

      </ul>
    </div>
  );
};

export default WatchList;


function WatchListItem({stock}){
    const [showWatchlistAcion ,setShowWatchlistAction] = useState(false);
    const handleMouseEnter = (e)=> {
        setShowWatchlistAction(true);
    }
    const handleMouseLeave = (e) => {
        setShowWatchlistAction(false);
    }
    return(
        <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="watch-list-row">
            <div className="item">
                <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
                <div className="itemInfo">
                    <span className="percent">{stock.percent}</span>
{stock.isDown ? (
            <KeyboardArrowDownIcon className="down" />
          ) : (
            <KeyboardArrowUpIcon className="up" />
          )}                    <span className="price">{stock.price}</span>
                </div>
            </div>
            {showWatchlistAcion && <WatchListAction uid={stock.name}/>}
        </li>
    )


}


function WatchListAction({uid}) {
    const generalContext = useContext(GeneralContext);
    const handleBuyClick = ()=>{
        generalContext.openBuyWindow(uid);

    };
    
    return(
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
                
                >
                    <button className="sell">Sell</button>
                </Tooltip>
                <Tooltip
                title="analytics"
                placement="top"
                arrow
                TransitionComponent={Grow}
                
                >
                <QueryStatsIcon className="chart-button"/>
                </Tooltip>
                <Tooltip
                title="More"
                placement="top"
                arrow
                TransitionComponent={Grow}
                
                >
                <MoreHorizIcon className="more-button"/>
                </Tooltip>
            </span>
        </span>
    );
}
