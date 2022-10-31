'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Endorsement extends Model {
    static associate(models) {
      Endorsement.belongsTo(models.InsurancePolicy,{ 
        foreignKey: 'insurancePolicyId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Endorsement.belongsTo(models.Car, { 
        foreignKey: 'carId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Endorsement.hasOne(models.Account, { 
        foreignKey: 'endorsementId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  Endorsement.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    totalPrice: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    expireDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    endorsementType:{
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
    }
  }, {
    sequelize,
    modelName: 'Endorsement',
  });
  return Endorsement;
};