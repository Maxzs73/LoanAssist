import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import AnimatedCounter from '../components/shared/AnimatedCounter';
import Footer from '../components/layout/Footer';
import { 
  Brain, Banknote, CreditCard as CardIcon, 
  Calculator, Activity, TrendingUp,
  ChevronDown, Quote
} from 'lucide-react';

const fadeInStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// Section Components
const HeroSection = () => {
  const { accessToken } = useAuthStore();
  
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Background Gradient Mesh & Blobs */}
      <div className="absolute inset-0 bg-gradient-mesh z-0"></div>
      <motion.div 
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl z-0"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-accent/10 rounded-full blur-3xl z-0"
      />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10 w-full text-center">
        <motion.div
          variants={fadeInStagger}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            AI-Powered Financial Intelligence
          </motion.div>

          <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-7xl font-extrabold text-text-primary tracking-tight leading-tight mb-6">
            AI Powered Loan & <br className="hidden md:block"/>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Credit Card Recommendation
            </span>
          </motion.h1>

          <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed">
            Instant eligibility checks, personalized bank matches, EMI planning, and comprehensive financial health scoring in seconds.
          </motion.p>

          <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full justify-center">
            <Link 
              to={accessToken ? "/dashboard/loan" : "/register"} 
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-surface font-semibold hover:bg-primary-dark transition-colors hover-lift shadow-lg shadow-primary/25"
            >
              Check Loan Eligibility
            </Link>
            <Link 
              to={accessToken ? "/dashboard/cards" : "/register"} 
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-surface border border-border-subtle text-text-primary font-semibold hover:bg-background transition-colors hover-lift shadow-sm"
            >
              Find Best Credit Card
            </Link>
          </motion.div>

          {/* Trust Row */}
          <motion.div variants={fadeUpVariant} className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 pt-8 border-t border-border-subtle w-full max-w-3xl">
            <AnimatedCounter value="10000" suffix="+" label="Applications Evaluated" />
            <AnimatedCounter value="3" suffix=" Sec" label="AI Decisions" />
            <AnimatedCounter value="50" suffix="+" label="Partner Banks" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    { icon: Brain, title: "AI Prediction", desc: "Instant eligibility decisions powered by machine learning algorithms." },
    { icon: Banknote, title: "Top Bank Recommendations", desc: "Ranked list of the best-fit lenders tailored to your profile." },
    { icon: CardIcon, title: "Smart Credit Card Matching", desc: "Cards perfectly matched to your income and credit profile." },
    { icon: Calculator, title: "EMI Calculator", desc: "Plan and optimize your monthly payments before you apply." },
    { icon: Activity, title: "Financial Health Score", desc: "A comprehensive 0-100 score analyzing your strengths and weaknesses." },
    { icon: TrendingUp, title: "Improvement Suggestions", desc: "Concrete, actionable next steps to improve your eligibility over time." }
  ];

  return (
    <section id="features" className="py-24 bg-surface" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">Everything you need to make smarter credit decisions</h2>
          <p className="text-lg text-text-secondary">Comprehensive tools to analyze and improve your financial standing.</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={fadeInStagger}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              variants={fadeUpVariant}
              className="p-8 rounded-2xl bg-surface border border-border-subtle shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-surface transition-colors">
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">{f.title}</h3>
              <p className="text-text-secondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    "Register",
    "Fill Details",
    "AI Prediction",
    "Recommendation",
    "EMI + Financial Report"
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">How it works</h2>
          <p className="text-lg text-text-secondary">Get your personalized results in 5 simple steps.</p>
        </div>

        <motion.div 
          className="relative flex flex-col md:flex-row justify-between items-center md:items-start max-w-5xl mx-auto"
          variants={fadeInStagger}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-8 left-10 right-10 h-0.5 bg-border-subtle z-0" />
          
          {/* Connecting line (mobile) */}
          <div className="md:hidden absolute top-0 bottom-0 left-1/2 w-0.5 bg-border-subtle -translate-x-1/2 z-0" />

          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeUpVariant} className="relative z-10 flex flex-col items-center mb-10 md:mb-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-surface flex items-center justify-center text-xl font-bold mb-4 shadow-lg shadow-primary/20">
                {i + 1}
              </div>
              <div className="text-center md:max-w-[120px]">
                <h4 className="font-semibold text-text-primary text-sm">{step}</h4>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    { quote: "LoanAssist completely changed how I approach credit. The AI matched me with a card I didn't even know I was eligible for, saving me thousands in fees.", name: "Rahul Sharma", role: "Software Engineer, Bengaluru" },
    { quote: "The financial health score was an eye-opener. The suggestions helped me improve my profile, and I got my home loan approved within weeks.", name: "Priya Desai", role: "Marketing Director, Mumbai" },
    { quote: "I was confused by all the credit card options out there. This platform made it so simple by ranking them based on my exact spending habits.", name: "Arjun Reddy", role: "Entrepreneur, Hyderabad" }
  ];

  return (
    <section className="py-24 bg-surface" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-16 text-center">Loved by thousands across India</h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={fadeInStagger}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUpVariant} className="p-8 rounded-2xl bg-background border border-border-subtle hover-lift shadow-sm">
              <Quote className="text-primary/40 mb-6" size={32} />
              <p className="text-text-primary mb-8 leading-relaxed font-medium">"{t.quote}"</p>
              <div>
                <p className="font-bold text-text-primary">{t.name}</p>
                <p className="text-sm text-text-secondary">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const FaqItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border-subtle py-4">
      <button 
        className="w-full flex items-center justify-between text-left focus:outline-none" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-text-primary text-lg pr-4">{q}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-text-secondary">
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <motion.div 
        initial={false} 
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }} 
        className="overflow-hidden"
      >
        <p className="pt-4 text-text-secondary leading-relaxed">{a}</p>
      </motion.div>
    </div>
  );
};

const FaqSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const faqs = [
    { q: "Is my data secure?", a: "Yes, we use bank-grade encryption to protect your financial data. We do not sell your personal information to third parties without your explicit consent." },
    { q: "How accurate is the AI prediction?", a: "Our models are trained on millions of data points and achieve over 92% accuracy in predicting bank approval decisions based on your provided profile." },
    { q: "Is there a fee to check eligibility?", a: "No, checking your loan or credit card eligibility on LoanAssist is 100% free. We may earn a small commission if you successfully apply through our partner links." },
    { q: "Which banks do you compare?", a: "We currently support predictions and recommendations for over 50 leading public, private, and foreign banks operating in India, including HDFC, SBI, ICICI, and Axis." },
    { q: "How is the Financial Health Score calculated?", a: "The score evaluates multiple parameters including your income-to-debt ratio, employment stability, age, and existing liabilities to generate a composite score from 0 to 100." }
  ];

  return (
    <section className="py-24 bg-background" ref={ref}>
      <div className="max-w-[800px] mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-10 text-center">Frequently Asked Questions</h2>
        <motion.div
          variants={fadeUpVariant}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
        </motion.div>
      </div>
    </section>
  );
};

const CtaSection = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-primary to-accent relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="max-w-[1280px] mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-surface mb-8 tracking-tight">Ready to find your best financial fit?</h2>
        <Link 
          to="/register" 
          className="inline-block px-10 py-4 rounded-full bg-surface text-primary font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          Get Started Free
        </Link>
      </div>
    </section>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
