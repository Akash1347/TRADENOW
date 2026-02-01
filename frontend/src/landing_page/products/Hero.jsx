import React from "react";
import { Link } from "react-router-dom";
function Hero() {
    return (
        <div className="container text-center p-5 m-5 text-muted">
            <h2>TradeNow Products</h2>
            <h5 className="my-4">Sleek, modern, and intuitive trading platforms</h5>
            <p>Check out our <Link to="/product">investment offerings <i className="fa fa-long-arrow-right" aria-hidden="true"></i></Link></p>
        </div>
    );
}   

export default Hero;
