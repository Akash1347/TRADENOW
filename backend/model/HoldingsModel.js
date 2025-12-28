const mongoose = require("mongoose");
const HoldingsSchema = require("../schema/HoldingsSchema");

module.exports = mongoose.model("Holding", HoldingsSchema);
