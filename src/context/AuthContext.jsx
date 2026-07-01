import { createContext, useState, useCallback } from "react";

// Create Auth Context
export const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock login function (replace with actual API call)
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual backend API call
      // const response = await fetch('http://localhost:5001/api/v1/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });

      // Mock successful login
      const mockUser = {
        id: "user123",
        name: "John Doe",
        email: email,
        phone: "9876543210",
        role: "user",
        profileImage: null,
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Set user and token
      setUser(mockUser);
      setIsAuthenticated(true);

      // Store token in localStorage
      localStorage.setItem("token", "mock_jwt_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify(mockUser));

      setLoading(false);
      return { success: true, user: mockUser };
    } catch (err) {
      setError(err.message || "Login failed");
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  // Register function
  const register = useCallback(async (name, email, phone, password) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual backend API call
      // const response = await fetch('http://localhost:5001/api/v1/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, phone, password })
      // });

      // Mock successful registration
      const mockUser = {
        id: "user_" + Date.now(),
        name: name,
        email: email,
        phone: phone,
        role: "user",
        profileImage: null,
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUser(mockUser);
      setIsAuthenticated(true);

      localStorage.setItem("token", "mock_jwt_token_" + Date.now());
      localStorage.setItem("user", JSON.stringify(mockUser));

      setLoading(false);
      return { success: true, user: mockUser };
    } catch (err) {
      setError(err.message || "Registration failed");
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  // Initialize auth on mount (check localStorage)
  const initializeAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setUser(user);
        setIsAuthenticated(true);
      } catch (err) {
        logout();
      }
    }
  }, [logout]);

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    initializeAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
