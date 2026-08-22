import { createAsyncThunk } from '@reduxjs/toolkit';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://devmorph-4.onrender.com/api';

async function parseResponse(res: Response) {
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  }
  await res.text();
  throw new Error(`Server returned non-JSON response (${res.status}). Make sure backend server is running on port 5000.`);
}

export const saveProject = createAsyncThunk(
  'user/save/project',
  async ({ projectId, code }: { projectId: string; code: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/project/projects/${projectId}/save`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code }),
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Save project failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'user/delete/project',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/project/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Delete project failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const togglePublish = createAsyncThunk(
  'user/toggle/publish/project',
  async ({ projectId }: { projectId: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/user/publish/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Toggle publish failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createProjectRevision = createAsyncThunk(
  'user/revision/project',
  async ({ input, projectId }: { input: string; projectId: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/project/projects/${projectId}/revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: input }),
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Create revision failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createProjectRevisionCode = createAsyncThunk(
  'user/revision/code/project',
  async ({ enhanceResponse, projectId }: { enhanceResponse?: string; projectId: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/project/projects/revision/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enhanceResponse, projectId }),
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Create revision code failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const switchProjectVersion = createAsyncThunk(
  'user/switch/version/project',
  async ({ projectId, versionId }: { projectId: string; versionId: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/project/projects/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ projectId, versionId }),
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Switch version failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const addProjectComment = createAsyncThunk(
  'user/comment/project',
  async ({ projectId, content }: { projectId: string; content: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/comment/project/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Add comment failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getProjectComment = createAsyncThunk(
  'user/comment/get/project',
  async ({ projectId }: { projectId: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/comment/project/${projectId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Get comments failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
