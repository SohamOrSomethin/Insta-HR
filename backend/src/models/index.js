const sequelize = require('../config/database');
const User = require('./User');
const CandidateProfile = require('./CandidateProfile');
const Job = require('./Job');
const Application = require('./Application');
const Training = require('./Training');

// Associations
User.hasOne(CandidateProfile, { foreignKey: 'userId', as: 'candidateProfile' });
CandidateProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Job, { foreignKey: 'employerId', as: 'jobs' });
Job.belongsTo(User, { foreignKey: 'employerId', as: 'employer' });

User.hasMany(Application, { foreignKey: 'candidateId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'candidateId', as: 'candidate' });

Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'Job' });

User.hasMany(Training, { foreignKey: 'providerId', as: 'trainings' });
Training.belongsTo(User, { foreignKey: 'providerId' });

// Sync all models with database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log('✅ All tables created!');
  } catch (error) {
    console.error('❌ Table sync failed:', error.message);
  }
};

syncDatabase();

module.exports = { sequelize, User, CandidateProfile, Job, Application, Training };
