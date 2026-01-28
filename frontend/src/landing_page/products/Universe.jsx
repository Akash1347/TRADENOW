import React from "react";
import { NavLink } from "react-router-dom";

function Universe() {
  return (
    <div className="container mt-5 mb-5 text-center">
 
      <h3 className="my-4">The Zerodha Universe</h3>
      <p className="text-muted">
        Extend your trading and investment experience even further with our partner platforms
      </p>
 
      <div className="row justify-content-center">
 
        <div className="col-md-4 p-4">
          <img src="/media/images/zerodhaFundHouse.png" style={{ width: "40%" }} alt="" />
          <p className="text-muted small mt-3">
            Our asset management venture that is creating simple and transparent index funds
            to help you save for your goals.
          </p>
        </div>
 
        <div className="col-md-4 p-4">
          <img src="/media/images/sensibullLogo.svg" style={{ width: "45%" }} alt="" />
          <p className="text-muted small mt-3">
            Options trading platform that lets you create strategies, analyze positions, and more.
          </p>
        </div>
 
        <div className="col-md-4 p-4">
          <img src="/media/images/streakLogo.png" style={{ width: "40%" }} alt="" />
          <p className="text-muted small mt-3">
            Investment research platform offering detailed insights into stocks and sectors.
          </p>
        </div>
 
        <div className="col-md-4 p-4">
          <img src="/media/images/streakLogo.png" style={{ width: "40%" }} alt="" />
          <p className="text-muted small mt-3" id="universe-text">
            Systematic trading platform that allows you to create and backtest strategies.
          </p>
        </div>

        
        <div className="col-md-4 p-4">
          <img src="/media/images/smallcaseLogo.png" style={{ width: "40%" }} alt="" />
          <p className="text-muted small mt-3">
            Thematic investing platform to invest in diversified baskets of stocks.
          </p>
        </div>
 
        <div className="col-md-4 p-4">
          <img src="/media/images/dittoLogo.png" style={{ width: "28%" }} alt="" />
          <p className="text-muted small mt-3">
            Personalized insurance advice with no spam and no mis-selling.
          </p>
        </div>
      </div>

     
      <div className="mt-4">
        <NavLink to="/login" className="btn btn-primary px-4 py-2">
          Login
        </NavLink>
      </div>

    </div>
  );
}

export default Universe;
