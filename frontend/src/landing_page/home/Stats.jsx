import React from "react";

function Stats() {
    return (
        <div className="container mb-5 ms-5 ps-5">
            <div className="row text-center m-5">
                <div className="col-5 text-start">
                    <h1 className="mb-5 text-start fs-2">Trust with confidence</h1>

                    
                    <h2 className="fs-4">Customer-first always</h2>
                    <p className="text-muted mb-4">That's why 1.6+ crore customers trust Zerodha with ~ ₹6 lakh crores of equity investments, making us India’s largest broker; contributing to 15% of daily retail exchange volumes in India.</p>
                    <h2 className="fs-4">No spam or gimmicks</h2>
                    <p className="text-muted mb-4">No gimmicks, spam, "gamification", or annoying push notifications. High quality apps that you use at your pace, the way you like. </p>
                    <h2 className="fs-4">The Zerodha universe</h2>
                    <p className="text-muted mb-4">Not just an app, but a whole ecosystem. Our investments in 30+ fintech startups offer you tailored services specific to your needs.</p>
                    <h2 className="fs-4">Do better with money</h2>
                    <p className="text-muted mb-4">With initiatives like Nudge and Kill Switch, we don't just facilitate transactions, but actively help you do better with your money.</p>
                    <div className="mt-4">
                        <a href="/product" className="btn btn-outline-primary btn-sm me-3">Explore Our Products</a>
                        <a href="/support" className="btn btn-outline-primary btn-sm">Get Support</a>
                    </div>


                </div>
                <div className="col-7">
                    <img src="/media/images/ecosystem.png" style={{width:"100%", height:"auto", borderRadius:"8px"}} alt="Ecosystem"/>
                     <div className="mt-4">
                        <a href="/product" className="btn btn-outline-primary btn-sm me-3">Explore our products <i className="fa fa-long-arrow-right" aria-hidden="true"></i></a>
                        <a href="/support" className="btn btn-outline-primary btn-sm">Try Kite demo <i className="fa fa-long-arrow-right" aria-hidden="true"></i></a>
                    </div>
                
                </div>
               

        </div>
    </div>
    );
}

export default Stats;
