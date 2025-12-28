const mongoose = require("mongoose");
const WatchListSchema = require("../schema/WatchListSchema");

const Watchlist = mongoose.model("Watchlist", WatchListSchema);

module.exports = Watchlist;
