'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    static associate(models) {
      Car.belongsTo(models.User, { 
        foreignKey: 'customerId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Car.belongsTo(models.CarType, { 
        foreignKey: 'carTypeId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Car.belongsTo(models.CarModel, { 
        foreignKey: 'carModelId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Car.hasMany(models.InsurancePolicy,  { 
        foreignKey: 'carId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      Car.hasMany(models.Accident,  { 
        foreignKey: 'carId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  Car.init({
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true
    },
    carNumber: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    motorNumber: {
      type: DataTypes.STRING(8),
      unique: true,
      allowNull: false
    },
    motorPH: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    licenseType: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    serialNumber: {
      type: DataTypes.STRING(17),
    },
    passengersCount: {
      type: DataTypes.TINYINT.UNSIGNED
    },
    productionYear: {
      type: DataTypes.DATEONLY
    },
    note: {
      type: DataTypes.TEXT,
    }
  }, {
    sequelize,
    modelName: 'Car',
  });
  return Car;
};