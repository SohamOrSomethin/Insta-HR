const sequelize = require('../config/database');
const User = require('./User');
const CandidateProfile = require('./CandidateProfile');
const Job = require('./Job');
const Application = require('./Application');
const Training = require('./Training');
const EmployerProfile = require('./EmployerProfile');
const Payment = require('./Payment');
const SavedJob = require('./SavedJob');
const JobAlert = require('./JobAlert');

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

// Associations (defined after all models loaded)
SavedJob.belongsTo(Job, { foreignKey: 'jobId', as: 'job', constraints: false });
Job.hasMany(SavedJob, { foreignKey: 'jobId', constraints: false });

module.exports = {
  SavedJob,
  JobAlert,
  Payment,
  EmployerProfile, sequelize, User, CandidateProfile, Job, Application, Training };
