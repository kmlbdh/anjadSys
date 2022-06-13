const db = require("../../models");
const util = require("util");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;


const CarModel = db.CarModel;
const CarType = db.CarType;

const INTERR = 'INT_ERR';
const LIMIT = 10;
const SKIP = 0;

const updateCarModelLog = util.debuglog("controller.admin-UpdateCarModel");
const addCarModelLog = util.debuglog("controller.admin-AddCarModel");
const deleteCarModelLog = util.debuglog("controller.admin-DeleteCarModel");
const listCarModelLog = util.debuglog("controller.admin-ListCarModel");

module.exports = {
  add: async(req, res) => {
    try {
      let {
        carTypeId,
        name
      } = req.body;

      const carModel = CarModel.build({
        name,
        carTypeId
      }, { isNewRecord: true });

      const savedCarModel = await carModel.save();

      if(!savedCarModel)
        throw new customError("Failed! Car Model wasn't added!", INTERR);
  
      res.status(200).json({
        message: "Car Model was added successfully!",
        data: savedCarModel.toJSON()
      });
    } catch(error) {
      addCarModelLog(error);
      errorHandler(res, error, "Failed! Car Model wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      let { carModelId } = req.params;

      if(!carModelId || !Number(carModelId))
        throw new customError("Failed! Car Model data isn't provided!", INTERR);

      const deletedCarModel = await CarModel.destroy({ where: { id: carModelId } });

      if(!deletedCarModel)
        throw new customError("Failed! Car Model isn't deleted!", INTERR);
  
      res.status(200).json({
        message: "Car Model was deleted successfully!",
        data: deletedCarModel
      });
    } catch(error) {
      deleteCarModelLog(error);
      errorHandler(res, error, "Failed! Car Model isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let { name, carTypeId } = req.body;
      const { carModelId } = req.params;

      if(!carModelId || !Number(carModelId))
        throw new customError("Failed! Car Model data isn't provided!", INTERR);
  
      const query = { where: {id: carModelId} };
      const updateData = {};

      if(carTypeId) updateData['carTypeId'] = carTypeId;
      if(name) updateData['name'] = name;

      updateCarModelLog(updateData, query);

      const updatedCarModel = await CarModel.update(updateData, query);
      updateCarModelLog(updatedCarModel[0]);

      if(updatedCarModel[0]!== 1) 
        throw new customError("Failed! Car Model isn't updated!", INTERR);

      res.status(200).json({message: "Car Model was updated successfully!", data: updatedCarModel[0]});

    } catch(error) {
      updateCarModelLog(error);
      errorHandler(res, error, "Failed! Car Model wasn't registered!");
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
        query.where.carTypeId = req.body.carTypeId;   

      if (req.body.carModelId)
        query.where.id = req.body.carModelId; 

      query = { ...query, 
        order: [['id', 'ASC' ]],
        include: [{
          model: CarType,
          required: true,
        }],
        attributes: { exclude: ['carTypeId'] },
        offset: skip,
        limit: limit,
      };

      const { count, rows: carModels } = await CarModel.findAndCountAll(query);
  
      listCarModelLog(query);
      res.status(200).json({data: carModels, total: count});
    } catch(error) {
      listCarModelLog(error);
      errorHandler(res, error, "Failed! can't get Car Models!");
    }
  },
};