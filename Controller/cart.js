const con = require("../config/db");

exports.addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.userId;

  try {
    let sql = "CALL SP_ManageCart('add', ?, ?, ?)";
    await con.query(sql, [user_id, product_id, quantity]);
    res.json({ message: "Product added to cart" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.user.userId;

  try {
    let sql = "CALL SP_ManageCart('update', ?, ?, ?)";
    await con.query(sql, [user_id, product_id, quantity]);
    res.json({ message: "Cart updated" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteFromCart = async (req, res) => {
  const product_id = req.params.product_id;
  const user_id = req.user.userId;

  try {
    let sql = "CALL SP_ManageCart('delete', ?, ?, NULL)";
    await con.query(sql, [user_id, product_id]);
    res.json({ message: "Product removed from cart" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.viewCart = async (req, res) => {
  const user_id = req.user.userId;
  try {
    let sql = "CALL SP_ManageCart('view', ?, NULL, NULL)";
    const [rows] = await con.query(sql, [user_id]);
    res.json(rows[0][0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.checkout = async (req, res) => {
  const user_id = req.user.userId;
  const { payment_method } = req.body;

  try {
    let sql = "CALL SP_Checkout(?, ?)";
    await con.query(sql, [user_id, payment_method]);
    res.json({ message: "Checkout successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
