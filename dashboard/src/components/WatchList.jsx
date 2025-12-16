import React, { useState, useContext } from "react";
import { watchlist } from "../data/data";
import { Tooltip, Grow } from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import GeneralContext from "./GeneralContext";
import { DoughnutChart } from "./DoughnoutChart";
import StockPriceChart from "./StockPriceChart";

const labels = watchlist.map((subArray) => subArray["name"]);

function WatchList(){
  const data = {
  labels,
  datasets: [
    {
      label: "Price",
      data: watchlist.map((stock) => stock.price),
      backgroundColor: [
        "rgba(46, 204, 113, 0.75)",  // green
        "rgba(52, 152, 219, 0.75)",  // blue
        "rgba(241, 196, 15, 0.75)",  // yellow
        "rgba(231, 76, 60, 0.75)",   // red
        "rgba(155, 89, 182, 0.75)",  // purple
        "rgba(26, 188, 156, 0.75)",  // teal
      ],
      borderColor: [
        "rgba(46, 204, 113, 1)",
        "rgba(52, 152, 219, 1)",
        "rgba(241, 196, 15, 1)",
        "rgba(231, 76, 60, 1)",
        "rgba(155, 89, 182, 1)",
        "rgba(26, 188, 156, 1)",
      ],
      borderWidth: 2,
      hoverOffset: 12,
    },
  ],
};


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
      <DoughnutChart data={data} />
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
    const handleChart= ()=> {
       generalContext.openChart(uid);
    }
    
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
                onClick={handleChart}
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
