const con = require("../config/db");
const bcrypt = require("bcrypt");

const { genUserId } = require("../middleware/generateUserId");

const util = require("util");
const hashAsync = util.promisify(bcrypt.hash);

exports.list = async (req, res) => {
  let sql = "CALL SP_User('select', NULL, NULL, NULL, NULL, NULL, NULL)";
  const [UserInfo] = await con.query(sql);
  res.send(UserInfo[0]);
};

exports.read = async (req, res) => {
  const id = req.params.user_id;
  let sql = "CALL SP_User('select_by_id', ?, NULL, NULL, NULL, NULL, NULL)";
  const [SingleUser] = await con.query(sql, [id]);
  res.send(SingleUser[0][0]);
};

exports.update = async (req, res) => {
  const id = req.params.user_id;
  const { username, pass, email, role } = req.body;

  try {
    const hash = await hashAsync(pass, 10);

    let sql = "CALL SP_User('update', ?, ?, ?, ?, ?, NULL)";

    const [update] = await con.query(sql, [id, username, hash, email, role]);
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
  let sql = "CALL SP_User('delete', ?, NULL, NULL, NULL, NULL, NULL)";
  const id = req.params.user_id;
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
