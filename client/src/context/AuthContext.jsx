import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('localfix_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      API.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials) => {
    const res = await API.post('/auth/login', credentials);
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('localfix_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const res = await API.post('/auth/register', data);
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('localfix_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const loginWithGoogle = async (googlePayload) => {
    const res = await API.post('/auth/google', googlePayload);
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('localfix_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('localfix_token');
    setToken(null);
    setUser(null);
  };

  const updateUserState = (newData) => {
    setUser(prev => ({ ...prev, ...newData }));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginWithGoogle, logout, updateUserState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
