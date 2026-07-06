import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { adminSignIn, user, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (user && user.role !== 'admin') {
        signOut();
      }

      await adminSignIn(email, password);
      toast({ title: 'Welcome back', description: 'Admin login successful' });
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: (error as Error).message || 'Invalid admin credentials',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role === 'admin') {
    return null;
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
        <div className="bg-pink-600 px-8 py-6 text-white text-center">
          <h1 className="text-2xl font-serif font-bold">Admin Sign In</h1>
          <p className="text-pink-100 text-sm mt-1">
            Manage orders, products, and store settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-slate-700">
              Admin email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-slate-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-pink-600 hover:bg-pink-700 h-11 text-base"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in to dashboard'}
          </Button>
        </form>

        <div className="px-8 pb-8 pt-0 text-center border-t border-slate-100 bg-slate-50 py-4">
          <p className="text-sm text-slate-500">
            Shopping as a customer?{' '}
            <Link to="/signin" className="text-pink-600 font-medium hover:underline">
              Customer login
            </Link>
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 mt-6 max-w-sm mx-auto">
        This page is separate from customer sign-in and uses the admin API only.
      </p>
    </div>
  );
};

export default AdminLogin;
