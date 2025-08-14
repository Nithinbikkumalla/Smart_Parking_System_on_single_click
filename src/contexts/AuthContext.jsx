import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo, signInUser, signOut } from '../firebase/services';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false); // Start with false for mock

  // Mock auth state - no Firebase auth state listener needed
  useEffect(() => {
    // Check if there's a stored user session (for demo purposes)
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setUserInfo(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('mockUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, vehicleNumber) => {
    try {
      const result = await signInUser(username, vehicleNumber);
      const user = {
        username: result.username,
        vehicleNumber: result.vehicleNumber,
        isAdmin: result.username.toLowerCase() === 'admin',
        uid: result.user.uid
      };

      setCurrentUser(result.user);
      setUserInfo(user);

      // Store in localStorage for demo persistence
      localStorage.setItem('mockUser', JSON.stringify(user));

      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      setUserInfo(null);
      localStorage.removeItem('mockUser');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userInfo,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
