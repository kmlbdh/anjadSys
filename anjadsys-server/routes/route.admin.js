const express = require("express");

const { 
  userValidation,
  serviceValidation,
  otherServiceValidation,
  agentLimitsValidation,
  carTypeValidation,
  carModelValidation,
  carValidation,
  accidentValidation,
  insurancePolicyValidation,
  accountValidation,
  supplierValidation,
 } = require("../middleware/middleware.admin");

const { 
  auth,
  checkDuplicateUsernameOrNickname 
} = require("../middleware/middleware.shared");

const { adminController } = require("../controller");

Router = express.Router();
generalRoute = express.Router();
userRoute = express.Router();
supplierRoute = express.Router();
serviceRoute = express.Router();
agentLimitsRoute = express.Router();
carRoute = express.Router();
carTypeRoute = express.Router();
carModelRoute = express.Router();
accidentRoute = express.Router();
insurancePolicyRoute = express.Router();
otherServiceRoute = express.Router();
accountRoute = express.Router();

Router.all('*', [
  auth.verifyToken,
  auth.isAdmin
]);
  
/** #################### USER  ########################*/

  userRoute.post("/create",[
    userValidation.create,
    checkDuplicateUsernameOrNickname
  ], adminController.userActions.create);

  userRoute.route("/:userID")
    .all(userValidation.userID)
    .delete(adminController.userActions.delete)
    .put([
      userValidation.update,
    ], adminController.userActions.update);

  userRoute.route("/list*")
  .all(userValidation.list);

  userRoute.post("/list", adminController.userActions.list);
  
  userRoute.post("/list-light", adminController.userActions.lightList);

  Router.use('/user', userRoute);

/** #################### SUPPLIER  ########################*/

  supplierRoute.post("/create",[
    supplierValidation.create,
    checkDuplicateUsernameOrNickname
  ], adminController.userActions.create);

  supplierRoute.post("/account",[
    supplierValidation.listAccount,
  ], adminController.SupplierActions.list);

  Router.use('/supplier', supplierRoute);
  
/** #################### SERVICE  ########################*/

  serviceRoute.post("/add",[
    serviceValidation.add,
  ], adminController.serviceActions.add);

  serviceRoute.post("/list",[
    serviceValidation.list,
  ], adminController.serviceActions.list);
  
  serviceRoute.route("/:serviceID")
    .all(serviceValidation.serviceID)
    .delete(adminController.serviceActions.delete)
    .put([
      serviceValidation.update,
    ], adminController.serviceActions.update);
  
  Router.use('/service', serviceRoute);

/** #################### OTHER SERVICE  ########################*/

otherServiceRoute.post("/add",[
    otherServiceValidation.add,
  ], adminController.otherServiceActions.add);

  otherServiceRoute.post("/list",[
    otherServiceValidation.list,
  ], adminController.otherServiceActions.list);

  otherServiceRoute.route('/:otherServiceID')
  .all(otherServiceValidation.otherServiceID)
  .delete(adminController.otherServiceActions.delete)
  .put([
    otherServiceValidation.update,
  ], adminController.otherServiceActions.update);

  Router.use('/other-service', otherServiceRoute);

/** #################### AGENT LIMITS  ########################*/

agentLimitsRoute.post("/add",[
    agentLimitsValidation.add,
  ], adminController.agentActions.add);

  agentLimitsRoute.delete("/:agentLimitID",[
    agentLimitsValidation.agentLimitID,
  ], adminController.agentActions.delete);

  agentLimitsRoute.post("/list",[
    agentLimitsValidation.list,
  ], adminController.agentActions.list);

  Router.use('/agent-limits', agentLimitsRoute);

/** #################### GENERAL API ########################*/

  generalRoute.get("/regions-roles", adminController.sharedActions.getRegionsAndRoles);

  generalRoute.get("/regions", adminController.sharedActions.listRegions);

  generalRoute.get("/statistics", adminController.sharedActions.statistics);

  Router.use('/general', generalRoute);

/** #################### CAR TYPE ########################*/
  
  carTypeRoute.post("/add",[
    carTypeValidation.add
  ], adminController.carTypeActions.add);

  carTypeRoute.route('/:carTypeId')
  .all(carTypeValidation.carTypeId)
  .delete(adminController.carTypeActions.delete)
  .put([
    carTypeValidation.update
  ], adminController.carTypeActions.update);

  carTypeRoute.post("/list",[
    carTypeValidation.list,
  ], adminController.carTypeActions.list);

  Router.use('/car-type', carTypeRoute);

/** #################### CAR MODEL ########################*/

  carModelRoute.post("/add",[
    carModelValidation.add
  ], adminController.carModelActions.add);

  carModelRoute.route("/:carModelId")
  .all(carModelValidation.carModelId)
  .delete(adminController.carModelActions.delete)
  .put([
    carModelValidation.update,
  ], adminController.carModelActions.update);

  carModelRoute.post("/list",[
    carModelValidation.list,
  ], adminController.carModelActions.list);

  Router.use('/car-model', carModelRoute);

  /** #################### CAR ########################*/
  carRoute.post("/add",[
    carValidation.add
  ], adminController.carActions.add);

  carRoute.route('/:carId')
  .all(carValidation.carId)
  .delete(adminController.carActions.delete)
  .put([
    carValidation.update,
  ], adminController.carActions.update);

  carRoute.post("/list",[
    carValidation.list,
  ], adminController.carActions.list);

  Router.use('/car', carRoute);

  /** #################### ACCIDENT ########################*/
  accidentRoute.post("/add",[
    accidentValidation.add
  ], adminController.accidentActions.add);

  accidentRoute.route('/:accidentId')
  .all(accidentValidation.accidentId)
  .delete(adminController.accidentActions.delete)
  .put([
    accidentValidation.update,
  ], adminController.accidentActions.update);

  accidentRoute.post("/list",[
    accidentValidation.list,
  ], adminController.accidentActions.list); 

  Router.use('/accident', accidentRoute);
  
  /** #################### INSURANCE POLICY ########################*/
  insurancePolicyRoute.post("/add",[
    insurancePolicyValidation.add
  ], adminController.insurancePolicyActions.add);

  insurancePolicyRoute.route('/:insurancePolicyId')
  .all(insurancePolicyValidation.insurancePolicyId)
  .delete(adminController.insurancePolicyActions.delete)
  .put([
    insurancePolicyValidation.update,
  ], adminController.insurancePolicyActions.update);

  insurancePolicyRoute.post("/list",[
    insurancePolicyValidation.list,
  ], adminController.insurancePolicyActions.list);

  Router.use('/insurance-policy', insurancePolicyRoute);

/** #################### ACCOUNT  ########################*/

  accountRoute.post("/list",[
    accountValidation.list,
  ], adminController.accountActions.list);

  Router.use('/account', accountRoute);


module.exports = Router;