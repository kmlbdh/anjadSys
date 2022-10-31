'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const models = [
  require('./accident')(sequelize, Sequelize),
  require('./account')(sequelize, Sequelize),
  require('./car')(sequelize, Sequelize),
  require('./carmodel')(sequelize, Sequelize),
  require('./cartype')(sequelize, Sequelize),
  require('./insurancepolicy')(sequelize, Sequelize),
  require('./endorsement')(sequelize, Sequelize),
  require('./otherservices')(sequelize, Sequelize),
  require('./region')(sequelize, Sequelize),
  require('./role')(sequelize, Sequelize),
  require('./service')(sequelize, Sequelize),
  require('./serviceaccident')(sequelize, Sequelize),
  require('./servicepolicy')(sequelize, Sequelize),
  require('./user')(sequelize, Sequelize),
];

models.forEach(model => {
  db[model.name] = model;
});

models.forEach(model => {

  if (db[model.name].associate) {
    db[model.name].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
