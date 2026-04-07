import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  emailOrRoll: {
    type: String,
    required: true,
    unique: true, // We will use emailOrRoll as uniqueness check
  },
  password: {
    type: String,
    required: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('User', userSchema);
