const carRoute = require('express').Router();

const carValidation = require("../../middleware/agent/middleware.agent.cars");
const carController  = require('../../controller/agent/controller.agent.cars');

carRoute.post("/add",[
  carValidation.add
], carController.add);

carRoute.post("/list",[
  carValidation.list,
], carController.list);

module.exports = carRoute;