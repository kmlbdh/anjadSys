'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Accident extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Accident.belongsTo(models.User,  { 
        foreignKey: 'customerId',
        as: 'Customer',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Accident.belongsTo(models.User,  { 
        foreignKey: 'agentId',
        as: 'Agent',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Accident.belongsTo(models.Car,  { 
        foreignKey: 'carId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Accident.belongsTo(models.Region,  { 
        foreignKey: 'regionId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Accident.hasMany(models.ServiceAccident,  { 
        foreignKey: 'accidentId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  Accident.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    accidentPlace: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    accidentDate: {
      type: DataTypes.DATE,
    },
    registerAccidentDate: {
      type: DataTypes.DATE,
    },
    driverName: {
      type: DataTypes.STRING(100)
    },
    driverIdentity: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    accidentDescription: {
      type: DataTypes.TEXT
    },
    expectedCost: {
      type: DataTypes.INTEGER.UNSIGNED
    },
    note: {
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'Accident',
  });
  return Accident;
};