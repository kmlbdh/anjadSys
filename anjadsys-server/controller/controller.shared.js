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
const updateUserLog = util.debuglog("controller.shared-updateUser");
const createUniqueRefIdLog = util.debuglog("controller.shared-createUniqueRefId");
const getUserLastIdLog = util.debuglog("controller.shared-getLastId");
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
const NUM_OF_DOCS_RETRUN = 30;
const DEFAULT_SKIP = 0;
const IdPrefixByRole = {
  admin: {
    shortPrefix: 'AD',
    length: 3
  },
  agent: {
    shortPrefix: 'AG',
    length: 6
  },
  customer: {
    shortPrefix: 'C',
    length: 8
  },
  supplier: {
    shortPrefix: 'SUP',
    length: 5
  }
};

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
  updateUser: async(res, query, update) => {
    try{ 
      const {value: updatedUser, lastErrorObject} = await User.findOneAndUpdate(query,
        update, {
        rawResult: true,
        new: true
      })
      .select({password: 0, __v:0})
      .lean()
      .exec();
      
      if(!lastErrorObject.updatedExisting || lastErrorObject.n !== 1) 
        throw new customError("Failed! user isn't updated!", INTERR);

      updateUserLog(updatedUser);
      res.status(200).json({message: "User was updated successfully!", data: updatedUser});
    } catch(error) {
      updateUserLog(error);
      errorHandler(res, error, "Failed! User wasn't updated!");
    }
  },
  deleteUser: async(res, query) => {
    try{
      const deletedUser = await User.findOneAndDelete(query)
      .select({password: 0, __v:0})
      .lean()
      .exec();
      if(!deletedUser)
        throw new customError("Failed! User isn't removed!", INTERR);

      res.status(200).json({message: "User was removed successfully!", data: deletedUser});
    } catch(error) {
      deleteUserLog(error);
      errorHandler(res, error, "Failed! User isn't removed!");
    }
  },
  listUsers: async(res, query, skip = DEFAULT_SKIP, limit = NUM_OF_DOCS_RETRUN) => {
    try{
      const users = await User.find(query, {}, {$sort: {'_id': 1}})
      .select({password: 0, __v: 0})
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  
      listUsersLog(users);
      res.status(200).json({data: users});
    } catch(error){
      listUsersLog(error);
      errorHandler(res, error, "Failed! Can't get users!");
    }
  },
  listServices: async(res, query, skip = DEFAULT_SKIP, limit = NUM_OF_DOCS_RETRUN) => {
    try{
      const services = await Service.find(query)
      .select({__v: 0})
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  
      listServicesLog(services);
      res.status(200).json({data: services});
    } catch(error){
      listServicesLog(error);
      errorHandler(res, error, "Failed! Can't get services!");
    }
  },
  listAgentLimits: async(res, query, skip = DEFAULT_SKIP, limit = NUM_OF_DOCS_RETRUN) => {
    try{
      const agentLimits = await AgentLimits.find(query)
      .select({__v: 0})
      .skip(skip)
      .limit(limit)
      .lean()
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
      const { username: loginUsername, password } = req.body;
      loginLog(loginUsername, password);

      const user = await User.findOne({_id: loginUsername}).lean().exec();
      
      if(!user)
        throw new customError("User not found!", INTERR);
  
      loginLog(user);
  
      let validPassword = bcrypt.compareSync(password, user.password);
      if(!validPassword)
        throw new customError("wrong password!", INTERR);
  
      loginLog(validPassword);

      const {_id, username, nickname, role} = user;
      const accessToken = jwt.sign({id: _id}, config.secret, {expiresIn: 86400});

      loginLog(accessToken);

      const userData = {
        _id,
        username,
        nickname,
        role,
        accessToken
      };
      res.status(200).json({data: userData});
    } catch(error){
      loginLog(error);
      errorHandler(res, error, "Failed! Can/'t sign in");
    }
  }
};

const createUniqueRefId = async (roleName) => {
  const prefix = IdPrefixByRole[roleName];
  if(!prefix)
    throw new customError('Failed! can\'t get prefix', INTERR);

  const lastUserId = await getUserLastId(roleName);
  createUniqueRefIdLog(lastUserId);
  const alphaNumericID = AutoID()
    .newFormat()
    .addPart(true, prefix.shortPrefix, 2)
    .addPart(true, '-', 1)
    .addPart(false, 'number', prefix.length)
    .compile();
    
  const ID = alphaNumericID.generateID(lastUserId);
  createUniqueRefIdLog(ID);
  return ID;
};

const getUserLastId = async (roleName) => {
  try{
    getUserLastIdLog(roleName);
    const user = await User.findOne({role: roleName}, {}, {sort: {'created_at': -1}})
      .select({_id: 1})
      .lean()
      .exec();
      getUserLastIdLog(user);
      return user?._id;
  } catch(error){
    getUserLastIdLog(error);
    errorHandler(res, error, "Failed! can't get last user!");
  }
};

module.exports = shared;