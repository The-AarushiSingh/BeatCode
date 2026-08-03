// src/controllers/aiController.js
const { generateHint, reviewCode, explainSolution, recommendProblem } = require('../services/aiService');
const Problem = require('../models/problems');
const Submission = require('../models/submissions');
const User = require('../models/user');

// Get AI Hint
const getHint = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { code } = req.body;
    const userId = req.user?.userId || req.result?._id;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const result = await generateHint(
      problem.title,
      problem.description,
      code
    );

    res.json(result);
  } catch (error) {
    console.error('Hint error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Code Review
const getCodeReview = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { code, language } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const result = await reviewCode(
      code,
      language,
      problem.title
    );

    res.json(result);
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Solution Explanation
const getExplanation = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user?.userId || req.result?._id;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Get user's best submission for this problem
    const submission = await Submission.findOne({
      userId,
      problemId,
      passed: true
    }).sort({ executionTime: 1 });

    if (!submission) {
      return res.status(404).json({ 
        error: 'No accepted solution found. Solve the problem first!',
        message: 'Submit a correct solution to get an explanation.'
      });
    }

    const result = await explainSolution(
      problem.title,
      problem.description,
      submission.code,
      submission.language
    );

    res.json(result);
  } catch (error) {
    console.error('Explanation error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Personalized Recommendation
const getRecommendation = async (req, res) => {
  try {
    const userId = req.user?.userId || req.result?._id;

    // Get user stats
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all problems
    const problems = await Problem.find({ isActive: true });

    // Get user's solved problems
    const solvedIds = user.problemSolved || [];
    const unsolvedProblems = problems.filter(p => 
      !solvedIds.includes(p._id.toString())
    );

    if (unsolvedProblems.length === 0) {
      return res.json({
        success: true,
        message: '🎉 You\'ve solved all problems! Great job!',
        recommendation: 'You\'re a coding master! Try harder problems or add more to the platform.'
      });
    }

    const userStats = {
      solvedCount: solvedIds.length,
      level: solvedIds.length < 3 ? 'beginner' : solvedIds.length < 7 ? 'intermediate' : 'advanced'
    };

    const result = await recommendProblem(userStats, unsolvedProblems);

    res.json({
      success: true,
      ...result,
      availableProblems: unsolvedProblems.length
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getHint,
  getCodeReview,
  getExplanation,
  getRecommendation
};