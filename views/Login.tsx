
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { INITIAL_USER } from '../constants';

interface LoginProps {
  onLogin: (u: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('sagar@gmail.com');
  const [password, setPassword] = useState('sagar');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Demo authentication
    if (email === 'sagar@gmail.com' && password === 'sagar') {
      onLogin(INITIAL_USER);
      navigate('/');
    } else {
      setError('Invalid email or password. Please use the provided credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 md:mt-24">
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-block w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mb-4">
            P
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
          <p className="text-slate-500">Login to manage your orders</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all transform active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-slate-500 text-sm">
            Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create Account</Link>
          </p>
        </div>
        
        <div className="mt-6 p-4 bg-indigo-50 rounded-xl text-xs text-indigo-700">
          <p className="font-bold mb-1">Demo Credentials:</p>
          <p>Email: sagar@gmail.com</p>
          <p>Password: sagar</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
