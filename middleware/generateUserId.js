const con = require("../config/db");

const genUserId = async (req, res, next) => {
  try {
    const [result] = await con.query(
      "SELECT MAX(User_ID) as maxUserId FROM users"
    );

    const maxUserId = result[0].maxUserId;

    const newUserNumber = (parseInt(maxUserId.slice(-4)) || 0) + 1;
    const newUserSuffix = newUserNumber.toString().padStart(4, "0");
    const newUserId = `user${newUserSuffix}`;

    req.genUserId = newUserId;

    next();
  } catch (error) {
    console.error("Error generating user ID:", error);
    res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  genUserId,
};
