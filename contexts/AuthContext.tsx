"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { toast } from "react-toastify";

export interface User {
  user_id: number;
  avatar: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const loginInProgressRef = useRef(false); // Prevent duplicate logins

  const checkAuth = () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        logout();
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  const login = (token: string, userData: User) => {
    // Prevent duplicate login calls
    if (loginInProgressRef.current) {
      console.log("Login already in progress, skipping...");
      return;
    }

    if (typeof window === "undefined") return;

    // Check if user is already logged in with the same token
    const existingToken = localStorage.getItem("authToken");
    if (existingToken === token && isAuthenticated) {
      console.log("User already logged in with this token, skipping...");
      return;
    }

    loginInProgressRef.current = true;

    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);

    // Show success toast
    const successContent = (
      <div>
        <div className="font-semibold text-green-800 mb-1">
          Chào mừng, {userData.name}!
        </div>
        <div className="text-sm text-gray-600">Đăng nhập thành công</div>
      </div>
    );
    toast.success(successContent);

    // Reset login in progress flag after a delay
    setTimeout(() => {
      loginInProgressRef.current = false;
    }, 1000);
  };

  const logout = () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    loginInProgressRef.current = false; // Reset flag on logout

    toast.success("Đăng xuất thành công - Hẹn gặp lại bạn!");
  };

  const refreshAuth = () => {
    checkAuth();
  };

  useEffect(() => {
    checkAuth();

    // Listen for storage changes (auth state changes in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" || e.key === "user") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
