const express = require("express");
const router = express.Router();

const { list, read, update, del } = require("../Controller/user");
const { authenticate } = require("../middleware/Auth");

router.get("/user", authenticate, list);
router.get("/user/:user_id", authenticate, read);
router.put("/user/:user_id", authenticate, update);
router.delete("/user/:user_id", authenticate, del);

module.exports = router;
