const express = require("express");
const router = express.Router();

const { list, read, update, del, create } = require("../Controller/store");
const { authenticate } = require("../middleware/Auth");
const checkOwner = require("../middleware/checkOwner");

router.get("/store", authenticate, list);
router.get("/store/:name", authenticate, read);
router.post("/store", authenticate, create);
router.put("/store/:store_id/:owner_id", authenticate, checkOwner, update);
router.delete("/store/:store_id/:owner_id", authenticate, checkOwner, del);

module.exports = router;
