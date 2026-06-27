// src/controllers/problemController.js
const Problem = require("../models/problems");

const { validateWithJDoodle } = require("../utils/jdoodleValidator");

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
    createdBy,
  } = req.body;

  try {
    // Validate required fields
    if (!title || !description || !difficulty || !publicTestCases || !referenceSolution) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["title", "description", "difficulty", "publicTestCases", "referenceSolution"],
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
      difficulty,  // Now accepts 'Easy', 'Medium', 'Hard'
      tags: tags || [],
      publicTestCases,  // Now matches schema (input, expectedOutput)
      hiddenTestCases: hiddenTestCases || [],
      codeTemplates: codeTemplates || [],  // Now matches schema (language, code)
      referenceSolution,
      createdBy: createdBy || "system",
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
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {});
      
      return res.status(400).json({
        error: "Validation failed",
        details: errors
      });
    }
    
    res.status(500).json({
      error: "Failed to create problem",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const updateProblem = async (req, res) => {
  console.log('📝 Updating problem...');
  
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    publicTestCases,
    hiddenTestCases,
    codeTemplates,
    referenceSolution,
    isActive
  } = req.body;

  try {
    // 1. Check if problem exists
    const existingProblem = await Problem.findById(id);
    if (!existingProblem) {
      return res.status(404).json({
        error: "Problem not found"
      });
    }

    // 2. Validate required fields (if being updated)
    if (title !== undefined && !title) {
      return res.status(400).json({
        error: "Title cannot be empty"
      });
    }

    if (description !== undefined && !description) {
      return res.status(400).json({
        error: "Description cannot be empty"
      });
    }

    // 3. Validate difficulty if provided
    if (difficulty) {
      const validDifficulties = ['Easy', 'Medium', 'Hard'];
      if (!validDifficulties.includes(difficulty)) {
        return res.status(400).json({
          error: "Invalid difficulty",
          validValues: validDifficulties
        });
      }
    }

    // 4. If referenceSolution or publicTestCases are being updated, re-validate
    let validationResults = existingProblem.validationResults || [];
    
    if (referenceSolution || publicTestCases) {
      const solutionsToValidate = referenceSolution || existingProblem.referenceSolution;
      const testCasesToValidate = publicTestCases || existingProblem.publicTestCases;
      const hiddenTestCasesToValidate = hiddenTestCases || existingProblem.hiddenTestCases || [];
      const templatesToUse = codeTemplates || existingProblem.codeTemplates || [];

      console.log(`🔍 Re-validating ${solutionsToValidate.length} reference solutions...`);

      const newValidationResults = [];
      
      for (const ref of solutionsToValidate) {
        const { language, completeCode } = ref;
        console.log(`🔍 Testing ${language} solution...`);

        const template = templatesToUse.find((t) => t.language === language);

        try {
          const testResults = await validateWithJDoodle({
            code: completeCode,
            language,
            testCases: [...testCasesToValidate, ...hiddenTestCasesToValidate],
            template: template?.code || "",
          });

          newValidationResults.push({
            language,
            passed: testResults.allPassed,
            testResults: testResults.results || [],
            executionTime: testResults.executionTime || 0,
            error: testResults.error || null,
          });

          console.log(`  ${testResults.allPassed ? '✅' : '❌'} ${language} passed: ${testResults.allPassed}`);

        } catch (error) {
          console.error(`❌ Error validating ${language}:`, error.message);
          newValidationResults.push({
            language,
            passed: false,
            testResults: [],
            executionTime: 0,
            error: error.message || "Validation failed",
          });
        }
      }

      // Check if all reference solutions passed
      const allValid = newValidationResults.every((r) => r.passed);
      if (!allValid) {
        console.log('❌ Validation failed');
        return res.status(400).json({
          error: "Reference solution validation failed",
          details: newValidationResults,
        });
      }

      validationResults = newValidationResults;
    }

    // 5. Prepare update data
    const updateData = {
      updatedAt: new Date()
    };

    // Only update fields that are provided
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (tags !== undefined) updateData.tags = tags;
    if (publicTestCases !== undefined) updateData.publicTestCases = publicTestCases;
    if (hiddenTestCases !== undefined) updateData.hiddenTestCases = hiddenTestCases;
    if (codeTemplates !== undefined) updateData.codeTemplates = codeTemplates;
    if (referenceSolution !== undefined) updateData.referenceSolution = referenceSolution;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Update validation results if they were re-validated
    if (referenceSolution || publicTestCases || hiddenTestCases) {
      updateData.validationResults = validationResults;
    }

    // 6. Update problem in database
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,  // Return the updated document
        runValidators: true  // Run schema validations
      }
    );

    console.log(`✅ Problem updated successfully: ${updatedProblem._id}`);

    // 7. Return success
    res.json({
      message: "Problem updated successfully",
      problemId: updatedProblem._id,
      validationResults: validationResults,
      problem: updatedProblem
    });

  } catch (error) {
    console.error("❌ Error updating problem:", error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {});
      
      return res.status(400).json({
        error: "Validation failed",
        details: errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Duplicate field value",
        field: Object.keys(error.keyPattern)[0]
      });
    }

    res.status(500).json({
      error: "Failed to update problem",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const deleteProblem = async (req, res) => {
  console.log('🗑️ Deleting problem...');
  
  const { id } = req.params;

  try {
    // Find and delete
    const deletedProblem = await Problem.findByIdAndDelete(id);
    
    if (!deletedProblem) {
      return res.status(404).json({
        error: "Problem not found"
      });
    }

    console.log(`✅ Problem deleted successfully: ${id}`);
    
    res.json({
      message: "Problem deleted successfully",
      problemId: id,
      problem: deletedProblem
    });

  } catch (error) {
    console.error("❌ Error deleting problem:", error);
    res.status(500).json({
      error: "Failed to delete problem",
      message: error.message
    });
  }
};

//*pagination: problems keep on loading as u scroll 
const getAllProblems = async (req, res) => {
  console.log('📋 Fetching all problems...');
  
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Filter
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
    
    // Fetch problems
    const problems = await Problem.find(filter)
      .select('title description difficulty tags submissions acceptedSubmissions createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Problem.countDocuments(filter);
    
    // If user is authenticated, check which problems they've solved
    let userSolved = [];
    if (req.user && req.user.id) {
      const user = await User.findById(req.user.id);
      if (user && user.solvedProblems) {
        userSolved = user.solvedProblems.map(sp => sp.problemId.toString());
      }
    }
    
    // Add solved status to each problem
    const problemsWithStatus = problems.map(problem => {
      const problemObj = problem.toObject();
      problemObj.isSolved = userSolved.includes(problem._id.toString());
      return problemObj;
    });
    
    res.json({
      success: true,
      count: problems.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      problems: problemsWithStatus
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      error: "Failed to fetch problems",
      message: error.message
    });
  }
};

const solvedProblem = async (req, res) => {
  console.log(`📋 Fetching solved problems for user: ${req.user?.id}`);
  
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        error: "Authentication required"
      });
    }
    
    const user = await User.findById(userId)
      .populate({
        path: 'solvedProblems.problemId',
        select: 'title description difficulty tags submissions acceptedSubmissions createdAt'
      });
    
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }
    
    const solvedProblems = user.solvedProblems
      .filter(sp => sp.problemId)
      .map(sp => ({
        problemId: sp.problemId._id,
        title: sp.problemId.title,
        description: sp.problemId.description,
        difficulty: sp.problemId.difficulty,
        tags: sp.problemId.tags,
        solvedAt: sp.solvedAt,
        attempts: sp.attempts || 1
      }));
    
    const stats = {
      totalSolved: solvedProblems.length,
      byDifficulty: {
        Easy: solvedProblems.filter(p => p.difficulty === 'Easy').length,
        Medium: solvedProblems.filter(p => p.difficulty === 'Medium').length,
        Hard: solvedProblems.filter(p => p.difficulty === 'Hard').length
      }
    };
    
    res.json({
      success: true,
      stats,
      solvedProblems
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      error: "Failed to fetch solved problems",
      message: error.message
    });
  }
};

const getProblemById = async (req, res) => {
  console.log(`📋 Fetching problem: ${req.params.id}`);
  
  try {
    const { id } = req.params;
    
    // Validate ObjectId
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
    
    // Check if problem is active (admin can see inactive)
    if (!problem.isActive && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        error: "Problem is not available"
      });
    }
    
    // Check if user has solved this problem
    let isSolved = false;
    if (req.user && req.user.id) {
      const user = await User.findById(req.user.id);
      if (user && user.solvedProblems) {
        isSolved = user.solvedProblems.some(
          sp => sp.problemId.toString() === id
        );
      }
    }
    
    const problemData = problem.toObject();
    problemData.isSolved = isSolved;
    
    // Remove sensitive data for non-admin
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

module.exports = { createProblem ,updateProblem,deleteProblem,getProblemById,getAllProblems,solvedProblem};