const watchlist = [
  {
    name: "AAPL",
    price: 189.45,
    percent: "+0.82%",
    isDown: false,
  },
  {
    name:"BINANCE:BTCUSDT",
    price: 27345.12,
    percent: "-1.25%",
    isDown: true,
  },
  {
    name: "BINANCE:ETHUSDT",
    price: 1585.40,
    percent: "0.82%",
    isDown: false,
  },
  {
    name: "BINANCE:BNBUSDT",
    price: 242.18,
    percent: "-0.45%",
    isDown: true,
  },
  {
    name: "BINANCE:XRPUSDT",
    price: 0.6234,
    percent: "1.92%",
    isDown: false,
  },

  {
    name: "MSFT",
    price: 417.30,
    percent: "-0.36%",
    isDown: true,
  },
  {
    name: "GOOGL",
    price: 152.88,
    percent: "+1.14%",
    isDown: false,
  },
  {
    name: "AMZN",
    price: 182.15,
    percent: "+0.47%",
    isDown: false,
  },
  {
    name: "META",
    price: 493.60,
    percent: "-0.91%",
    isDown: true,
  },
  {
    name: "TSLA",
    price: 248.72,
    percent: "+2.35%",
    isDown: false,
  },
  {
    name: "NVDA",
    price: 128.40,
    percent: "+1.89%",
    isDown: false,
  },
  {
    name: "NFLX",
    price: 671.55,
    percent: "-0.22%",
    isDown: true,
  },
   
   
];


// holdings
const holdings = [
  
  {
    name: "HDFCBANK",
    qty: 2,
    avg: 1383.4,
    price: 1522.35,
    net: "+10.04%",
    day: "+0.11%",
  },
  {
    name: "HINDUNILVR",
    qty: 1,
    avg: 2335.85,
    price: 2417.4,
    net: "+3.49%",
    day: "+0.21%",
  },
  {
    name: "INFY",
    qty: 1,
    avg: 1350.5,
    price: 1555.45,
    net: "+15.18%",
    day: "-1.60%",
    isLoss: true,
  },
  {
    name: "ITC",
    qty: 5,
    avg: 202.0,
    price: 207.9,
    net: "+2.92%",
    day: "+0.80%",
  },
   
  {
    name: "RELIANCE",
    qty: 1,
    avg: 2193.7,
    price: 2112.4,
    net: "-3.71%",
    day: "+1.44%",
  },
  {
    name: "SBIN",
    qty: 4,
    avg: 324.35,
    price: 430.2,
    net: "+32.63%",
    day: "-0.34%",
    isLoss: true,
  },
   
  {
    name: "TCS",
    qty: 1,
    avg: 3041.7,
    price: 3194.8,
    net: "+5.03%",
    day: "-0.25%",
    isLoss: true,
  },
  {
    name: "WIPRO",
    qty: 4,
    avg: 489.3,
    price: 577.75,
    net: "+18.08%",
    day: "+0.32%",
  },
];

// positions
const positions = [
  {
    product: "CNC",
    name: "EVEREADY",
    qty: 2,
    avg: 316.27,
    price: 312.35,
    net: "+0.58%",
    day: "-1.24%",
    isLoss: true,
  },
  {
    product: "CNC",
    name: "JUBLFOOD",
    qty: 1,
    avg: 3124.75,
    price: 3082.65,
    net: "+10.04%",
    day: "-1.35%",
    isLoss: true,
  },
];

module.exports = { watchlist, holdings, positions };
