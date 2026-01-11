const express = require('express');
const route = express.Router();
const { addwatchlist, removewatchlist, sendWatchlist, search } = require("../controllers/userWatchlist");
const { userAuth } = require("../middleware/userAuth");


route.get('/search' ,search);

route.post('/add' ,userAuth ,addwatchlist);
route.delete('/' ,userAuth ,removewatchlist);
route.get("/:email" ,sendWatchlist);


module.exports = route;