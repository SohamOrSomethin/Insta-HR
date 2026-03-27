const { Sequelize } = require('sequelize');
require('dotenv').config();

let connectionString = process.env.DATABASE_URL;

// Neon appends query params like ?sslmode=require&channel_binding=require
// Sequelize handles SSL via dialectOptions, so strip everything after ?
if (connectionString && connectionString.includes('?')) {
  connectionString = connectionString.split('?')[0];
}

let sequelize;

if (connectionString) {
  console.log('🔗 Connecting to database via DATABASE_URL');
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
  console.log('🔗 Connecting to database via individual env vars');
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
