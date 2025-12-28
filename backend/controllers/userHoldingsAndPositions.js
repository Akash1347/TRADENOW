const userHoldings = require("../model/HoldingsModel");


module.exports.getUserHoldings = async(req, res) => {

    const userId = req.userId;
    if(!userId){

        return res.json({ success: false, message: "User ID not found" });
    }

    try {
        console.log("Fetching holdings for userId:", userId);
        const holdings = await userHoldings.find({userId: userId});
        console.log("Found holdings:", holdings.length);
        console.log("HoldingsModel DB name:", userHoldings.db?.name);
console.log("HoldingsModel collection name:", userHoldings.collection?.name);

        return res.json({ success: true, data: holdings });
    } catch (error) {
        return res.json({ success: false, message: error });
    }

};
