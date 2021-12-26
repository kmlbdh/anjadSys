const mongoose = require("mongoose");

const db = {};
db.mongoose = mongoose;

db.userModel = require("./model.user");
db.roleModel = require("./model.role");
db.serviceModel = require("./model.service");
db.agentLimitsModel = require("./model.agentLimits");

db.ROLES = ["customer", "agent", "admin"];

module.exports = db;