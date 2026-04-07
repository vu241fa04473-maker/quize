import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Student login verification
export const studentLogin = async (req, res) => {
  try {
    const { name, emailOrRoll } = req.body;
    
    if (!name || !emailOrRoll) {
      return res.status(400).json({ error: 'Name and Email/Roll number are required' });
    }

    let user = await User.findOne({ emailOrRoll });
    if (!user) {
      user = await User.create({ name, emailOrRoll });
    } else {
      // update login time for existing session restart
      user.loginTime = Date.now();
      await user.save();
    }

    // create a simple token for student to auth their requests
    const token = jwt.sign({ id: user._id, role: 'student' }, process.env.JWT_SECRET || 'secret123', {
      expiresIn: '2h'
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, emailOrRoll: user.emailOrRoll }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Admin login verification (Hardcoded logic for simplicity, could be DB backed)
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secret123', {
      expiresIn: '1d'
    });
    res.status(200).json({ message: 'Admin login successful', token });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
};
