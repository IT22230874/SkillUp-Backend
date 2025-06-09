const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  videoUrl: { type: String },
  resources: [{ type: String }],
}, { _id: true });

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  topics: [topicSchema],
}, { _id: true });

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  category: { type: String },
  tags: [{ type: String }],
  image: { type: String },
  published: { type: Boolean, default: true },
  sections: [sectionSchema],
});

module.exports = mongoose.model('Course', courseSchema);
