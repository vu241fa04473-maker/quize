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
  }
});

function arrayLimit(val) {
  return val.length === 4;
}

export default mongoose.model('Question', questionSchema);
