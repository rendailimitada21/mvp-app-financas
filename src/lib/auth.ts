import { User } from './types';

const AUTH_KEY = 'la-plata-auth';
const USERS_KEY = 'la-plata-users';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

// Usuários de demonstração
const demoUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  }
];

export const getStoredUsers = (): User[] => {
  if (typeof window === 'undefined') return demoUsers;
  
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  }
  
  // Salva usuários demo se não existirem
  localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
  return demoUsers;
};

export const saveUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  
  const users = getStoredUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null };
  }
  
  const stored = localStorage.getItem(AUTH_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Erro ao carregar estado de autenticação:', error);
    }
  }
  
  return { isAuthenticated: false, user: null };
};

export const saveAuthState = (authState: AuthState): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
  } catch (error) {
    console.error('Erro ao salvar estado de autenticação:', error);
  }
};

export const login = (email: string, password: string): User | null => {
  const users = getStoredUsers();
  const user = users.find(u => u.email === email);
  
  if (user) {
    const authState: AuthState = {
      isAuthenticated: true,
      user
    };
    saveAuthState(authState);
    return user;
  }
  
  return null;
};

export const register = (name: string, email: string, password: string): User | null => {
  const users = getStoredUsers();
  const existingUser = users.find(u => u.email === email);
  
  if (existingUser) {
    return null; // Usuário já existe
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email
  };
  
  saveUser(newUser);
  
  const authState: AuthState = {
    isAuthenticated: true,
    user: newUser
  };
  saveAuthState(authState);
  
  return newUser;
};

export const logout = (): void => {
  const authState: AuthState = {
    isAuthenticated: false,
    user: null
  };
  saveAuthState(authState);
};