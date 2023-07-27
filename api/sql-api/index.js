const express = require("express");
const mongoose = require("mongoose");
const conn = require("./DB.js");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

// Importing Routes
const authRoute = require("./Routes/auth.js");
const userRoute = require("./Routes/User.js");
const productsRoute = require("./Routes/Product.js");
const cartRoute = require("./Routes/Cart.js");
const orderRoute = require("./Routes/Order.js");

// app usage
app.use(express.json());

// importing data from .env file
const port = process.env.PORT | 3001;

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM city LIMIT 50";
  try {
    conn.query(sql, (err, data) => {
      if (err) {
        console.log(err);
      }
      res.status(200).json(data);
    });
  } catch (err) {
    res.status(500).json;
  }
});

// Routes

// 1. user authentication route

app.use("/api/auth", authRoute);
// app.use("/api/user", userRoute);
app.use("/api/products", productsRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders/", orderRoute);

app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});
