import React from "react";

function Hero() {
    return (
        <div className="container">
            <div className="row p-5 mb-5">
                <h1 className="fs-4 text-center mt-5 text-muted">
                    We pioneered the discount broking model in India.
                    <br />Now, we are breaking ground with our technology.
                </h1>
            </div>

            <div className="mx-5 boarder-top ">
                <div className="row mx-5 text-muted  ">
                
                <div className="col-6 p-5">
                    <p>
                        We kick-started operations on the 15th of August, 2010 with the goal of
                        breaking all barriers that traders and investors face in India in
                        terms of cost, support, and technology. We named the company Zerodha,
                        a combination of Zero and "Rodha", the Sanskrit word for barrier.
                        <br /><br />
                        Today, our disruptive pricing models and in-house technology have made
                        us the biggest stock broker in India.
                        <br /><br />
                        Over 1.6+ crore clients place billions of orders every year through our
                        powerful ecosystem of investment platforms, contributing over 15% of all
                        Indian retail trading volumes.
                    </p>
                </div>

                
                <div className="col-6 p-5">
                    <p>
                        In addition, we run a number of popular open online educational and
                        community initiatives to empower retail traders and investors.
                        <br /><br />
                        Rainmatter, our fintech fund and incubator, has invested in several
                        fintech startups with the goal of growing the Indian capital markets.
                        <br /><br />
                        And yet, we are always up to something new every day. Catch up on the
                        latest updates on our blog or see what the media is saying about us or
                        learn more about our business and product philosophies.
                    </p>
                </div>
            </div>
            </div>
        </div>
    );
}

export default Hero;
