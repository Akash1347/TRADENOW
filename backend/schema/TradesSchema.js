const mongoose = require("mongoose");
const { Schema } = mongoose;

const tradeSchema = new Schema(
  {
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },

    buyOrderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },

    sellOrderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: { createdAt: "executedAt", updatedAt: false }
  }
);
tradeSchema.index({ buyerOrderId: 1, executedAt: -1 });
tradeSchema.index({ sellerOrderId: 1, executedAt: -1 });
module.exports = tradeSchema;
