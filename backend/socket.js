const { Server } = require("socket.io");
const Watchlist = require("./model/WatchListModel");
const { initNotifier } = require("./utils/notify");
const {
  connectFinnhub,
  subscribeSymbol,
  unsubscribeSymbol
} = require("./finnhub");

module.exports = function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: [process.env.DASHBOARD_URL, process.env.FRONTEND_URL],
      credentials: true
    }
  });

  const activeSymbols = new Set();
  const symbolRefCount = new Map();
  const userSockets = new Map();

  initNotifier(io);

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) {
      return socket.disconnect();
    }

    socket.join(userId); // notification room
    userSockets.set(socket.id, { userId, symbols: new Set() });

    try {
      const items = await Watchlist.find({ userId });
      items.forEach(item => {
        addSymbol(socket, item.symbol);
      });
    } catch (err) {
      console.error("Error fetching watchlist for socket:", err);
    }

    socket.on("add-symbol", (symbol) => {
      addSymbol(socket, symbol);
    });

    socket.on("remove-symbol", (symbol) => {
      removeSymbol(socket, symbol);
    });

    socket.on("disconnect", () => {
      cleanup(socket);
    });
  });

  function addSymbol(socket, symbol) {
    if (!symbol) return;
    symbol = symbol.toUpperCase();

    const userData = userSockets.get(socket.id);
    if (!userData || userData.symbols.has(symbol)) return;

    userData.symbols.add(symbol);
    socket.join(symbol);

    const count = symbolRefCount.get(symbol) || 0;
    symbolRefCount.set(symbol, count + 1);

    if (count === 0) {
      if (activeSymbols.size >= 50) {
        console.warn("Reached Finnhub free tier limit (50 symbols)");
        return;
      }
      activeSymbols.add(symbol);
      subscribeSymbol(symbol);
    }
  }

  function removeSymbol(socket, symbol) {
    symbol = symbol.toUpperCase();
    const userData = userSockets.get(socket.id);
    if (!userData?.symbols.has(symbol)) return;

    userData.symbols.delete(symbol);
    socket.leave(symbol);

    const count = (symbolRefCount.get(symbol) || 1) - 1;
    if (count <= 0) {
      symbolRefCount.delete(symbol);
      activeSymbols.delete(symbol);
      unsubscribeSymbol(symbol);
    } else {
      symbolRefCount.set(symbol, count);
    }
  }

  function cleanup(socket) {
    const userData = userSockets.get(socket.id);
    if (userData) {
      for (const symbol of userData.symbols) {
        removeSymbol(socket, symbol);
      }
      userSockets.delete(socket.id);
    }
  }

  // Start Finnhub connection ONCE
  connectFinnhub((trades) => {
    trades.forEach(t => {
      io.to(t.s).emit("price-update", {
        s: t.s,
        p: t.p,
        t: t.t,
        v: t.v
      });
    });
  });
};
