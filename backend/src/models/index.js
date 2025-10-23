const dbConfig = require('../config/database');
const sequelize = dbConfig.sequelize || dbConfig;

const User = require('./User');
const Player = require('./Player');

const db = {
    sequelize,
    User,
    Player,
}

module.exports = db;