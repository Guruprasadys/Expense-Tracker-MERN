/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, userObj: User) => void;
  logout: () => void;
};

// ✅ Create Context
export const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Restore user & token from localStorage on page load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  // ✅ Login function
  const login = (t: string, userObj: User) => {
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(userObj));
    setToken(t);
    setUser(userObj);
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
