import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Made optional for browser-based submissions
  },
  name: {
    type: String,
    required: false,
  },
  rollNumber: {
    type: String,
    required: false,
  },
  answers: {
    type: Array,
    required: false, // Detailed answers containing questionId, selectedOption, correctOption, isCorrect
  },
  score: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  submissionTime: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Submission', submissionSchema);
