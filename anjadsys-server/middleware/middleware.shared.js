const jwt = require("jsonwebtoken");
const db = require("../models");
const util = require("util");
const customError = require("../classes/customError");
const errorHandler = require("../classes/errorhandler");
const validation = require("./middleware.validation");
const { login } = require("../schema/schema.validation.shared");
const { Op } = require("sequelize");

const User = db.User;
const Role = db.Role;

const INTERR = "INT_ERR";

//debugging NOT FOR PRODUCTION
const verifyTokenLog = util.debuglog("middleware.auth-VerifyToken");
const isAdminLog = util.debuglog("middleware.auth-isAdmin");
const isAgentLog = util.debuglog("middleware.auth-isAgent");
const isUserTypeLog = util.debuglog("middleware.auth-isUserType");
const isCustomerLog = util.debuglog("middleware.auth-isCustomer");
const checkRoleLog = util.debuglog("middleware.checkRole");
const checkDuplicateLog = util.debuglog("middleware.auth-checkDuplicateUsernameOrNickname");

const isUserType = (roleName) => {
  return async (req, res, next) => {
    let errorCode;
    try{
      const done = await checkRole(roleName, req, res);
      isUserTypeLog(done);
      if(done) next();
      else{
        errorCode = 401;
        throw new customError("Unauthorized!", INTERR);
      } 
    } catch(error){
      isUserTypeLog(error);
      errorHandler(res, error, `Failed! can't get ${roleName} privilege!`, errorCode);
    }
  }
}

const auth = {
  isAdmin: isUserType('admin'),
  isAgent: isUserType('agent'),
  isCustomer: isUserType('customer'),
  verifyToken: (req, res, next) => {
    let errorCode;
    try{
      let token = req.headers['x-access-token'];
      verifyTokenLog(token);
  
      if(!token){
        errorCode = 401;
        throw new customError("No token provided!", INTERR);
      }
      
      jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
        if(error){
          errorCode = 401;
          throw new customError("Unauthorized!", INTERR);
        }
      
        req.id = decoded.id;
        next();
      });
    } catch(error){
      verifyTokenLog(error);
      errorHandler(res, error, "Failed! can't get token!", errorCode);
    }
  }
};

const checkDuplicateUsernameOrNickname = async(req, res, next) => {
  try{
    const query = {where: {[Op.or]: []}};
    if(req.body.username) query.where[Op.or].push({username: req.body.username});
    if(req.body.companyName) query.where[Op.or].push({companyName: req.body.companyName});
    
    checkDuplicateLog(query);

    let fieldName = null;
    const user = await User.findOne(query);

    checkDuplicateLog(user);

    if(user){
      fieldName = user.username === req.body.username ? 'username' : 'companyName';
      return res.status(400).json({message: `${fieldName} is exist!`});
    }

    next();
  } catch(error){
    errorHandler(res, error, "Failed! can't verify user existance", 400);
  }
};

const verifyLogin =  validation(login, 'body');

const checkRole = async(roleName, req, res) => {
  try{
    const user = await User.findOne({
      where: { id: req.id },
      include: [{
        model: Role,
        required: true,
        where: { name: {
          [Op.substring]: roleName
        }}
      }]
    });

    if(!user || !user.Role || user.Role.name !== roleName)
      throw new customError(`Require ${roleName} Role!`, INTERR);
    
    const { id, username, companyName, Role: {name: role} } = user;
 
    if(roleName === 'admin'){
      req.admin = { id, username, companyName, role};
    } else if(roleName === 'agent'){
      req.agent = { id, username, companyName, role};
    }

    return (req.admin || req.agent);//TODO wrong behaviour, fail on customer check 
  } catch(error){
    checkRoleLog(error);
    errorHandler(res, error, "Failed! can't get role!");
  }
};

module.exports = { auth, verifyLogin, checkDuplicateUsernameOrNickname };