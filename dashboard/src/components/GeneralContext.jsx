import React, { createContext, useState } from 'react';

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";
import StockPriceChart from './StockPriceChart';


const GeneralContext = createContext({
    openBuyWindow: (uid, price) => { },
    closeBuyWindow: () => { },
    openSellWindow: (uid, price) => { },
    closeSellWindow: () => { },
    openChart: (uid) => { },
    closeChart: () => { }
});

export const GeneralContextProvider = (props) => {
    const [isBuyWindowOpen, setBuyWindowOpen] = useState(false);
    const [isSellWindowOpen, setSellWindowOpen] = useState(false);
    const [selectedStockUID, setSelectedStockUID] = useState("");
    const [ischartOpen, setChart] = useState(false);
    const [selectedStockPrice, setSelectedStockPrice] = useState(0.0);



    const handleOpenBuyWindow = (uid, price) => {
        setSelectedStockPrice(price);
        setBuyWindowOpen(true);
        setSelectedStockUID(uid);
    }
    const handleCloseBuyWindow = () => {
        setSelectedStockUID("");
        setBuyWindowOpen(false);
    }
    const handleOpenSellWindow = (uid, price) => {
        setSelectedStockPrice(price);
        setSellWindowOpen(true);
        setSelectedStockUID(uid);
    }
    const handleCloseSellWindow = () => {
        setSelectedStockUID("");
        setSellWindowOpen(false);
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
            value={{
                openBuyWindow: handleOpenBuyWindow, closeBuyWindow: handleCloseBuyWindow,
                openSellWindow: handleOpenSellWindow, closeSellWindow: handleCloseSellWindow,
                openChart: handleOpenChart, closeChart: handleCloseChart,
                updateBuyPrice: setSelectedStockPrice, buyPrice: selectedStockPrice,
                selectedStockUID
            }}>
            {props.children}
            {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} price={selectedStockPrice} />}
            {isSellWindowOpen && <SellActionWindow uid={selectedStockUID} price={selectedStockPrice} />}
            {ischartOpen && <StockPriceChart symbol={selectedStockUID} />}
        </GeneralContext.Provider>
    )
}

export default GeneralContext;
