import { createSlice } from "@reduxjs/toolkit";
import { fetchProjects } from "./projectThunk";
import { ProjectsState } from "../../types";

const initialState: ProjectsState = {
  list: [],
  page: 1,
  hasMore: true,
  loading: false,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    resetProjects: (state) => {
      state.list = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.list = [];
        state.loading = false;
        if (action.payload?.projects) {
          state.list.push(...action.payload.projects);
        }
        if (action.payload?.pagination) {
          state.hasMore = action.payload.pagination.hasMore;
          state.page = action.payload.pagination.page;
        }
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetProjects } = projectsSlice.actions;
export default projectsSlice.reducer;
