const mongoose = require("mongoose");

const {model} = mongoose;

const WalletsSchema = require("../schema/WalletsSchema").WalletsSchema;

const WalletsModel = model("Wallet", WalletsSchema);

module.exports = { WalletsModel };