import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch fresh profile from database
  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem('vasavi_current_user', JSON.stringify(data));
      } else {
        // Token expired/invalid
        logout();
      }
    } catch (e) {
      console.error('Failed to fetch profile', e);
    }
  };

  // On initial load, check for active session
  useEffect(() => {
    const token = localStorage.getItem('vasavi_token');
    const storedUser = localStorage.getItem('vasavi_current_user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (token) {
      fetchProfile(token).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      
      localStorage.setItem('vasavi_token', data.token); // Save token for future API requests
      await fetchProfile(data.token);
      
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } catch (error: any) {
      throw new Error(error.message || "Invalid email or password");
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.AUTH}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pass })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed');
      
      localStorage.setItem('vasavi_token', data.token);
      await fetchProfile(data.token);
      
      navigate('/');
    } catch (error: any) {
      throw new Error(error.message || "An account with this email already exists.");
    }
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    if (!user) return;
    
    // Optimistic UI update
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('vasavi_current_user', JSON.stringify(updatedUser));

    try {
      const token = localStorage.getItem('vasavi_token');
      const response = await fetch(`${API_ENDPOINTS.AUTH}/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }
      // Re-fetch profile to keep local and database in sync
      if (token) await fetchProfile(token);
    } catch (e) {
      console.error('Failed to sync profile update to server', e);
    }
  };



  const logout = () => {
    setUser(null);
    localStorage.removeItem('vasavi_current_user');
    localStorage.removeItem('vasavi_token');
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
