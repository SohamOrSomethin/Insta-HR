const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  industry: {
    type: DataTypes.ENUM(
      'Finance', 'Manufacturing', 'Pharma', 'Civil',
      'Automation', 'Mechanical', 'Banking', 'IT',
      'Healthcare', 'Logistics', 'Others'
    ),
    allowNull: false
  },
  jobType: {
    type: DataTypes.ENUM(
      'Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'
    )
  },
  experienceMin: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  experienceMax: {
    type: DataTypes.INTEGER
  },
  salaryMin: {
    type: DataTypes.DECIMAL(12, 2)
  },
  salaryMax: {
    type: DataTypes.DECIMAL(12, 2)
  },
  location: {
    type: DataTypes.STRING
  },
  employerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'closed', 'draft'),
    defaultValue: 'active'
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Job;