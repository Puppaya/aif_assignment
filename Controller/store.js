const con = require("../config/db");
const bcrypt = require("bcrypt");

exports.list = async (req, res) => {
  let sql = "CALL SP_Store('select', NULL, NULL, NULL, NULL, NULL)";
  const [StoreInfo] = await con.query(sql);
  res.send(StoreInfo[0]);
};

exports.read = async (req, res) => {
  const id = req.params.user_id;
  let sql = "CALL SP_Store('select_by_name', NULL, ?, NULL, NULL, NULL)";
  const [SingleStore] = await con.query(sql, [id]);
  res.send(SingleStore[0][0]);
};

exports.create = async (req, res) => {
  try {
    const { name, owner, tel, detail } = req.body;
    const sql = "CALL SP_Store('insert', NULL, ?, ?, ?, ?)";
    const [Insert] = await con.query(sql, [name, owner, tel, detail]);

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
  const storeId = req.params.store_id;
  const ownerId = req.user.userId;
  const { name, tel, detail } = req.body;
  try {
    let sql = "CALL SP_Store('update', ?, ?, ?, ?, ?)";
    const [update] = await con.query(sql, [
      storeId,
      name,
      ownerId,
      tel,
      detail,
    ]);

    if (update.affectedRows > 0) {
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
  const storeId = req.params.store_id;
  try {
    let sql = "CALL SP_Store('delete', ?, NULL, NULL, NULL, NULL)";
    const [result] = await con.query(sql, storeId);
    if (result && result.affectedRows) {
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
      message: error.message,
    });
  }
};
