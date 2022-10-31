
const db = require("../../models");
const util = require("util");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");

const User = db.User;
const Role = db.Role;
const Accident = db.Accident;
const InsurancePolicy = db.InsurancePolicy;
const Region = db.Region;
const Endorsement = db.Endorsement;

const listStatisticsLog = util.debuglog("controller.admin-ListStatistics");
const listRegionsLog = util.debuglog("controller.admin-ListRegions");
const listRegionsAndRolesLog = util.debuglog("controller.admin-ListRegionsAndRoles");

module.exports = {
  listRegions: async(req, res) => {
    try {
      const regions = await Region.findAll();
  
      if(!regions) 
        throw new customError("Failed! can't get regions!");

      res.status(200).json({
        message: "Regions were reterived successfully!",
        data: regions
      });   
    } catch(error){
      listRegionsLog(error);
      errorHandler(res, error, "Failed! can't get data!!");
    }
  },
  statistics: async(req, res) => {
    try {
      const agents = await User.count({ where: {roleId: 2}});
      const customers = await User.count({ where: {roleId: 3}});
      const suppliers = await User.count({ where: {roleId: 4}});
      const insurancePolicies = await InsurancePolicy.count();
      const accidents = await Accident.count();
      const endorsements = await Endorsement.count();
  
      if(agents == null ||
          customers == null ||
          suppliers == null ||
          insurancePolicies == null ||
          accidents == null ||
          endorsements == null) 
        throw new customError("Failed! can't get Statistics!");

      res.status(200).json({
        message: "Statistics were reterived successfully!",
        data: {
          agents,
          customers,
          suppliers,
          insurancePolicies,
          accidents,
          endorsements
        }
      });   
    } catch(error){
      listStatisticsLog(error);
      errorHandler(res, error, "Failed! can't get data!!");
    }
  },
  getRegionsAndRoles: async(req, res) => {
    try {
      const roles = await Role.findAll();
      const regions = await Region.findAll();
  
      if(!regions || !roles) 
        throw new customError("Failed! can't get data!");

      res.status(200).json({
        message: "Regions and Roles were reterived successfully!",
        data: {roles, regions}
      });   
    } catch(err){
      listRegionsAndRolesLog(error);
      errorHandler(res, error, "Failed! can't get data!!");
    }
  },

}

