const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidate.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

// All routes below require login
router.use(protect);

// Get profile
router.get('/profile', candidateController.getProfile);

// Create profile
router.post('/profile', candidateController.createProfile);

// Update profile
router.put('/profile', candidateController.updateProfile);


router.post('/resume', upload.single('resume'), candidateController.uploadResume);

router.get('/ai-match/:jobId', candidateController.getAIMatches)

module.exports = router;