const con = require("../config/db");

exports.history = async (req, res) => {
  const userId = req.user.userId;
  try {
    const [orders] = await con.query("CALL SP_GetUserOrders(?)", [userId]);
    res.json(orders[0][0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.transaction = async (req, res) => {
  const ownerId = req.user.userId;

  try {
    const [transactions] = await con.query("CALL SP_GetStoreTransactions(?)", [
      ownerId,
    ]);
    res.json(transactions[0][0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
