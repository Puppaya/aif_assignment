const express = require("express");
const router = express.Router();

const { list, read, create, update, del } = require("../Controller/unit");
const { authenticate } = require("../middleware/Auth");
const checkOwner = require("../middleware/checkOwner");

router.get("/unit", authenticate, list);
router.get("/unit/:unit_id", authenticate, read);
router.post("/unit", authenticate, checkOwner, create);
router.put("/unit/:unit_id", authenticate, checkOwner, update);
router.delete("/unit/:unit_id", authenticate, checkOwner, del);

module.exports = router;
