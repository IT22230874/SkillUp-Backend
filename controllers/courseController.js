const Course = require('../models/Course');
const User = require('../models/User');

exports.addCourse = async (req, res) => {
  try {
    const { title, description, category, tags, image, price, published } = req.body;
    const course = new Course({
      title,
      description,
      instructor: req.user,
      category,
      tags,
      image,
      published,
    });
    await course.save();
    await User.findByIdAndUpdate(req.user, { $push: { taughtCourses: course._id } });
    res.status(201).json({ message: 'Course created', course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user });
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, instructor: req.user });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course details' });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const { title, description, category, tags, image, price, published, lessons } = req.body;
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, instructor: req.user },
      { title, description, category, tags, image, price, published, lessons, updatedAt: Date.now() },
      { new: true }
    );
    if (!course) return res.status(404).json({ error: 'Course not found or not authorized' });
    res.json({ message: 'Course updated', course });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
};

exports.getEnrolledStudents = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, instructor: req.user }).populate('students', 'username email role firstName lastName profilePicture');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ students: course.students });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ _id: req.params.id, instructor: req.user });
    if (!course) return res.status(404).json({ error: 'Course not found or not authorized' });
    await User.findByIdAndUpdate(req.user, { $pull: { taughtCourses: course._id } });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
};

exports.addSection = async (req, res) => {
  try {
    const { title } = req.body;
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, instructor: req.user },
      { $push: { sections: { title } }, $set: { updatedAt: Date.now() } },
      { new: true }
    );
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Section added', course });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add section' });
  }
};

exports.removeSection = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.courseId, instructor: req.user },
      { $pull: { sections: { _id: req.params.sectionId } }, $set: { updatedAt: Date.now() } },
      { new: true }
    );
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Section removed', course });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove section' });
  }
};

exports.addTopic = async (req, res) => {
  try {
    const { title, content, videoUrl, resources } = req.body;
    const course = await Course.findOne({ _id: req.params.courseId, instructor: req.user });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const section = course.sections.id(req.params.sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    section.topics.push({ title, content, videoUrl, resources });
    course.updatedAt = Date.now();
    await course.save();

    res.json({ message: 'Topic added', course });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add topic' });
  }
};

exports.removeTopic = async (req, res) => {
  const { courseId, sectionId, topicId } = req.params;

  console.log(`[removeTopic] Attempting to remove topic`);
  console.log(`→ courseId: ${courseId}`);
  console.log(`→ sectionId: ${sectionId}`);
  console.log(`→ topicId: ${topicId}`);

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      console.error(`[removeTopic] Course not found with ID: ${courseId}`);
      return res.status(404).json({ message: 'Course not found' });
    }

    const section = course.sections.id(sectionId);
    if (!section) {
      console.error(`[removeTopic] Section not found in course with ID: ${sectionId}`);
      return res.status(404).json({ message: 'Section not found' });
    }

    const existingTopic = section.topics.id(topicId);
    if (!existingTopic) {
      console.error(`[removeTopic] Topic not found in section with ID: ${topicId}`);
      console.log(`[removeTopic] Available topic IDs:`, section.topics.map(t => t._id.toString()));
      return res.status(404).json({ message: 'Topic not found' });
    }

    section.topics.pull(topicId); 
    console.log(`[removeTopic] Topic pulled from section. Saving course...`);

    await course.save();
    console.log(`[removeTopic] Course saved. Topic deletion complete.`);

    res.status(200).json({ message: 'Topic removed successfully', course });
  } catch (error) {
    console.error(`[removeTopic] Error occurred:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { title } = req.body;
    const course = await Course.findOne({ _id: req.params.courseId, instructor: req.user });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const section = course.sections.id(req.params.sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    section.title = title || section.title;
    course.updatedAt = Date.now();
    await course.save();

    res.json({ message: 'Section updated', course });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update section' });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const { title, content, videoUrl, resources } = req.body;
    const course = await Course.findOne({ _id: req.params.courseId, instructor: req.user });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const section = course.sections.id(req.params.sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    const topic = section.topics.id(req.params.topicId);
    if (!topic) return res.status(404).json({ error: 'Topic not found' });

    topic.title = title || topic.title;
    topic.content = content || topic.content;
    topic.videoUrl = videoUrl || topic.videoUrl;
    topic.resources = resources || topic.resources;
    course.updatedAt = Date.now();
    await course.save();

    res.json({ message: 'Topic updated', course });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update topic' });
  }
};


