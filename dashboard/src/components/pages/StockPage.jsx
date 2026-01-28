import React, { useEffect, useState, useContext } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CandleChart from '../charts/CandleChart';
import AddWatchlistButton from '../watchlist/AddWatchlistButton';
import GeneralContext from '../../contexts/GeneralContext';
import { UserContext } from '../../contexts/userContext';
import './StockPage.css';

function StockPage() {
    const { symbol: urlSymbol } = useParams();
    const [searchParams] = useSearchParams();
    const querySymbol = searchParams.get('symbol');

    const [symbol, setSymbol] = useState(urlSymbol || querySymbol);
    const [companyData, setCompanyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userData, isLoggedIn } = useContext(UserContext);
    const generalContext = useContext(GeneralContext);
     
    // Function to check if US market is open
    const isMarketOpen = () => {
        const now = new Date();
        // Convert to ET (UTC-5)
        const etOffset = -5 * 60; // ET is UTC-5
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const etTime = new Date(utc + (etOffset * 60000));

        const day = etTime.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        const hours = etTime.getHours();
        const minutes = etTime.getMinutes();

        // Market open: Mon-Fri, 9:30 AM - 4:00 PM ET
        if (day >= 1 && day <= 5) {
            const currentMinutes = hours * 60 + minutes;
            const openMinutes = 9 * 60 + 30; // 9:30
            const closeMinutes = 16 * 60; // 4:00
            return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
        }
        return false;
    };

    // Function to get next market opening time
    const getNextMarketOpening = () => {
        const now = new Date();
        const etOffset = -5 * 60; // ET is UTC-5
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const etTime = new Date(utc + (etOffset * 60000));

        const day = etTime.getDay();
        const hours = etTime.getHours();
        const minutes = etTime.getMinutes();

        let nextOpening;

        if (day === 0) { // Sunday
            // Next Monday 9:30 AM ET
            nextOpening = new Date(etTime);
            nextOpening.setDate(etTime.getDate() + 1); // Monday
            nextOpening.setHours(9, 30, 0, 0);
        } else if (day === 6) { // Saturday
            // Next Monday 9:30 AM ET
            nextOpening = new Date(etTime);
            nextOpening.setDate(etTime.getDate() + 2); // Monday
            nextOpening.setHours(9, 30, 0, 0);
        } else if (day >= 1 && day <= 5) { // Monday-Friday
            const currentMinutes = hours * 60 + minutes;
            const openMinutes = 9 * 60 + 30; // 9:30

            if (currentMinutes < openMinutes) {
                // Today 9:30 AM ET
                nextOpening = new Date(etTime);
                nextOpening.setHours(9, 30, 0, 0);
            } else {
                // Next day 9:30 AM ET
                nextOpening = new Date(etTime);
                nextOpening.setDate(etTime.getDate() + 1);

                // If next day is Saturday, skip to Monday
                if (nextOpening.getDay() === 6) {
                    nextOpening.setDate(nextOpening.getDate() + 2);
                }
                // If next day is Sunday, skip to Monday
                if (nextOpening.getDay() === 0) {
                    nextOpening.setDate(nextOpening.getDate() + 1);
                }

                nextOpening.setHours(9, 30, 0, 0);
            }
        }

        return nextOpening;
    };

    useEffect(() => {
        setSymbol(urlSymbol || querySymbol);
    }, [urlSymbol, querySymbol]);

    useEffect(() => {
        if (!symbol) return;

        async function fetchCompanyData() {
            try {
                setLoading(true);
                setError(null);
                const { data } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/chart/${symbol}`
                );

                if (data.chart && data.chart.result && data.chart.result.length > 0) {
                    const meta = data.chart.result[0].meta;
                    setCompanyData(meta);
                } else {
                    setError('No company data available');
                }
            } catch (err) {
                setError('Failed to load company data');
                console.error('Error fetching company data:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchCompanyData();
    }, [symbol]);

    if (!symbol) {
        return <div className="stock-page-error">No stock symbol provided.</div>;
    }
    const navigate = useNavigate();

    const buyWindow = () => {
        if (isLoggedIn === false) {
            window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/login`;
            return;
        }
        if (userData && userData.isVerified === false) {
            navigate('/verifyAccount');
            return;
        }
        if (generalContext?.openBuyWindow) {
            generalContext.openBuyWindow(symbol, companyData?.regularMarketPrice || 0);
        }
    }
    const marketOpen = isMarketOpen();
    const nextOpening = getNextMarketOpening();

    return (
        <div className="stock-page">
            <h2>Stock Chart: {symbol.toUpperCase()}</h2>

            {!marketOpen && (
                <div className="market-status-closed">
                    {/* <div className="market-status-icon">⏰</div> */}
                    <div className="market-status-text">
                        <strong>Market Closed</strong>
                        <br />
                        Opens {nextOpening?.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })} at {nextOpening?.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'America/New_York'
                        })} ET
                    </div>
                </div>
            )}

            {marketOpen && (
                <div className="market-status-open">
                    <div className="market-status-text">
                        <strong>US Market Open</strong>
                        <br />
                        Closes at 4:00 PM ET
                    </div>
                </div>
            )}

            <div className="stock-actions">
                <button
                    onClick={buyWindow}
                    disabled={!companyData || !marketOpen || !generalContext?.openBuyWindow}
                    title={!marketOpen ? "Market is closed" : ""}
                >
                    BUY
                </button>
                <button
                    onClick={() => generalContext?.openSellWindow && generalContext.openSellWindow(symbol, companyData?.regularMarketPrice || 0)}
                    disabled={!companyData || !marketOpen || !generalContext?.openSellWindow}
                    title={!marketOpen ? "Market is closed" : ""}
                >
                    SELL
                </button>
                <AddWatchlistButton symbol={symbol} />
            </div>
            {loading && (
                <div className="company-details-loading">Loading company details...</div>
            )}

            {error && (
                <div className="company-details-error">Error: {error}</div>
            )}

            {companyData && (
                <div className="company-details">
                    <h3>Company Information</h3>
                    <div className="company-info-grid">
                        <div className="info-item">
                            <span className="info-label">Company Name:</span>
                            <span className="info-value">{companyData.longName || companyData.shortName}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Symbol:</span>
                            <span className="info-value">{companyData.symbol}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Currency:</span>
                            <span className="info-value">{companyData.currency}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Current Price:</span>
                            <span className="info-value">${companyData.regularMarketPrice?.toFixed(2)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">52 Week High:</span>
                            <span className="info-value">${companyData.fiftyTwoWeekHigh?.toFixed(2)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">52 Week Low:</span>
                            <span className="info-value">${companyData.fiftyTwoWeekLow?.toFixed(2)}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Market Cap:</span>
                            <span className="info-value">{companyData.marketCap ? `$${(companyData.marketCap / 1e9).toFixed(2)}B` : 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Exchange:</span>
                            <span className="info-value">{companyData.fullExchangeName || companyData.exchangeName}</span>
                        </div>
                    </div>
                </div>
            )}
            <div className="chart-container">
                <CandleChart symbol={symbol} />
            </div>
        </div>
    );
}

export default StockPage;
