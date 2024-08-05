const express = require("express");
const app = express();
const port = 3031;
const { readdirSync } = require("fs");
const fileUpload = require("express-fileupload");

app.use(require("cors")({ origin: "*" }));
app.use(fileUpload());
app.use(express.json());

readdirSync("./Route").map((r) => app.use("/api", require("./Route/" + r)));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
