import { Link } from 'react-router-dom';
import { BriefcaseBusiness, Code2, Globe2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border-subtle pt-16 pb-8 bg-surface">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-primary mb-4 block">
              LoanAssist
            </Link>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              AI-powered financial intelligence platform designed to help you make smarter loan and credit card decisions.
            </p>
            <div className="flex items-center gap-4 text-text-secondary">
              <a href="#" aria-label="Website" className="hover:text-primary transition-colors"><Globe2 size={20} /></a>
              <a href="#" aria-label="Careers" className="hover:text-primary transition-colors"><BriefcaseBusiness size={20} /></a>
              <a href="#" aria-label="Source code" className="hover:text-primary transition-colors"><Code2 size={20} /></a>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="font-bold text-text-primary mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link to="/#loan" className="text-sm text-text-secondary hover:text-primary transition-colors">Loan Eligibility</Link></li>
              <li><Link to="/#cards" className="text-sm text-text-secondary hover:text-primary transition-colors">Credit Card Matches</Link></li>
              <li><Link to="/#emi-calculator" className="text-sm text-text-secondary hover:text-primary transition-colors">EMI Calculator</Link></li>
              <li><Link to="/dashboard" className="text-sm text-text-secondary hover:text-primary transition-colors">Financial Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="font-bold text-text-primary mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/#about" className="text-sm text-text-secondary hover:text-primary transition-colors">About Us</Link></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Press</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="font-bold text-text-primary mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-sm text-text-secondary hover:text-primary transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} LoanAssist. All rights reserved.
          </p>
          <p className="text-xs text-text-secondary/70">
            Note: This is a demo project for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
