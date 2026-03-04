const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { protect } = require('../middleware/auth');

// All routes require login
router.use(protect);

// Apply for a job
router.post('/apply/:jobId', applicationController.applyJob);

// Get my applications
router.get('/my', applicationController.getMyApplications);

// Get applications for a job
router.get('/job/:jobId', applicationController.getJobApplications);

// Update application status
router.put('/:id/status', applicationController.updateStatus);

module.exports = router;