// frontend/src/store/ProblemSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../utils/axiosClient';

export const getProblems = createAsyncThunk(
  'problems/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/problems');
      return response.problems || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getProblemById = createAsyncThunk(
  'problems/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/problems/${id}`);
      return response.problem;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const submitSolution = createAsyncThunk(
  'problems/submit',
  async ({ problemId, code, language }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/problems/${problemId}/submit`, {
        code,
        language,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  problems: [],
  currentProblem: null,
  submissionResult: null,
  loading: false,
  error: null,
};

const problemSlice = createSlice({
  name: 'problems',
  initialState,
  reducers: {
    clearSubmissionResult: (state) => {
      state.submissionResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all problems
      .addCase(getProblems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload;
      })
      .addCase(getProblems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get problem by ID
      .addCase(getProblemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProblemById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProblem = action.payload;
      })
      .addCase(getProblemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit solution
      .addCase(submitSolution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitSolution.fulfilled, (state, action) => {
        state.loading = false;
        state.submissionResult = action.payload;
      })
      .addCase(submitSolution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubmissionResult } = problemSlice.actions;
export default problemSlice.reducer;