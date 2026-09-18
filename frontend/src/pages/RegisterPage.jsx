import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, ShieldCheck, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../store/authStore';

const registerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirm: z.string()
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ["password_confirm"],
});

const calculatePasswordStrength = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score += 1;
  if (password.match(/\d/)) score += 1;
  if (password.match(/[^a-zA-Z\d]/)) score += 1;
  return score;
};

const BrandedPanel = () => (
  <div className="hidden lg:flex flex-col justify-between w-full lg:w-[55%] bg-gradient-mesh p-14 lg:p-16 relative overflow-hidden border-r border-border-subtle/50">
    <div className="absolute inset-0 bg-primary/5"></div>
    
    <div className="relative z-10">
      <Link to="/" className="text-3xl font-extrabold tracking-tight text-primary">
        LoanAssist
      </Link>
    </div>

    <div className="relative z-10 max-w-lg">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl lg:text-5xl font-extrabold text-text-primary leading-tight mb-8"
      >
        Join the future of intelligent finance.
      </motion.h2>
      
      <div className="space-y-5">
        {[
          { icon: ShieldCheck, text: "Bank-grade data security" },
          { icon: Zap, text: "Instant AI eligibility checks" },
          { icon: TrendingUp, text: "Actionable credit insights" }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className="flex items-center gap-4 text-text-secondary bg-surface/60 backdrop-blur-md p-4 rounded-2xl border border-border-subtle shadow-sm w-fit"
          >
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
              <item.icon size={22} />
            </div>
            <span className="font-semibold text-[15px]">{item.text}</span>
          </motion.div>
        ))}
      </div>
    </div>

    <div className="relative z-10 text-sm font-medium text-text-secondary/70">
      © {new Date().getFullYear()} LoanAssist. All rights reserved.
    </div>
  </div>
);

