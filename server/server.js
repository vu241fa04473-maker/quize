import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Trust Proxy for deployments (Render, Vercel, etc.)
app.set('trust proxy', 1);

// Rate Limiting to prevent crash spamming algorithms
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
  message: { error: 'Too many requests from this IP, please try again after 10 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all API routes
app.use('/api', apiLimiter, apiRoutes);

// Database connection
const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/online-quiz';
    mongoURI = mongoURI.replace(/"/g, ''); // Safely strip any stray double quotes that users might paste
    await mongoose.connect(mongoURI, { family: 4 });
    console.log(`MongoDB Connected: ${mongoURI}`);
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

connectDB();
