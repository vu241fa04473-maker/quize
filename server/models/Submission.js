import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
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
