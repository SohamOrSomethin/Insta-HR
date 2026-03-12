const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmployerProfile = sequelize.define('EmployerProfile', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  companyName: { type: DataTypes.STRING, allowNull: false },
  logoUrl: { type: DataTypes.STRING },
  logoPublicId: { type: DataTypes.STRING },
  tagline: { type: DataTypes.STRING },
  about: { type: DataTypes.TEXT },
  industry: { type: DataTypes.STRING },
  companySize: {
    type: DataTypes.ENUM('1-10','11-50','51-200','201-500','501-1000','1000+'),
    defaultValue: '1-10'
  },
  website: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING, defaultValue: 'India' },
  linkedinUrl: { type: DataTypes.STRING },
  twitterUrl: { type: DataTypes.STRING },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  foundedYear: { type: DataTypes.INTEGER },
  totalJobsPosted: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'EmployerProfiles', timestamps: true });

module.exports = EmployerProfile;
