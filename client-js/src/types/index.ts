export interface User {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  email: string;
  credits?: number;
  isAdmin?: boolean;
}

export interface ConversationMessage {
  _id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  createdAt?: string;
  isTemp?: boolean;
}

export interface ProjectVersion {
  _id: string;
  description?: string;
  code?: string;
  timestamp?: string;
  createdAt?: string;
}

export interface Project {
  _id: string;
  name: string;
  initial_prompt: string;
  current_code: string;
  enhanceResponse?: string;
  createdAt: string;
  updatedAt: string;
  userId?: {
    _id?: string;
    name?: string;
    email?: string;
  } | string;
  isPublished?: boolean;
  current_version_index?: string;
  conversations?: ConversationMessage[];
  versions?: ProjectVersion[];
  project?: Project;
}

export interface Payment {
  _id: string;
  userId?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  transactionNumber: string;
  planId: string;
  amount: number;
  credits: number;
  status: 'pending' | 'done' | 'rejected';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface ProjectState {
  project: Project | null;
  loading: boolean;
  error: string | null;
}

export interface ProjectsState {
  list: Project[];
  page: number;
  hasMore: boolean;
  loading: boolean;
}

export interface ProjectActionState {
  project: Project | null;
  loading: boolean;
  error: string | null;
}
