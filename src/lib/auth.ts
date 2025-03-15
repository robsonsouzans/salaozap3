
import { toast } from "sonner";

// Types for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'salon';
  avatar?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'salon';
}

// Mock current user data - Replace with actual API calls
let currentUser: User | null = null;

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  const user = localStorage.getItem('salaozap_user');
  return !!user;
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (currentUser) return currentUser;
  
  const userJson = localStorage.getItem('salaozap_user');
  if (userJson) {
    try {
      currentUser = JSON.parse(userJson);
      return currentUser;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  
  return null;
};

// Login function
export const login = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock validation - In real app this would be a backend API call
      if (credentials.email && credentials.password) {
        // Mock successful login data - in real app this would come from backend
        const user: User = {
          id: '1',
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: credentials.email.includes('salon') ? 'salon' : 'client',
        };
        
        // Save user data to localStorage
        localStorage.setItem('salaozap_user', JSON.stringify(user));
        currentUser = user;
        
        toast.success('Login realizado com sucesso!');
        resolve(user);
      } else {
        toast.error('Credenciais inválidas');
        reject(new Error('Invalid credentials'));
      }
    }, 800); // Simulate network delay
  });
};

// Register function
export const register = async (credentials: RegisterCredentials): Promise<User> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock validation - In real app this would be a backend API call
      if (credentials.email && credentials.password && credentials.name) {
        // Mock successful registration - in real app this would be handled by backend
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: credentials.name,
          email: credentials.email,
          role: credentials.role,
        };
        
        // Save user data to localStorage
        localStorage.setItem('salaozap_user', JSON.stringify(user));
        currentUser = user;
        
        toast.success('Cadastro realizado com sucesso!');
        resolve(user);
      } else {
        toast.error('Dados de cadastro inválidos');
        reject(new Error('Invalid registration data'));
      }
    }, 800); // Simulate network delay
  });
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('salaozap_user');
  currentUser = null;
  toast.success('Logout realizado com sucesso!');
};

// Demo login function
export const demoLogin = (role: 'client' | 'salon'): void => {
  // Create demo user
  const user: User = {
    id: `demo-${role}-${Math.random().toString(36).substr(2, 9)}`,
    name: role === 'client' ? 'Cliente Demo' : 'Salão Demo',
    email: `demo-${role}@salaozap.com`,
    role: role,
    avatar: role === 'client' ? '/avatar-client.png' : '/avatar-salon.png',
  };
  
  // Save user data to localStorage
  localStorage.setItem('salaozap_user', JSON.stringify(user));
  currentUser = user;
  
  toast.success(`Login demo como ${role === 'client' ? 'cliente' : 'salão'} realizado!`);
};
