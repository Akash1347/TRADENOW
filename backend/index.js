require("dotenv").config();
console.log("NODE_ENV:", process.env.NODE_ENV);

const express = require("express");
const mongoose = require("mongoose");
const HoldingsModel = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel")
const { watchlist } = require("./data/data")
const Watchlist = require("./model/WatchListModel");
const bodyParser = require("body-parser");
const cors = require("cors");


const http = require("http");
const initSocket = require("./socket");

const PORT = process.env.PORT || 3001;
const url = process.env.MONGO_URL;
const app = express();

const server = http.createServer(app);


const authRoute = require("./routes/AuthRoutes");
const buyAndSellRoute = require("./routes/BuyAndSellRoute");
const watchlistRoute = require("./routes/WatchlistRoute");
const holdingsAndPositionsRoute = require("./routes/HoldingsAndPositionsRoute");
const chartRoute = require("./routes/ChartRoute");


const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/userAuth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true
}));

mongoose.connect(url)
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err));




app.get('/', (req, res) => {
    res.send("hello");
})

 

app.get('/allpositions', async (req, res) => {

    const allPosition = await PositionsModel.find({});
    console.log(allPosition);
    res.json(allPosition);
})




app.post('/addorder', async (req, res) => {

    const data = req.body;
    let order = await OrdersModel.insertOne(data);
    console.log(order);
    res.json({ message: "Order saved", status: "success" });

});

app.post('/watchlist', userAuth, async (req, res) => {
    const userId = req.userId;
    const filteredData = watchlist.map(item => ({
        userId: userId,
        symbol: item.name
    }));
    const data = await Watchlist.insertMany(filteredData);
    console.log(data);
    res.json({ message: "Watchlist saved", status: "success" });
})

app.get('/watchlist', userAuth, async (req, res) => {
    const userId = req.userId;
    const userWatchlist = await Watchlist.find({ userId });
    res.json(userWatchlist);
})

app.use('/api/auth', authRoute);
app.use('/api/watchlist', watchlistRoute);
app.use('/api/order', buyAndSellRoute);
app.use('/api/getdata', holdingsAndPositionsRoute);
app.use('/api/chart',  chartRoute);

initSocket(server);
server.listen(PORT, () => {
    console.log(`App started at ${PORT}`);
});
