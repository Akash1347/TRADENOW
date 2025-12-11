import React from "react";

function Hero() {
    return (
        <div className="container p-5 ms-5">

            <div className="row text-center ms-5">
                <img src="/media/images/homeHero.png" alt="Hero Image" className="mb-5"/>
                <h1 className="mt-5">Invest in everything</h1>
                <p>Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.</p>
                <button type="button" className="btn btn-primary btn-sm fs-5" style={{width:"30%" ,margin:"0 auto"}}>Signup Now</button>
            
            </div>

        </div>
 
    );
}
export default Hero;
