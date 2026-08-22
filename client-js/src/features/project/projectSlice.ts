import { createSlice } from '@reduxjs/toolkit';
import { createProject, getProject, getAllProject, getUserProject, getPublishedProject, createProjectCode } from './projectThunk';
import { ProjectState } from '../../types';

const initialState: ProjectState = {
  project: null,
  loading: true,
  error: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.project = null;
    },
    updateProjectLocal(state, action) {
      if (!state.project) return;
      state.project = action.payload;
    },
    updateProjectCodeLocal(state, action) {
      if (!state.project) return;
      state.project.current_code = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // CREATE
      .addCase(createProject.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // CREATE_CODE
      .addCase(createProjectCode.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProjectCode.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(createProjectCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // GETONE
      .addCase(getProject.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(getProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // GETALL
      .addCase(getAllProject.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(getAllProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
       // GETUSERPROJRCT
      .addCase(getUserProject.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(getUserProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
       // GET_PUBLISH_PROJRCT
      .addCase(getPublishedProject.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublishedProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(getPublishedProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, logout, updateProjectLocal, updateProjectCodeLocal } = projectSlice.actions;
export default projectSlice.reducer;
