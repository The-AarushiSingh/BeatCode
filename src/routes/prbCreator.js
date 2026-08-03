// src/routes/prbCreator.js
const express = require('express');
const router = express.Router();
const adminMiddleware = require('../middlewares/adminMiddleware');
const userMiddleware = require('../middlewares/userMiddleware');
const {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  solvedProblem
} = require('../controllers/userProblem');
const {
  submitSolution,
  getUserSubmissions,
  getSubmissionById
} = require('../controllers/userSubmission');

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// Get all problems
router.get('/', getAllProblems);

// ✅ RECOMMENDATION MUST COME BEFORE /:id
router.get('/recommendation', async (req, res) => {
  try {
    const Problem = require('../models/problems');
    const problems = await Problem.find({ isActive: true });
    
    if (problems.length === 0) {
      return res.json({
        success: true,
        recommendation: 'No problems available yet. Add some problems!'
      });
    }
    
    const random = Math.floor(Math.random() * problems.length);
    const problem = problems[random];
    
    res.json({
      success: true,
      recommendation: `💡 Try solving "${problem.title}" (${problem.difficulty}).`,
      problem: {
        id: problem._id,
        title: problem.title,
        difficulty: problem.difficulty,
        tags: problem.tags
      }
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single problem by ID - THIS MUST COME AFTER /recommendation
router.get('/:id', getProblemById);

// ============================================
// USER ROUTES (Authentication required)
// ============================================

// Get user's solved problems
router.get('/user/solved', userMiddleware, solvedProblem);

// Submit a solution
router.post('/:id/submit', userMiddleware, submitSolution);

// Get user's submissions for a problem
router.get('/:id/submissions', userMiddleware, getUserSubmissions);

// ============================================
// AI ROUTES (Authentication required)
// ============================================

// Get AI hint
router.post('/:id/hint', userMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const Problem = require('../models/problems');
    const problem = await Problem.findById(id);
    
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    
    const hints = {
      'Two Sum': 'Use a hash map to store the complement of each number.',
      'Valid Parentheses': 'Use a stack to track opening brackets.',
      'Contains Duplicate': 'Use a Set to track seen numbers.',
      'Maximum Subarray': 'Use Kadane\'s algorithm: keep track of current and max sum.',
      '3Sum': 'Sort the array and use two pointers.',
      'Container With Most Water': 'Use two pointers from both ends.',
      'Best Time to Buy and Sell Stock': 'Track the minimum price seen so far.',
      'Remove Duplicates from Sorted Array': 'Use two pointers to overwrite duplicates.',
      'Two Sum II - Input Array Sorted': 'Use two pointers from both ends.'
    };
    
    const hint = hints[problem.title] || 'Think about the optimal approach for this problem.';
    
    res.json({
      success: true,
      hint: hint + ' Keep trying! 💪'
    });
  } catch (error) {
    console.error('Hint error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get AI code review
router.post('/:id/review', userMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const Problem = require('../models/problems');
    const problem = await Problem.findById(id);
    
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    
    res.json({
      success: true,
      review: `📝 Code Review for "${problem.title}"\n\n✅ Your solution approach is on the right track.\n💡 Consider optimizing for time complexity.\n⭐ Keep practicing!`
    });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get AI explanation
router.get('/:id/explanation', userMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const Problem = require('../models/problems');
    const problem = await Problem.findById(id);
    
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    
    const explanations = {
      'Two Sum': 'Use a hash map to store each number and its index. For each number, check if target - current exists in the map.',
      'Valid Parentheses': 'Use a stack to track opening brackets. Match each closing bracket with the top of the stack.',
      'Contains Duplicate': 'Use a Set to track seen numbers. If a number is already in the Set, return true.',
      'Maximum Subarray': 'Use Kadane\'s algorithm: keep track of current sum and max sum.',
      '3Sum': 'Sort the array and use two pointers to find triplets that sum to zero.',
      'Container With Most Water': 'Use two pointers from both ends. Move the pointer with the smaller height inward.',
      'Best Time to Buy and Sell Stock': 'Track the minimum price seen so far and calculate max profit.',
      'Remove Duplicates from Sorted Array': 'Use two pointers to overwrite duplicates in-place.'
    };
    
    res.json({
      success: true,
      explanation: explanations[problem.title] || `This is a ${problem.difficulty} problem about ${problem.tags?.join(', ') || 'algorithms'}.`
    });
  } catch (error) {
    console.error('Explanation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ADMIN ROUTES (Admin only)
// ============================================

// Create a new problem
router.post('/', adminMiddleware, createProblem);

// Update a problem
router.put('/:id', adminMiddleware, updateProblem);

// Delete a problem
router.delete('/:id', adminMiddleware, deleteProblem);

module.exports = router;