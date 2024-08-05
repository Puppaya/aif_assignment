const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/Auth");
const {
  addToCart,
  updateCart,
  deleteFromCart,
  viewCart,
  checkout,
} = require("../Controller/cart");

router.post("/cart", authenticate, addToCart);
router.put("/cart", authenticate, updateCart);
router.delete("/cart/:product_id", authenticate, deleteFromCart);
router.get("/cart", authenticate, viewCart);
router.post("/checkout", authenticate, checkout);

module.exports = router;
