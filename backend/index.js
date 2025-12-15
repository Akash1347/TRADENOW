require("dotenv").config();
console.log("NODE_ENV:", process.env.NODE_ENV);

const express = require("express");
const mongoose = require("mongoose");
const {HoldingsModel}=require("./model/HoldingsModel");
const {PositionsModel}=require("./model/PositionsModel");
const {OrdersModel}=require("./model/OrdersModel")
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.port || 3001;
const url = process.env.MONGO_URL;
const app = express();



const authRoute = require("./routes/AuthRoutes");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true
}));

mongoose.connect(url)
    .then(()=> console.log("DB connected"))
    .catch((err) => console.log(err));




app.get('/' ,(req ,res) => {
    res.send("hello");
})

app.get('/allholdings' ,async(req ,res) => {

    const allHoldings = await HoldingsModel.find({});
    console.log(allHoldings);
    res.json(allHoldings);


})

app.get('/allpositions' ,async(req ,res) => {
    
    const allPosition = await PositionsModel.find({});
    console.log(allPosition);
    res.json(allPosition);
})

 
app.post('/addorder', async(req, res) => {
  
    const data = req.body;
    let order= await OrdersModel.insertOne(data);
    console.log(order);
    res.json({ message: "Order saved", status: "success" });
   
});

app.use('/api/auth' ,authRoute);


app.listen(PORT ,()=>{
    console.log(`App started at ${PORT}`);
});
