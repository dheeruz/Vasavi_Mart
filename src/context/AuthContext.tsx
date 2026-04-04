import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface AddressItem {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  name: string;
  mobile: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  mobile?: string;
  address?: string; // Legacy default address string
  addresses?: AddressItem[];
  gender?: 'Male' | 'Female' | '';
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  updateProfile: (updatedData: Partial<User>) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin Identity (Hardcoded since we have no DB)
const ADMIN_EMAIL = 'admin@vasavimart.com';
const ADMIN_PASS = 'admin123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // On initial load, check for active session
  useEffect(() => {
    const storedUser = localStorage.getItem('vasavi_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    // 1. Check if it's the Admin
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
      const adminUser: User = { id: 'admin_1', name: 'Store Owner', email, role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('vasavi_current_user', JSON.stringify(adminUser));
      navigate('/admin/dashboard');
      return;
    }

    // 2. Check regular users in "database" (localStorage)
    const storedDB = localStorage.getItem('vasavi_users_db');
    const db = storedDB ? JSON.parse(storedDB) : [];
    
    const foundUser = db.find((u: any) => u.email === email && u.pass === pass);
    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    const standardUser: User = { 
      id: foundUser.id, 
      name: foundUser.name, 
      lastName: foundUser.lastName || '',
      email: foundUser.email, 
      mobile: foundUser.mobile || '',
      address: foundUser.address || '',
      addresses: foundUser.addresses || [],
      gender: foundUser.gender || '',
      role: 'user' 
    };
    setUser(standardUser);
    localStorage.setItem('vasavi_current_user', JSON.stringify(standardUser));
    
    // Redirect to home page
    navigate('/');
  };

  const signup = async (name: string, email: string, pass: string) => {
    // Don't let users register as admin email
    if (email === ADMIN_EMAIL) {
      throw new Error("This email is reserved for administration.");
    }

    const storedDB = localStorage.getItem('vasavi_users_db');
    const db = storedDB ? JSON.parse(storedDB) : [];

    const exists = db.find((u: any) => u.email === email);
    if (exists) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      lastName: '',
      email,
      mobile: '',
      address: '',
      gender: '',
      pass, // In a real app, hash this!
      role: 'user'
    };

    db.push(newUser);
    localStorage.setItem('vasavi_users_db', JSON.stringify(db));

    // Automatically log them in after signup
    const standardUser: User = { 
      id: newUser.id, 
      name: newUser.name, 
      lastName: newUser.lastName,
      email: newUser.email, 
      mobile: newUser.mobile,
      address: newUser.address,
      addresses: [],
      gender: newUser.gender as any,
      role: 'user' 
    };
    setUser(standardUser);
    localStorage.setItem('vasavi_current_user', JSON.stringify(standardUser));
    navigate('/');
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;

    // 1. Update the local session
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('vasavi_current_user', JSON.stringify(updatedUser));

    // 2. Sync with the users "database" in localStorage
    if (user.role === 'user') {
      const storedDB = localStorage.getItem('vasavi_users_db');
      if (storedDB) {
        const db = JSON.parse(storedDB);
        const userIndex = db.findIndex((u: any) => u.id === user.id);
        if (userIndex !== -1) {
          db[userIndex] = { ...db[userIndex], ...updatedData };
          localStorage.setItem('vasavi_users_db', JSON.stringify(db));
        }
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vasavi_current_user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, updateProfile, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
