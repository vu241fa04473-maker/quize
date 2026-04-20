import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Student Registration
export const studentRegister = async (req, res) => {
  try {
    const { name, emailOrRoll, password } = req.body;

    if (!name || !emailOrRoll || !password) {
      return res.status(400).json({ error: 'Name, Email/Roll, and Password are required' });
    }

    const existingUser = await User.findOne({ emailOrRoll });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this Email/Roll' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      emailOrRoll,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id, role: 'student' }, process.env.JWT_SECRET || 'secret123', {
      expiresIn: '2h'
    });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: user._id, name: user.name, emailOrRoll: user.emailOrRoll }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// Student Login
export const studentLogin = async (req, res) => {
  try {
    const { emailOrRoll, password } = req.body;
    
    if (!emailOrRoll || !password) {
      return res.status(400).json({ error: 'Email/Roll and Password are required' });
    }

    let user = await User.findOne({ emailOrRoll });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // update login time for existing session restart
    user.loginTime = Date.now();
    await user.save();

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
  const ADMIN_USER = process.env.ADMIN_USER || 'venky';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'venky@223';

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secret123', {
      expiresIn: '1d'
    });
    res.status(200).json({ message: 'Admin login successful', token });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
};
