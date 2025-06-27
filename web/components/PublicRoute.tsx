"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function PublicRoute({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const { user, loading, isAuthenticated, initialized } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (loading || !initialized) return;

    // If authenticated, redirect to appropriate dashboard
    if (isAuthenticated && user) {
      setIsRedirecting(true);
      if (user.role === "institution") {
        router.replace(`/${lang}/institution-dashboard`);
      } else {
        router.replace(`/${lang}/dashboard`);
      }
    }
  }, [user, loading, isAuthenticated, router, lang, initialized]);

  // Show loading while checking authentication or redirecting
  if (loading || isRedirecting || !initialized) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">
              {loading
                ? "Checking authentication..."
                : !initialized
                ? "Initializing..."
                : "Redirecting to dashboard..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User is not authenticated, show public content
  return <>{children}</>;
}
