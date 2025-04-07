import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the authentication context
export const AuthContext = createContext();

// Custom hook for using the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth context provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    return new Promise((resolve, reject) => {
      try {
        // In a real app, this would make an API call
        // For now, we'll just store the user in localStorage
        localStorage.setItem('authUser', JSON.stringify(userData));
        setCurrentUser(userData);
        resolve(userData);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Register function
  const register = (userData) => {
    return new Promise((resolve, reject) => {
      try {
        // In a real app, this would make an API call
        const newUser = {
          ...userData,
          id: Math.floor(Math.random() * 1000) + 1
        };
        
        localStorage.setItem('authUser', JSON.stringify(newUser));
        setCurrentUser(newUser);
        resolve(newUser);
      } catch (error) {
        reject(error);
      }
    });
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authUser');
    setCurrentUser(null);
    navigate('/login');
  };

  // Context value
  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
