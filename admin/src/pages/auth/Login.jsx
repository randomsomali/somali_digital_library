//src/pages/auth/login.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle2 } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Admin Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <div className="p-6 space-y-6">
            {(formError || authError) && (
              <Alert variant="destructive">
                <AlertDescription>
                  {formError || authError}
                </AlertDescription>
              </Alert>
            )}

            {authMessage && (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-600 dark:text-green-400 ml-2">
                  {authMessage}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  autoComplete="username"
                  className={formError?.includes('email') ? 'border-destructive' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                  className={formError?.includes('password') ? 'border-destructive' : ''}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </div>

          <div className="p-6 border-t">
            <p className="text-center text-sm text-muted-foreground">
              Contact the system administrator if you're having trouble logging in
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;