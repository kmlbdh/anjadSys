const { 
  verifyLoggedIn,
  userValidation,
  serviceValidation,
  carTypeValidation,
  carModelValidation,
  carValidation,
  accidentValidation,
  insurancePolicyValidation,
  accountValidation,
  notBlockedUser,
 } = require("../middleware/middleware.agent");

const { 
  auth,
  checkDuplicateUsernameOrNickname 
} = require("../middleware/middleware.shared");

const { agentController } = require('../controller');

const express = require('express');

Router = express.Router();
generalRoute = express.Router();
userRoute = express.Router();
serviceRoute = express.Router();
carTypeRoute = express.Router();
carModelRoute = express.Router();
carRoute = express.Router();
accidentRoute = express.Router();
insurancePolicyRoute = express.Router();
accountRoute = express.Router();

  Router.all("*", [auth.verifyToken, auth.isAgent]);
/** #################### USER  ########################*/

  userRoute.post("/create",[
    userValidation.create,
    checkDuplicateUsernameOrNickname
  ], agentController.userActions.create);

  userRoute.post("/list",[
    userValidation.list,
  ], agentController.userActions.list);

  userRoute.post("/list-active",[
    userValidation.list,
    notBlockedUser
  ], agentController.userActions.list);

  userRoute.post("/list-light",[
    userValidation.list,
  ], agentController.userActions.lightList);

  userRoute.post("/list-suppliers",[
    userValidation.listSuppliers,
  ], agentController.userActions.listSuppliers);

  Router.use("/user", userRoute);
    
/** #################### SERVICE  ########################*/

  serviceRoute.post("/list",[
    serviceValidation.list,
  ], agentController.serviceActions.list);

  Router.use("/service", serviceRoute);

/** #################### GENERAL API ########################*/

  generalRoute.get("/regions", agentController.sharedActions.listRegions);
  generalRoute.get("/statistics", agentController.sharedActions.statistics);
  Router.use("/general", generalRoute);

/** #################### CAR TYPE ########################*/

  carTypeRoute.post("/list",[
    carTypeValidation.list,
  ], agentController.carTypeActions.list);

  Router.use("/car-type", carTypeRoute);

/** #################### CAR MODEL ########################*/

  carModelRoute.post("/list",[
    carModelValidation.list,
  ], agentController.carModelActions.list);

  Router.use("/car-model", carModelRoute);

/** #################### CAR ########################*/
  carRoute.post("/add",[
    carValidation.add
  ], agentController.carActions.add);

  carRoute.post("/list",[
    carValidation.list,
  ], agentController.carActions.list);

  Router.use("/car", carRoute);

/** #################### ACCIDENT ########################*/
  accidentRoute.post("/add",[
    accidentValidation.add
  ], agentController.accidentActions.add);

  accidentRoute.post("/list",[
    accidentValidation.list,
  ], agentController.accidentActions.list); 

  Router.use("/accident", accidentRoute);

/** #################### INSURANCE POLICY ########################*/
  insurancePolicyRoute.post("/add",[
    insurancePolicyValidation.add
  ], agentController.insurancePolicyActions.add);

  insurancePolicyRoute.post("/list",[
    insurancePolicyValidation.list,
  ], agentController.insurancePolicyActions.list);

  Router.use("/insurance-policy", insurancePolicyRoute);

/** #################### ACCOUNT  ########################*/
  accountRoute.post("/list",[
    accountValidation.list,
  ], agentController.accountActions.list);

  Router.use("/account", accountRoute);
// };

module.exports = Router;