import React from "react";
import Awards from "./Awards";
import Stats from "./Stats";
import Pricing from "./pricing";
import Education from "./Education";
import OpenAccount from "../OpenAccount";
 
import Hero from "./Hero";

function HomePage() {
    return (
        <>
             
            <Hero/> 
            <Awards/>
            <Stats/>
            <Pricing/>
            <Education/>
            <OpenAccount/>
            



        </>
    );
}
export default HomePage;