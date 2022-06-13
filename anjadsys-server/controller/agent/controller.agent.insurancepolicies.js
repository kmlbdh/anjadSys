const db = require("../../models");
const util = require("util");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const User = db.User;
const Role = db.Role;
const Service = db.Service;
const Account = db.Account;
const Car = db.Car;
const CarModel = db.CarModel;
const CarType = db.CarType;
const InsurancePolicy = db.InsurancePolicy;
const Region = db.Region;
const ServicePolicy = db.ServicePolicy;
const sequelizeDB = db.sequelize;

const INTERR = 'INT_ERR';
const LIMIT = 10;
const SKIP = 0;

const addInsurancePolicyLog = util.debuglog("controller.admin-AddInsurancePolicy");
const listInsurancePolicyLog = util.debuglog("controller.admin-ListInsurancePolicy");

module.exports = {
  add: async(req, res) => {
    try {
      let {
        totalPrice,
        note,
        expireDate,
        customerId,
        carId,
        services
      } = req.body;

      let availableLimit = await checkLimits(req);

      if(!availableLimit)
        throw new customError("لا يوجد رصيد كافي لاجراء هذه العملية!", INTERR);

     await sequelizeDB.transaction( async t => {

        const insurancePolicy = InsurancePolicy.build({
          totalPrice,
          expireDate,
          note,
          customerId,
          agentId: req.agent.id,
          carId,
        }, { isNewRecord: true, transaction: t });

        const savedInsurancePolicy = await insurancePolicy.save();

        if(!savedInsurancePolicy || !insurancePolicy.id)
          throw new customError("Failed! Insurance Policy wasn't added!", INTERR);

        let servicePolicyObj = [];

        services.forEach((service, i) => {
          servicePolicyObj[i] = {
            cost: service.cost,
            additionalDays: service.additionalDays,
            note: service.note,
            serviceId: service.serviceId,
            supplierId: service.supplierId,
            insurancePolicyId: insurancePolicy.id,
            supplierPercentage: service.supplierPercentage
          };
        });

        const servicesPolicy = await ServicePolicy.bulkCreate(servicePolicyObj,
          { transaction: t});
        
        addInsurancePolicyLog(servicesPolicy);

        if(servicesPolicy.length === 0)
          throw new customError("Failed! Services Policy wasn't added!", INTERR);

        const account = Account.build({
          insurancePolicyId: insurancePolicy.id,
          credit: totalPrice,
        }, { isNewRecord: true, transaction: t });
    
        const savedAccount = await account.save();

        if(!savedAccount)
          throw new customError("Failed! Account wasn't added!", INTERR);

        res.status(200).json({
          message: "Insurance Policy was added successfully!",
          data: {
            insurancePolicy: savedInsurancePolicy.toJSON(),
            servicesPolicy: servicesPolicy
          }
        });
      });
    } catch(error) {
      addInsurancePolicyLog(error);
      errorHandler(res, error, "Failed! Insurance Policy wasn't added!");
    }
  },
  list: async(req, res) => {
    try{
      let query = { where: { agentId: req.agent.id }};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
 
      if (req.body.insurancePolicyId) 
        query.where.id = req.body.insurancePolicyId;
     
      // if (req.body.carNumber) 
      //   query.where.carNumber = req.body.carNumber; 
      
      if (req.body.carID) 
        query.where.carId = req.body.carID;

      if (req.body.agentID)
        query.where.agentId = req.body.agentID;

      if (req.body.customerID)
        query.where.customerID = req.body.customerID;

      if(req.body.filterOutValid){
        query.where.expireDate = {[Op.gte]: new Date().setHours(0, 0, 0, 0)}
      }
      
      query = { ...query,
        order: [['id', 'ASC' ]],
        include: [
        {
          model: ServicePolicy,
          required: true,
          separate: true,
          include: [
            {
              model: Service,
              required: true,
              attributes: ['id', 'name', 'cost', 'coverageDays', 'supplierPercentage']
            },
            {
              model: User,
              as: 'Supplier',
              required: true,
              attributes: ['id', 'username', 'companyName']
            }
          ]
        },
        {
          model: User,
          required: true,
          as: 'Customer',
          include:[
            {
              model: Role,
              required: true
            },
            {
              model: Region,
              required: true
            }
          ],
          attributes: { exclude: ['password', 'note'] }
        },
        {
          model: User,
          required: true,
          as: 'Agent',
          include:[
            {
              model: Region,
              required: true
            }
          ],
          attributes: { exclude: ['password', 'note'] }
        },
        {
          model: Car,
          required: true,
          include: [
            {
              model: CarType,
              require: true,
            },
            {
              model: CarModel,
              require: true,
            }
          ]
        }
      ],
        offset: skip,
        limit: limit,
        attributes: { exclude: ['carId', 'customerId', 'agentId']}
      };

      const { count, rows: insurancePolices } = await InsurancePolicy.findAndCountAll(query);
      
      if(req.body.filterOutValid){
        if(count === 0)
          throw new customError("لا يوجد بوليصة تأمين متاحة او غير منتهية", INTERR);
      }
      
      listInsurancePolicyLog(query);
      res.status(200).json({data: insurancePolices, total: count});
    } catch(error) {
      listInsurancePolicyLog(error);
      errorHandler(res, error, "Failed! can't get Insurance Policies!");
    }
  },
};

/* ######################### Internal Method ##################### */

const checkLimits = async (req) => {
  const totalDebit = await Account.findAll({
    where: { agentId: req.agent.id },
    attributes: [
       [sequelize.fn('sum', sequelize.col('debit')), 'debit'],
    ],
    group: ['agentId']
  });

  const totalCredit = await Account.findAll({
    include:[
      {
        model: InsurancePolicy,
        require: true,
        where: { agentId: req.agent.id },
        attributes: []
      }
    ],
    attributes: [
       [sequelize.fn('sum', sequelize.col('credit')), 'credit'],
    ],
    group: ['InsurancePolicy.agentId']
  });

  let totalDebitVal = Number(totalDebit[0]?.debit || 0),
      totalCreditVal = Number(totalCredit[0]?.credit || 0),
      totalPricePolicy = Number(req.body.totalPrice);

    let finalAccount = ((totalDebitVal - (totalCreditVal + totalPricePolicy)) > 0);
    return finalAccount;
}
