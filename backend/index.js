require("dotenv").config();


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

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
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


app.listen(PORT ,()=>{
    console.log("App started");
});
