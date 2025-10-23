require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
  }
);

const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    // You can add sync or other initialization logic here if desired
    // await sequelize.sync();
    return true;
  } catch (err) {
    // Re-throw so the caller can handle logging/exit
    throw err;
  }
};

module.exports = { sequelize, initializeDB };