const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  Order.find()
    .populate("product")
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/", (req, res, next) => {
  const order = Order({
    product_id: req.body.product_id,
    quantity: req.body.quantity
  });
  order
    .save()
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res, next) => {
  res.status(200).json({});
});

module.exports = router;
