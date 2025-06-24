//register.tsx
"use client";

import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import Link from "next/link";
import { AppDictionary } from "@/types/dictionary";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface RegisterProps {
  dictionary: AppDictionary;
  lang: string;
}

export default function Register({ dictionary, lang }: RegisterProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [backendError, setBackendError] = useState<string>("");

  const { login, register } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = dictionary.auth.errors.required;
    } else if (formData.name.length > 255) {
      newErrors.name = dictionary.auth.errors.nameTooLong;
    }

    if (!formData.email) {
      newErrors.email = dictionary.auth.errors.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = dictionary.auth.errors.invalidEmail;
    } else if (formData.email.length > 100) {
      newErrors.email = dictionary.auth.errors.emailTooLong;
    }

    if (!formData.password) {
      newErrors.password = dictionary.auth.errors.required;
    } else if (formData.password.length < 6) {
      newErrors.password = dictionary.auth.errors.passwordTooShort;
    } else if (formData.password.length > 100) {
      newErrors.password = dictionary.auth.errors.passwordTooLong;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = dictionary.auth.errors.required;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = dictionary.auth.errors.passwordsDontMatch;
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
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      toast({
        title: "Success",
        description:
          dictionary.auth.registerSuccess ||
          "Registration successful! You have been logged in.",
      });
    } catch (error: any) {
      const errorMessage =
        error.message || "Registration failed. Please try again.";
      setBackendError(errorMessage);
      toast({
        title: "Registration Failed",
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
          <Card className="bg-card/60 backdrop-blur-sm border border-border/50 shadow-xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-gradient">
                {dictionary.auth.createAccount}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {dictionary.auth.loginWithEmail}
              </CardDescription>
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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{dictionary.auth.form.name}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{dictionary.auth.form.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    {dictionary.auth.form.password}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {dictionary.auth.form.confirmPassword}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={
                      errors.confirmPassword ? "border-destructive" : ""
                    }
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword}
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
                    : dictionary.auth.register}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  {dictionary.auth.alreadyHaveAccount}{" "}
                </span>
                <Link
                  href={`/${lang}/login`}
                  className="text-primary hover:underline font-medium"
                >
                  {dictionary.auth.login}
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
