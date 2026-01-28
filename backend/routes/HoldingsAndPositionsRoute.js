const route = require("express").Router();
const { getUserHoldings, getUserOrders } = require("../controllers/userHoldingsAndPositions");
const { userAuth } = require("../middleware/userAuth");

route.get('/holdings', userAuth, getUserHoldings);
route.get('/orders', userAuth, getUserOrders);
module.exports = route;
