const userHoldings = require("../model/HoldingsModel");
const { OrdersModel } = require("../model/OrdersModel");

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

module.exports.getUserOrders = async(req, res) => {
    const userId = req.userId;
    console.log("getUserOrders called with userId:", userId);
    if(!userId){
        console.log("No userId found in request");
        return res.json({ success: false, message: "User ID not found" });
    }
    try {
        console.log("Searching for orders with userId:", userId);
        const userOrders = await OrdersModel.find({userId: userId});
        console.log("Found orders:", userOrders.length);
        return res.json({ success: true, data: userOrders });
    } catch (error) {
        console.error("Error in getUserOrders:", error);
        return res.json({ success: false, message: error.message || error });
    }
}
