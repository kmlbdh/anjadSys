require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const {main, agent, admin} = require('./routes');

db.sequelize.sync({force: false}).then( () => {
  console.log("Drop and re-sync db");
}).catch(err => {
  console.error(err);
});

const corsOptions = {
  // origin: "https://injad.albayraq.net"
  origin: "http://localhost:3033"
};

const app = express();

app
  .use(cors(corsOptions))
  .use(express.json())
  .use(express.urlencoded({extended: true}));

  app.use("/api/login", main);
  app.use("/api/agent", agent);
  app.use("/api/admin", admin);

module.exports = app;