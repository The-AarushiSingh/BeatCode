const express = require("express");
const problemRouter = express.Router();

const {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
} = require("../controllers/problemController");

// Create
problemRouter.post("/create", createProblem);

// Fetch all
problemRouter.get("/", getAllProblems);

// Fetch one
problemRouter.get("/:id", getProblemById);

// Update
problemRouter.put("/:id", updateProblem);

// Delete
problemRouter.delete("/:id", deleteProblem);

//Problems Solved
problemRouter.get("/user",solvedProblem);

module.exports = problemRouter;