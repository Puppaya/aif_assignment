const con = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.register = async (req, res) => {
  try {
    const { username, pass, email, role } = req.body;

    const checkUser = "CALL SP_User('login', NULL, ?, NULL, NULL, NULL, NULL)";
    const [existingUserRows] = await con.query(checkUser, [username]);

    if (existingUserRows[0].length > 0) {
      return res.status(400).json({
        code: 14,
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    const secretKey = crypto.randomBytes(64).toString("hex");

    const insertUserSql = "CALL SP_User(?, ?, ?, ?, ?, ?, ?)";
    await con.query(insertUserSql, [
      "insert",
      0,
      username,
      hashedPassword,
      email,
      role,
      secretKey,
    ]);

    res.status(201).json({
      code: 10,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
};
