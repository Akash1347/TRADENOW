 
const User = require("../model/UsersModel");
const Watchlist = require("../model/WatchListModel")
const axios = require("axios");

module.exports.addwatchlist = async(req ,res)=> {
    const userId = req.userId;
    const {symbol} = req.body;
    try{
        const data = await Watchlist.create({userId ,symbol});
    console.log(data);
    res.json({success : true ,message:"added Watchlist"})
    }catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports.removewatchlist = async(req ,res)=> {
    const userId = req.userId;
    const {symbol} = req.body;
    try{
        await Watchlist.deleteOne({userId ,symbol});
        res.json({success : true ,message:"removed from Watchlist"})
    }catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports.sendWatchlist = async (req, res) => {
  try {
    const { email } = req.params;

    
    const user = await User.findOne({ email }).select("_id");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    
    const watchlist = await Watchlist.find({ userId: user._id })
      .select("symbol -_id")
      .lean();
        console.log(watchlist);
    return res.status(200).json(watchlist);
  } catch (err) {
    console.error("Watchlist by email error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}


module.exports.search = async (req, res) => {
  try {
    console.log("query:", req.query);
    console.log("api key:", process.env.FINNHUB_API_KEY);

    const response = await axios.get(
      `https://finnhub.io/api/v1/search?q=${req.query.q}&token=${process.env.FINNHUB_API_KEY}`
    );

    console.log("finnhub data:", response.data);

    res.json(response.data);
  } catch (error) {
    console.log("ERROR >>>", error?.response?.data || error.message);
    res.status(500).json({ error: error?.message });
  }
};