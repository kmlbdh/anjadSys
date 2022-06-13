const db = require("../../models");
const util = require("util");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const CarType = db.CarType;

const LIMIT = 10;
const SKIP = 0;

const listCarTypeLog = util.debuglog("controller.admin-ListCarType");

module.exports = {
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