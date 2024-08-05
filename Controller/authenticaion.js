const con = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { username, pass } = req.body;
    const sql = "CALL SP_User('login', NULL, ?, NULL, NULL, NULL, NULL)";
    const [userRows] = await con.query(sql, [username]);

    if (userRows[0].length === 1) {
      const user = userRows[0][0];

      const isPasswordMatch = await bcrypt.compare(pass, user.Password);

      if (isPasswordMatch) {
        const token = jwt.sign({ userId: user.User_ID }, user.secret_key, {
          expiresIn: "1h",
          algorithm: "HS256",
        });

        res.json({
          code: 10,
          message: "Login successful",
          user: {
            id: user.User_ID,
            name: user.Username,
            email: user.Email,
          },
          token,
        });
      } else {
        res.json({
          code: 12,
          message: "Incorrect password",
        });
      }
    } else {
      res.json({
        code: 11,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
};
