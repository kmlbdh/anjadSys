const accidentRoute = require('express').Router();

const accidentValidation = require("../../middleware/agent/middleware.agent.accidents");
const accidentController  = require('../../controller/agent/controller.agent.accidents');

accidentRoute.post("/add",[
  accidentValidation.add
], accidentController.add);

accidentRoute.post("/list",[
  accidentValidation.list,
], accidentController.list); 

module.exports = accidentRoute;