import React, { createContext, useState, useEffect, useContext, useRef } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // user object, at least { email }

  // Store timeout ID to clear on logout/unmount
  const logoutTimeoutId = useRef(null);

  // Logout helper
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    setIsLoggedIn(false);
    setUser(null);
    if (logoutTimeoutId.current) {
      clearTimeout(logoutTimeoutId.current);
    }
  };

  // Setup auto logout timeout given remaining time in ms
  const setupAutoLogout = (milliseconds) => {
    if (logoutTimeoutId.current) clearTimeout(logoutTimeoutId.current);
    logoutTimeoutId.current = setTimeout(() => {
      logout();
      alert("Session expired. You have been logged out.");
    }, milliseconds);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const loginTime = localStorage.getItem("loginTime");

    if (token && storedUser && loginTime) {
      const now = Date.now();
      const elapsed = now - parseInt(loginTime, 10);
      const oneHour = 3600000;

      if (elapsed >= oneHour) {
        // Session expired
        logout();
      } else {
        // Restore login state and setup timer for remaining time
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
        setupAutoLogout(oneHour - elapsed);
      }
    } else {
      logout();
    }

    // Clean up timeout on unmount
    return () => {
      if (logoutTimeoutId.current) clearTimeout(logoutTimeoutId.current);
    };
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("loginTime", Date.now().toString());
    setIsLoggedIn(true);
    setUser(userData);

    // Setup auto logout after 1 hour
    setupAutoLogout(3600000);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
