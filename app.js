require("dotenv").config();
require("./config/config.db").connect();
const express = require("express");
const authRoute = require("./routes/route.auth");

const app = express();

app
  .use(express.json())
  .use(express.urlencoded({extended: true}));

authRoute(app);

module.exports = app;