//what about the avatar
//what about the bio
// we have registration_date instead of createdAt
export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar?: string;
  bio?: string;
  registration_date: string;
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