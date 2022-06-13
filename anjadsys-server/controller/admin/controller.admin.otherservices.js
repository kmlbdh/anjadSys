const db = require("../../models");
const util = require("util");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const addOtherServiceLog = util.debuglog("controller.admin-AddOtherService");
const deleteOtherServiceLog = util.debuglog("controller.admin-DeleteOtherService");
const listOtherServiceLog = util.debuglog("controller.admin-ListOtherService");
const updateOtherServiceLog = util.debuglog("controller.admin-UpdateOtherService");

const OtherServices = db.OtherServices;
const User = db.User;
const Region = db.Region;
const Car = db.Car;
const CarType = db.CarType;
const CarModel = db.CarModel;
const InsurancePolicy = db.InsurancePolicy;

const INTERR = 'INT_ERR';
const LIMIT = 10;
const SKIP = 0;

module.exports = {

  add: async(req, res) => {
    try {

      let { 
        name,
        serviceKind,
        fileStatus,
        descCustomer,
        description,
        cost,
        insurancePolicyId,
        customerId 
      } = req.body;

      const otherService = OtherServices.build({
        name,
        serviceKind,
        fileStatus,
        descCustomer,
        description,
        cost,
        customerId,
        insurancePolicyId
      });

      const savedOtherService = await otherService.save();

      if(!savedOtherService)
        throw new customError("Failed! Other Service wasn't added!", INTERR);
  
      res.status(200).json({message: "Other Service was added successfully!", data: savedOtherService.toJSON()});
    } catch(error) {
      addOtherServiceLog(error);
      errorHandler(res, error, "Failed! Other Service wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      let { otherServiceID } = req.params;

      if(!otherServiceID || !Number(otherServiceID))
        throw new customError("Failed! Other Service data isn't provided!", INTERR);
      
      const deletedOtherService = await OtherServices.destroy({ where: { id: otherServiceID }});

      if(!deletedOtherService)
        throw new customError("Failed! Other Service isn't deleted!", INTERR);
  
      res.status(200).json({message: "Other Service was added successfully!", data: deletedOtherService});
    } catch(error) {
      deleteOtherServiceLog(error);
      errorHandler(res, error, "Failed! Other Service isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let { otherServiceID } = req.params;
  
      if(!otherServiceID || !Number(otherServiceID))
        throw new customError("Failed! Other Service data isn't provided!", INTERR);
  
      const query = { where: {id: otherServiceID} };
      const updateData = {};

      Object.entries(req.body).forEach((val, ind) => {
        updateOtherServiceLog(val[0], val[1])
        if(val && val.length > 0 && val[0] !== 'otherServiceID')
          updateData[val[0]] = val[1];
      });

      updateOtherServiceLog(updateData);
      const updatedOtherService = await OtherServices.update(updateData, query);
      updateOtherServiceLog(updatedOtherService);

      if(updatedOtherService[0] !== 1) 
        throw new customError("Failed! Other Service isn't updated!", INTERR);
  
      res.status(200).json({message: "Other Service was updated successfully!", data: updatedOtherService[0]});
    } catch(error) {
      updateOtherServiceLog(error);
      errorHandler(res, error, "Failed! Other Service wasn't registered!");
    }
  },
  list: async(req, res) => {
    try{
      let query = {where:{}};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
  
      if (req.body.fileStatus) 
        query.where.fileStatus = {[Op.substring]: req.body.fileStatus}; 

      if (req.body.customerID) 
        query.where.customerId = req.body.customerID;
        
      if (req.body.insurancePolicyID) 
        query.where.insurancePolicyId = req.body.insurancePolicyID;
      
      if (req.body.otherServiceID)
        query.where.id = req.body.otherServiceID;

      if (req.body.startDate && req.body.endDate){
        query.where.createdAt = {
          [Op.between]: [
            new Date(req.body.startDate).setHours(0, 0, 0, 0),
            new Date(req.body.endDate).setHours(23, 59 , 59, 59)
          ]
        };
      } else if(req.body.startDate){
        query.where.createdAt = {
          [Op.gte]: new Date(req.body.startDate).setHours(0, 0, 0, 0),
        };
      } else if(req.body.endDate){
        query.where.createdAt = {
          [Op.lte]: new Date(req.body.endDate).setHours(23, 59 , 59, 59),
        };
      }
      
      listOtherServiceLog(query);
      query = { ...query, 
        order: [['id', 'ASC' ]],
        include: [
          {
            model: User,
            as: 'Customer',
            required: true,
            attributes: ['id', 'username', 'identityNum', 'address', 'jawwal1', 'jawwal2'],
            include:[
              {
                model: Region,
                required: true,
                attributes: ['name']
              }
            ]
          },
          {
            model: InsurancePolicy,
            required: true,
            include:[
              {
                model: Car,
                required: true,
                include: [
                  {
                    model: CarType,
                    required: true
                  },
                  {
                    model: CarModel,
                    required: true
                  }
                ]
              }
            ]
          }
        ],
        offset: skip,
        limit: limit,
      };
      const { count , rows: otherServices} = await OtherServices.findAndCountAll(query);
  
      listOtherServiceLog(otherServices);
      res.status(200).json({data: otherServices, total: count});
  
    } catch(error) {
      listOtherServiceLog(error);
      errorHandler(res, error, "Failed! can't get other services!");
    }
  },
};