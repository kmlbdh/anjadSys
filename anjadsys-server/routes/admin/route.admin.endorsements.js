const endorsementRoute = require("express").Router();

const endorsementValidation = require('../../middleware/admin/middleware.admin.endorsements');
const endorsementController = require("../../controller/admin/controller.admin.endorsements");

endorsementRoute.post("/add",[
  endorsementValidation.add
], endorsementController.add);

endorsementRoute.route('/:endorsementId')
.all(endorsementValidation.endorsementId)
.delete(endorsementController.delete)
.put([
  endorsementValidation.update,
], endorsementController.update);

endorsementRoute.post("/list",[
  endorsementValidation.list,
], endorsementController.list);

module.exports = endorsementRoute;