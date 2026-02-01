const { OrdersModel } = require("../model/OrdersModel");
const { WalletsModel } = require("../model/WalletsModel");
const HoldingsModel = require("../model/HoldingsModel");
const { executeTrade } = require("../utils/executeTrade");

const isValidOrderType = (t) => t === "MARKET" || t === "LIMIT";

const {notifyUser} = require("../utils/notify");
/* =========================
   BUY – MARKET
========================= */
const buyAtMarketPrice = async (order) => {
  const cursor = OrdersModel.find({
    symbol: order.symbol,
    side: "SELL",
    orderType: "LIMIT",
    status: "OPEN",
  }).sort({ price: 1, createdAt: 1 }).cursor();

  let remaining = order.quantity;
  let spent = 0;

  for (let sell = await cursor.next(); sell && remaining > 0; sell = await cursor.next()) {
    const qty = Math.min(remaining, sell.quantity);

    try {
      const { tradedAmount } = await executeTrade({
        buyerOrder: order,
        sellerOrder: sell,
        quantity: qty,
        price: sell.price,
      });
      remaining -= qty;
      spent += tradedAmount;
    } catch (err) {
      if (err.message !== "SELL_ORDER_ALREADY_CONSUMED") throw err;
    }
  }

  await OrdersModel.updateOne(
    { _id: order._id },
    {
      quantity: remaining,
      status: remaining === 0 ? "COMPLETED" : "CANCELLED",
    }
  );
  if (remaining > 0){
    notifyUser(order.userId, {
      type: "info",
      message: `Your BUY MARKET order for ${order.symbol} was only partially filled. Remaining quantity: ${remaining}.`,
      orderId: order._id,
    });
  }

  if (order.lockedAmount > spent) {
    await WalletsModel.updateOne(
      { userId: order.userId },
      { $inc: { blockedAmount: -(order.lockedAmount - spent) } }
    );
  }
};

/* =========================
   BUY – LIMIT
========================= */
const buyAtLimitPrice = async (order) => {
  const cursor = OrdersModel.find({
    symbol: order.symbol,
    side: "SELL",
    orderType: "LIMIT",
    status: "OPEN",
    price: { $lte: order.price },
  }).sort({ price: 1, createdAt: 1 }).cursor();

  let remaining = order.quantity;
  let spent = 0;

  for (let sell = await cursor.next(); sell && remaining > 0; sell = await cursor.next()) {
    const qty = Math.min(remaining, sell.quantity);

    try {
      const { tradedAmount } = await executeTrade({
        buyerOrder: order,
        sellerOrder: sell,
        quantity: qty,
        price: sell.price,
      });
      remaining -= qty;
      spent += tradedAmount;
    } catch (err) {
      if (err.message !== "SELL_ORDER_ALREADY_CONSUMED") throw err;
    }
  }

  await OrdersModel.updateOne(
    { _id: order._id },
    {
      quantity: remaining,
      status: remaining === 0 ? "COMPLETED" : "OPEN",
    }
  );

  if (order.lockedAmount > spent) {
    await WalletsModel.updateOne(
      { userId: order.userId },
      { $inc: { blockedAmount: -(order.lockedAmount - spent) } }
    );
  }
};

/* =========================
   SELL – MARKET
========================= */
const sellAtMarketPrice = async (order) => {
  const cursor = OrdersModel.find({
    symbol: order.symbol,
    side: "BUY",
    status: "OPEN",
  }).sort({ price: -1, createdAt: 1 }).cursor();

  let remaining = order.quantity;

  for (let buy = await cursor.next(); buy && remaining > 0; buy = await cursor.next()) {
    const qty = Math.min(remaining, buy.quantity);

    try {
      await executeTrade({
        buyerOrder: buy,
        sellerOrder: order,
        quantity: qty,
        price: buy.orderType === "LIMIT" ? buy.price : order.price,
      });
      remaining -= qty;
    } catch (err) {
      if (err.message !== "BUY_ORDER_ALREADY_CONSUMED") throw err;
    }
  }

  await OrdersModel.updateOne(
    { _id: order._id },
    {
      quantity: remaining,
      status: remaining === 0 ? "COMPLETED" : "CANCELLED",
    }
  );

  if (remaining > 0) {
    await HoldingsModel.updateOne(
      { userId: order.userId, symbol: order.symbol },
      { $inc: { quantity: remaining, blockedQty: -remaining } }
    );
  }
};

