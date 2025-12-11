import React, { createContext, useState } from 'react';

import BuyActionWindow from "../components/BuyActionWindow";


const GeneralContext = createContext({
    openBuyWindow: (uid) => { },
    closeBuyWindow: () => { },
});

export const GeneralContextProvider = (props) => {
    const [isBuyWindowOpen, setBuyWindowOpen] = useState(false);
    const [selectedStockUID, setSelectedStockUID] = useState("");


    const handleOpenWindow = (uid) => {
        setBuyWindowOpen(true);
        setSelectedStockUID(uid);

    }
    const handleCloseWindow = () => {
        setSelectedStockUID("");
        setBuyWindowOpen(false);
    }


    return (
        <GeneralContext.Provider
            value={{ openBuyWindow: handleOpenWindow, closeBuyWindow: handleCloseWindow }}>
            {props.children}
            {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}



        </GeneralContext.Provider>
    )
}

export default GeneralContext;
