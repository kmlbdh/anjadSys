const carRoute = require("express").Router();

const carValidation = require('../../middleware/admin/middleware.admin.cars');
const carController = require("../../controller/admin/controller.admin.cars");

carRoute.post("/add",[
  carValidation.add
], carController.add);

carRoute.route('/:carId')
.all(carValidation.carId)
.delete(carController.delete)
.put([
  carValidation.update,
], carController.update);

carRoute.post("/list",[
  carValidation.list,
], carController.list);

module.exports = carRoute;