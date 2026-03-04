const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { protect } = require('../middleware/auth');

// Public routes (no login needed)
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJob);

// Protected routes (login required)
router.post('/', protect, jobController.createJob);
router.put('/:id', protect, jobController.updateJob);
router.delete('/:id', protect, jobController.deleteJob);

module.exports = router;