import React from "react";
import "../../assets/css/accordionFix.css";




function CreateTicket() {
    return (
        <div className="container m-5">
            <div className="row ">
                <div className="accordion accordion-flush col-9" id="accordionFlushExample">

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseOne"
                                aria-expanded="false"
                                aria-controls="collapseOne"
                            >
                                <i className="fa fa-plus-circle" aria-hidden="true"></i> Account Opening
                            </button>
                        </h2>
                        <div
                            id="collapseOne"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingOne"
                            data-bs-parent="#accordionFlushExample"
                        >
                            <div className="accordion-body">
                                <ul>
                                    <li>Resident individual</li>
                                    <li>Minor</li>
                                    <li>NRI</li>
                                    <li>Company, Partnership, HUF & LLP</li>
                                    <li>Glossary</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseTwo"
                                aria-expanded="false"
                                aria-controls="collapseTwo"
                            >
                                <i className="fa fa-user-circle-o" aria-hidden="true"></i>Your Zerodha Account
                            </button>
                        </h2>
                        <div
                            id="collapseTwo"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingTwo"
                            data-bs-parent="#accordionFlushExample"
                        >
                            <div className="accordion-body">
                                <ul>
                                    <li>Your Profile</li>
                                    <li>Account modification</li>
                                    <li>Client Master Report (CMR)</li>
                                    <li>Nomination</li>
                                    <li>Transfer & conversion of securities</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingThree">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseThree"
                                aria-expanded="false"
                                aria-controls="collapseThree"
                            >
                                <i className="fa fa-circle-thin" aria-hidden="true"></i> Kite
                            </button>
                        </h2>
                        <div
                            id="collapseThree"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingThree"
                            data-bs-parent="#accordionFlushExample"
                        >
                            <div className="accordion-body">
                                <ul>
                                    <li>IPO</li>
                                    <li>Trading FAQs</li>
                                    <li>MTF & Margins</li>
                                    <li>Charts and orders</li>
                                    <li>Alerts and Nudges</li>
                                    <li>General</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingFour">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseFour"
                                aria-expanded="false"
                                aria-controls="collapseFour"
                            >
                                <i className="fa fa-inr" aria-hidden="true"></i> Funds
                            </button>
                        </h2>
                        <div
                            id="collapseFour"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingFour"
                            data-bs-parent="#accordionFlushExample"
                        >
                            <div className="accordion-body">
                                <ul>
                                    <li>Add money</li>
                                    <li>Withdraw money</li>
                                    <li>Add bank accounts</li>
                                    <li>eMandates</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingFive">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseFive"
                                aria-expanded="false"
                                aria-controls="collapseFive"
                            >
                                <i className="fa fa-eercast" aria-hidden="true"></i> Console
                            </button>
                        </h2>
                        <div
                            id="collapseFive"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingFive"
                            data-bs-parent="#accordionFlushExample"
                        >
                            <div className="accordion-body">
                                <ul>
                                    <li>Portfolio</li>
                                    <li>Corporate actions</li>
                                    <li>Fund statement</li>
                                    <li>Reports</li>
                                    <li>Profile</li>
                                    <li>Segments</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingSix">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseSix"
                                aria-expanded="false"
                                aria-controls="collapseSix"
                            >
                                <i className="fa fa-circle-o-notch" aria-hidden="true"></i> Coin
                            </button>
                        </h2>
                        <div
                            id="collapseSix"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingSix"
                            data-bs-parent="#accordionFlushExample"
                        >
                            <div className="accordion-body">
                                <ul>
                                    <li>Mutual funds</li>
                                    <li>NPS</li>
                                    <li>Features on Coin</li>
                                    <li>Payments and Orders</li>
                                    <li>General</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-3 ms-2 my-5 box">
                    <div className="m-2 random-box" >
                        <div className="ms-2 inside-random-box">
                            <ul>
                                <li><a href="">Rights Entitlements listing in December 2025</a></li>
                                <li><a href="">Latest Intraday leverages and Square-off timings</a></li>
                            </ul>
                        </div>

                    </div>

                    <div className="quick-links ">
                        <h4 className="fs-5 m-1 quick-link-heading">Quick links</h4>
                        <ol><a href="">Track account opening</a></ol>
                        <ol><a href="">Track segment activation</a></ol>
                        <ol><a href="">Intraday margins</a></ol>
                        <ol><a href="">Kite user manual</a></ol>
                        <ol><a href="">Learn how to create a ticket</a></ol>
                    </div>

                </div>
            </div>


        </div>
    );
}

export default CreateTicket;
