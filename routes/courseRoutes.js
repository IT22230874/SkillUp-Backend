const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const courseController = require('../controllers/courseController');

// Add new course
router.post('/', auth, requireRole('instructor'), courseController.addCourse);
// Get all courses for instructor
router.get('/', auth, requireRole('instructor'), courseController.getInstructorCourses);
// Get course details
router.get('/:id', auth, requireRole('instructor'), courseController.getCourseDetails);
// Edit course
router.put('/:id', auth, requireRole('instructor'), courseController.editCourse);
// Delete course
router.delete('/:id', auth, requireRole('instructor'), courseController.deleteCourse);
// Get enrolled students for a course
router.get('/:id/students', auth, requireRole('instructor'), courseController.getEnrolledStudents);
// Add a section to a course
router.post('/:id/sections', auth, requireRole('instructor'), courseController.addSection);
// Remove a section
router.delete('/:courseId/sections/:sectionId', auth, requireRole('instructor'), courseController.removeSection);
// Add a topic to a section
router.post('/:courseId/sections/:sectionId/topics', auth, requireRole('instructor'), courseController.addTopic);
// Remove a topic from a section
router.delete('/:courseId/sections/:sectionId/topics/:topicId', auth, requireRole('instructor'), courseController.removeTopic);
// Update section
router.put('/:courseId/sections/:sectionId', auth, requireRole('instructor'), courseController.updateSection);
// Update topic
router.put('/:courseId/sections/:sectionId/topics/:topicId', auth, requireRole('instructor'), courseController.updateTopic);


module.exports = router;
