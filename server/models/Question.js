import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [arrayLimit, '{PATH} must have exactly 4 options']
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    default: 'General'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  tags: {
    type: [String],
    default: []
  },
  explanation: {
    type: String,
    default: ''
  }
});

function arrayLimit(val) {
  return val.length === 4;
}

export default mongoose.model('Question', questionSchema);
