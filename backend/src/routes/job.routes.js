const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', jobController.getAllJobs);
router.get('/my', protect, authorize('employer'), jobController.getMyJobs);
router.get('/:id', jobController.getJob);

// Protected routes
router.post('/', protect, authorize('employer'), jobController.createJob);
router.put('/:id', protect, authorize('employer'), jobController.updateJob);
router.delete('/:id', protect, authorize('employer'), jobController.deleteJob);

module.exports = router;
