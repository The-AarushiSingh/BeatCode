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

// Public routes (no auth)
router.get('/', getAllProblems);
router.get('/:id', getProblemById);

// User routes (auth required)
router.get('/user/solved', userMiddleware, solvedProblem);
router.post('/:id/submit', userMiddleware, submitSolution);
router.get('/:id/submissions', userMiddleware, getUserSubmissions);

// Admin routes (admin auth required)
router.post('/', adminMiddleware, createProblem);
router.put('/:id', adminMiddleware, updateProblem);
router.delete('/:id', adminMiddleware, deleteProblem);

module.exports = router;