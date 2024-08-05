const express = require("express");
const router = express.Router();

const { list, read, update, del, create } = require("../Controller/product");
const { authenticate } = require("../middleware/Auth");
const checkOwner = require("../middleware/checkOwner");

router.get("/product", authenticate, list);
router.get("/product/:product_id", authenticate, read);
router.post("/product/:store_id", authenticate, checkOwner, create);
router.put("/product/:store_id/:product_id", authenticate, checkOwner, update);
router.delete("/product/:store_id/:product_id", authenticate, checkOwner, del);

module.exports = router;
