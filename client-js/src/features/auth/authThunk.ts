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

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      return data.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/auth/me`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Not authenticated');
      const data = await parseResponse(res);
      return data.user;
    } catch {
      return rejectWithValue(null);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Logout failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const buyCredits = createAsyncThunk(
  'credits/buy',
  async ({ planId, transactionNumber }: { planId: string; transactionNumber: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/user/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ planId, transactionNumber }),
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Payment request failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getPayments = createAsyncThunk(
  'payments',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/admin/payments`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Fetch payments failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateAPayment = createAsyncThunk(
  'payment/status',
  async ({ paymentId, status }: { paymentId: string; status: string }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/admin/payment/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      const data = await parseResponse(res);
      if (!res.ok) throw new Error(data.message || 'Update payment status failed');
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
