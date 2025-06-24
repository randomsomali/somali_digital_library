//login.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import Link from "next/link";
import { AppDictionary } from "@/types/dictionary";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { getInstitutions } from "@/lib/api";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LoginProps {
  dictionary: AppDictionary;
  lang: string;
}

export default function Login({ dictionary, lang }: LoginProps) {
  const [activeTab, setActiveTab] = useState("user");
  const [loading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [institutionsLoading, setInstitutionsLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    institution: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [backendError, setBackendError] = useState<string>("");

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const { toast } = useToast();

  // Fetch institutions on component mount
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const institutionsData = await getInstitutions();
        setInstitutions(institutionsData);
      } catch (error) {
        console.error("Failed to fetch institutions:", error);
      } finally {
        setInstitutionsLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = dictionary.auth.errors.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = dictionary.auth.errors.invalidEmail;
    }

    if (!formData.password) {
      newErrors.password = dictionary.auth.errors.required;
    }

    if (activeTab === "student" && !formData.institution) {
      newErrors.institution = dictionary.auth.errors.selectInstitution;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description:
          Object.values(errors).join(" ") || "Please fix the errors above.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setBackendError("");

    try {
      await login(
        formData.email,
        formData.password,
        activeTab as "user" | "student" | "institution",
        formData.institution
      );
      toast({
        title: "Success",
        description:
          dictionary.auth.loginSuccess || "Login successful! Redirecting...",
      });
    } catch (error: unknown) {
      let errorMessage = dictionary.auth.invalidCredentials;
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as any).message === "string"
      ) {
        errorMessage = (error as { message: string }).message;
      }
      setBackendError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (backendError) {
      setBackendError("");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {/* Back Button if returnUrl exists */}
          {returnUrl && (
            <div className="mb-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to previous page
              </Button>
            </div>
          )}

          <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-gradient">
                {dictionary.auth.welcomeBack}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {dictionary.auth.loginWithEmail}
              </CardDescription>
              {returnUrl && (
                <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
                  Please log in to access the requested resource
                </div>
              )}
            </CardHeader>
            <CardContent>
              {backendError && (
                <Alert className="mb-4 border-destructive/50 bg-destructive/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-destructive">
                    {backendError}
                  </AlertDescription>
                </Alert>
              )}

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="user" className="text-sm">
                    {dictionary.auth.tabs.user}
                  </TabsTrigger>
                  <TabsTrigger value="student" className="text-sm">
                    {dictionary.auth.tabs.student}
                  </TabsTrigger>
                  <TabsTrigger value="institution" className="text-sm">
                    {dictionary.auth.tabs.institution}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="user" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {dictionary.auth.form.email}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">
                          {dictionary.auth.form.password}
                        </Label>
                        <Link
                          href="#"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {dictionary.auth.forgotPassword}
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className={errors.password ? "border-destructive" : ""}
                      />
                      {errors.password && (
                        <p className="text-sm text-destructive">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-primary hover:bg-gradient-primary-hover"
                      disabled={loading}
                    >
                      {loading
                        ? dictionary.auth.form.loading
                        : dictionary.auth.login}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="student" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="student-email">
                        {dictionary.auth.form.email}
                      </Label>
                      <Input
                        id="student-email"
                        type="email"
                        placeholder="student@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-institution">
                        {dictionary.auth.institution.select}
                      </Label>
                      <Select
                        value={formData.institution}
                        onValueChange={(value) =>
                          handleInputChange("institution", value)
                        }
                        disabled={institutionsLoading}
                      >
                        <SelectTrigger
                          className={
                            errors.institution ? "border-destructive" : ""
                          }
                        >
                          <SelectValue
                            placeholder={
                              dictionary.auth.institution.placeholder
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {institutions.map((institution) => (
                            <SelectItem
                              key={institution.id}
                              value={institution.id}
                            >
                              {institution.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.institution && (
                        <p className="text-sm text-destructive">
                          {errors.institution}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-password">
                        {dictionary.auth.form.password}
                      </Label>
                      <Input
                        id="student-password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className={errors.password ? "border-destructive" : ""}
                      />
                      {errors.password && (
                        <p className="text-sm text-destructive">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-primary hover:bg-gradient-primary-hover"
                      disabled={loading || institutionsLoading}
                    >
                      {loading
                        ? dictionary.auth.form.loading
                        : dictionary.auth.login}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="institution" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="institution-email">
                        {dictionary.auth.form.email}
                      </Label>
                      <Input
                        id="institution-email"
                        type="email"
                        placeholder="admin@institution.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institution-password">
                        {dictionary.auth.form.password}
                      </Label>
                      <Input
                        id="institution-password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className={errors.password ? "border-destructive" : ""}
                      />
                      {errors.password && (
                        <p className="text-sm text-destructive">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-primary hover:bg-gradient-primary-hover"
                      disabled={loading}
                    >
                      {loading
                        ? dictionary.auth.form.loading
                        : dictionary.auth.login}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  {dictionary.auth.dontHaveAccount}{" "}
                </span>
                <Link
                  href={`/${lang}/register`}
                  className="text-primary hover:underline font-medium"
                >
                  {dictionary.auth.signup}
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <span>{dictionary.auth.byContinuing} </span>
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              {dictionary.auth.termsOfService}
            </Link>
            <span> {dictionary.auth.and} </span>
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              {dictionary.auth.privacyPolicy}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
