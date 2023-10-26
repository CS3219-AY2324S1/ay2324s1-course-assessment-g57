require('dotenv').config();
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    min: 1,
  },
  title: {
    type: String,
    required: true,
  },
  categories: {
    type: [String],
  },
  complexity: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
});

module.exports = mongoose.model(
  'Question',
  questionSchema,
  process.env.QUESTION_COLLECTION_NAME
);
