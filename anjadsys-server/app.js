require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");

db.sequelize.sync({force: false}).then( () => {
  console.log("Drop and re-sync db");
}).catch(err => {
  console.error(err);
});

const corsOptions = {
  // origin: "https://injad.albayraq.net"
  origin: "http://localhost:3033"
};

const mainRoute = require("./routes/route.main");
const adminRoute = require("./routes/route.admin");
const agentRoute = require("./routes/route.agent");

const app = express();

app
  .use(cors(corsOptions))
  .use(express.json())
  .use(express.urlencoded({extended: true}));

mainRoute(app);
adminRoute(app);
agentRoute(app);

module.exports = app;