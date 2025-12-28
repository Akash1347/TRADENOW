const mongoose = require("mongoose");

const {model} =mongoose;
const tradeSchema = require("../schema/TradesSchema");  

const TradesModel=model("Trade",tradeSchema);

module.exports={TradesModel};