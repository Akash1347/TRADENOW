import React from 'react';

function Awards() {
    return(
        <div className="container p-5 mb-5 ms-5">
            <div className='row text-center'>
                <div className="col-6 p-5">
                    <img src='/media/images/largestBroker.svg' ></img>
                </div>
                <div className="col-6 p-5 mt-5">
                    <h1>Largest stock broker in India</h1>
                    <p className='mb-5'>2+ million clients contribute to over 15% of all 
                        retail order volumes in India daily by trading and investing in:
                    </p>
                    <div className="mt-4">
                        <a href="/product" className="btn btn-outline-primary btn-sm me-3">Explore Products</a>
                        <a href="/pricing" className="btn btn-outline-primary btn-sm">View Pricing</a>
                    </div>
                    <div className='row mt-4'>
                        <div className='col-6'>
                            <ul className="list-unstyled">
                                <li className="mb-2"> Features and Options</li>
                                <li className="mb-2"> Commodity Derivatives</li>
                                <li className="mb-2"> Currency derivatives</li>
                            </ul>
                        </div>
                        <div className='col-6'>
                            <ul className="list-unstyled">
                                <li className="mb-2"> Stocks & IPOs</li>
                                <li className="mb-2"> Direct mutual funds</li>
                                <li className="mb-2"> Bonds and Govt. Securities</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-4">
                        <img src='/media/images/pressLogos.png' style={{width:"90%", height:"auto"}} alt="Press logos"/>
                    </div>
                     
                </div>

            </div>

        </div>
    );

}

export default Awards;
