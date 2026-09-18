import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { accessToken, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToastAndRedirect = (msg, path) => {
    setToast(msg);
    setTimeout(() => {
      setToast('');
      navigate(path);
    }, 2000); // Wait 2s to let user read toast before redirecting
  };

  const handleProtectedAction = (e, path, msg) => {
    e.preventDefault();
    if (accessToken) {
      navigate(path);
    } else {
      if (msg) {
        showToastAndRedirect(msg, '/login');
      } else {
        navigate('/login');
      }
    }
  };

  const handleScrollToAbout = (e) => {
    e.preventDefault();
    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback if no #about exists, just scroll to bottom/footer
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] bg-surface border border-border-subtle shadow-xl px-6 py-3 rounded-full text-sm font-bold text-text-primary flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <nav 
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-surface/80 backdrop-blur-md border-b border-border-subtle shadow-sm" : "bg-transparent"
        )}
      >
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary">
              LoanAssist
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Home</Link>
              
              <a href="/dashboard/loan" onClick={(e) => handleProtectedAction(e, '/dashboard/loan', 'Please login to use Loan Eligibility.')} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
                Loan
              </a>
              
              <a href="/dashboard/cards" onClick={(e) => handleProtectedAction(e, '/dashboard/cards', 'Please login to access Credit Card Recommendation.')} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
                Credit Cards
              </a>
              
              <a href="/dashboard/emi-calculator" onClick={(e) => handleProtectedAction(e, '/dashboard/emi-calculator', 'Please login to use the EMI Calculator.')} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
                EMI Calculator
              </a>

              <a href="#about" onClick={handleScrollToAbout} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
                About
              </a>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="/dashboard" onClick={(e) => handleProtectedAction(e, '/dashboard', '')} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
              Dashboard
            </a>

            {accessToken ? (
              <button 
                onClick={logout}
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium bg-primary text-surface px-5 py-2 rounded-full hover:bg-primary-dark transition-colors hover-lift shadow-md shadow-primary/20">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
