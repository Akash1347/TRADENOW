const route = require("express").Router();
const { getUserHoldings } = require("../controllers/userHoldingsAndPositions");
const { userAuth } = require("../middleware/userAuth");

route.get('/holdings', userAuth, getUserHoldings);
module.exports = route;
