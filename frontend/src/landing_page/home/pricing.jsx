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
                    <div className='row '>
                        <p style={{ fontSize: "10px" }} className='col-4 text-start text-muted'>
                            <img src='/media/images/Pricing0.svg' style={{ width: "50%" }}></img>
                            Free account opening
                        </p>

                        <p style={{ fontSize: "10px" }} className='col-4 text-muted text-start'>
                            <img src='/media/images/Pricing0.svg' style={{ width: "50%" }}></img>
                            Free equity delivery
                        </p>
                        <p style={{ fontSize: "10px" }} className='col-4 text-muted'>
                            <img src='/media/images/intradayTrades.svg' style={{ width: "50%" }}></img>
                            Intraday and F&O
                        </p>
                    </div>



                </div>


            </div>
            <a href="" className=" text-decoration-none ms-5">See pricing<i className="fa fa-long-arrow-right" aria-hidden="true"></i></a>
        </div>
    );
}

export default Pricing;
