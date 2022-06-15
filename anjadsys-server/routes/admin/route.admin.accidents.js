const accidentRoute = require("express").Router();

const { accidentValidation } = require("../../middleware/middleware.admin");
const accidentController = require("../../controller/admin/controller.admin.accidents");

accidentRoute.post("/add",[
  accidentValidation.add
], accidentController.add);

accidentRoute.route('/:accidentId')
.all(accidentValidation.accidentId)
.delete(accidentController.delete)
.put([
  accidentValidation.update,
], accidentController.update);

accidentRoute.post("/list",[
  accidentValidation.list,
], accidentController.list); 

module.exports = accidentRoute;