const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobAlert = sequelize.define('JobAlert', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  keywords: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  industry: { type: DataTypes.STRING },
  jobType: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  lastSentAt: { type: DataTypes.DATE },
}, { tableName: 'JobAlerts', timestamps: true });

module.exports = JobAlert;
