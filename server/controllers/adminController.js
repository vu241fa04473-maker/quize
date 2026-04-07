import Question from '../models/Question.js';
import Submission from '../models/Submission.js';

export const addQuestion = async (req, res) => {
  try {
    const { text, options, correctAnswer } = req.body;
    
    if (!text || !options || options.length !== 4 || !correctAnswer) {
      return res.status(400).json({ error: 'Invalid question data. Require text, 4 options, and correctAnswer.' });
    }
    
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ error: 'correctAnswer must be one of the options.' });
    }

    const question = await Question.create({ text, options, correctAnswer });
    res.status(201).json({ message: 'Question added successfully', question });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add question' });
  }
};

export const getAdminQuestions = async (req, res) => {
  try {
    // Admin gets everything including correct answers
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

export const getStudentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().populate('userId', 'name emailOrRoll').sort({ submissionTime: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, options, correctAnswer } = req.body;
    
    const question = await Question.findByIdAndUpdate(
      id, 
      { text, options, correctAnswer }, 
      { new: true, runValidators: true }
    );
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.status(200).json({ message: 'Question updated successfully', question });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update question' });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question' });
  }
};
