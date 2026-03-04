const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  candidateId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM(
      'applied',
      'shortlisted',
      'interview_scheduled',
      'rejected',
      'hired'
    ),
    defaultValue: 'applied'
  },
  coverLetter: {
    type: DataTypes.TEXT
  },
  interviewDate: {
    type: DataTypes.DATE
  },
  notes: {
    type: DataTypes.TEXT
  }
});

module.exports = Application;