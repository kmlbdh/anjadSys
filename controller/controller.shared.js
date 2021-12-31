const config = require("../config/config.auth");
const jwt = require("jsonwebtoken");
const db = require("../model");
const bcrypt = require("bcryptjs");
const AutoID = require("auto-id-builder");
const util = require("util");
const customError = require("../classes/customError");
const errorHandler = require("../classes/errorhandler");

//debugging NOT FOR PRODUCTION 
const createUserLog = util.debuglog("controller.shared-createUser");
const createUniqueRefIdLog = util.debuglog("controller.shared-createUniqueRefId");
const getUserLastRefIdLog = util.debuglog("controller.shared-getLastId");
const loginLog = util.debuglog("controller.shared-login");
const listUsersLog = util.debuglog("controller.shared-listUsers");
const listServicesLog = util.debuglog("controller.shared-listServices");
const listAgentLimitsLog = util.debuglog("controller.shared-listAgentLimits");
const deleteUserLog = util.debuglog("controller.shared-deleteUser");

const User = db.userModel;
const Service = db.serviceModel;
const AgentLimits = db.agentLimitsModel;
// const Role = db.roleModel;
const INTERR = 'INT_ERR';

const shared = {
  createUser: async(res, data) => {
    let {username, nickname, address, password, phone, tel, note, role, agent} = data;
    
    const _id = await createUniqueRefId(role);
    createUserLog(_id);
    password = password ? bcrypt.hashSync(password): undefined;
  
    try{
      const user = new User({
        _id,
        username,
        nickname,
        password,
        address,
        phone,
        tel,
        note,
        role,
        agent
      });
      
      const savedUser = await user.save();
      if(!savedUser)
        throw new customError("Failed! User wasn't registered!", INTERR);

      res.status(200).json({message: "User was registered successfully!", data: savedUser});
    } catch(error) {
      createUserLog(error);
      errorHandler(res, error, "Failed! User wasn't registered!");
    }
  },
  deleteUser: async(res, query) => {
    try{
      const deletedUser = await User.findOneAndDelete(query).exec();
      if(!deletedUser)
        throw new customError("Failed! User isn't removed!", INTERR);

      res.status(200).json({message: "User was removed successfully!", data: deletedUser});
    } catch(error) {
      deleteUserLog(error);
      errorHandler(res, error, "Failed! User isn't removed!");
    }
  },
  listUsers: async(res, query, skip, limit) => {
    try{
      const users = await User.find(query)
      .select({password: 0, __v: 0})
      .skip(skip)
      .limit(limit)
      .exec();
  
      listUsersLog(users);
      res.status(200).json({data: users});
    } catch(error){
      listUsersLog(error);
      errorHandler(res, error, "Failed! Can't get users!");
    }
  },
  listServices: async(res, query, skip, limit) => {
    try{
      const services = await Service.find(query)
      .select({__v: 0})
      .skip(skip)
      .limit(limit)
      .exec();
  
      listServicesLog(services);
      res.status(200).json({data: services});
    } catch(error){
      listServicesLog(error);
      errorHandler(res, error, "Failed! Can't get services!");
    }
  },
  listAgentLimits: async(res, query, skip, limit) => {
    try{
      const agentLimits = await AgentLimits.find(query)
      .select({__v: 0})
      .skip(skip)
      .limit(limit)
      .exec();
  
      listAgentLimitsLog(agentLimits);
      res.status(200).json({data: agentLimits});
    } catch(error){
      listAgentLimitsLog(error);
      errorHandler(res, error, "Failed! Can't get agent limits!");
    }
  },
  login: async(req, res) => {
    try{
      const { username, password } = req.body;
      loginLog(username, password);

      const user = await User.findOne({_id: username}).exec();
      
      if(!user)
        throw new customError("User not found!", INTERR);
  
      loginLog(user);
  
      let validPassword = bcrypt.compareSync(password, user.password);
      if(!validPassword)
        throw new customError("wrong password!", INTERR);
  
      loginLog(validPassword);
  
      const token = jwt.sign({id: user._id}, config.secret, {expiresIn: 86400});
      loginLog(token);
      const userData = {
        id: user._id,
        username: user.username,
        nickname: user.nickname,
        role: user.role,
        accessToken: token 
      };
      res.status(200).json({data: userData});
    } catch(error){
      loginLog(error);
      errorHandler(res, error, "Failed! Can/'t sign in");
    }
  }
};

const createUniqueRefId = async (roleName) => {
  let length = 8;
  let shortPrefix = '';
  switch(roleName){
    case 'admin':
      shortPrefix = 'AD';
      length = 3;
      break;
      
    case 'agent':
      shortPrefix = 'AG';
      length = 6;
      break;

    case 'customer':
      shortPrefix = 'C';
      length = 8;
      break;

    case 'supplier':
      shortPrefix = 'SUP';
      length = 5;
      break;
  }
  const lastUserId = await getUserLastRefId(roleName);
  createUniqueRefIdLog(lastUserId?._id);
  const alphaNumericID = AutoID().newFormat()
    .addPart(true, shortPrefix, 2)
    .addPart(true, '-', 1)
    .addPart(false, 'number', length) 
    .compile();
    
  let ID = alphaNumericID.generateID(lastUserId?._id);
  createUniqueRefIdLog(ID);
  return new Promise(resolve => resolve(ID)); //TODO remove promise
};

const getUserLastRefId = async (roleName) => {
  try{
    getUserLastRefIdLog(roleName);
    const user = await User.findOne({role: roleName}, {}, {sort: {'created_at': -1}})
      .exec();
      getUserLastRefIdLog(user);
      return new Promise(resolve => resolve(user)); //TODO remove promise, wrong way, by default return promise
  } catch(error){
    getUserLastRefIdLog(error);
    errorHandler(res, error, "Failed! No id found!");
  }
};

module.exports = shared;