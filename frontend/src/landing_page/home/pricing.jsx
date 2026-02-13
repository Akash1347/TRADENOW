import React from 'react';

function Pricing() {
    return (
        <div className='container mt-5 ms-5 ps-5 pt-5'>
            <div className='row ms-5'>
                <div className='col-5 '>
                    <h1 className='fs-2 mb-5'>Unbeatable pricing</h1>
                    <h2 className='text-muted fs-5'>We pioneered the concept of discount broking and price transparency in India. Flat fees and no hidden charges.</h2>
                </div>
                <div className='col-7 mt-5'>
                    <div className='row'>
                        <div className='col-4 text-center'>
                            <img src='/media/images/Pricing0.svg' style={{ width: "80px", height: "80px", marginBottom: "15px" }} alt="Free account opening"/>
                            <p className='text-muted' style={{ fontSize: "14px", fontWeight: "500" }}>Free account opening</p>
                        </div>

                        <div className='col-4 text-center'>
                            <img src='/media/images/Pricing0.svg' style={{ width: "80px", height: "80px", marginBottom: "15px" }} alt="Free equity delivery"/>
                            <p className='text-muted' style={{ fontSize: "14px", fontWeight: "500" }}>Free equity delivery</p>
                        </div>
                        
                        <div className='col-4 text-center'>
                            <img src='/media/images/intradayTrades.svg' style={{ width: "80px", height: "80px", marginBottom: "15px" }} alt="Intraday and F&O"/>
                            <p className='text-muted' style={{ fontSize: "14px", fontWeight: "500" }}>Intraday and F&O</p>
                        </div>
                    </div>
                </div>


            </div>
            <a href="/pricing" className=" text-decoration-none ms-5">See pricing <i className="fa fa-long-arrow-right" aria-hidden="true"></i></a>
        </div>
    );
}

export default Pricing;
