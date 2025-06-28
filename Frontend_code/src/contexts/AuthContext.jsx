import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user, token]);

  const login = async (nameOrEmail, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameOrEmail, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }
      
      setUser({ 
        id: data.id,
        name: data.name, 
        email: data.email,
        role: data.role || 'USER'
      });
      setToken(data.token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Signup failed');
      }
      
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (userData) => {
    if (!token) throw new Error('Not authenticated');
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Profile update failed');
      }
      
      setUser(prev => ({ ...prev, ...data }));
      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAuthHeaders = () => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // Role-based access control helpers
  const isAdmin = () => {
    return user && user.role === 'ADMIN';
  };

  const isUser = () => {
    return user && user.role === 'USER';
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading,
      login, 
      signup, 
      logout, 
      updateProfile,
      getAuthHeaders,
      isAuthenticated: !!user && !!token,
      isAdmin,
      isUser,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
} 