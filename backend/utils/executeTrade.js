const mongoose = require("mongoose");
const { OrdersModel } = require("../model/OrdersModel");
const { WalletsModel } = require("../model/WalletsModel");
const HoldingsModel = require("../model/HoldingsModel");
const { TradesModel } = require("../model/TradesModel");

/**
 * Executes a trade between a buyer and seller
 * This function handles all the atomic updates needed for a trade:
 * - Updates both orders (quantity, filled amount, status)
 * - Transfers money between wallets
 * - Transfers holdings between users
 * - Creates a trade record for audit trail
 * 
 * Uses MongoDB transactions to ensure all-or-nothing execution
 */
async function executeTrade({ buyerOrder, sellerOrder, quantity, price }) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const tradeAmount = quantity * price;

    // Step 1: Update SELL order - reduce quantity and mark as filled
    const sellerRemaining = sellerOrder.quantity - quantity;
    await OrdersModel.updateOne(
      { _id: sellerOrder._id, quantity: { $gte: quantity } }, // Safety check
      {
        $inc: {
          quantity: -quantity,
          filledQty: quantity
        },
        $set: {
          status: sellerRemaining === 0 ? "COMPLETED" : "PARTIAL"
        }
      },
      { session }
    );

    // Step 2: Update BUY order - increase filled quantity
    // Note: We don't update the quantity here because the caller handles it
    // This is because market and limit orders handle remaining quantity differently
    await OrdersModel.updateOne(
      { _id: buyerOrder._id },
      {
        $inc: { filledQty: quantity }
      },
      { session }
    );

    // Step 3: Update BUYER wallet - deduct money and unblock it
    await WalletsModel.updateOne(
      { userId: buyerOrder.userId },
      {
        $inc: {
          balance: -tradeAmount,
          blockedAmount: -tradeAmount
        }
      },
      { session }
    );

    // Step 4: Update SELLER wallet - credit the sale amount
    await WalletsModel.updateOne(
      { userId: sellerOrder.userId },
      {
        $inc: { balance: tradeAmount }
      },
      { session }
    );

    // Step 5: Update BUYER holdings - add the purchased quantity
    // Calculate new average price when adding to existing position
    const buyerHolding = await HoldingsModel.findOne(
      { userId: buyerOrder.userId, symbol: buyerOrder.symbol },
      null,
      { session }
    );

    if (buyerHolding) {
      // Calculate weighted average price
      const totalQty = buyerHolding.quantity + quantity;
      const newAvg = 
        ((buyerHolding.quantity * buyerHolding.avg) + (quantity * price)) / totalQty;

      await HoldingsModel.updateOne(
        { userId: buyerOrder.userId, symbol: buyerOrder.symbol },
        {
          $inc: { quantity: quantity },
          $set: { avg: newAvg }
        },
        { session }
      );
    } else {
      // First time buying this symbol
      await HoldingsModel.create(
        [{
          userId: buyerOrder.userId,
          symbol: buyerOrder.symbol,
          quantity: quantity,
          blockedQty: 0,
          avg: price
        }],
        { session }
      );
    }

    // Step 6: Update SELLER holdings - reduce quantity and unblock it
    await HoldingsModel.updateOne(
      { userId: sellerOrder.userId, symbol: sellerOrder.symbol },
      {
        $inc: {
          quantity: -quantity,
          blockedQty: -quantity
        }
      },
      { session }
    );

    // Step 7: Create trade record for audit trail
    await TradesModel.create(
      [{
        buyOrderId: buyerOrder._id,
        sellOrderId: sellerOrder._id,
        symbol: buyerOrder.symbol,
        quantity,
        price,
        amount: tradeAmount
      }],
      { session }
    );

    // Everything succeeded, commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { 
      success: true, 
      tradedAmount: tradeAmount,
      tradedQuantity: quantity 
    };

  } catch (error) {
    // Something went wrong, rollback everything
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

module.exports = { executeTrade };
