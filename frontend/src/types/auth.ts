export interface User {
  user_id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  username: string;
  full_name: string;
  confirmPassword: string;
}
