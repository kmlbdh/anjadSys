'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InsurancePolicy_Account extends Model {
    static associate(models) {
      InsurancePolicy_Account.belongsTo(models.InsurancePolicy,  { 
        foreignKey: 'insurancePolicyId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      InsurancePolicy_Account.belongsTo(models.Account,  { 
        foreignKey: 'accountId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  InsurancePolicy_Account.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
  }, {
    sequelize,
    modelName: 'InsurancePolicy_Account',
    timestamps: false,
  });
  return InsurancePolicy_Account;
};