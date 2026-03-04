const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/training.controller');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', trainingController.getAllCourses);
router.get('/:id', trainingController.getCourse);

// Protected routes
router.post('/', protect, trainingController.createCourse);
router.post('/:id/enroll', protect, trainingController.enrollCourse);

module.exports = router;