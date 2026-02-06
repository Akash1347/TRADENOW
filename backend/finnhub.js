const WebSocket = require("ws");

let finnhubWS = null;
let isConnecting = false;

// Track subscriptions so we can re-subscribe after reconnect
const subscriptions = new Set();

// Reconnect backoff
let retryDelay = 5000;           // start with 5 seconds
const MAX_DELAY = 60000;         // max 60 seconds

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
    retryDelay = 5000; // reset backoff on success

    // Re-subscribe to all symbols after reconnect
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
      console.error("Failed to parse Finnhub message:", err.message);
    }
  });

  finnhubWS.on("close", () => {
    console.log("Finnhub WebSocket closed.");
    cleanupAndReconnect(onTrade);
  });

  finnhubWS.on("error", (err) => {
    console.error("Finnhub WebSocket error:", err.message);
    try { finnhubWS.close(); } catch {}
  });
}

function cleanupAndReconnect(onTrade) {
  isConnecting = false;
  finnhubWS = null;

  const delay = retryDelay;
  console.log(`Reconnecting in ${delay / 1000}s...`);

  setTimeout(() => {
    connectFinnhub(onTrade);
  }, delay);

  retryDelay = Math.min(retryDelay * 2, MAX_DELAY); // exponential backoff
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
