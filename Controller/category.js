const con = require("../config/db");

exports.list = async (req, res) => {
  const [cateList] = await con.query("SELECT * FROM categorys");
  res.send(cateList);
};

exports.read = async (req, res) => {
  const [cateName] = await con.query(
    "SELECT * FROM categorys WHERE cate_ID = ?",
    req.params.cate_ID
  );
  res.send(cateName);
};

exports.create = async (req, res) => {
  try {
    const { cate_name } = req.body;

    const [Insert] = await con.query(
      "INSERT INTO categorys (cate_Name) VALUES (?)",
      [cate_name]
    );

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
  const { cate_name } = req.body;

  try {
    const [update] = await con.query(
      "UPDATE categorys SET cate_Name = ? WHERE cate_ID = ?",
      [cate_name, req.params.cate_id]
    );
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
  const [result] = await con.query(
    "DELETE FROM categorys WHERE cate_ID = ?",
    req.params.cate_id
  );
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
