const sharedRoute = require('express').Router();

const sharedController  = require('../../controller/agent/controller.agent.shared');

sharedRoute.get("/regions", sharedController.listRegions);
sharedRoute.get("/statistics", sharedController.statistics);

module.exports = sharedRoute;