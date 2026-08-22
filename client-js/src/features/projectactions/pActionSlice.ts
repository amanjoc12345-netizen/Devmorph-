import { createSlice } from '@reduxjs/toolkit';
import { deleteProject, saveProject, togglePublish } from './pActionThunk';
import { ProjectActionState } from '../../types';

const initialState: ProjectActionState = {
  project: null,
  loading: true,
  error: null,
};

const projectActionSlice = createSlice({
  name: 'projectaction',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    logout(state) {
      state.project = null;
    },
  },
  extraReducers: builder => {
    builder
       // SAVE_PROJRCT
      .addCase(saveProject.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(saveProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // TOGGLE_PUBLISH
      .addCase(togglePublish.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePublish.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(togglePublish.rejected, (state) => {
        state.loading = false;
      })
       // DELETE_PUBLISH
      .addCase(deleteProject.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProject.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearError, logout } = projectActionSlice.actions;
export default projectActionSlice.reducer;
