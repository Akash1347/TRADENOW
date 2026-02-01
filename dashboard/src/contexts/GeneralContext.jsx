import React, { createContext, useState } from 'react';

import BuyActionWindow from "../components/actionWindow/BuyActionWindow";
import SellActionWindow from "../components/actionWindow/SellActionWindow";
import StockPriceChart from '../components/charts/StockPriceChart';


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
    const [sellMaxQuantity, setSellMaxQuantity] = useState(null);



    const handleOpenBuyWindow = (uid, price) => {
        setSelectedStockPrice(price);
        setBuyWindowOpen(true);
        setSelectedStockUID(uid);
    }
    const handleCloseBuyWindow = () => {
        setSelectedStockUID("");
        setBuyWindowOpen(false);
    }
    const handleOpenSellWindow = (uid, price, maxQuantity) => {
        setSelectedStockPrice(price);
        setSellWindowOpen(true);
        setSelectedStockUID(uid);
        setSellMaxQuantity(maxQuantity);
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
            {isSellWindowOpen && <SellActionWindow uid={selectedStockUID} price={selectedStockPrice} maxQuantity={sellMaxQuantity} />}
            {ischartOpen && <StockPriceChart symbol={selectedStockUID} />}
        </GeneralContext.Provider>
    )
}

export default GeneralContext;
