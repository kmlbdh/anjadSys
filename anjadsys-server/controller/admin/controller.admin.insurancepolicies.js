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

const updateInsurancePolicyLog = util.debuglog("controller.admin-UpdateInsurancePolicy");
const addInsurancePolicyLog = util.debuglog("controller.admin-AddInsurancePolicy");
const deleteInsurancePolicyLog = util.debuglog("controller.admin-DeleteInsurancePolicy");
const listInsurancePolicyLog = util.debuglog("controller.admin-ListInsurancePolicy");

module.exports = {
  add: async(req, res) => {
    try {
      let {
        totalPrice,
        note,
        expireDate,
        customerId,
        agentId,
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
          agentId,
          carId,
        }, { isNewRecord: true, transaction: t });

        const savedInsurancePolicy = await insurancePolicy.save();

        if(!savedInsurancePolicy || !insurancePolicy.id)
          throw new customError("Failed! Insurance Policy wasn't added!", INTERR);

        let servicePolicyArray = [];
        // let supplierAccountArray = [];
        services.forEach((service, i) => {
          servicePolicyArray[i] = {
            cost: service.cost,
            additionalDays: service.additionalDays,
            note: service.note,
            serviceId: service.serviceId,
            supplierId: service.supplierId,
            insurancePolicyId: insurancePolicy.id,
            supplierPercentage: service.supplierPercentage
          };
        });

        const servicesPolicy = await ServicePolicy.bulkCreate(servicePolicyArray,
          { transaction: t});
        
        addInsurancePolicyLog(servicesPolicy);

        if(servicesPolicy.length === 0)
          throw new customError("Failed! Services Policy wasn't added!", INTERR);

        const account = Account.build({
          insurancePolicyId: insurancePolicy.id,
          credit: totalPrice,
        }, { 
          isNewRecord: true,
          transaction: t 
        });
    
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
  delete: async(req, res) => {
    try {
      const { insurancePolicyId } = req.params;
      
      if(!insurancePolicyId || !Number(insurancePolicyId))
        throw new customError("Failed! Insurance Policy data isn't provided!", INTERR);

      await sequelizeDB.transaction( async t => {
        const deletedServicesPolicy = await ServicePolicy.destroy({ where: 
          { insurancePolicyId }}, 
          { transaction: t });

        if(!deletedServicesPolicy)
          throw new customError("Failed! Services Policy isn't deleted!", INTERR);

        const deletedAccount = await Account.destroy({ where: { insurancePolicyId: insurancePolicyId }}, 
          {transaction: t});
    
        if(!deletedAccount)
          throw new customError("Failed! Account wasn't deleted!", INTERR);

        const deletedInsurancePolicy = await InsurancePolicy.destroy({ where: { id: insurancePolicyId }}, 
          {transaction: t});

        if(!deletedInsurancePolicy)
          throw new customError("Failed! Insurance Policy isn't deleted!", INTERR);

        res.status(200).json({
          message: "Insurance Policy was deleted successfully!",
          data: {insurancePolicy: deletedInsurancePolicy, servicesPolicy: deletedServicesPolicy}
        });
      });

    } catch(error) {
      deleteInsurancePolicyLog(error);
      errorHandler(res, error, "Failed! Insurance Policy isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let { totalPrice, services } = req.body;

      const { insurancePolicyId } = req.params;
      
      if(!insurancePolicyId || !Number(insurancePolicyId))
        throw new customError("Failed! Insurance Policy data isn't provided!", INTERR);
  
      await sequelizeDB.transaction( async t => {
        const query = { where: {id: insurancePolicyId} };
        const updateData = {};

        Object.entries(req.body).forEach((val, ind) => {
          updateInsurancePolicyLog(val[0], val[1])
          if(val && val.length > 0 && val[0] !== 'insurancePolicyId' && val[0] !== 'services')
            updateData[val[0]] = val[1];
        });

        updateInsurancePolicyLog(updateData);
        const updatedInsurancePolicy = await InsurancePolicy.update(updateData, query);
        
        if(updatedInsurancePolicy[0]!== 1) 
          throw new customError("Failed! Insurance Policy isn't updated!", INTERR);

        let servicePolicyArray = [];
        let servAPolicyIds = [];

        services.forEach((service, i) => {
          if(service.id)
            servAPolicyIds.push(service.id);

            servicePolicyArray[i] = {
              id: service.id,
              cost: service.cost,
              additionalDays: service.additionalDays,
              note: service.note,
              serviceId: service.serviceId,
              supplierId: service.supplierId,
              insurancePolicyId: insurancePolicyId,
              supplierPercentage: service.supplierPercentage
            };
        });

        //delete services that are not provided by ids
        const deletedServicePolicy = await ServicePolicy.destroy({ 
          where: {
            [Op.and]: {
              id:{ [Op.notIn]: [...servAPolicyIds] },
              insurancePolicyId: insurancePolicyId
            }
          }
        },
        { transaction: t});

        //update exist one and add the new services
        const updateServicesPolicy = await ServicePolicy.bulkCreate(servicePolicyArray,
          { updateOnDuplicate: ["id"] , transaction: t});
          
        const updatedAccount = await Account.update({credit: totalPrice}, {where: {insurancePolicyId: insurancePolicyId}}, { transaction: t});
    
        if(!updatedAccount)
          throw new customError("Failed! Account wasn't updated!", INTERR);
        
        updateInsurancePolicyLog(deletedServicePolicy);
        res.status(200).json({
          message: "Insurance Policy was updated successfully!", 
          data: {
            insurancePolicy: updatedInsurancePolicy[0],
            servicesPolicy: updateServicesPolicy[0],
            deletedServicesPolicy: deletedServicePolicy
          }
        });
      });
      
    } catch(error) {
      updateInsurancePolicyLog(error);
      errorHandler(res, error, "Failed! Insurance Policy wasn't updated!");
    }
  },
  list: async(req, res) => {
    try{
      let query = {where:{}};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
 
      if (req.body.insurancePolicyId) 
        query.where.id = req.body.insurancePolicyId;
      
      if (req.body.carID) 
        query.where.carId = req.body.carID;

      if (req.body.agentID)
        query.where.agentId = req.body.agentID;

      if (req.body.customerID)
        query.where.customerId = req.body.customerID;

      if(req.body.filterOutValid){
        query.where.expireDate = {[Op.gte]: new Date().setHours(0, 0, 0, 0)}
      }
        
      if(Object.keys(query.where) === 0 ) delete query.where;
      
      query = { ...query,
        order: [['createdAt', 'DESC' ]],
        include: [{
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
          as: 'Agent',
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

      //TODO doesn't make sense! what is for?
      // if (req.body.agentID)
      //   query.include[2].where.agentId = req.body.agentID;

      let { count, rows: insurancePolices } = await InsurancePolicy.findAndCountAll(query);

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
    where: { agentId: req.body.agentId },
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
        where: { agentId: req.body.agentId },
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
