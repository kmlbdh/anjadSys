const db = require("../../models");
const util = require("util");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;


const CarModel = db.CarModel;
const CarType = db.CarType;

const INTERR = 'INT_ERR';
const LIMIT = 10;
const SKIP = 0;

const listCarModelLog = util.debuglog("controller.agent-ListCarModel");

module.exports = {
  list: async(req, res) => {
    try{
      let query = { where: {} };
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
        
      if (req.body.name) 
        query.where.name = {[Op.substring]: req.body.name};

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