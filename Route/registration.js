const express = require("express");
const router = express.Router();

const { register } = require("../Controller/registration");

router.post("/register", register);
module.exports = router;
