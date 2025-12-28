
const mongoose=require("mongoose");
const {Schema}=mongoose;

const OrdersSchema=new Schema(
    {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    symbol: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },

    side: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true
    },

    orderType: {
      type: String,
      enum: ["MARKET", "LIMIT"],
      required: true
    },

    price: {
      type: Number,
      required: function () {
        return this.orderType === "LIMIT";
      },
      min: 0
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    filledQty: {
      type: Number,
      default: 0,
      min: 0
    },
    lockedAmount: {
      type: Number,
      default: 0
    },


    status: {
      type: String,
      enum: ["OPEN", "PARTIAL", "COMPLETED", "CANCELLED"],
      default: "OPEN",
      index: true
    },
    
    
    },
    {
    timestamps: { createdAt: true, updatedAt: false }
    }

);
OrdersSchema.index({ symbol: 1, side: 1, status: 1, price: 1 });

module.exports={OrdersSchema};