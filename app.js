require("dotenv").config();
require("./config/config.db").connect();
const express = require("express");
const authRoute = require("./routes/route.sign");
const adminRoute = require("./routes/route.admin");

const app = express();

app
  .use(express.json())
  .use(express.urlencoded({extended: true}));

authRoute(app);
adminRoute(app);

module.exports = app;