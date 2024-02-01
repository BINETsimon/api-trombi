const dbConfig = require('../config/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./user.model.js')(sequelize, Sequelize);
db.pictures = require('./picture.model.js')(sequelize, Sequelize);
// db.stats = require('./stat.model.js')(sequelize, Sequelize);

// relations
db.users.hasMany(db.pictures, { as: 'pictures' });
db.pictures.belongsTo(db.users);

module.exports = db;