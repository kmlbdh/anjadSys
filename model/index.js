const mongoose = require("mongoose");

const db = {};
db.mongoose = mongoose;

db.userModel = require("./model.user");
db.roleModel = require("./model.role");

db.ROLES = ["customer", "agent", "admin"];

module.exports = db;