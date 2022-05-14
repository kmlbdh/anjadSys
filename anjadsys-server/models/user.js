'use strict';
const Sequelize = require('sequelize');
const { Model } = Sequelize;
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Region, { 
        foreignKey: 'regionId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      User.belongsTo(models.Role, { 
        foreignKey: 'roleId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      User.belongsTo(models.User, { 
        foreignKey: 'agentId',
        as: 'Agent',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      User.hasMany(models.InsurancePolicy, { 
        foreignKey: 'customerId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      User.hasMany(models.InsurancePolicy, { 
        foreignKey: 'agentId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      User.hasMany(models.Accident, { 
        foreignKey: 'customerId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      User.hasMany(models.Accident, { 
        foreignKey: 'agentId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      User.hasMany(models.Account, { 
        foreignKey: 'agentId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      User.hasMany(models.ServicePolicy, { 
        foreignKey: 'supplierId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      User.hasMany(models.ServiceAccident, { 
        foreignKey: 'supplierId',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      });
      User.hasMany(models.OtherServices, {
        foreignKey: 'customerId',
        onDelete: 'RESRICT',
        onUpdate: 'RESTRICT'
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.STRING(10),
      primaryKey: true
    },
    identityNum: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    companyName: {
      type: DataTypes.STRING(100),
    },
    password: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING(100),
    },
    jawwal1: {
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true
    },
    jawwal2: {
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true
    },
    fax: {
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true
    },
    tel: {
      type: DataTypes.INTEGER.UNSIGNED,
      unique: true
    }, 
    email: {
      type: DataTypes.STRING(100),
      unique: true
    }, 
    note: {
      type: DataTypes.TEXT,
    }, 
    blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: {}
      }
    },
    hooks: {
      afterCreate: (record) => {
          delete record.dataValues.password;
      },
      afterUpdate: (record) => {
          delete record.dataValues.password;
      },
    }
  });
  return User;
};