"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser,
  registerClient,
  ApiError,
} from "@/lib/api";
import { Client, AuthContextType } from "@/lib/auth";
import Loader from "@/components/Loader";

const AuthContext = createContext<AuthContextType | null>(null);

// All routes that require authentication
const PROTECTED_ROUTES = ["/resources/[id]"]; // Add your protected routes here
const AUTH_ROUTES = ["/login", "/signup"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if current path requires authentication
  const isProtectedRoute = (path: string) => {
    return PROTECTED_ROUTES.some((route) => path.startsWith(route));
  };

  // Check if current path is auth-related (login/signup)
  const isAuthRoute = (path: string) => {
    return AUTH_ROUTES.some((route) => path.startsWith(route));
  };

  // Handle authentication state and routing
  useEffect(() => {
    const initialize = async () => {
      try {
        const userData = await getCurrentUser();

        if (userData) {
          setClient(userData);

          // If user is logged in and tries to access auth routes, redirect appropriately
          if (isAuthRoute(pathname)) {
            const params = new URLSearchParams(window.location.search);
            const returnUrl = params.get("returnUrl");
            router.replace(returnUrl || "/dashboard"); // Adjust the redirect as needed
          }
        } else if (isProtectedRoute(pathname)) {
          // If user is not logged in and tries to access protected routes, redirect to login
          router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
        if (isProtectedRoute(pathname)) {
          router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
        }
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [pathname]);

  // Login handler
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      await apiLogin(username, password);
      const userData = await getCurrentUser();
      setClient(userData);

      // After successful login, redirect to returnUrl if it exists
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get("returnUrl");
      router.push(returnUrl || "/dashboard"); // Adjust the redirect as needed
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message);
      }
      throw new Error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
      setClient(null);
      router.push("/"); // Redirect to home or login page after logout
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear client state even if API call fails
      setClient(null);
    } finally {
      setLoading(false);
    }
  };

  // // Registration handler
  // const register = async (clientData: {
  //   username: string;
  //   password: string;
  //   phone: string;
  // }) => {
  //   setLoading(true);
  //   try {
  //     await registerClient(clientData);
  //     // Optionally, you can log the user in immediately after registration
  //     await login(clientData.username, clientData.password);
  //   } catch (error) {
  //     if (error instanceof ApiError) {
  //       throw new Error(error.message);
  //     }
  //     throw new Error("Registration failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Provide the authentication context to children
  return (
    <AuthContext.Provider
      value={{
        client,
        login,
        logout,

        loading,
        isAuthenticated: !!client,
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
