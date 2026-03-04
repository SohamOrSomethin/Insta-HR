const { Training } = require('../models/index');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const { category, isFree } = req.query
    const where = { status: 'active' }

    if (category) where.category = category
    if (isFree === 'true') where.isFree = true

    const courses = await Training.findAll({
      where,
      order: [['enrollmentCount', 'DESC']]
    })

    res.json({ success: true, data: courses })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get single course
exports.getCourse = async (req, res) => {
  try {
    const course = await Training.findByPk(req.params.id)
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }
    res.json({ success: true, data: course })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Create course
exports.createCourse = async (req, res) => {
  try {
    const course = await Training.create({
      ...req.body,
      providerId: req.user.id
    })
    res.status(201).json({ success: true, data: course })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Enroll in course
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Training.findByPk(req.params.id)
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }

    await course.increment('enrollmentCount')

    res.json({
      success: true,
      message: 'Enrolled successfully!'
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}