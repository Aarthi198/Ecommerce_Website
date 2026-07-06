import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

interface AdminAuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Standalone layout for admin authentication — no customer Header/Footer.
 */
const AdminAuthLayout: React.FC<AdminAuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-pink-950">
      <header className="px-6 py-5 border-b border-white/10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link to="/admin/login" className="flex items-center gap-2 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-600">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-serif font-semibold text-lg tracking-tight">
              Threads & Trinkets
            </span>
          </Link>
          <span className="text-xs font-medium uppercase tracking-wider text-pink-300/90">
            Admin
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        {children}
      </main>

      <footer className="px-6 py-4 text-center border-t border-white/10">
        <p className="text-xs text-slate-400">
          Authorized personnel only.{' '}
          <Link to="/" className="text-pink-300 hover:text-pink-200 underline-offset-2 hover:underline">
            Return to store
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default AdminAuthLayout;
