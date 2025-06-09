const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const studentController = require('../controllers/studentController');

// Get all available courses
router.get('/courses', auth, requireRole('student'), studentController.getAllCourses);
// Get course details
router.get('/courses/:id', auth, requireRole('student'), studentController.getCourseDetails);
// Enroll in a course
router.post('/courses/:id/enroll', auth, requireRole('student'), studentController.enrollInCourse);
// Get enrolled courses
router.get('/enrolled', auth, requireRole('student'), studentController.getEnrolledCourses);

module.exports = router;
