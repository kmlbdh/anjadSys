
const sharedService  = require('../shared/controller.shared.services');
const util = require("util");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const listServicesLog = util.debuglog("controller.agent-ListServices");

const LIMIT = 10;
const SKIP = 0;


module.exports = {
  list: async(req, res) => {
    try{
      let query = {where:{}};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
  
      if (req.body.serviceName) 
        query.where.name = {[Op.substring]: req.body.serviceName};
      
      if (req.body.serviceID)
        query.where.id = req.body.serviceID;
      
      listServicesLog(query);
     
      await sharedService.list(res, query, skip, limit);
  
    } catch(error) {
      listServicesLog(error);
      errorHandler(res, error, "Failed! can't get services!");
    }
  },
};