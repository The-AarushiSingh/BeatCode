const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    enum: ['Easy', 'Medium', 'Hard'],  // Note: Capital E, M, H
    default: 'Easy'
  },
  tags: {
    type: [String],
    default: []
  },
  publicTestCases: {
    type: [{
      input: {
        type: String,
        required: true
      },
      expectedOutput: {
        type: String,
        required: true
      },
      explanation: {
        type: String,
        default: ''
      }
    }],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one public test case is required'
    }
  },
  hiddenTestCases: {
    type: [{
      input: {
        type: String,
        required: true
      },
      expectedOutput: {
        type: String,
        required: true
      }
    }],
    default: []
  },
  codeTemplates: {
    type: [{
      language: {
        type: String,
        required: true
      },
      code: {  // Changed from boilerplateCode to code
        type: String,
        required: true
      }
    }],
    default: []
  },
  referenceSolution: {
    type: [{
      language: {
        type: String,
        required: true
      },
      completeCode: {
        type: String,
        required: true
      }
    }],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one reference solution is required'
    }
  },
  createdBy: {
    type: String,
    required: true
  },
  validationResults: {
    type: [{
      language: String,
      passed: Boolean,
      testResults: [{
        testCase: Number,
        passed: Boolean,
        error: String
      }],
      executionTime: Number,
      error: String
    }],
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

// Update timestamp on save
problemSchema.pre('save', function() {
  this.updatedAt = new Date();
});

// Add indexes
problemSchema.index({ difficulty: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Problem', problemSchema);