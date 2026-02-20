const app = require("./src/app");
require("dotenv").config();
// console.log(process.env.PORT);
app.listen(3000, () => {
  console.log(`Server is runing on port ${process.env.PORT}`);
});
