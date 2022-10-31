const carTypeRoute = require("express").Router();

const carTypeValidation = require('../../middleware/admin/middleware.admin.cartypes');
const carTypeController = require("../../controller/admin/controller.admin.cartypes");

carTypeRoute.post("/add",[
  carTypeValidation.add
], carTypeController.add);

carTypeRoute.route('/:carTypeId')
.all(carTypeValidation.carTypeId)
.delete(carTypeController.delete)
.put([
  carTypeValidation.update
], carTypeController.update);

carTypeRoute.post("/list",[
  carTypeValidation.list,
], carTypeController.list);

module.exports = carTypeRoute;