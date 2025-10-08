import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Wallet, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = loginSchema; // Same as login schema, no name field needed

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '' },
  });

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email: data.email, password: data.password });
      login(response.token, response.user);
      toast.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'ECONNABORTED') {
        toast.error('Connection timeout. Please check your internet connection and try again.');
      } else if (error.response?.status === 401) {
        toast.error('Invalid email or password.');
      } else if (error.response?.status === 429) {
        toast.error('Too many login attempts. Please try again later.');
      } else if (!error.response) {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await authApi.register({ 
        email: data.email, 
        password: data.password
      });
      login(response.token, response.user);
      toast.success('Registration successful! Welcome to Finance Tracker!');
      navigate('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'ECONNABORTED') {
        toast.error('Connection timeout. Please check your internet connection and try again.');
      } else if (error.response?.status === 409) {
        toast.error('Email already exists. Please use a different email or try logging in.');
      } else if (error.response?.status === 422) {
        toast.error('Invalid data. Please check your email and password format.');
      } else if (error.response?.status === 429) {
        toast.error('Too many registration attempts. Please try again later.');
      } else if (!error.response) {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">FinanceTracker</CardTitle>
          <CardDescription>Manage your finances with ease</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted p-1 rounded-lg">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm font-medium transition-all duration-200"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your@email.com" 
                            {...field}
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showLoginPassword ? "text" : "password"} 
                              placeholder="••••••" 
                              {...field} 
                              className="pr-10"
                              autoComplete="current-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowLoginPassword(!showLoginPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                              {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your@email.com" 
                            {...field}
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showRegisterPassword ? "text" : "password"} 
                              placeholder="••••••" 
                              {...field} 
                              className="pr-10"
                              autoComplete="new-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                              {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Register'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
