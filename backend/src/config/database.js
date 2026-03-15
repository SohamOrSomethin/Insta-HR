const { Sequelize } = require('sequelize');
require('dotenv').config();

// Prefer DATABASE_URL (Railway internal) over individual vars
const connectionString = process.env.DATABASE_URL;

let sequelize;

if (connectionString) {
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Fallback for local development using individual vars
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      dialectOptions: {}
    }
  );
}

module.exports = sequelize;
