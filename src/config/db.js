const mongoose = require("mongoose");

function connectToDB() {
//   console.log("form db file", process.env.MONGO_URI);
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Server is connected To DB");
    })
    .catch((err) => {
      console.log("Error is connection to DB",err);
      process.exit(1);
    });
}
module.exports = connectToDB;
