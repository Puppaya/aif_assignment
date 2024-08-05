const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/Auth");
const { history, transaction } = require("../Controller/report");
const checkOwner = require("../middleware/checkOwner");

router.get("/history", authenticate, history);
router.get("/trans", authenticate, checkOwner, transaction);

module.exports = router;
