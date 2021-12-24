const jwt = require("jsonwebtoken");
const config = require("../config/config.auth");
const db = require("../model");
const util = require("util");
const customError = require("../classes/customError");
const validation = require("./middleware.validation");
const { schema } = require("../schema/schema.validation");

const User = db.userModel;
const Role = db.roleModel;
const StaticRoles = db.ROLES;
const INTERR = "INT_ERR";

//debugging NOT FOR PRODUCTION
const verifyTokenLog = util.debuglog("middleware.auth-VerifyToken");
const isAdminLog = util.debuglog("middleware.auth-isAdmin");

const verifyToken = (req, res, next) => {
  try{
    let token = req.headers['x-access-token'];
    verifyTokenLog(token);

    if(!token)
      throw new customError("No token provided!", INTERR);
    
    jwt.verify(token, config.secret, (error, decoded) => {
      if(error)
        throw new customError("Unauthorized!", INTERR);
  
        req.refId = decoded.refId;
        next();
    });
  } catch(error){
    verifyTokenLog(error);
    const customErrorVerify = error.code === INTERR ? error.message : "Failed! can't get token!";
    res.status(500).json({message: customErrorVerify});
  }

};

const isAdmin = async (req, res, next) => {
 await checkRole(2, req, res, next);
};

const isAgent = async (req, res, next) => {
  await checkRole(1, req, res, next);
};

const isCustomer = async (req, res, next) => {
  await checkRole(0, req, res, next);
};

const checkRole = async(role, req, res, next) => {
  const roleString = StaticRoles[role];
  try{
    isAdminLog(roleString);
    isAdminLog(req.refId);

    const user = await User.findOne({refId:req.refId}).populate({
      path: "role",
      model: "Role",
      select: {name: 1, _id: 0}
    }).exec();

    isAdminLog(user);

    if(!user || !user.role || !user.role.name || user.role.name !== roleString)
      throw new customError(`Require ${roleString} Role!`, INTERR);
    
    next();
  } catch(error){
    isAdminLog(error);
    const customErrorCheckRole = error.code === INTERR ? error.message : "Failed! can't get role!";
    res.status(500).json({message: customErrorCheckRole});
  }
}

const validateListUsersByRole = validation(schema.listUsersByRole,'body');

module.exports = {verifyToken, isAdmin, isAgent, isCustomer, validateListUsersByRole};