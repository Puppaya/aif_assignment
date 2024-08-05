const con = require("../config/db");

const checkOwner = async (req, res, next) => {
  const storeId = req.params.store_id;
  const ownerId = req.user.userId;

  try {
    const checkSql = "SELECT Owner_ID FROM stores WHERE Store_ID = ?";
    const [rows] = await con.query(checkSql, [storeId]);
    if (rows.length === 0) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const store = rows[0];
    if (store.Owner_ID != ownerId) {
      return res.status(403).json({
        message: "You do not have permission to update this store",
      });
    }

    next();
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = checkOwner;
