'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Supplier_Account extends Model {
    static associate(models) {
      Supplier_Account.belongsTo(models.Account,  { 
        foreignKey: 'accountId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Supplier_Account.belongsTo(models.ServiceAccident,  { 
        foreignKey: 'serviceAccidentId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Supplier_Account.belongsTo(models.ServicePolicy,  { 
        foreignKey: 'servicePolicyId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  Supplier_Account.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    }, 
    supplierPercentage: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Supplier_Account',
    timestamps: false,
  });
  return Supplier_Account;
};