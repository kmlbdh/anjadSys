
const sharedService  = require('../shared/controller.shared.services');
const db = require("../../models");
const util = require("util");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const addServiceLog = util.debuglog("controller.admin-AddService");
const deleteServiceLog = util.debuglog("controller.admin-DeleteService");
const updateServiceLog = util.debuglog("controller.admin-UpdateService");
const listServicesLog = util.debuglog("controller.admin-ListServices");

const Service = db.Service;

const INTERR = 'INT_ERR';
const LIMIT = 10;
const SKIP = 0;


module.exports = {

  add: async(req, res) => {
    try {
      let {name, coverageDays, cost, supplierPercentage, packageType, note} = req.body;

      const service = Service.build({
        name,
        coverageDays,
        cost,
        note,
        supplierPercentage,
        packageType
      });

      const savedService = await service.save();

      if(!savedService)
        throw new customError("Failed! service wasn't added!", INTERR);
  
      res.status(200).json({message: "Service was added successfully!", data: savedService.toJSON()});
    } catch(error) {
      addServiceLog(error);
      errorHandler(res, error, "Failed! service wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      let { serviceID } = req.params;
      
      if(!serviceID || !Number(serviceID)) 
        throw new customError("Failed! service data isn't provided!", INTERR);
      
      const deletedService = await Service.destroy({ where: { id: serviceID }});

      if(!deletedService)
        throw new customError("Failed! Service isn't deleted!", INTERR);
  
      res.status(200).json({message: "Service was added successfully!", data: deletedService});
    } catch(error) {
      deleteServiceLog(error);
      errorHandler(res, error, "Failed! service isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let { serviceID } = req.params;
  
      if(!serviceID || !Number(serviceID)) 
        throw new customError("Failed! service data isn't provided!", INTERR);
  
      const query = { where: {id: serviceID} };
      const updateData = {};

      Object.entries(req.body).forEach((val, ind) => {
        updateServiceLog(val[0], val[1])
        if(val && val.length > 0 && val[0] !== 'serviceID')
          updateData[val[0]] = val[1];
      });

      updateServiceLog(updateData);
      const updatedService = await Service.update(updateData, query);
      updateServiceLog(updatedService);

      if(updatedService[0]!== 1) 
        throw new customError("Failed! service isn't updated!", INTERR);
  
      res.status(200).json({message: "Service was updated successfully!", data: updatedService[0]});
    } catch(error) {
      updateServiceLog(error);
      errorHandler(res, error, "Failed! Service wasn't registered!");
    }
  },
  list: async(req, res) => {
    try{
      let query = {where:{}};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
  
      if (req.body.serviceName) 
        query.where.name = {[Op.substring]: req.body.serviceName};
      
      if (req.body.serviceID)
        query.where.id = req.body.serviceID;
      
      //TODO need to be automated!! 0 is westbank, 1 jeru and 2 is for jer & west bank
      if(req.body.packageType === 0 || req.body.packageType === 1){
        query.where.packageType = {[Op.or]:[req.body.packageType, 2]};
      }
      
      listServicesLog(query);
      await sharedService.list(res, query, skip, limit);
  
    } catch(error) {
      listServicesLog(error);
      errorHandler(res, error, "Failed! can't get services!");
    }
  },
};