const { CandidateProfile } = require('../models/index');

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Profile
exports.createProfile = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    
    const existing = await CandidateProfile.findOne({
      where: { userId: req.user.id }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists'
      });
    }

    const {
      firstName,
      lastName,
      headline,
      currentLocation,
      industry,
      yearsOfExperience,
      skills,
      expectedSalary
    } = req.body;

    const profile = await CandidateProfile.create({
      firstName,
      lastName,
      headline,
      currentLocation,
      industry,
      yearsOfExperience,
      skills,
      expectedSalary,
      userId: req.user.id
    });

    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    await profile.update(req.body);

    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const resumeUrl = `/uploads/${req.file.filename}`;

    await CandidateProfile.update(
      { resumeUrl },
      { where: { userId: req.user.id } }
    );

    res.json({
      success: true,
      message: 'Resume uploaded successfully!',
      resumeUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAIMatches = async (req, res) => {
  try {
    const { jobId } = req.params

    // Get job details
    const { Job } = require('../models/index')
    const job = await Job.findByPk(jobId)
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' })
    }

    // Get all candidates with profiles
    const { CandidateProfile } = require('../models/index')
    const candidates = await CandidateProfile.findAll()

    // Call AI engine
    const response = await fetch('http://localhost:8000/match-candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_skills: job.skills || [],
        job_description: job.description,
        job_experience_min: job.experienceMin || 0,
        candidates: candidates.map(c => c.toJSON())
      })
    })

    const data = await response.json()
    res.json(data)

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}