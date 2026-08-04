// src/controllers/userSubmission.js
const Problem = require("../models/problems");
const Submission = require("../models/submissions");
const User = require("../models/user");
const { validateWithJDoodle } = require("../utils/jdoodleValidator");

const submitSolution = async (req, res) => {
  console.log('📝 New submission...');
  
  try {
    const { id: problemId } = req.params;
    const { code, language } = req.body;
    const userId = req.user?.userId || req.result?._id;

    if (!userId || !code || !problemId || !language) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["userId", "code", "problemId", "language"]
      });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const previousAttempts = await Submission.countDocuments({ userId, problemId });
    const attemptNumber = previousAttempts + 1;

    const allTestCases = [...problem.publicTestCases, ...problem.hiddenTestCases];
    
     const executionResult = await validateWithJDoodle({
    code,
    language,  // ✅ This is passed from frontend
    testCases: allTestCases,
    template: problem.codeTemplates?.find(t => t.language === language)?.code || ''
  });

    const submission = new Submission({
      userId,
      problemId,
      code,
      language,
      passed: executionResult.allPassed,
      testResults: executionResult.results || [],
      executionTime: executionResult.executionTime || 0,
      error: executionResult.error || null,
      status: executionResult.allPassed ? 'accepted' : 'wrong',
      testCasesTotal: allTestCases.length,
      testCasesPassed: executionResult.results?.filter(r => r.passed).length || 0,
      attemptNumber
    });

    await submission.save();

    // Update problem stats
    problem.submissions = (problem.submissions || 0) + 1;
    if (executionResult.allPassed) {
      problem.acceptedSubmissions = (problem.acceptedSubmissions || 0) + 1;
    }
    await problem.save();

    // Update user stats
    user.submissions = {
      total: (user.submissions?.total || 0) + 1,
      accepted: (user.submissions?.accepted || 0) + (executionResult.allPassed ? 1 : 0)
    };
    
    // ✅ FIX: Use 'problemSolved' (not 'solvedProblems')
    if (executionResult.allPassed) {
      const alreadySolved = user.problemSolved?.some(
        p => p.toString() === problemId
      );
      if (!alreadySolved) {
        user.problemSolved = user.problemSolved || [];
        user.problemSolved.push(problemId);
      }
    }
    await user.save();

    console.log(`✅ Submission ${submission._id} - ${executionResult.allPassed ? 'PASSED' : 'FAILED'}`);

    res.json({
      success: true,
      submissionId: submission._id,
      passed: executionResult.allPassed,
      results: executionResult.results,
      executionTime: executionResult.executionTime,
      error: executionResult.error,
      attemptNumber,
      testCaseCount: {
        total: allTestCases.length,
        passed: executionResult.results?.filter(r => r.passed).length || 0,
        failed: executionResult.results?.filter(r => !r.passed).length || 0
      },
      stats: {
        totalSubmissions: problem.submissions,
        acceptanceRate: problem.submissions > 0 
          ? Math.round((problem.acceptedSubmissions / problem.submissions) * 100) 
          : 0
      }
    });

  } catch (error) {
    console.error("❌ Submission error:", error);
    res.status(500).json({
      error: "Failed to process submission",
      message: error.message
    });
  }
};

const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user?.userId || req.result?._id;
    const { problemId } = req.params;

    const query = { userId };
    if (problemId) {
      query.problemId = problemId;
    }

    const submissions = await Submission.find(query)
      .populate('problemId', 'title difficulty')
      .sort({ submittedAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: submissions.length,
      submissions
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch submissions",
      message: error.message
    });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId || req.result?._id;

    const submission = await Submission.findById(id)
      .populate('problemId', 'title difficulty');

    if (!submission) {
      return res.status(404).json({
        error: "Submission not found"
      });
    }

    if (submission.userId.toString() !== userId.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({
        error: "Access denied"
      });
    }

    res.json({
      success: true,
      submission
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch submission",
      message: error.message
    });
  }
};

module.exports = {
  submitSolution,
  getUserSubmissions,
  getSubmissionById
};