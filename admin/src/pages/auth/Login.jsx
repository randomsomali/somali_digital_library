//src/pages/auth/login.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import logiImage from '../../assets/tahqiiq1.png';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(username, password);
      const from = location.state?.from?.pathname || 
        (user.role === 'admin' ? '/admin/dashboard' : '/staff/dashboard');
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Invalid username or password');
            break;
          case 429:
            setError('Too many login attempts. Please try again later.');
            break;
          default:
            setError('An error occurred. Please try again.');
        }
      } else {
        setError('Unable to connect to the server. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          {/* Updated logo section */}
          {/* <div className="flex justify-center">
            <div className="h-24 w-64 overflow-hidden">
              <img 
                src={logiImage} 
                alt="Logo" 
                className="h-full w-full object-contain"
              />
            </div>
          </div> */}
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full"
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>

              <div className="pt-2">
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
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t p-6">
            <p className="text-sm text-muted-foreground">
              Do n't Retry if username or the password is incorrect
              <Button variant="link" className="p-0 h-auto font-semibold">
                Just contact the admin for help
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;