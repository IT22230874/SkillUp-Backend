const Course = require('../models/Course');
const User = require('../models/User');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ published: true })
      .populate('instructor', 'username email firstName lastName profilePicture bio');
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'username email firstName lastName profilePicture bio')
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ course });
} catch (error) {
  console.error("Error fetching course details:", error);
  res.status(500).json({ error: 'Failed to fetch course details' });
}
};

exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    if (course.students.includes(req.user)) {
      return res.status(400).json({ error: 'Already enrolled' });
    }
    course.students.push(req.user);
    await course.save();
    await User.findByIdAndUpdate(req.user, { $push: { enrolledCourses: course._id } });
    res.json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to enroll' });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user })
      .populate('instructor', 'username email firstName lastName profilePicture bio');
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrolled courses' });
  }
};
