require("dotenv").config();
const express = require("express");
const db = require("./models");
const { adminRouter, agentRouter, loginRouter } = require('./routes');

db.sequelize.sync({force: false}).then( () => {
  console.log("Drop and re-sync db");
}).catch(err => {
  console.error(err);
});

const app = express();

app
  .use(express.json())
  .use(express.urlencoded({extended: true}));

  app.use("/api/login", loginRouter);
  app.use("/api/agent", agentRouter);
  app.use("/api/admin", adminRouter);

module.exports = app;