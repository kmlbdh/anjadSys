const sharedRoute = require("express").Router();

const sharedController = require("../../controller/admin/controller.admin.shared");

sharedRoute.get("/regions-roles", sharedController.getRegionsAndRoles);

sharedRoute.get("/regions", sharedController.listRegions);

sharedRoute.get("/statistics", sharedController.statistics);

module.exports = sharedRoute;