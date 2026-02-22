require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/db");


// *DB connection 
connectToDB();


app.listen(process.env.PORT, () => {
  console.log(`Server is runing on port ${process.env.PORT}`);
});
