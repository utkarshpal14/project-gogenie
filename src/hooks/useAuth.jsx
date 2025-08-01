import { useState, useEffect, createContext, useContext } from "react";

// Create a context for auth state
const AuthContext = createContext(undefined);

// Mock user for demo purposes
const mockUser = {
  id: "user123",
  fullName: "Demo User",
  email: "demo@example.com",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem("authUser", JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
