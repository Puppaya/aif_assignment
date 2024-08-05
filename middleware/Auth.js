const con = require("../config/db");
const jwt = require("jsonwebtoken");

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const decodedToken = jwt.decode(token);

    if (!decodedToken || !decodedToken.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decodedToken.userId;
    const checkKeySql = "SELECT secret_key FROM Users WHERE User_ID = ?";
    const [keyRows] = await con.query(checkKeySql, [userId]);

    if (keyRows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const secretKey = keyRows[0].secret_key;

    jwt.verify(token, secretKey, (verifyError, verifiedToken) => {
      if (verifyError) {
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = verifiedToken;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
