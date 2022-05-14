'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OtherServices extends Model {
    static associate(models) {

      OtherServices.belongsTo(models.User, {
        foreignKey: 'customerId',
        as: 'Customer',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });

      OtherServices.belongsTo(models.InsurancePolicy,  { 
        foreignKey: 'insurancePolicyId',
        allowNull: false,
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  OtherServices.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    serviceKind: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fileStatus: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    descCustomer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    insurancePolicyId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'OtherServices',
  });
  return OtherServices;
};
/*
مفتوح
مغلق
*/