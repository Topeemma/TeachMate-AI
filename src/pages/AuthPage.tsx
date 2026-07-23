import React, { useState } from 'react';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '../lib/firebase';
import { LogIn, UserPlus, AlertCircle, Loader2, Sparkles, Lock, Mail } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: () => void;
  onGuestAccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onGuestAccess }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please fill in both email and password');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      onAuthSuccess();
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      const errorCode = err?.code || '';

      if (isSignUp) {
        if (errorCode === 'auth/email-already-in-use') {
          setError('User already exists. Please sign in');
        } else if (errorCode === 'auth/weak-password') {
          setError('Password should be at least 6 characters');
        } else if (errorCode === 'auth/invalid-email') {
          setError('Please enter a valid email address');
        } else {
          setError('Email or password is incorrect');
        }
      } else {
        // Sign In error
        setError('Email or password is incorrect');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = (mode: boolean) => {
    setIsSignUp(mode);
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-purple-200/80 shadow-2xl p-8 space-y-6 relative overflow-hidden">
        {/* Top Glow Accent */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-bright-orange/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-primary-purple/15 rounded-full blur-2xl pointer-events-none" />

        {/* Logo & Title Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="w-14 h-14 bg-bright-orange rounded-2xl mx-auto flex items-center justify-center shadow-md">
            <Sparkles className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-2xl font-black text-deep-purple tracking-tight">
            TeachMate AI
          </h2>
          <p className="text-xs text-gray-600 font-medium max-w-xs mx-auto">
            Primary School Teacher Assistant — Please sign in to access your dashboard
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-purple-50 p-1.5 rounded-2xl border border-purple-100 relative z-10">
          <button
            type="button"
            onClick={() => toggleMode(false)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              !isSignUp
                ? 'bg-deep-purple text-white shadow-md'
                : 'text-gray-600 hover:text-deep-purple'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => toggleMode(true)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isSignUp
                ? 'bg-deep-purple text-white shadow-md'
                : 'text-gray-600 hover:text-deep-purple'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-2xl flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-deep-purple">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@school.edu.ng"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl text-xs text-dark-text font-medium focus:ring-2 focus:ring-primary-purple focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-deep-purple">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl text-xs text-dark-text font-medium focus:ring-2 focus:ring-primary-purple focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-bright-orange hover:bg-orange-600 active:scale-[0.99] text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
              </>
            ) : (
              <>
                {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        {onGuestAccess && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onGuestAccess}
              className="w-full py-3 bg-purple-50 hover:bg-purple-100 text-deep-purple font-black text-xs rounded-2xl border-2 border-primary-purple/30 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-bright-orange" />
              <span>Explore Demo Studio (No Sign In Needed)</span>
            </button>
          </div>
        )}

        <div className="text-center text-[11px] text-gray-500 pt-2 border-t border-gray-100">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => toggleMode(false)}
                className="text-primary-purple font-bold hover:underline cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          ) : (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => toggleMode(true)}
                className="text-primary-purple font-bold hover:underline cursor-pointer"
              >
                Sign up here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
