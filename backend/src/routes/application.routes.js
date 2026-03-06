const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/apply/:jobId', authorize('candidate'), applicationController.applyJob);
router.get('/my', authorize('candidate'), applicationController.getMyApplications);
router.get('/job/:jobId', authorize('employer', 'admin'), applicationController.getJobApplications);
router.put('/:id/status', authorize('employer', 'admin'), applicationController.updateStatus);

module.exports = router;