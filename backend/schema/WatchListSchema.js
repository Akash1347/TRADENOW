const mongoose = require("mongoose");

const WatchListSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        symbol: {
            type: String,
            required: true,
            uppercase: true,
            index: true
        },
         createdAt: {
            type: Date,
            default: Date.now
        }
    },
    
    
);
WatchListSchema.index({ userId: 1, symbol: 1 }, { unique: true });



module.exports = WatchListSchema;