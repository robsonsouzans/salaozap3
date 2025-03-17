
import { toast } from "sonner";

// Types for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'salon' | 'admin';
  avatar?: string;
  phone?: string;
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
  phone?: string;
  address?: string;
  document?: string;
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
        // Check for admin
        if (credentials.email === 'admin@salaozap.com' && credentials.password === 'admin123') {
          const adminUser: User = {
            id: 'admin1',
            name: 'Administrador',
            email: credentials.email,
            role: 'admin',
            avatar: '/avatar-admin.png'
          };
          
          localStorage.setItem('salaozap_user', JSON.stringify(adminUser));
          currentUser = adminUser;
          
          toast.success('Login como administrador realizado com sucesso!');
          resolve(adminUser);
          return;
        }
        
        // Regular user login
        const role = credentials.email.includes('salon') ? 'salon' : 'client';
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: role,
          phone: role === 'salon' ? '(11) 99999-9999' : '(11) 98888-8888'
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
          phone: credentials.phone,
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
export const demoLogin = (role: 'client' | 'salon' | 'admin'): void => {
  // Create demo user
  const user: User = {
    id: `demo-${role}-${Math.random().toString(36).substr(2, 9)}`,
    name: role === 'client' 
      ? 'Cliente Demo' 
      : role === 'salon' 
        ? 'Salão Demo' 
        : 'Admin Demo',
    email: `demo-${role}@salaozap.com`,
    role: role,
    avatar: role === 'client' 
      ? '/avatar-client.png' 
      : role === 'salon' 
        ? '/avatar-salon.png' 
        : '/avatar-admin.png',
    phone: role === 'client' 
      ? '(11) 98888-8888' 
      : '(11) 99999-9999'
  };
  
  // Save user data to localStorage
  localStorage.setItem('salaozap_user', JSON.stringify(user));
  currentUser = user;
  
  let roleText = role === 'client' ? 'cliente' : role === 'salon' ? 'salão' : 'administrador';
  toast.success(`Login demo como ${roleText} realizado!`);
};

// Update user profile
export const updateUserProfile = (userData: Partial<User>): User => {
  const currentUserData = getCurrentUser();
  
  if (!currentUserData) {
    throw new Error('User not logged in');
  }
  
  const updatedUser: User = {
    ...currentUserData,
    ...userData
  };
  
  localStorage.setItem('salaozap_user', JSON.stringify(updatedUser));
  currentUser = updatedUser;
  
  toast.success('Perfil atualizado com sucesso!');
  return updatedUser;
};

// Request password reset
export const requestPasswordReset = async (email: string): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success(`Email de redefinição de senha enviado para ${email}`);
      resolve();
    }, 800);
  });
};
