// src/controllers/userProblem.js
const Problem = require("../models/problems");
const User = require("../models/user");
const { validateWithJDoodle } = require("../utils/jdoodleValidator");

// CREATE PROBLEM
const createProblem = async (req, res) => {
  console.log('📝 Creating new problem...');
  
  const {
    title,
    description,
    difficulty,
    tags,
    publicTestCases,
    hiddenTestCases,
    codeTemplates,
    referenceSolution,
  } = req.body;

  try {
    // Validate required fields
    if (!title || !description || !difficulty || !publicTestCases || !referenceSolution) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    // Validate difficulty
    const validDifficulties = ['Easy', 'Medium', 'Hard'];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        error: "Invalid difficulty",
        validValues: validDifficulties
      });
    }

    // Get user from request (set by middleware)
    const userId = req.user?.userId || req.body.createdBy || 'system';

    console.log(`✅ Validating ${referenceSolution.length} reference solutions with JDoodle...`);

    // Validate reference solutions
    const validationResults = [];
    for (const ref of referenceSolution) {
      const { language, completeCode } = ref;
      console.log(`🔍 Testing ${language} solution...`);

      const template = codeTemplates?.find((t) => t.language === language);

      try {
        const testResults = await validateWithJDoodle({
          code: completeCode,
          language,
          testCases: [...publicTestCases, ...(hiddenTestCases || [])],
          template: template?.code || "",
        });

        validationResults.push({
          language,
          passed: testResults.allPassed,
          testResults: testResults.results || [],
          executionTime: testResults.executionTime || 0,
          error: testResults.error || null,
        });

        console.log(`  ${testResults.allPassed ? '✅' : '❌'} ${language} passed: ${testResults.allPassed}`);

      } catch (error) {
        console.error(`❌ Error validating ${language}:`, error.message);
        validationResults.push({
          language,
          passed: false,
          testResults: [],
          executionTime: 0,
          error: error.message || "Validation failed",
        });
      }
    }

    // Check if all reference solutions passed
    const allValid = validationResults.every((r) => r.passed);
    if (!allValid) {
      console.log('❌ Validation failed');
      return res.status(400).json({
        error: "Reference solution validation failed",
        details: validationResults,
      });
    }

    // Create problem in database
    const newProblem = new Problem({
      title,
      description,
      difficulty,
      tags: tags || [],
      publicTestCases,
      hiddenTestCases: hiddenTestCases || [],
      codeTemplates: codeTemplates || [],
      referenceSolution,
      createdBy: userId,
      validationResults,
      createdAt: new Date(),
      isActive: true,
    });

    await newProblem.save();

    console.log(`✅ Problem created successfully: ${newProblem._id}`);

    res.status(201).json({
      message: "Problem created successfully",
      problemId: newProblem._id,
      validationResults,
      problem: newProblem,
    });

  } catch (error) {
    console.error("❌ Error creating problem:", error);
    res.status(500).json({
      error: "Failed to create problem",
      message: error.message,
    });
  }
};

// GET ALL PROBLEMS
const getAllProblems = async (req, res) => {
  console.log('📋 Fetching all problems...');
  
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const filter = { isActive: true };
    
    if (req.query.difficulty) {
      const validDifficulties = ['Easy', 'Medium', 'Hard'];
      if (validDifficulties.includes(req.query.difficulty)) {
        filter.difficulty = req.query.difficulty;
      }
    }
    
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      filter.tags = { $in: tags };
    }
    
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const problems = await Problem.find(filter)
      .select('title description difficulty tags submissions acceptedSubmissions createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Problem.countDocuments(filter);
    
    res.json({
      success: true,
      count: problems.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      problems
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      error: "Failed to fetch problems",
      message: error.message
    });
  }
};

// GET PROBLEM BY ID
const getProblemById = async (req, res) => {
  console.log(`📋 Fetching problem: ${req.params.id}`);
  
  try {
    const { id } = req.params;
    
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "Invalid problem ID format"
      });
    }
    
    const problem = await Problem.findById(id);
    
    if (!problem) {
      return res.status(404).json({
        error: "Problem not found"
      });
    }
    
    if (!problem.isActive && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        error: "Problem is not available"
      });
    }
    
    const problemData = problem.toObject();
    
    if (!req.user || req.user.role !== 'admin') {
      delete problemData.hiddenTestCases;
      delete problemData.validationResults;
      delete problemData.__v;
    }
    
    res.json({
      success: true,
      problem: problemData
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      error: "Failed to fetch problem",
      message: error.message
    });
  }
};

// UPDATE PROBLEM
const updateProblem = async (req, res) => {
  console.log('📝 Updating problem...');
  
  const { id } = req.params;
  const updateData = req.body;

  try {
    const existingProblem = await Problem.findById(id);
    if (!existingProblem) {
      return res.status(404).json({
        error: "Problem not found"
      });
    }

    updateData.updatedAt = new Date();

    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Problem updated successfully",
      problemId: updatedProblem._id,
      problem: updatedProblem
    });

  } catch (error) {
    console.error("❌ Error updating problem:", error);
    res.status(500).json({
      error: "Failed to update problem",
      message: error.message
    });
  }
};

// DELETE PROBLEM
const deleteProblem = async (req, res) => {
  console.log('🗑️ Deleting problem...');
  
  const { id } = req.params;

  try {
    const deletedProblem = await Problem.findByIdAndDelete(id);
    
    if (!deletedProblem) {
      return res.status(404).json({
        error: "Problem not found"
      });
    }

    res.json({
      message: "Problem deleted successfully",
      problemId: id
    });

  } catch (error) {
    console.error("❌ Error deleting problem:", error);
    res.status(500).json({
      error: "Failed to delete problem",
      message: error.message
    });
  }
};

// GET SOLVED PROBLEMS
// In userProblem.js - update the solvedProblem function

const solvedProblem = async (req, res) => {
  console.log(`📋 Fetching solved problems for user: ${req.user?.userId}`);
  
  try {
    const userId = req.user?.userId || req.result?._id;
    
    if (!userId) {
      return res.status(401).json({
        error: "Authentication required"
      });
    }
    
    const user = await User.findById(userId)
      .populate('problemSolved', 'title description difficulty tags submissions acceptedSubmissions createdAt');

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }
    
    // Format the response
    const solvedProblems = user.problemSolved || [];
    
    res.json({
      success: true,
      count: solvedProblems.length,
      solvedProblems: solvedProblems
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      error: "Failed to fetch solved problems",
      message: error.message
    });
  }
};

module.exports = {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  solvedProblem
};