import { createAsyncThunk } from '@reduxjs/toolkit';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://devmorphs.onrender.com/api';

async function parseResponse(res: Response) {
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  }
  await res.text();
  throw new Error(`Server returned non-JSON response (${res.status}). Make sure backend server is running on port 5000.`);
}

export const createProject = createAsyncThunk(
  'user/project',
  async ({ input }: { input: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/user/project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ initial_prompt: input }),
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Create project failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createProjectCode = createAsyncThunk(
  'user/code/project',
  async ({ enhanceResponse, projectId }: { enhanceResponse?: string; projectId: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/user/project/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enhanceResponse, projectId }),
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Generate code failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createProjectRevisionCode = createAsyncThunk(
  'user/revisioncode/project',
  async ({ enhanceResponse, projectId }: { enhanceResponse?: string; projectId: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/user/project/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enhanceResponse, projectId }),
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Generate revision code failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getProject = createAsyncThunk(
  'user/get/project',
  async ({ projectId }: { projectId: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/user/project/${projectId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Get project failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getAllProject = createAsyncThunk(
  'user/all/project',
  async ({ pagee, limit }: { pagee: number; limit: number }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/project/projects/published?page=${pagee}&limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Get published projects failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getUserProject = createAsyncThunk(
  'user/user/project',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/user/projects`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Get user projects failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getPublishedProject = createAsyncThunk(
  'user/pulish/project',
  async ({ projectId }: { projectId: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/project/projects/published/${projectId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Get published project failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchProjects = createAsyncThunk(
  'projects/fetch',
  async ({ pagee, limit }: { pagee: number; limit: number }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${API}/user/projects?page=${pagee}&limit=${limit}`,
        { credentials: 'include' }
      );

      const data = await parseResponse(res);
      if (!res.ok) throw new Error('Fetch failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
