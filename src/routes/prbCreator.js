const express = require("express");
const problemRouter = express.Router();

const adminMiddleware = require("../middlewares/adminMiddleware");
const userMiddleware = require("../middlewares/userMiddleware");

const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblems,
  solvedProblem,
} = require("../controllers/userProblem");

problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);

problemRouter.get("/getAll", userMiddleware, getAllProblems);
problemRouter.get("/problemById/:id", userMiddleware, getProblemById);
problemRouter.get("/problemsSolvedByUser", userMiddleware, solvedProblem);

module.exports = problemRouter;
