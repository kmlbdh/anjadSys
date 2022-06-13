
const db = require("../../models");
const util = require("util");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");

const User = db.User;
const Accident = db.Accident;
const InsurancePolicy = db.InsurancePolicy;
const Region = db.Region;

const listStatisticsLog = util.debuglog("controller.admin-ListStatistics");
const listRegionsLog = util.debuglog("controller.admin-ListRegions");

module.exports = {
  listRegions:  async(req, res) => {
    try {
      const regions = await Region.findAll();
  
      if(!regions) 
        throw new customError("Failed! can't get regions!");

      listRegionsLog(regions);
      res.status(200).json({
        message: "Regions were reterived successfully!",
        data: regions
      });   
    } catch(err){
      listRegionsLog(err);
      errorHandler(res, error, "Failed! can't get data!!");
    }
  },
  statistics: async(req, res) => {
      try {
        const customers = await User.count({ where: {roleId: 3, agentId: req.agent.id}});
        const insurancePolicies = await InsurancePolicy.count({ where: {agentId: req.agent.id}});
        const accidents = await Accident.count({ where: { agentId: req.agent.id}});
    
        if(customers == null || insurancePolicies == null || accidents == null) 
          throw new customError("Failed! can't get Statistics!");
  
        res.status(200).json({
          message: "Statistics were reterived successfully!",
          data: {
            customers,
            insurancePolicies,
            accidents
          }
        });   
      } catch(error){
        listStatisticsLog(error);
        errorHandler(res, error, "Failed! can't get data!!");
      }
    },
}

