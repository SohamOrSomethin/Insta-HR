const { Application, Job, User, CandidateProfile } = require('../models/index');

// Apply for a job (candidate)
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Fix: use candidateId (consistent with Application model FK)
    const existing = await Application.findOne({
      where: { jobId, candidateId: req.user.id }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      jobId,
      candidateId: req.user.id,
      coverLetter: req.body.coverLetter
    });

    res.status(201).json({ success: true, message: 'Applied successfully!', data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get my applications (candidate)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { candidateId: req.user.id },
      include: [{ model: Job, as: 'Job', attributes: ['title', 'location', 'industry', 'jobType'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get applications for a job (employer)
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Fix: use employerId (consistent with models/index.js association)
    if (String(job.employerId) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view these applications' });
    }

    const applications = await Application.findAll({
      where: { jobId: req.params.jobId },
      include: [
        { model: Job, as: 'Job', attributes: ['title', 'location', 'industry', 'jobType'] },
        {
          model: User,
          attributes: ['id', 'email'],
          include: [{
            model: CandidateProfile,
            as: 'candidateProfile',
            attributes: ['firstName', 'lastName', 'skills', 'yearsOfExperience']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update application status (employer)
exports.updateStatus = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job, as: 'Job', attributes: ['employerId'] }]
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Fix: verify requesting employer owns the job
    if (req.user.role !== 'admin' && String(application.Job.employerId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this application' });
    }

    const validStatuses = ['applied', 'shortlisted', 'interview_scheduled', 'rejected', 'hired'];
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    await application.update({ status: req.body.status });
    res.json({ success: true, message: 'Status updated!', data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Withdraw application (candidate)
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      where: { id: req.params.id, candidateId: req.user.id }
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.status !== 'applied') {
      return res.status(400).json({ success: false, message: 'Cannot withdraw application at this stage' });
    }

    await application.destroy();
    res.json({ success: true, message: 'Application withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Schedule interview (employer)
exports.scheduleInterview = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job, as: 'Job', attributes: ['employerId'] }]
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Fix: verify requesting employer owns the job
    if (req.user.role !== 'admin' && String(application.Job.employerId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to schedule interview for this application' });
    }

    const { interviewDate, notes } = req.body;
    if (!interviewDate) {
      return res.status(400).json({ success: false, message: 'Interview date is required' });
    }

    await application.update({ status: 'interview_scheduled', interviewDate, notes });
    res.json({ success: true, message: 'Interview scheduled successfully!', data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
