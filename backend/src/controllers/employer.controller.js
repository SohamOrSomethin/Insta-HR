const { Job, Application, User, CandidateProfile } = require('../models/index');

exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { employerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.jobId, employerId: req.user.id }
    });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found or unauthorized' });
    }
    const applications = await Application.findAll({
      where: { jobId: req.params.jobId },
      include: [
        {
          model: User,
          as: 'candidate',
          attributes: ['id', 'email', 'firstName', 'lastName', 'phone'],
          include: [
            {
              model: CandidateProfile,
              as: 'candidateProfile',
              attributes: ['headline', 'skills', 'yearsOfExperience', 'currentLocation', 'resumeUrl']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, interviewDate } = req.body;
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job, as: 'Job' }]
    });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (application.Job.employerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    const validStatuses = ['applied', 'shortlisted', 'interview_scheduled', 'hired', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    await application.update({
      status,
      ...(interviewDate && { interviewDate })
    });
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
