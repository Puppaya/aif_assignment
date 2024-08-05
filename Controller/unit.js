const con = require("../config/db");

exports.list = async (req, res) => {
  const [unitList] = await con.query("SELECT * FROM units");
  res.send(unitList);
};

exports.read = async (req, res) => {
  const [unitName] = await con.query(
    "SELECT * FROM units WHERE unit_ID = ?",
    req.params.unit_ID
  );
  res.send(unitName);
};

exports.create = async (req, res) => {
  try {
    const { unit_name } = req.body;

    const [Insert] = await con.query(
      "INSERT INTO units (unit_Name) VALUES (?)",
      [unit_name]
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
  const { unit_name } = req.body;

  try {
    const [update] = await con.query(
      "UPDATE units SET unit_Name = ? WHERE unit_ID = ?",
      [unit_name, req.params.unit_id]
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
    "DELETE FROM units WHERE unit_ID = ?",
    req.params.unit_id
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
