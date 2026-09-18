import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import useAuthStore from '../store/authStore';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

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
        Smarter credit decisions start here.
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

const LoginPage = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg('Invalid username or password');
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

      <div className="w-full max-w-[1280px] bg-surface rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-border-subtle overflow-hidden flex flex-col lg:flex-row relative z-10 min-h-[750px]">
        <BrandedPanel />

        <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-8 sm:p-12 lg:p-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[420px]"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden mb-10 text-center">
              <Link to="/" className="text-3xl font-extrabold tracking-tight text-primary">
                LoanAssist
              </Link>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mb-3">Welcome back</h2>
              <p className="text-text-secondary text-base">Please enter your details to sign in.</p>
            </div>
            
            <AnimatePresence>
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 28 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-4 bg-danger/10 text-danger text-sm font-medium rounded-2xl border border-danger/20">
                    <AlertCircle size={20} />
                    {errorMsg}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Username</label>
                <input
                  {...register('username')}
                  className={`w-full px-5 py-3.5 bg-background border ${errors.username ? 'border-danger focus:ring-danger/20' : 'border-border-subtle focus:ring-primary/20 focus:border-primary'} rounded-2xl focus:ring-4 outline-none transition-all text-[15px]`}
                  placeholder="Enter your username"
                />
                <AnimatePresence>
                  {errors.username && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-2 text-xs font-semibold text-danger"
                    >
                      {errors.username.message}
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
                <AnimatePresence>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-2 text-xs font-semibold text-danger"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl shadow-[0_8px_20px_rgb(0,0,0,0.08)] shadow-primary/25 text-[15px] font-extrabold text-surface bg-primary hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all hover-lift disabled:opacity-70 disabled:hover:-translate-y-0 disabled:hover:shadow-none mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Log In'
                )}
              </button>
            </form>

            <p className="mt-10 text-center text-[15px] font-semibold text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary-dark transition-colors font-bold">
                Register
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
