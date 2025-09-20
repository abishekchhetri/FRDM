const path = require("path");
const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");
dotenv.config({ path: path.join(__dirname, "config.env") });

//if we want production just form the package stuff
if (process.argv[2] === "--production") process.env.NODE_ENV = "production";

const db = process.env.DB.replace("<db_password>", process.env.DB_PASSWORD);
mongoose.connect(db).then(() => console.log("mongodb connected!"));

//server is started
app.listen(process.env.PORT, () => {
  console.log("server started successfully!");
});
