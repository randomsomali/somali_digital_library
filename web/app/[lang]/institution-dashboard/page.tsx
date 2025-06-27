"use client";

import { useAuth } from "@/contexts/AuthContext";
import { getDictionary } from "@/lib/dictionary";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Building2,
  Users,
  BarChart3,
  Settings,
  BookOpen,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AppDictionary } from "@/types/dictionary";
import { use } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function InstitutionDashboardPage({
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
          <div className="max-w-6xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute lang={lang} requiredType={["institution"]}>
      <div className="min-h-screen bg-background pt-32 pb-20">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header with logout button */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gradient mb-2">
                  {dictionary.dashboard.institutionDashboard}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {dictionary.dashboard.institutionPortal}
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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">1,250</h3>
                <p className="text-muted-foreground">
                  {dictionary.dashboard.totalStudents}
                </p>
              </div>

              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">450</h3>
                <p className="text-muted-foreground">
                  {dictionary.dashboard.activeSubscriptions}
                </p>
              </div>

              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">2,340</h3>
                <p className="text-muted-foreground">
                  {dictionary.dashboard.resourcesAccessed}
                </p>
              </div>

              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">89%</h3>
                <p className="text-muted-foreground">
                  {dictionary.dashboard.engagementRate}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {dictionary.dashboard.institutionInfo}
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">
                      {dictionary.auth.form.name}:
                    </span>{" "}
                    {user?.name}
                  </p>
                  <p>
                    <span className="font-medium">
                      {dictionary.auth.email}:
                    </span>{" "}
                    {user?.email}
                  </p>
                  <p>
                    <span className="font-medium">
                      {dictionary.auth.profile}:
                    </span>{" "}
                    {user?.sub_status}
                  </p>
                  <p>
                    <span className="font-medium">
                      {dictionary.auth.username}:
                    </span>{" "}
                    {user?.role}
                  </p>
                </div>
              </div>

              <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    {dictionary.dashboard.quickActions}
                  </h3>
                </div>
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-primary hover:bg-gradient-primary-hover text-white justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    {dictionary.dashboard.manageStudents}
                  </Button>
                  <Button className="w-full bg-gradient-primary hover:bg-gradient-primary-hover text-white justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {dictionary.dashboard.viewReports}
                  </Button>
                  <Button className="w-full bg-gradient-primary hover:bg-gradient-primary-hover text-white justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    {dictionary.dashboard.updateInstitutionInfo}
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">
                {dictionary.dashboard.comingSoon}
              </h2>
              <p className="text-muted-foreground">
                {dictionary.dashboard.institutionFeatures}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
