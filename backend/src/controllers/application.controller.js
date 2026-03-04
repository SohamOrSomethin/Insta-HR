const { Application, Job } = require('../models/index');

// Apply for a job
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const existing = await Application.findOne({
      where: { jobId, candidateId: req.user.id }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    const application = await Application.create({
      jobId,
      candidateId: req.user.id,
      coverLetter: req.body.coverLetter
    });

    res.status(201).json({
      success: true,
      message: 'Applied successfully!',
      data: application
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get my applications (candidate)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { candidateId: req.user.id },
      include: [{
        model: Job,
        as: 'Job',
        attributes: ['title', 'location', 'industry', 'jobType']
      }]
    });

    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get applications for a job (employer)
exports.getJobApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { jobId: req.params.jobId },
      include: [{
        model: Job,
        as: 'Job',
        attributes: ['title', 'location', 'industry', 'jobType']
      }]
    });

    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update application status (employer)
exports.updateStatus = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    await application.update({ status: req.body.status });

    res.json({
      success: true,
      message: 'Status updated!',
      data: application
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};