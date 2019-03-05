const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  postedOn: { type: Date, default: Date.now },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Please grade with a grade of 1-5'],
    max: [5, 'Please grade with a grade of 1-5'],
  },
  review: { type: String },
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