const RegisterPage = () => {
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const passwordValue = watch("password", "");
  const strength = calculatePasswordStrength(passwordValue);

  const getStrengthColor = () => {
    if (strength === 0) return 'bg-border-subtle';
    if (strength <= 1) return 'bg-danger';
    if (strength <= 2) return 'bg-amber-500';
    if (strength <= 3) return 'bg-emerald-400';
    return 'bg-success';
  };
  const getStrengthLabel = () => {
    if (strength === 0) return '';
    if (strength <= 1) return 'Weak';
    if (strength <= 2) return 'Fair';
    if (strength <= 3) return 'Good';
    return 'Strong';
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setGlobalError('');
    try {
      await registerUser(data);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      if (err.response?.status === 400 && typeof err.response.data === 'object') {
        const errorData = err.response.data;
        Object.keys(errorData).forEach((field) => {
          if (Array.isArray(errorData[field])) {
            setError(field, { type: 'server', message: errorData[field][0] });
          } else if (typeof errorData[field] === 'string') {
            setError(field, { type: 'server', message: errorData[field] });
          } else {
            setGlobalError('An error occurred during registration.');
          }
        });
      } else {
        setGlobalError(err.response?.data?.message || err.response?.data?.detail || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-surface to-background p-4 sm:p-8 relative overflow-hidden">
      {/* Subtle Background Decorative Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[70%] -right-[10%] w-[40%] h-[50%] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-[1280px] bg-surface rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-border-subtle overflow-hidden flex flex-col lg:flex-row relative z-10 min-h-[850px]">
        <BrandedPanel />

        <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[460px]"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden mb-10 text-center">
              <Link to="/" className="text-3xl font-extrabold tracking-tight text-primary">
                LoanAssist
              </Link>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-3">Create an account</h2>
              <p className="text-text-secondary text-base">Enter your details to get started.</p>
            </div>
            
            <AnimatePresence>
              {globalError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 28 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-4 bg-danger/10 text-danger text-sm font-medium rounded-2xl border border-danger/20">
                    <AlertCircle size={20} />
                    {globalError}
                  </div>
                </motion.div>
              )}
              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 28 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-4 bg-success/10 text-success text-sm font-medium rounded-2xl border border-success/20">
                    <CheckCircle2 size={20} />
                    Account created successfully! Redirecting...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">First Name</label>
                  <input
                    {...register('first_name')}
                    className={`w-full px-5 py-3.5 bg-background border ${errors.first_name ? 'border-danger focus:ring-danger/20' : 'border-border-subtle focus:ring-primary/20 focus:border-primary'} rounded-2xl focus:ring-4 outline-none transition-all text-[15px]`}
                    placeholder="John"
                  />
                  <AnimatePresence>
                    {errors.first_name && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-xs font-semibold text-danger">
                        {errors.first_name.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-primary mb-2">Last Name</label>
                  <input
                    {...register('last_name')}
                    className={`w-full px-5 py-3.5 bg-background border ${errors.last_name ? 'border-danger focus:ring-danger/20' : 'border-border-subtle focus:ring-primary/20 focus:border-primary'} rounded-2xl focus:ring-4 outline-none transition-all text-[15px]`}
                    placeholder="Doe"
                  />
                  <AnimatePresence>
                    {errors.last_name && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-xs font-semibold text-danger">
                        {errors.last_name.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Username</label>
                <input
                  {...register('username')}
                  className={`w-full px-5 py-3.5 bg-background border ${errors.username ? 'border-danger focus:ring-danger/20' : 'border-border-subtle focus:ring-primary/20 focus:border-primary'} rounded-2xl focus:ring-4 outline-none transition-all text-[15px]`}
                  placeholder="johndoe123"
                />
                <AnimatePresence>
                  {errors.username && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-xs font-semibold text-danger">
                      {errors.username.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  className={`w-full px-5 py-3.5 bg-background border ${errors.email ? 'border-danger focus:ring-danger/20' : 'border-border-subtle focus:ring-primary/20 focus:border-primary'} rounded-2xl focus:ring-4 outline-none transition-all text-[15px]`}
                  placeholder="john@example.com"
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-xs font-semibold text-danger">
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Password</label>
                <input
                  {...register('password')}
                  type="password"
                  className={`w-full px-5 py-3.5 bg-background border ${errors.password ? 'border-danger focus:ring-danger/20' : 'border-border-subtle focus:ring-primary/20 focus:border-primary'} rounded-2xl focus:ring-4 outline-none transition-all text-[15px]`}
                  placeholder="••••••••"
                />
                {/* Password Strength Indicator */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 flex h-1.5 gap-1 rounded-full overflow-hidden">
                    <div className={`flex-1 ${strength >= 1 ? getStrengthColor() : 'bg-border-subtle'} transition-colors duration-300`} />
                    <div className={`flex-1 ${strength >= 2 ? getStrengthColor() : 'bg-border-subtle'} transition-colors duration-300`} />
                    <div className={`flex-1 ${strength >= 3 ? getStrengthColor() : 'bg-border-subtle'} transition-colors duration-300`} />
                    <div className={`flex-1 ${strength >= 4 ? getStrengthColor() : 'bg-border-subtle'} transition-colors duration-300`} />
                  </div>
                  <span className={`text-[11px] uppercase tracking-wider font-bold w-14 text-right ${strength > 0 ? getStrengthColor().replace('bg-', 'text-') : 'text-text-secondary/60'}`}>
                    {getStrengthLabel()}
                  </span>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-xs font-semibold text-danger">
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Confirm Password</label>
                <input
                  {...register('password_confirm')}
                  type="password"
                  className={`w-full px-5 py-3.5 bg-background border ${errors.password_confirm ? 'border-danger focus:ring-danger/20' : 'border-border-subtle focus:ring-primary/20 focus:border-primary'} rounded-2xl focus:ring-4 outline-none transition-all text-[15px]`}
                  placeholder="••••••••"
                />
                <AnimatePresence>
                  {errors.password_confirm && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-xs font-semibold text-danger">
                      {errors.password_confirm.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || showSuccess}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl shadow-[0_8px_20px_rgb(0,0,0,0.08)] shadow-primary/25 text-[15px] font-extrabold text-surface bg-primary hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all hover-lift disabled:opacity-70 disabled:hover:-translate-y-0 disabled:hover:shadow-none mt-6"
              >
                {isSubmitting || showSuccess ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {showSuccess ? 'Redirecting...' : 'Creating account...'}
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="mt-10 text-center text-[15px] font-semibold text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-dark transition-colors font-bold">
                Log in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
