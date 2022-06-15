const serviceRoute = require('express').Router();

const { serviceValidation } = require("../../middleware/middleware.agent");
const serviceController  = require('../../controller/agent/controller.agent.services');

serviceRoute.post("/list",[
  serviceValidation.list,
], serviceController.list);

module.exports = serviceRoute;