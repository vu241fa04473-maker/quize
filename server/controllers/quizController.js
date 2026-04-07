import Question from '../models/Question.js';
import Submission from '../models/Submission.js';

export const getQuestions = async (req, res) => {
  try {
    // Send only id, text, and options. Do NOT send correctAnswer to the client
    const questions = await Question.find().select('-correctAnswer');
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // array of { questionId, selectedOption }
    const userId = req.user.id; // from auth middleware

    // Check if user already submitted
    const existingSubmission = await Submission.findOne({ userId });
    if (existingSubmission) {
      return res.status(400).json({ error: 'You have already submitted the quiz.' });
    }

    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    
    // Check if all questions are answered
    const totalQuestions = await Question.countDocuments();
    if (answers.length !== totalQuestions) {
       return res.status(400).json({ error: 'Please answer all questions before submitting.' });
    }

    let score = 0;
    
    answers.forEach(ans => {
      const q = questions.find(question => question._id.toString() === ans.questionId);
      if (q && q.correctAnswer === ans.selectedOption) {
        score += 1;
      }
    });

    const submission = await Submission.create({
      userId,
      answers,
      score
    });

    res.status(200).json({ message: 'Quiz submitted successfully', score, total: totalQuestions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
};

export const submitBrowserQuiz = async (req, res) => {
  try {
    const { name, roll, score, total } = req.body;
    
    if (!name || !roll) {
       return res.status(400).json({ error: 'Name and Roll Number required' });
    }

    const submission = await Submission.create({
      name,
      rollNumber: roll,
      score,
      total
    });

    res.status(200).json({ message: 'Saved to Backend successfully', submission });
  } catch (error) {
    res.status(500).json({ error: 'Server error saving submission' });
  }
};
