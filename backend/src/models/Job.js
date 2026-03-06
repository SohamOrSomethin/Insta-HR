const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  employerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requiredSkills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  salaryMin: {
    type: DataTypes.INTEGER
  },
  salaryMax: {
    type: DataTypes.INTEGER
  },
  experienceLevel: {
    type: DataTypes.ENUM('fresher', 'junior', 'mid', 'senior', 'lead'),
    defaultValue: 'fresher'
  },
  location: {
    type: DataTypes.STRING
  },
  isRemote: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  jobType: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'remote'),
    defaultValue: 'full-time'
  },
  industry: {
    type: DataTypes.ENUM(
      'IT', 'Finance', 'Banking', 'Healthcare', 'Manufacturing',
      'Pharma', 'Civil', 'Automation', 'Mechanical', 'Logistics', 'Others'
    ),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'active', 'closed', 'rejected'),
    defaultValue: 'active'   // admin must approve
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  applicationDeadline: {
    type: DataTypes.DATE
  },
  totalApplications: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  tableName: 'jobs'
});

module.exports = Job;
