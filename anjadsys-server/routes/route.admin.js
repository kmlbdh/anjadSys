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

const {
  userActions,
  serviceActions,
  otherServiceActions,
  agentActions,
  sharedActions,
  accidentActions,
  carTypeActions,
  carModelActions,
  carActions,
  regionActions,
  insurancePolicyActions,
  accountActions,
  statisticsActions,
  SupplierActions
} = require("../controller/controller.admin");
const express = require("express");

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
  ], userActions.create);

  userRoute.route("/:userID")
    .all(userValidation.userID)
    .delete(userActions.delete)
    .put([
      userValidation.update,
    ], userActions.update);

  userRoute.route("/list*")
  .all(userValidation.list);

  userRoute.post("/list", userActions.list);
  
  userRoute.post("/list-light", userActions.lightList);

  Router.use('/user', userRoute);

/** #################### SUPPLIER  ########################*/

  supplierRoute.post("/create",[
    supplierValidation.create,
    checkDuplicateUsernameOrNickname
  ], userActions.create);

  supplierRoute.post("/account",[
    supplierValidation.listAccount,
  ], SupplierActions.list);

  Router.use('/supplier', supplierRoute);
  
/** #################### SERVICE  ########################*/

  serviceRoute.post("/add",[
    serviceValidation.add,
  ], serviceActions.add);

  serviceRoute.post("/list",[
    serviceValidation.list,
  ], serviceActions.list);
  
  serviceRoute.route("/:serviceID")
    .all(serviceValidation.serviceID)
    .delete(serviceActions.delete)
    .put([
      serviceValidation.update,
    ], serviceActions.update);
  
  Router.use('/service', serviceRoute);

/** #################### OTHER SERVICE  ########################*/

otherServiceRoute.post("/add",[
    otherServiceValidation.add,
  ], otherServiceActions.add);

  otherServiceRoute.post("/list",[
    otherServiceValidation.list,
  ], otherServiceActions.list);

  otherServiceRoute.route('/:otherServiceID')
  .all(otherServiceValidation.otherServiceID)
  .delete(otherServiceActions.delete)
  .put([
    otherServiceValidation.update,
  ], otherServiceActions.update);

  Router.use('/other-service', otherServiceRoute);

/** #################### AGENT LIMITS  ########################*/

agentLimitsRoute.post("/add",[
    agentLimitsValidation.add,
  ], agentActions.add);

  agentLimitsRoute.delete("/:agentLimitID",[
    agentLimitsValidation.agentLimitID,
  ], agentActions.delete);

  agentLimitsRoute.post("/list",[
    agentLimitsValidation.list,
  ], agentActions.list);

  Router.use('/agent-limits', agentLimitsRoute);

/** #################### GENERAL API ########################*/

  generalRoute.get("/regions-roles", sharedActions.getRegionsAndRoles);

  generalRoute.get("/regions", regionActions.list);

  generalRoute.get("/statistics", statisticsActions.list);

  Router.use('/general', generalRoute);

/** #################### CAR TYPE ########################*/
  
  carTypeRoute.post("/add",[
    carTypeValidation.add
  ], carTypeActions.add);

  carTypeRoute.route('/:carTypeId')
  .all(carTypeValidation.carTypeId)
  .delete(carTypeActions.delete)
  .put([
    carTypeValidation.update
  ], carTypeActions.update);

  carTypeRoute.post("/list",[
    carTypeValidation.list,
  ], carTypeActions.list);

  Router.use('/car-type', carTypeRoute);

/** #################### CAR MODEL ########################*/

  carModelRoute.post("/add",[
    carModelValidation.add
  ], carModelActions.add);

  carModelRoute.route("/:carModelId")
  .all(carModelValidation.carModelId)
  .delete(carModelActions.delete)
  .put([
    carModelValidation.update,
  ], carModelActions.update);

  carModelRoute.post("/list",[
    carModelValidation.list,
  ], carModelActions.list);

  Router.use('/car-model', carModelRoute);

  /** #################### CAR ########################*/
  carRoute.post("/add",[
    carValidation.add
  ], carActions.add);

  carRoute.route('/:carId')
  .all(carValidation.carId)
  .delete(carActions.delete)
  .put([
    carValidation.update,
  ], carActions.update);

  carRoute.post("/list",[
    carValidation.list,
  ], carActions.list);

  Router.use('/car', carRoute);

  /** #################### ACCIDENT ########################*/
  accidentRoute.post("/add",[
    accidentValidation.add
  ], accidentActions.add);

  accidentRoute.route('/:accidentId')
  .all(accidentValidation.accidentId)
  .delete(accidentActions.delete)
  .put([
    accidentValidation.update,
  ], accidentActions.update);

  accidentRoute.post("/list",[
    accidentValidation.list,
  ], accidentActions.list); 

  Router.use('/accident', accidentRoute);
  
  /** #################### INSURANCE POLICY ########################*/
  insurancePolicyRoute.post("/add",[
    insurancePolicyValidation.add
  ], insurancePolicyActions.add);

  insurancePolicyRoute.route('/:insurancePolicyId')
  .all(insurancePolicyValidation.insurancePolicyId)
  .delete(insurancePolicyActions.delete)
  .put([
    insurancePolicyValidation.update,
  ], insurancePolicyActions.update);

  insurancePolicyRoute.post("/list",[
    insurancePolicyValidation.list,
  ], insurancePolicyActions.list);

  Router.use('/insurance-policy', insurancePolicyRoute);

/** #################### ACCOUNT  ########################*/

  accountRoute.post("/list",[
    accountValidation.list,
  ], accountActions.list);

  Router.use('/account', accountRoute);


module.exports = Router;