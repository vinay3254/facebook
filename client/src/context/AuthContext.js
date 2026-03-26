import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('fb_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('fb_user', JSON.stringify(data));
    localStorage.setItem('fb_access_token', data.accessToken);
    localStorage.setItem('fb_refresh_token', data.refreshToken);
    setUser(data);
    return data;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('fb_user', JSON.stringify(data));
    localStorage.setItem('fb_access_token', data.accessToken);
    localStorage.setItem('fb_refresh_token', data.refreshToken);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('fb_user');
    localStorage.removeItem('fb_access_token');
    localStorage.removeItem('fb_refresh_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    localStorage.setItem('fb_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
