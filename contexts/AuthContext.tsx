"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import AuthService from "@/lib/services/authService";
import { User, AuthContextType } from "@/types";
import { toast } from "react-toastify";

// Re-export User type for convenience
export type { User };

/**
 * Optimized AuthContext that delegates storage operations to AuthService
 * This eliminates code duplication and ensures consistent auth state management
 */

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

    // Use AuthService methods instead of direct localStorage access
    const token = AuthService.getToken();
    const userData = AuthService.getUser();

    if (token && userData) {
      setUser(userData);
      setIsAuthenticated(true);
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
    const existingToken = AuthService.getToken();
    if (existingToken === token && isAuthenticated) {
      console.log("User already logged in with this token, skipping...");
      return;
    }

    loginInProgressRef.current = true;

    // Use AuthService methods instead of direct localStorage access
    AuthService.setToken(token);
    AuthService.setUser(userData);
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

    // Use AuthService logout method instead of direct localStorage access
    AuthService.logout();
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
      if (e.key === "auth_token" || e.key === "user_data") {
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
    // Helper methods that delegate to AuthService
    isEmailVerified: () => AuthService.isEmailVerified(),
    isAccountLocked: () => AuthService.isAccountLocked(),
    getUserRole: () => AuthService.getUserRole(),
    isAdmin: () => AuthService.isAdmin(),
    isStaff: () => AuthService.isStaff(),
    getUserId: () => AuthService.getUserId(),
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
