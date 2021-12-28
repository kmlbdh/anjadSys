const mongoose = require("mongoose");

const db = {};
db.mongoose = mongoose;

db.userModel = require("./model.user");
db.roleModel = require("./model.role");
db.serviceModel = require("./model.service");
db.agentLimitsModel = require("./model.agentLimits");
db.supplierPartsModel = require("./model.supplierParts");

db.ROLES = ["customer", "agent", "admin", "supplier"];

module.exports = db;