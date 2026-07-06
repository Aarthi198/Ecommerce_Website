import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    const isAdmin = user?.role === 'admin';
    signOut();
    setIsMenuOpen(false);
    navigate(isAdmin ? '/admin/login' : '/');
  };

  // Navigation links based on role
  const getNavLinks = () => {
    if (user?.role === 'admin') {
      return [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Orders', href: '/admin/orders' },
        { label: 'Products', href: '/admin/products' },
      ];
    }

    if (user && user.role !== 'admin') {
      return [
        { label: 'Home', href: '/' },
        { label: 'All Products', href: '/products' },
        { label: 'Bangles', href: '/products/bangles' },
        { label: 'Earrings', href: '/products/earrings' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'My Orders', href: '/my-orders' },
      ];
    }

    return [
      { label: 'Home', href: '/' },
      { label: 'All Products', href: '/products' },
      { label: 'Bangles', href: '/products/bangles' },
      { label: 'Earrings', href: '/products/earrings' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ];
  };

  const navLinks = getNavLinks();
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/70 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          {/* Logo (left) */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src="/images/Logo.png" alt="Threads & Trinkets logo" className="w-[200px] max-w-[220px] object-contain" />
            </Link>
          </div>

          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center justify-center space-x-8 text-sm font-medium text-slate-700">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="transition-all duration-200 hover:text-pink-600 hover:-translate-y-0.5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions (right) */}
          <div className="flex items-center justify-end space-x-2">
            <div className="hidden md:flex">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5 text-slate-700" />
              </Button>
            </div>

            {/* User Section */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate('/admin/dashboard')}
                      title="Admin Dashboard"
                    >
                      <Settings className="h-5 w-5 text-slate-700" />
                    </Button>
                  )}
                  <div className="px-3 py-2 rounded-md bg-pink-50 border border-pink-100">
                    <p className="text-sm font-medium text-slate-700">
                      {user.name?.split(' ')[0] || 'User'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    title="Sign out"
                  >
                    <LogOut className="h-5 w-5 text-slate-700" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    <Link to="/signin">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full bg-pink-600 hover:bg-pink-700"
                  >
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Cart Button */}
            {user?.role !== 'admin' && (
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/cart')}
                  className="relative"
                >
                  <ShoppingCart className="h-5 w-5 text-slate-700" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-slate-700" />
                ) : (
                  <Menu className="h-5 w-5 text-slate-700" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 flex flex-col space-y-4 bg-background border-t mt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium hover:text-primary transition-colors px-4 py-2 rounded-md hover:bg-secondary/20"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile User Actions */}
            <div className="border-t pt-4 space-y-2">
              {user ? (
                <>
                  <div className="px-4 py-2 bg-pink-50 border border-pink-100 rounded-md">
                    <p className="text-sm font-medium text-slate-700">
                      Signed in as {user.name?.split(' ')[0] || 'User'}
                    </p>
                  </div>
                  {user.role === 'admin' && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-pink-600 hover:bg-pink-700"
                  >
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      Create Account
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

