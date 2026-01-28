const WebSocket = require("ws");
let finnhubWS;

module.exports.connectFinnhub = function (onTrade) {
  console.log("Connecting to Finnhub WebSocket...");
  finnhubWS = new WebSocket(
    `wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`
  );

  finnhubWS.on("open", () => {
    console.log("Finnhub WebSocket connected");
  });

  finnhubWS.on("error", (error) => {
    console.error("Finnhub WebSocket error:", error);
  });

  finnhubWS.on("close", () => {
    console.log("Finnhub WebSocket closed");
  });

  finnhubWS.on("message", (msg) => {
    const data = JSON.parse(msg.toString());
    if (data.type === "trade") {
      onTrade(data.data);
    } else {
      console.log("Received non-trade message:", data);
    }
  });
};

module.exports.subscribeSymbol = (symbol) =>
  finnhubWS.send(JSON.stringify({ type: "subscribe", symbol }));

module.exports.unsubscribeSymbol = (symbol) =>
  finnhubWS.send(JSON.stringify({ type: "unsubscribe", symbol }));
