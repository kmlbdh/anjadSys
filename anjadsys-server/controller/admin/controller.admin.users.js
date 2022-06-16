const sharedUser = require('../shared/controller.shared.users')
const db = require("../../models");
const util = require("util");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const Role = db.Role;

const INTERR = 'INT_ERR';
const LIMIT = 10;
const SKIP = 0;

const createUserLog = util.debuglog("controller.admin.users-CreateUser");
const listUsersLog = util.debuglog("controller.admin.users-ListUsers");
const updateUserLog = util.debuglog("controller.admin-UpdateUser");

module.exports = {
  create: async (req, res) => {
    try {
      const { roleId } = req.body;
        const role = await Role.findByPk(roleId, {raw: true});
  
      if(!role || !role.name)
        throw new customError("Failed! Role isn't exist!", INTERR);
  
      req.body.roleName = role.name;
      await sharedUser.add(res, req.body);
    } catch(error) {
      createUserLog(error);
      errorHandler(res, error, "Failed! User wasn't registered!");
    }
  },
  delete: async(req, res) => {
    const { userID } = req.params;
    query = { where: { id: userID }};
  
    await sharedUser.deleteUser(res, query);
  },
  update: async(req, res) => {
    try {
      let { userID } = req.params;
  
      if(!userID) 
        throw new customError("Failed! user data isn't provided!", INTERR);
  
      const query = { where: {id: userID} };
      const updateData = {};
      Object.entries(req.body).forEach((val, ind) => {
        updateUserLog(val[0], val[1])
        if(val && val.length > 0 && val[0] !== 'id')
          updateData[val[0]] = val[1];
      });

      updateUserLog(updateData, query);
      await sharedUser.update(res, query, updateData);
    } catch(error) {
      updateUserLog(error);
      errorHandler(res, error, "Failed! User wasn't registered!");
    }
  },
  list: async(req, res) => {
    try {
      listUsersLog(req.body.agentID);
      let query = {where: {
        [Op.or]:[]
      }};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
      if (req.body.role) query.where = ({'$Role.name$': req.body.role});
      if (req.body.agentID) query.where.agentId = req.body.agentID;
      if (req.body.regionID) query.where.regionId = req.body.regionID;
      if (req.body.identityNum) query.where.identityNum = req.body.identityNum;
  
      if (req.body.companyName && req.body.username){
        query.where[Op.or] = [
          {companyName:{[Op.substring]: req.body.companyName}},
          {username:{[Op.substring]: req.body.username}}
        ];
      } else {
        if (req.body.companyName && req.body.username)
          query.where.companyName = {[Op.substring]: req.body.companyName};
        if (req.body.username)
          query.where.username = {[Op.substring]: req.body.username};
      }
   
      if (req.body.userID) query.where.id = req.body.userID;
  
      if(query.where[Op.or] && query.where[Op.or].length === 0) delete query.where[Op.or];
      // if(query.where[Op.and].length === 0) delete query.where[Op.and];

      listUsersLog(query);
      await sharedUser.list(res, query, skip, limit, req.body.agent);
    } catch(error) {
      listUsersLog(error);
      errorHandler(res, error, "Failed! cant get Users!");
    }
  },
  lightList: async(req, res) => {
    try {
      let query = {where: {
        [Op.or]: [],
        blocked: false
      }};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;

      if (req.body.role) query.where = {['$Role.name$']: req.body.role};

      if (req.body.regionID) query.where.regionId = req.body.regionID;
  
      if (req.body.companyName && req.body.username){
        query.where[Op.or] = [
          {companyName:{[Op.substring]: req.body.companyName}},
          {username:{[Op.substring]: req.body.username}}
        ];
      } else {
        if (req.body.companyName && req.body.username)
          query.where.companyName = {[Op.substring]: req.body.companyName};
        if (req.body.username)
          query.where.username = {[Op.substring]: req.body.username};
      }

      if (req.body.userID) query.where.id = req.body.userID;
      if (req.body.identityNum) query.where.identityNum = req.body.identityNum;

      if(query.where[Op.or] && query.where[Op.or].length === 0) delete query.where[Op.or];

      listUsersLog(query);
      await sharedUser.lightList(res, query, skip, limit);

    } catch(error) {
      listUsersLog(error);
      errorHandler(res, error, "Failed! cant get Users!");
    }
  },
};