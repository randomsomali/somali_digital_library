"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getDictionary } from "@/lib/dictionary";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, BookOpen } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AppDictionary } from "@/types/dictionary";
import { use } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function DashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const { user, logout } = useAuth();
  const [dictionary, setDictionary] = useState<AppDictionary | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getDictionary(lang as "en" | "ar");
      setDictionary(dict);
    };
    loadDictionary();
  }, [lang]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully!",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!dictionary) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute lang={lang} requiredType={["user", "student"]}>
      <div className="min-h-screen bg-background pt-32 pb-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header with logout button */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gradient mb-2">
                  {dictionary.dashboard.welcome},{" "}
                  {user?.name || dictionary.auth.username}!
                </h1>
                <p className="text-lg text-muted-foreground">
                  {dictionary.dashboard.manageAccount}
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2 border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30"
              >
                <LogOut className="w-4 h-4" />
                {dictionary.auth.logout}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {dictionary.dashboard.accountInfo}
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">
                      {dictionary.auth.email}:
                    </span>{" "}
                    {user?.email}
                  </p>
                  <p>
                    <span className="font-medium">
                      {dictionary.auth.username}:
                    </span>{" "}
                    {user?.role}
                  </p>
                  <p>
                    <span className="font-medium">
                      {dictionary.auth.profile}:
                    </span>{" "}
                    {user?.sub_status}
                  </p>
                  {/* {user?.institution_id && (
                    <p>
                      <span className="font-medium">
                        {dictionary.auth.institution.required}:
                      </span>{" "}
                      {user.institution_id}
                    </p>
                  )} */}
                </div>
              </div>

              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {dictionary.dashboard.myResources}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  {dictionary.dashboard.accessResources}
                </p>
                <Button className="bg-gradient-primary hover:bg-gradient-primary-hover text-white">
                  {dictionary.dashboard.viewResources}
                </Button>
              </div>

              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {dictionary.dashboard.profileSettings}
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  {dictionary.dashboard.updateProfile}
                </p>
                <Button className="bg-gradient-primary hover:bg-gradient-primary-hover text-white">
                  {dictionary.dashboard.editProfile}
                </Button>
              </div>
            </div>

            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">
                {dictionary.dashboard.comingSoon}
              </h2>
              <p className="text-muted-foreground">
                {dictionary.dashboard.personalizedDashboard}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
