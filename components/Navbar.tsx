
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Icons } from '../constants';

interface NavbarProps {
  user: User | null;
  cartCount: number;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, cartCount, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-slate-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="./logo.png" 
            alt="Devrajani Mobile Zone" 
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              // Fallback if logo.png is missing
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="font-black text-xl tracking-tighter hidden sm:block bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Devrajani Mobile Zone
          </span>
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Shop</Link>
          {user && (
            <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Orders</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Admin</Link>
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <Link to="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors">
            <Icons.Cart />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2 md:gap-4 border-l pl-4 border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                  <Icons.User />
                </div>
                <span className="hidden md:block text-sm font-medium text-slate-700">{user.name}</span>
              </div>
              <button 
                onClick={() => { onLogout(); navigate('/login'); }}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <Icons.Logout />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l pl-4 border-slate-100">
              <Link 
                to="/login" 
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="text-sm font-bold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
