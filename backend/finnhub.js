const WebSocket = require("ws");

let finnhubWS = null;
let isConnecting = false;
const subscriptions = new Set();

function connectFinnhub(onTrade) {
  if (isConnecting || (finnhubWS && finnhubWS.readyState === WebSocket.OPEN)) {
    return;
  }

  isConnecting = true;
  console.log("Connecting to Finnhub WebSocket...");

  finnhubWS = new WebSocket(
    `wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`
  );

  finnhubWS.on("open", () => {
    console.log("Finnhub WebSocket connected");
    isConnecting = false;

    // Re-subscribe all symbols after reconnect
    for (const symbol of subscriptions) {
      finnhubWS.send(JSON.stringify({ type: "subscribe", symbol }));
    }
  });

  finnhubWS.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.type === "trade") {
        onTrade(data.data);
      }
    } catch (err) {
      console.error("Failed to parse Finnhub message:", err);
    }
  });

  finnhubWS.on("close", () => {
    console.log("Finnhub WebSocket closed. Reconnecting in 5s...");
    isConnecting = false;
    finnhubWS = null;
    setTimeout(() => connectFinnhub(onTrade), 5000);
  });

  finnhubWS.on("error", (error) => {
    console.error("Finnhub WebSocket error:", error);
    // Force close to trigger reconnect
    try { finnhubWS.close(); } catch {}
  });
}

function subscribeSymbol(symbol) {
  subscriptions.add(symbol);

  if (finnhubWS && finnhubWS.readyState === WebSocket.OPEN) {
    finnhubWS.send(JSON.stringify({ type: "subscribe", symbol }));
  }
}

function unsubscribeSymbol(symbol) {
  subscriptions.delete(symbol);

  if (finnhubWS && finnhubWS.readyState === WebSocket.OPEN) {
    finnhubWS.send(JSON.stringify({ type: "unsubscribe", symbol }));
  }
}

module.exports = {
  connectFinnhub,
  subscribeSymbol,
  unsubscribeSymbol
};
