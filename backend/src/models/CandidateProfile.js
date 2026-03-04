const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CandidateProfile = sequelize.define('CandidateProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
  },
  headline: {
    type: DataTypes.STRING
  },
  summary: {
    type: DataTypes.TEXT
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  experience: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  education: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  currentLocation: {
    type: DataTypes.STRING
  },
  expectedSalary: {
    type: DataTypes.DECIMAL(12, 2)
  },
  yearsOfExperience: {
    type: DataTypes.DECIMAL(4, 1)
  },
  resumeUrl: {
    type: DataTypes.STRING
  },
  isResumePublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  industry: {
    type: DataTypes.STRING
  },
  profileCompleteness: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = CandidateProfile;