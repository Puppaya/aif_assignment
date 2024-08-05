const express = require("express");
const router = express.Router();

const { list, read, create, update, del } = require("../Controller/category");
const { authenticate } = require("../middleware/Auth");
const checkOwner = require("../middleware/checkOwner");

router.get("/cate", authenticate, list);
router.get("/cate/:cate_id", authenticate, read);
router.post("/cate", authenticate, checkOwner, create);
router.put("/cate/:cate_id", authenticate, checkOwner, update);
router.delete("/cate/:cate_id", authenticate, checkOwner, del);

module.exports = router;
