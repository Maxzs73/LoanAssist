import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, CreditCard, Calculator, User, LogOut, X } from 'lucide-react';
import clsx from 'clsx';
import useAuthStore from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isMobileOpen, closeMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Loan Eligibility', path: '/dashboard/loan', icon: Wallet },
    { name: 'Credit Cards', path: '/dashboard/cards', icon: CreditCard },
    { name: 'EMI Calculator', path: '/dashboard/emi-calculator', icon: Calculator },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const displayName = user?.first_name || user?.username || 'User';

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-surface border-r border-border-subtle overflow-y-auto">
      {/* Header / Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border-subtle shrink-0">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-primary truncate">
          LoanAssist
        </Link>
        <button onClick={closeMobile} className="md:hidden text-text-secondary hover:text-text-primary p-1">
          <X size={20} />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-6 px-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMobile}
              className={clsx(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all relative overflow-hidden",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-text-secondary hover:bg-background hover:text-text-primary"
              )}
            >
              {isActive && (
                <motion.div layoutId="sidebar-active-bar" className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
              )}
              <Icon size={20} className={clsx("shrink-0", isActive ? "text-primary" : "text-text-secondary group-hover:text-text-primary")} />
              <span className="truncate md:hidden lg:block">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User & Logout */}
      <div className="p-4 border-t border-border-subtle shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg bg-background border border-border-subtle">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-surface flex items-center justify-center font-bold text-sm shrink-0">
            {getInitials(displayName)}
          </div>
          <div className="flex-1 min-w-0 md:hidden lg:block">
            <p className="text-sm font-bold text-text-primary truncate">{displayName}</p>
            <p className="text-xs text-text-secondary truncate">Free Plan</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
        >
          <LogOut size={20} className="shrink-0" />
          <span className="md:hidden lg:block">Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (lg: 256px, md: 80px) */}
      <aside className="hidden md:block w-20 lg:w-64 shrink-0 transition-all duration-300">
        <div className="fixed top-0 bottom-0 w-20 lg:w-64 z-40">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="fixed top-0 bottom-0 left-0 w-[280px] z-50 md:hidden shadow-2xl"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
