const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employer.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('employer'));

router.get('/jobs', employerController.getMyJobs);
router.get('/jobs/:jobId/applications', employerController.getJobApplications);
router.put('/applications/:id/status', employerController.updateApplicationStatus);

module.exports = router;