/* =========================
   SELL – LIMIT
========================= */
const sellAtLimitPrice = async (order) => {
  const cursor = OrdersModel.find({
    symbol: order.symbol,
    side: "BUY",
    status: "OPEN",
    $or: [
      { orderType: "MARKET" },
      { orderType: "LIMIT", price: { $gte: order.price } },
    ],
  }).sort({ price: -1, createdAt: 1 }).cursor();

  let remaining = order.quantity;

  for (let buy = await cursor.next(); buy && remaining > 0; buy = await cursor.next()) {
    const qty = Math.min(remaining, buy.quantity);

    try {
      await executeTrade({
        buyerOrder: buy,
        sellerOrder: order,
        quantity: qty,
        price: buy.orderType === "MARKET" ? order.price : buy.price,
      });
      remaining -= qty;
    } catch (err) {
      if (err.message !== "BUY_ORDER_ALREADY_CONSUMED") throw err;
    }
  }

  await OrdersModel.updateOne(
    { _id: order._id },
    {
      quantity: remaining,
      status: remaining === 0 ? "COMPLETED" : "OPEN",
    }
  );
};

/* =========================
   PLACE BUY ORDER
========================= */
module.exports.placeBuyOrder = async (req, res) => {
  try {
    const { symbol, quantity, price, side, orderType } = req.body;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (side !== "BUY" || !isValidOrderType(orderType) || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid order" });
    }

    const upperSymbol = symbol.toUpperCase();

    let lockedAmount;
    if (orderType === "MARKET") {
      const bestSell = await OrdersModel.findOne({
        symbol: upperSymbol,
        side: "SELL",
        orderType: "LIMIT",
        status: "OPEN",
      }).sort({ price: 1 });

      if (!bestSell) {
        return res.status(400).json({ success: false, message: "No sellers available" });
      }
      lockedAmount = bestSell.price * quantity * 1.05;
    } else {
      if (!price || price <= 0) {
        return res.status(400).json({ success: false, message: "Invalid price" });
      }
      lockedAmount = price * quantity;
    }

    const walletLock = await WalletsModel.updateOne(
      { userId, balance: { $gte: lockedAmount } },
      { $inc: { blockedAmount: lockedAmount } }
    );

    if (!walletLock.matchedCount) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    const order = await OrdersModel.create({
      userId,
      symbol: upperSymbol,
      quantity,
      price: orderType === "LIMIT" ? price : 0,
      side: "BUY",
      orderType,
      status: "OPEN",
      lockedAmount,
    });
    notifyUser(userId, { // notify user
      type: "info",
      message: `Your BUY order for ${quantity} shares of ${upperSymbol} has been placed successfully.`,
      orderId: order._id,
    });

    if (orderType === "MARKET") await buyAtMarketPrice(order);
    else await buyAtLimitPrice(order);

    return res.json({
      success: true,
      message: "Buy order processed",
      data: await OrdersModel.findById(order._id),
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   PLACE SELL ORDER
========================= */
module.exports.placeSellOrder = async (req, res) => {
  try {
    const { symbol, quantity, price, side, orderType } = req.body;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (side !== "SELL" || !isValidOrderType(orderType) || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid order" });
    }

    const upperSymbol = symbol.toUpperCase();

    // First check if user has sufficient holdings
    const holding = await HoldingsModel.findOne({ userId, symbol: upperSymbol });
    const availableQty = holding ? (holding.quantity - holding.blockedQty) : 0;

    if (!holding || availableQty < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient holdings. Required: ${quantity}, Available: ${availableQty}`
      });
    }

    // Block the holdings
    await HoldingsModel.updateOne(
      { userId, symbol: upperSymbol },
      { $inc: { blockedQty: quantity } }
    );

    const order = await OrdersModel.create({
      userId,
      symbol: upperSymbol,
      quantity,
      price: orderType === "LIMIT" ? price : 0,
      side: "SELL",
      orderType,
      status: "OPEN",
    });

    notifyUser(userId, { //notifiy seller
      type: "info",
      message: `Your SELL order for ${quantity} shares of ${upperSymbol} has been placed successfully.`,
      orderId: order._id,
    });

    if (orderType === "MARKET") await sellAtMarketPrice(order);
    else await sellAtLimitPrice(order);

    return res.json({
      success: true,
      message: "Sell order processed",
      data: await OrdersModel.findById(order._id),
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
