const sharedUser = require('../shared/controller.shared.users')
const db = require("../../models");
const util = require("util");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const User = db.User;
const Role = db.Role;

const INTERR = 'INT_ERR';
const LIMIT = 10;
const SKIP = 0;

const createUserLog = util.debuglog("controller.agent.users-CreateUser");
const listUsersLog = util.debuglog("controller.agent.users-ListUsers");
const lisSuppliersLog = util.debuglog("controller.agent.users-ListSuppliers");
const lightListUsersLog = util.debuglog("controller.agent-LightListUsers");

module.exports = {
  create: async (req, res) => {
    try {
      const roleName = 'customer';
      const role = await Role.findOne({
        where:{name:{[Op.substring]: roleName}}
      });
  
      if(!role || !role.name)
        throw new customError("Failed! Role isn't exist!", INTERR);
  
      req.body.roleName = role.name;
      req.body.roleId = role.id;
      req.body.agentId = req.agent.id;
      await sharedUser.add(res, req.body);
    } catch(error) {
      createUserLog(error);
      errorHandler(res, error, "Failed! User wasn't registered!");
    }
  },
  lightList: async(req, res) => {
    try {
      let query = {where: {
        '$Role.name$': 'customer',
        agentId: req.agent.id,
        blocked: false,
      }};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;

      if (req.body.regionID) query.where.regionId = req.body.regionID;
  
      if (req.body.username) query.where.username = {[Op.substring]: req.body.username};

      if (req.body.userID) query.where.id = req.body.userID;

      lightListUsersLog(query);
      await sharedUser.lightList(res, query, skip, limit);
    } catch(error) {
      lightListUsersLog(error);
      errorHandler(res, error, "Failed! cant get Users!");
    }
  },
  list: async(req, res) => {
    try {
      listUsersLog(req.body.agentID);
      let query = { where: {
        '$Role.name$': 'customer',
        agentId: req.agent.id,
        [Op.or]:[]
      }};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;

      if (req.body.regionID) query.where.regionId = req.body.regionID;

      if (req.body.blocked !== null && req.body.blocked !== undefined ) query.where.blocked = req.body.blocked;
  
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
      await sharedUser.list(res, query, skip, limit, req.body.agent);
    } catch(error) {
      listUsersLog(error);
      errorHandler(res, error, "Failed! cant get Users!");
    }
  },
  listSuppliers: async(req, res) => {
    try {
      let query = {where: {
        '$Role.name$': 'supplier',
        blocked: false,
        [Op.or]:[]
      }};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;

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
  
      if(query.where[Op.or] && query.where[Op.or].length === 0) delete query.where[Op.or];

      lisSuppliersLog(query);
      await sharedUser.list(res, query, skip, limit);
    } catch(error) {
      lisSuppliersLog(error);
      errorHandler(res, error, "Failed! cant get Suppliers!");
    }
  }
};
