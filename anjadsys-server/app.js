require("dotenv").config();
const express = require("express");
const db = require("./models");
const {main, agent, admin} = require('./routes');

db.sequelize.sync({force: false}).then( () => {
  console.log("Drop and re-sync db");
}).catch(err => {
  console.error(err);
});

const app = express();

app
  .use(express.json())
  .use(express.urlencoded({extended: true}));

  app.use("/api/login", main);
  app.use("/api/agent", agent);
  app.use("/api/admin", admin);

module.exports = app;