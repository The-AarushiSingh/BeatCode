//ye file isliye hai bcs solved qs kahi store hue honge in some format
// src/models/submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  // User who submitted
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Problem being solved
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
    index: true
  },
  
  // Submission details
  code: {
    type: String,
    required: true
  },
  
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp', 'go', 'rust', 'ruby'],
    index: true
  },
  
  // Results
  passed: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  },
  
  testResults: [{
    testCase: {
      type: Number,
      required: true
    },
    passed: {
      type: Boolean,
      required: true
    },
    input: {
      type: String
    },
    expectedOutput: {
      type: String
    },
    actualOutput: {
      type: String
    },
    error: {
      type: String
    },
    executionTime: {
      type: Number, // in milliseconds
      default: 0
    }
  }],
  
  // Execution metrics
  executionTime: {
    type: Number, // total execution time in milliseconds
    default: 0
  },
  
  memoryUsed: {
    type: Number, // in bytes
    default: 0
  },
  
  // Error information
  error: {
    type: String,
    default: null
  },
  
  // Compilation info (for compiled languages)
  compileOutput: {
    type: String,
    default: null
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed', 'timeout'],
    default: 'pending'
  },
  
  // AI hints used
  hintsUsed: {
    type: Number,
    default: 0
  },
  
  // AI review requested
  aiReviewRequested: {
    type: Boolean,
    default: false
  },
  
  // AI review result
  aiReview: {
    type: String,
    default: null
  },
  
  // Code review
  codeReview: {
    suggestions: [{
      line: Number,
      message: String,
      severity: {
        type: String,
        enum: ['info', 'warning', 'error'],
        default: 'info'
      }
    }],
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    feedback: {
      type: String,
      default: null
    }
  },
  
  // Attempt tracking
  attemptNumber: {
    type: Number,
    default: 1
  },
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
},
{
    timestamps:true
});

// Compound indexes for faster queries
submissionSchema.index({ userId: 1, problemId: 1 });
submissionSchema.index({ problemId: 1, passed: 1 });
submissionSchema.index({ userId: 1, submittedAt: -1 });
submissionSchema.index({ language: 1, submittedAt: -1 });

// Update timestamp on save
submissionSchema.pre('save', function() {
  this.updatedAt = new Date();
});

// Virtual for time ago
submissionSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.submittedAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
});

// Virtual for success rate (percentage)
submissionSchema.virtual('successRate').get(function() {
  if (!this.testResults || this.testResults.length === 0) return 0;
  const passed = this.testResults.filter(t => t.passed).length;
  return Math.round((passed / this.testResults.length) * 100);
});

// Enable virtuals in JSON output
submissionSchema.set('toJSON', { virtuals: true });
submissionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Submission', submissionSchema);