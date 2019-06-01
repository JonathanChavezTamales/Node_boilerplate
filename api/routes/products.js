const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    date = parseInt(new Date() / 1000);
    cb(null, date + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
});

router.get("/", (req, res, next) => {
  Product.find({})
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
});

router.get("/:id", (req, res, next) => {
  Product.findById(req.params.id)
    .then(data => {
      if (data) {
        res.status(200).json({
          data
        });
      } else {
        res.status(404).json({
          message: "Not found"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
});

router.post("/", upload.single("image"), (req, res, next) => {
  const product = Product({
    name: req.body.name,
    price: req.body.price,
    image: req.file.path
  });

  product
    .save()
    .then(data => {
      console.log("product created");
      res.status(201).json(data);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.delete("/:id", (req, res, next) => {
  Product.deleteOne({ _id: req.params.id })
    .then(data => {
      res.status(204).json(data);
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Product.deleteOne({ _id: req.params.id })
    .then(data => {
      res.status(204).json(data);
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
});

router.patch("/:id", (req, res, next) => {
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Product.updateOne({ _id: req.params.id }, { $set: updateOps })
    .exec()
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
});

module.exports = router;
