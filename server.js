require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/db");
// console.log(process.env.MONGO_URI);
connectToDB();
app.listen(3000, () => {
  console.log(`Server is runing on port ${process.env.PORT}`);
});
