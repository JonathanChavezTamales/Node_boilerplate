const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Global middleware
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB
mongoose.connect(
  `mongodb+srv://DB-rest:${
    process.env.DB_PASSWORD
  }@rest-4vjej.mongodb.net/test?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);
mongoose.connection.once("open", () => {
  console.log("<< connected to db");
});

//CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//Routes
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

//Errors

//When reaches here it means that did not enter on any of the urls above
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  //Passes this data to the next middleware
  next(error);
});

//Handles any error thrown
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      status: error.status
    }
  });
});

module.exports = app;
