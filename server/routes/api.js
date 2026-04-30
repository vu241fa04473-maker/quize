import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { studentLogin, studentRegister, adminLogin } from '../controllers/authController.js';
import { getQuestions, submitQuiz, submitBrowserQuiz, getLeaderboard } from '../controllers/quizController.js';
import { addQuestion, getAdminQuestions, getStudentSubmissions, updateQuestion, deleteQuestion, bulkUploadQuestions } from '../controllers/adminController.js';

const router = express.Router();
const upload = multer();

// Middleware to verify student token
const verifyStudent = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret123', (err, decoded) => {
    if (err || decoded.role !== 'student') return res.status(403).json({ error: 'Forbidden' });
    req.user = decoded;
    next();
  });
};

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret123', (err, decoded) => {
    if (err || decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  });
};

// Auth Routes
router.post('/auth/student/register', studentRegister);
router.post('/auth/student/login', studentLogin);
router.post('/auth/admin/login', adminLogin);

// Student Quiz Routes
router.get('/quiz/questions', verifyStudent, getQuestions);
router.post('/quiz/submit', verifyStudent, submitQuiz);

// New public route for Browser frontend
router.post('/quiz/submit-browser', submitBrowserQuiz);

// Public Routes for standalone browser app
router.get('/public/questions', getAdminQuestions);
router.post('/public/questions', addQuestion);
router.delete('/public/questions/:id', deleteQuestion);
router.get('/public/leaderboard', getLeaderboard);

// Admin Quiz Routes
router.get('/admin/questions', verifyAdmin, getAdminQuestions);
router.get('/admin/submissions', verifyAdmin, getStudentSubmissions);
router.post('/admin/questions', verifyAdmin, addQuestion);
router.post('/admin/questions/bulk', verifyAdmin, upload.single('file'), bulkUploadQuestions);
router.put('/admin/questions/:id', verifyAdmin, updateQuestion);
router.delete('/admin/questions/:id', verifyAdmin, deleteQuestion);

export default router;
