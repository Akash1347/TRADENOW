const express = require("express");
const router = express.Router();
const { placeBuyOrder, placeSellOrder } = require("../controllers/BuyAndSell");
const { userAuth } = require("../middleware/userAuth");

router.post('/buy' ,userAuth ,placeBuyOrder);
router.post('/sell' ,userAuth ,placeSellOrder);

module.exports = router;
