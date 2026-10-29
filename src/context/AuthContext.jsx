import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'laptop_store_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      return savedAuth ? JSON.parse(savedAuth) : null;
    } catch (error) {
      console.error('Lỗi khi đọc thông tin đăng nhập:', error);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (authData) => {
    setUser(authData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserInfo = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    login,
    logout,
    updateUserInfo,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}