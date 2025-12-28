 
const User = require("../model/UsersModel");
const Watchlist = require("../model/WatchListModel")


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