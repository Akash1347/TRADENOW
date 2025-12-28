const { Schema } = require("mongoose");

const HoldingsSchema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    symbol: {
        type: String,
        required: true,
        uppercase: true,
        index: true
    },
    quantity: {
        type: Number,
        default: 0,
        min: 0
    },
    blockedQty: {
        type: Number,
        default: 0,
        min: 0
    },
    avg: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

 
HoldingsSchema.index({ userId: 1, symbol: 1 }, { unique: true });

module.exports = HoldingsSchema;