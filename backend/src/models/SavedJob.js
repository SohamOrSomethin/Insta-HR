const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavedJob = sequelize.define('SavedJob', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  jobId: { type: DataTypes.INTEGER, allowNull: false },
}, { 
  tableName: 'SavedJobs', 
  timestamps: true,
});

module.exports = SavedJob;
