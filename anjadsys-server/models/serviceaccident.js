'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ServiceAccident extends Model {
    static associate(models) {
      ServiceAccident.belongsTo(models.Accident, { 
        foreignKey: 'accidentId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      ServiceAccident.belongsTo(models.Service, { 
        foreignKey: 'serviceId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      ServiceAccident.belongsTo(models.User, { 
        foreignKey: 'supplierId',
        as: 'Supplier',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  ServiceAccident.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    coverageDays: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
    }
  }, {
    sequelize,
    modelName: 'ServiceAccident',
  });
  return ServiceAccident;
};