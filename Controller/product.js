const con = require("../config/db");

exports.list = async (req, res) => {
  let sql =
    "CALL SP_Product('select', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)";
  const [ProductInfo] = await con.query(sql);
  res.send(ProductInfo[0]);
};

exports.read = async (req, res) => {
  const id = req.params.product_id;
  let sql =
    "CALL SP_Product('select_by_id', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL)";
  const [SingleProduct] = await con.query(sql, [id]);
  res.send(SingleProduct[0][0]);
};

exports.create = async (req, res) => {
  try {
    const { name, p_detail, p_price, p_stock, u_id, c_id } = req.body;
    const st_id = req.params.store_id;
    const sql = "CALL SP_Product('insert', NULL, ?, ?, ?, ?, ?, ?, ?)";
    const [Insert] = await con.query(sql, [
      st_id,
      name,
      p_detail,
      p_price,
      p_stock,
      u_id,
      c_id,
    ]);

    if (Insert && Insert.affectedRows) {
      res.json({
        code: 10,
        message: "Success!",
      });
    } else {
      res.json({
        code: 12,
        message: "Failed!",
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

exports.update = async (req, res) => {
  const id = req.params.product_id;
  const st_id = req.params.store_id;
  const { name, p_detail, p_price, p_stock, u_id, c_id } = req.body;

  try {
    let sql = "CALL SP_Product('update', ?, ?, ?, ?, ?, ?, ?, ?)";

    const [update] = await con.query(sql, [
      id,
      st_id,
      name,
      p_detail,
      p_price,
      p_stock,
      u_id,
      c_id,
    ]);
    if (update && update.affectedRows) {
      res.json({
        message: "Success!",
      });
    } else {
      res.json({
        message: "Failed!",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.del = async (req, res) => {
  let sql =
    "CALL SP_Product('delete', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL)";
  const id = req.params.product_id;
  const [result] = await con.query(sql, id);
  if (result && result.affectedRows) {
    res.json({
      message: "Success!",
    });
  } else {
    res.json({
      message: "Failed!",
    });
  }
};
