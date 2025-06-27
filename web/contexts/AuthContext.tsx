"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  loginUser,
  loginStudent,
  loginInstitution,
  logout as apiLogout,
  getCurrentUser,
  getCurrentInstitution,
  registerUser,
  ApiError,
} from "@/lib/api";
import { User, AuthContextType } from "@/lib/auth";

const AuthContext = createContext<AuthContextType | null>(null);

// All routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/institution-dashboard", "/pricing"];
// Auth routes that should redirect logged-in users
const AUTH_ROUTES = ["/login", "/register"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  // Initialize authentication state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    if (initialized) return;

    setLoading(true);
    try {
      // Try to get current user first
      let userData = await getCurrentUser();

      if (!userData) {
        // If no user found, try institution
        userData = await getCurrentInstitution();
      }

      setUser(userData);
    } catch (error) {
      console.error("Auth initialization error:", error);
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  // Login handler
  const login = async (
    email: string,
    password: string,
    userType: "user" | "student" | "institution" = "user",
    institutionId?: string
  ) => {
    setLoading(true);
    try {
      let userData: User | null = null;

      // Call appropriate login API based on user type
      if (userType === "institution") {
        await loginInstitution(email, password);
        userData = await getCurrentInstitution();
      } else if (userType === "student" && institutionId) {
        await loginStudent(email, password, institutionId);
        userData = await getCurrentUser();
      } else {
        await loginUser(email, password);
        userData = await getCurrentUser();
      }

      if (userData) {
        setUser(userData);

        // Handle redirect after successful login
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get("returnUrl");

        if (returnUrl && returnUrl !== "/login" && returnUrl !== "/register") {
          router.push(decodeURIComponent(returnUrl));
        } else if (userData.role === "institution") {
          router.push("/institution-dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        throw new Error("Failed to get user data after login");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Registration handler
  const register = async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      await registerUser(userData);
      // After successful registration, log the user in
      await login(userData.email, userData.password, "user");
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setLoading(false);

      // Clear any stored data
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("user");
          localStorage.removeItem("institution");
        } catch (e) {
          // Ignore localStorage errors
        }
      }

      router.push("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading,
        isAuthenticated: !!user,
        initializeAuth,
        initialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
