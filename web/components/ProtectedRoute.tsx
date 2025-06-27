"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredType?: string | string[];
  lang: string;
}

export default function ProtectedRoute({
  children,
  requiredType,
  lang,
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, initialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (loading || !initialized) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      setIsRedirecting(true);
      router.replace(
        `/${lang}/login?returnUrl=${encodeURIComponent(pathname)}`
      );
      return;
    }

    // Check role requirements if specified
    if (requiredType && user) {
      const hasRequiredRole = Array.isArray(requiredType)
        ? requiredType.includes(user.role)
        : user.role === requiredType;

      if (!hasRequiredRole) {
        setIsRedirecting(true);
        // Redirect based on user role
        if (user.role === "institution") {
          router.replace(`/${lang}/institution-dashboard`);
        } else {
          router.replace(`/${lang}/dashboard`);
        }
        return;
      }
    }
  }, [
    user,
    loading,
    isAuthenticated,
    requiredType,
    router,
    pathname,
    lang,
    initialized,
  ]);

  // Reset redirecting state when pathname changes
  useEffect(() => {
    setIsRedirecting(false);
  }, [pathname]);

  // Show loading while checking authentication or redirecting
  if (loading || isRedirecting || !initialized) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">
              {loading
                ? "Loading..."
                : !initialized
                ? "Initializing..."
                : "Redirecting..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and has correct permissions
  return <>{children}</>;
}
