const endorsementRoute = require("express").Router();

const endorsementValidation = require('../../middleware/agent/middleware.agent.endorsements');
const endorsementController = require("../../controller/agent/controller.agent.endorsements");

endorsementRoute.post("/add",[
  endorsementValidation.add
], endorsementController.add);

endorsementRoute.post("/list",[
  endorsementValidation.list,
], endorsementController.list);

module.exports = endorsementRoute;