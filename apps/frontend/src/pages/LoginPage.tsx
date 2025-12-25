import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { Loader } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const { user, token } = await response.json();

      // Store auth in Zustand
      setAuth(user, token);

      toast({
        title: 'Welcome back!',
        description: "You've successfully logged in.",
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-[100vh] max-h-[100vh] w-full overflow-y-auto flex items-center justify-center px-4 py-10"
      style={{
        backgroundColor: '#6B2C91',
        backgroundImage: 'url(/assets/images/bg-pattern.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Card className="w-full max-w-md bg-[#71309c] border-none shadow-2xl rounded-2xl">
        <CardHeader className="space-y-3 pt-6 pb-2">
          <div className="flex justify-center">
            <img src="/assets/images/logo-white.png" alt="QuitSmart Logo" className="w-20 h-20 object-contain drop-shadow-md" />
          </div>
          <CardTitle className="text-2xl text-center text-white font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-center text-white/80">
            Log in to continue your quit journey
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-semibold text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="h-12 bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-[#F9C015] focus:ring-[#F9C015] rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-semibold text-sm sm:text-base">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-[#F9C015] focus:ring-[#F9C015] rounded-lg"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#F9C015] hover:bg-[#c49005] text-[#561F7A] font-semibold h-12 rounded-lg transition-all shadow-md hover:shadow-lg"
              size="lg"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Log In'}
            </Button>
          </form>
          <div className="mt-5 text-center text-sm text-white/80">
            <span>Don't have an account? </span>
            <Link to="/" className="text-[#F9C015] hover:text-[#c49005] hover:underline font-semibold transition-colors">
              Get Started
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
