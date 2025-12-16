import React, { createContext, useState } from 'react';

import BuyActionWindow from "./BuyActionWindow";
import StockPriceChart from './StockPriceChart';


const GeneralContext = createContext({
    openBuyWindow: (uid) => { },
    closeBuyWindow: () => { },
    openChart: (uid) => { },
    closeChart: () => {}
});

export const GeneralContextProvider = (props) => {
    const [isBuyWindowOpen, setBuyWindowOpen] = useState(false);
    const [selectedStockUID, setSelectedStockUID] = useState("");
    const [ischartOpen ,setChart] = useState(false);
    


    const handleOpenWindow = (uid) => {
        setBuyWindowOpen(true);
        setSelectedStockUID(uid);

    }
    const handleCloseWindow = () => {
        setSelectedStockUID("");
        setBuyWindowOpen(false);
    }
    const handleOpenChart = (uid) => {
        setSelectedStockUID(uid);
        setChart(true);
    }
    const handleCloseChart = () => {
        setSelectedStockUID("");
        setChart(false);
    }


    return (
        <GeneralContext.Provider
            value={{ openBuyWindow: handleOpenWindow, closeBuyWindow: handleCloseWindow, 
                    openChart : handleOpenChart ,closeChart : handleCloseChart 
            }}>
            {props.children}
            {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
            {ischartOpen && <StockPriceChart symbol={selectedStockUID} />}



        </GeneralContext.Provider>
    )
}

export default GeneralContext;
