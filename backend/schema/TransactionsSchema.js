const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ["DEBIT", "CREDIT"],
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    reason: {
      type: String,
      enum: [
        "BUY_ORDER",        // funds blocked
        "BUY_SETTLEMENT",   // funds debited after trade
        "SELL_SETTLEMENT",  // funds credited after trade
        "ORDER_CANCELLED",  // funds unblocked
        "DEPOSIT",
        "WITHDRAWAL"
      ],
      required: true
    },

    refId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
      // can point to Order or Trade
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = transactionSchema;
