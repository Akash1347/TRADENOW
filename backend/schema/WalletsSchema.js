const mongoose = require("mongoose");
const { Schema } = mongoose;

const WalletsSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true
    },
    balance: {
        type: Number,
        default: 1000,
         
        min: 0
    },
    blockedAmount: {
        type: Number,
        default: 0, 
         
        min: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
         
    }

});

module.exports = {WalletsSchema};