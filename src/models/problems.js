// src/models/problems.js
const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  tags: {
    type: [String],
    default: []
  },
  publicTestCases: {
    type: [{
      input: { type: String, required: true },
      expectedOutput: { type: String, required: true },
      explanation: { type: String, default: '' }
    }],
    required: true
  },
  hiddenTestCases: {
    type: [{
      input: { type: String, required: true },
      expectedOutput: { type: String, required: true }
    }],
    default: []
  },
  codeTemplates: {
    type: [{
      language: { type: String, required: true },
      code: { type: String, required: true }
    }],
    default: []
  },
  referenceSolution: {
    type: [{
      language: { type: String, required: true },
      completeCode: { type: String, required: true }
    }],
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  validationResults: {
    type: Array,
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  submissions: {
    type: Number,
    default: 0
  },
  acceptedSubmissions: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Problem', problemSchema);