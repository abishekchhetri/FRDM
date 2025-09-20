const path = require("path");
const dotenv = require("dotenv");
const app = require("./app");
dotenv.config({ path: path.join(__dirname, "config.env") });

//server is started
app.listen(process.env.PORT, () => {
  console.log("server started successfully!");
});
