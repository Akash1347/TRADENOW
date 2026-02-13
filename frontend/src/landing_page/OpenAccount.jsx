import React from "react";

function OpenAccount() {
    return (
        <div className="container my-5 ms-5 py-5 text-center .text-dark">
            <h1>Open a TradeNow account</h1>
            <p className="fs-5 text-muted mt-3">Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.</p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button
                    type="button"
                    className="btn btn-primary btn-sm fs-5 mt-3"
                    style={{ width: "20%" }}
                >
                    <a href="/signup" style={{color: 'white', textDecoration: 'none'}}>Open an account</a>
                </button>
                <button
                    type="button"
                    className="btn btn-outline-primary btn-sm fs-5 mt-3"
                    style={{ width: "20%" }}
                >
                    <a href="/product" style={{color: '#0d6efd', textDecoration: 'none'}}>Learn more</a>
                </button>
            </div>
            <p className="text-muted mt-3 small">
                Already have an account? <a href="/login" className="text-primary">Login here</a>
            </p>
        </div>
    );
}

export default OpenAccount;
