const mongoose = require("mongoose");
const { DB } = require("../constant/constant");
mongoose
  .connect(DB)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));
