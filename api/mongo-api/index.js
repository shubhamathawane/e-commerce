const express = require("express")
const mongoose = require('mongoose')
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// Importing Routes
const authRoute = require('./Routes/auth.js')
const userRoute = require("./Routes/User.js")
const productsRoute = require("./Routes/Product.js")
const cartRoute = require("./Routes/Cart.js")
const orderRoute = require("./Routes/Order.js")
// app usage
app.use(express.json())

// importing data from .env file 
const port = process.env.PORT | 3001;
const mongoURI = process.env.MONGO_URL;


// Mongodb Connection
mongoose.connect(mongoURI, {
    config:{autoIndex:true}
})
.then(console.log("Database Connected!"))
.catch((err) => console.log(err))


// Routes

// 1. user authentication route
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute)
app.use("/api/products", productsRoute)
app.use("/api/carts", cartRoute);
app.use("/api/order/", orderRoute)

app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`)
})