import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, CheckCircle2, Lock, Mail, InfoIcon } from 'lucide-react';
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, admin, error: authError, message: authMessage } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && admin) {
      const redirectPath = location.state?.from?.pathname || 
        (admin.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard');
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, admin, navigate, location.state]);

  // Handle form errors
  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  const validateForm = () => {
    if (!email.trim()) {
      setFormError('Email is required');
      return false;
    }
    if (!password.trim()) {
      setFormError('Password is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const admin = await login(email, password);
      const redirectPath = location.state?.from?.pathname || 
        (admin.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard');
      
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <ThemeToggle className="absolute top-6 right-6" />
      
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          {/* Logo/Brand Area */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center p-2 bg-primary text-white rounded-lg mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Portal Access</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Secure admin management system
            </p>
          </div>

          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
              <h2 className="text-xl font-medium text-center">Sign In</h2>
            </CardHeader>
            
            <CardContent className="pt-6 pb-2 px-6">
              {(formError || authError) && (
                <Alert variant="destructive" className="mb-6">
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription className="ml-2">
                    {formError || authError}
                  </AlertDescription>
                </Alert>
              )}

              {authMessage && (
                <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-600 dark:text-green-400 ml-2">
                    {authMessage}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    disabled={isLoading}
                    autoComplete="username"
                    className={`${formError?.includes('email') ? 'border-destructive' : ''} bg-muted/30`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    autoComplete="current-password"
                    className={`${formError?.includes('password') ? 'border-destructive' : ''} bg-muted/30`}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-6" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Access Dashboard'
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="border-t px-6 py-4 bg-muted/10">
              <div className="w-full text-center text-sm text-muted-foreground">
                Need assistance? Contact support via
                <a href="https://wa.me/+252612995362" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                  WhatsApp
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;