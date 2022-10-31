'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CarModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CarModel.belongsTo(models.CarType, { 
        foreignKey: 'carTypeId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      CarModel.hasMany(models.Car, { 
        foreignKey: 'carModelId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  CarModel.init({
    id: {
      type: DataTypes.SMALLINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: false,
    } 
  }, {
    sequelize,
    modelName: 'CarModel',
    timestamps: false
  });
  return CarModel;
};