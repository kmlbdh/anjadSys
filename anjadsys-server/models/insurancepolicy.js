'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InsurancePolicy extends Model {
    static associate(models) {
      InsurancePolicy.belongsTo(models.User, { 
        foreignKey: 'customerId',
        as: 'Customer',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      InsurancePolicy.belongsTo(models.User,{ 
        foreignKey: 'agentId',
        as: 'Agent',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      InsurancePolicy.belongsTo(models.Car, { 
        foreignKey: 'carId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      InsurancePolicy.hasMany(models.Endorsement, { 
        foreignKey: 'insurancePolicyId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      InsurancePolicy.hasMany(models.ServicePolicy, { 
        foreignKey: 'insurancePolicyId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      InsurancePolicy.hasOne(models.Account, { 
        foreignKey: 'insurancePolicyId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      InsurancePolicy.hasMany(models.OtherServices, { 
        foreignKey: 'insurancePolicyId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  InsurancePolicy.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    totalPrice: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    expireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
    }
  }, {
    sequelize,
    modelName: 'InsurancePolicy',
  });
  return InsurancePolicy;
};