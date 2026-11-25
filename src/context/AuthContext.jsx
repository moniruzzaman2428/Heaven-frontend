import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // পেজ লোডে: সেভ করা সেশন নেওয়া, তারপর সার্ভার থেকে যাচাই (ব্লক/ডিলিট/রোল বদল ধরার জন্য)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    if (!token || !stored) {
      setLoading(false);
      return;
    }
    try {
      setUser(JSON.parse(stored));
    } catch {
      clearSession();
      setLoading(false);
      return;
    }
    api
      .getProfile()
      .then((fresh) => {
        const merged = { ...JSON.parse(stored), ...fresh, token };
        localStorage.setItem('user', JSON.stringify(merged));
        setUser(merged);
      })
      .catch(() => {
        /* 401/blocked হলে api.js নিজেই auth:logout ইভেন্ট দেয়; নেটওয়ার্ক এরর হলে সেশন রেখে দিই */
      })
      .finally(() => setLoading(false));
  }, [clearSession]);

  useEffect(() => {
    window.addEventListener('auth:logout', clearSession);
    return () => window.removeEventListener('auth:logout', clearSession);
  }, [clearSession]);

  const saveSession = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    saveSession(data);
    return data;
  };

  const register = async (name, email, password, phone) => {
    const data = await api.register({ name, email, password, phone });
    saveSession(data);
    return data;
  };

  const logout = () => clearSession();

  const updateUser = (data) => saveSession({ ...user, ...data });

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
