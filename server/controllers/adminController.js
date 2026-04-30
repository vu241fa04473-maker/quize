import Question from '../models/Question.js';
import Submission from '../models/Submission.js';
import csv from 'csv-parser';
import { Readable } from 'stream';

export const addQuestion = async (req, res) => {
  try {
    const { text, options, correctAnswer, topic, difficulty, tags, explanation } = req.body;
    
    if (!text || !options || options.length !== 4 || !correctAnswer) {
      return res.status(400).json({ error: 'Invalid question data. Require text, 4 options, and correctAnswer.' });
    }
    
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ error: 'correctAnswer must be one of the options.' });
    }

    const question = await Question.create({ 
      text, options, correctAnswer, topic, difficulty, tags, explanation 
    });
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
    const { text, options, correctAnswer, topic, difficulty, tags, explanation } = req.body;
    
    const question = await Question.findByIdAndUpdate(
      id, 
      { text, options, correctAnswer, topic, difficulty, tags, explanation }, 
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

export const bulkUploadQuestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a CSV file' });
    }

    const results = [];
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    bufferStream
      .pipe(csv())
      .on('data', (data) => {
        try {
          const options = [data['Option A'], data['Option B'], data['Option C'], data['Option D']].filter(Boolean);
          if (data.Text && options.length === 4 && data['Correct Answer']) {
            results.push({
              text: data.Text,
              options,
              correctAnswer: data['Correct Answer'],
              topic: data.Topic || 'General',
              difficulty: data.Difficulty || 'Medium',
              tags: data.Tags ? data.Tags.split(',').map(t => t.trim()) : [],
              explanation: data.Explanation || ''
            });
          }
        } catch (e) {
          // ignore malformed row
        }
      })
      .on('end', async () => {
        if (results.length === 0) {
           return res.status(400).json({ error: 'No valid questions found in CSV.' });
        }
        await Question.insertMany(results);
        res.status(201).json({ message: `${results.length} questions added successfully.` });
      });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process CSV file' });
  }
};
