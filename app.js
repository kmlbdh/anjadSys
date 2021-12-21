require("dotenv").config();
require("./config/config.db").connect();
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

module.exports = app;