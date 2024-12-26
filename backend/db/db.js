const mongoose = require("mongoose");
const DB = 'mongodb+srv://sanjay:sanjay@database.6967v.mongodb.net/udaan'
mongoose
  .connect(DB)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));
