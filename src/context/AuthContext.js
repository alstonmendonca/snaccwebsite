import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // user object, at least { email }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user"); // store user info as JSON string

    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser)); // parse user info
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // login receives token and user info (e.g. { email: 'abc@x.com' })
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for easier use of auth context
export function useAuth() {
  return useContext(AuthContext);
}
