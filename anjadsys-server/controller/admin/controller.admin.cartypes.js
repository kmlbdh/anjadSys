const db = require("../../models");
const util = require("util");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const CarType = db.CarType;

const INTERR = 'INT_ERR';
const LIMIT = 10;
const SKIP = 0;

const updateCarTypeLog = util.debuglog("controller.admin-UpdateCarType");
const addCarTypeLog = util.debuglog("controller.admin-AddCarType");
const deleteCarTypeLog = util.debuglog("controller.admin-DeleteCarType");
const listCarTypeLog = util.debuglog("controller.admin-ListCarType");

module.exports = {
  add: async(req, res) => {
    try {
      let {
        name
      } = req.body;

      const carType = CarType.build({
        name
      }, { isNewRecord: true });

      const savedCarType = await carType.save();

      if(!savedCarType)
        throw new customError("Failed! Car Type wasn't added!", INTERR);
  
      res.status(200).json({
        message: "Car Type was added successfully!",
        data: savedCarType.toJSON()
      });
    } catch(error) {
      addCarTypeLog(error);
      errorHandler(res, error, "Failed! Car Type wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      let { carTypeId } = req.params;

      if(!carTypeId || !Number(carTypeId))
        throw new customError("Failed! Car Type data isn't provided!", INTERR);

      const deletedCarType = await CarType.destroy({ where: { id: carTypeId } });

      if(!deletedCarType)
        throw new customError("Failed! Car Type isn't deleted!", INTERR);
  
      res.status(200).json({
        message: "Car Type was deleted successfully!",
        data: deletedCarType
      });
    } catch(error) {
      deleteCarTypeLog(error);
      errorHandler(res, error, "Failed! Car Type isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let { name } = req.body;
      let { carTypeId } = req.params;
  
      if(!carTypeId || !Number(carTypeId))
        throw new customError("Failed! Car Type data isn't provided!", INTERR);

      const query = { where: {id: carTypeId} };
      const updateData = { name: name};
      updateCarTypeLog(updateData, query);

      const updatedCarType = await CarType.update(updateData, query);
      updateCarTypeLog(updatedCarType[0]);

      if(updatedCarType[0]!== 1) 
        throw new customError("Failed! Car Type isn't updated!", INTERR);

      res.status(200).json({message: "Car Type was updated successfully!", data: updatedCarType[0]});

    } catch(error) {
      updateCarTypeLog(error);
      errorHandler(res, error, "Failed! Car Type wasn't registered!");
    }
  },
  list: async(req, res) => {
    try{
      let query = { where: {} };
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
        
      if (req.body.name) 
        query.where.name = {[Op.substring]: req.body.name}
      
      if (req.body.carTypeId)
        query.where.id = req.body.carTypeId; 

      query = { ...query, 
        order: [['id', 'ASC' ]],
        offset: skip,
        limit: limit,
      };

      const { count, rows: CarTypes } = await CarType.findAndCountAll(query);
  
      listCarTypeLog(query);
      res.status(200).json({data: CarTypes, total: count});
    } catch(error) {
      listCarTypeLog(error);
      errorHandler(res, error, "Failed! can't get Car Types!");
    }
  },
};
