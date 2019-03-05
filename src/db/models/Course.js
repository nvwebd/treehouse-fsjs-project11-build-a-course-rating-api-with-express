const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: [true, 'Course Title is required.'] },
  description: { type: String, required: [true, 'Description is required.'] },
  estimatedTime: { type: String },
  materialsNeeded: { type: String },
  steps: [
    {
      stepNumber: Number,
      title: { type: String, required: [true, 'Step Title is required.'] },
      description: {
        type: String,
        required: [true, 'Step Description is required.'],
      },
    },
  ],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
