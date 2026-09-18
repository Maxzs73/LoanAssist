import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { getProfile, updateProfile } from '../api/auth';
import { useApplicationHistory } from '../store/historyStore';
import { formatConfidence } from '../utils/formatters';
import { 
  User, Mail, Phone, Calendar, MapPin, Briefcase, 
  Edit2, Save, X, Loader2, AlertCircle, FileText, CreditCard, CheckCircle2
} from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [globalError, setGlobalError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('account'); // 'account', 'loans', 'cards'
  
  const { history, fetchHistory } = useApplicationHistory();

  const { register, handleSubmit, reset, formState: { errors }, setError } = useForm();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getProfile();
      setProfileData(data);
      reset({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone_number: data.profile?.phone_number || '',
        date_of_birth: data.profile?.date_of_birth || '',
        gender: data.profile?.gender || '',
        occupation: data.profile?.occupation || '',
        city: data.profile?.city || '',
        state: data.profile?.state || ''
      });
    } catch (err) {
      setGlobalError('Failed to load profile data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSave = async (formData) => {
    try {
      setIsSaving(true);
      setGlobalError('');
      setSaveSuccess(false);

      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        profile: {
          phone_number: formData.phone_number,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          occupation: formData.occupation,
          city: formData.city,
          state: formData.state
        }
      };

      const updated = await updateProfile(payload);
      setProfileData(updated);
      setIsEditing(false);
      setSaveSuccess(true);
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      if (err.response?.status === 400 && typeof err.response.data === 'object') {
        const errData = err.response.data;
        // Handle top level errors
        ['first_name', 'last_name', 'email'].forEach(field => {
          if (errData[field]) setError(field, { type: 'server', message: errData[field][0] });
        });
        // Handle nested profile errors
        if (errData.profile && typeof errData.profile === 'object') {
          Object.keys(errData.profile).forEach(field => {
            if (Array.isArray(errData.profile[field])) {
              setError(field, { type: 'server', message: errData.profile[field][0] });
            }
          });
        }
        setGlobalError('Please fix the errors below.');
      } else {
        setGlobalError('An unexpected error occurred while saving.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (first, last, username) => {
    if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
    if (username) return username.substring(0, 2).toUpperCase();
    return 'U';
  };

  const genderMap = { 'M': 'Male', 'F': 'Female', 'O': 'Other', 'N': 'Prefer not to say' };

  const loansHistory = history.filter(h => h.type === 'loan');
  const cardsHistory = history.filter(h => h.type === 'card');

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mb-2">My Profile</h1>
        <p className="text-text-secondary text-lg">Manage your personal information and view your application history.</p>
      </div>

      <div className="flex border-b border-border-subtle mb-8 space-x-6">
        <button 
          onClick={() => setActiveTab('account')}
          className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'account' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Account Information
        </button>
        <button 
          onClick={() => setActiveTab('loans')}
          className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'loans' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Loan Applications ({loansHistory.length})
        </button>
        <button 
          onClick={() => setActiveTab('cards')}
          className={`pb-3 text-sm font-bold transition-colors ${activeTab === 'cards' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Credit Card Applications ({cardsHistory.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'account' && (
          <motion.div 
            key="account"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-surface rounded-3xl border border-border-subtle shadow-sm overflow-hidden">
              
              {isLoading ? (
                <div className="p-12 flex flex-col items-center justify-center text-text-secondary">
                  <Loader2 size={32} className="animate-spin text-primary mb-4" />
                  <p className="font-medium">Loading profile...</p>
                </div>
              ) : profileData ? (
                <>
                  <div className="p-8 border-b border-border-subtle bg-background/50 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-black shrink-0 border-2 border-surface shadow-sm">
                        {getInitials(profileData.first_name, profileData.last_name, profileData.username)}
                      </div>
                      <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-text-primary mb-1">
                          {profileData.first_name || profileData.last_name ? `${profileData.first_name} ${profileData.last_name}` : profileData.username}
                        </h2>
                        <div className="flex items-center gap-1.5 text-text-secondary text-sm font-medium justify-center md:justify-start">
                          <Mail size={16} />
                          {profileData.email}
                        </div>
                      </div>
                    </div>

                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-background border border-border-subtle text-text-primary font-bold hover:bg-border-subtle/30 transition-colors"
                      >
                        <Edit2 size={16} />
                        Edit Profile
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          reset(); // revert form
                          setGlobalError('');
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-background border border-border-subtle text-text-secondary font-bold hover:bg-border-subtle/30 transition-colors"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="p-8">
                    <AnimatePresence>
                      {globalError && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6">
                          <div className="flex items-center gap-3 p-4 bg-danger/10 text-danger text-sm font-medium rounded-xl border border-danger/20">
                            <AlertCircle size={18} /> {globalError}
                          </div>
                        </motion.div>
                      )}
                      {saveSuccess && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6">
                          <div className="flex items-center gap-3 p-4 bg-success/10 text-success text-sm font-medium rounded-xl border border-success/20">
                            <CheckCircle2 size={18} /> Profile updated successfully!
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit(onSave)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-2">Username</label>
                          <input type="text" value={profileData.username} disabled className="w-full px-4 py-2.5 bg-background/50 border border-border-subtle rounded-xl text-text-secondary cursor-not-allowed font-medium" />
                          <p className="text-xs text-text-secondary mt-1">Username cannot be changed.</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-2">Email Address</label>
                          <input type="email" {...register('email')} disabled={!isEditing} className={`w-full px-4 py-2.5 border rounded-xl font-medium transition-all ${isEditing ? 'bg-background border-border-subtle focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none' : 'bg-background/50 border-transparent text-text-secondary'}`} />
                          {errors.email && <p className="text-xs text-danger mt-1 font-medium">{errors.email.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-2">First Name</label>
                          <input type="text" {...register('first_name')} disabled={!isEditing} className={`w-full px-4 py-2.5 border rounded-xl font-medium transition-all ${isEditing ? 'bg-background border-border-subtle focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none' : 'bg-background/50 border-transparent text-text-secondary'}`} />
                          {errors.first_name && <p className="text-xs text-danger mt-1 font-medium">{errors.first_name.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-2">Last Name</label>
                          <input type="text" {...register('last_name')} disabled={!isEditing} className={`w-full px-4 py-2.5 border rounded-xl font-medium transition-all ${isEditing ? 'bg-background border-border-subtle focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none' : 'bg-background/50 border-transparent text-text-secondary'}`} />
                          {errors.last_name && <p className="text-xs text-danger mt-1 font-medium">{errors.last_name.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-2 flex items-center gap-1.5"><Phone size={14}/> Phone Number</label>
                          <input type="text" {...register('phone_number')} disabled={!isEditing} className={`w-full px-4 py-2.5 border rounded-xl font-medium transition-all ${isEditing ? 'bg-background border-border-subtle focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none' : 'bg-background/50 border-transparent text-text-secondary'}`} />
                          {errors.phone_number && <p className="text-xs text-danger mt-1 font-medium">{errors.phone_number.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-2 flex items-center gap-1.5"><Calendar size={14}/> Date of Birth</label>
                          {isEditing ? (
                            <input type="date" {...register('date_of_birth')} className="w-full px-4 py-2.5 border bg-background border-border-subtle rounded-xl font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                          ) : (
                            <input type="text" value={profileData.profile?.date_of_birth || 'Not provided'} disabled className="w-full px-4 py-2.5 bg-background/50 border-transparent rounded-xl text-text-secondary font-medium" />
                          )}
                          {errors.date_of_birth && <p className="text-xs text-danger mt-1 font-medium">{errors.date_of_birth.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-2 flex items-center gap-1.5"><User size={14}/> Gender</label>
                          {isEditing ? (
                            <select {...register('gender')} className="w-full px-4 py-2.5 border bg-background border-border-subtle rounded-xl font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none">
                              <option value="">Select Gender</option>
                              <option value="M">Male</option>
                              <option value="F">Female</option>
                              <option value="O">Other</option>
                              <option value="N">Prefer not to say</option>
                            </select>
                          ) : (
                            <input type="text" value={genderMap[profileData.profile?.gender] || 'Not provided'} disabled className="w-full px-4 py-2.5 bg-background/50 border-transparent rounded-xl text-text-secondary font-medium" />
                          )}
                          {errors.gender && <p className="text-xs text-danger mt-1 font-medium">{errors.gender.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-2 flex items-center gap-1.5"><Briefcase size={14}/> Occupation</label>
                          <input type="text" {...register('occupation')} disabled={!isEditing} className={`w-full px-4 py-2.5 border rounded-xl font-medium transition-all ${isEditing ? 'bg-background border-border-subtle focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none' : 'bg-background/50 border-transparent text-text-secondary'}`} />
                          {errors.occupation && <p className="text-xs text-danger mt-1 font-medium">{errors.occupation.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-2 flex items-center gap-1.5"><MapPin size={14}/> City</label>
                          <input type="text" {...register('city')} disabled={!isEditing} className={`w-full px-4 py-2.5 border rounded-xl font-medium transition-all ${isEditing ? 'bg-background border-border-subtle focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none' : 'bg-background/50 border-transparent text-text-secondary'}`} />
                          {errors.city && <p className="text-xs text-danger mt-1 font-medium">{errors.city.message}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-text-primary mb-2 flex items-center gap-1.5"><MapPin size={14}/> State</label>
                          <input type="text" {...register('state')} disabled={!isEditing} className={`w-full px-4 py-2.5 border rounded-xl font-medium transition-all ${isEditing ? 'bg-background border-border-subtle focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none' : 'bg-background/50 border-transparent text-text-secondary'}`} />
                          {errors.state && <p className="text-xs text-danger mt-1 font-medium">{errors.state.message}</p>}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isEditing && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="flex justify-end overflow-hidden"
                          >
                            <button
                              type="submit"
                              disabled={isSaving}
                              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-surface font-bold hover:bg-primary-dark transition-all hover-lift shadow-md disabled:opacity-70 disabled:hover:-translate-y-0 disabled:shadow-none"
                            >
                              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                              {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-danger font-medium">Failed to load profile.</div>
              )}
            </div>
          </motion.div>
        )}

        {/* API Integration Complete: Data is now fetched directly from the backend API. */}

        {activeTab === 'loans' && (
          <motion.div 
            key="loans"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
          >
            <div className="bg-surface rounded-3xl border border-border-subtle shadow-sm overflow-hidden p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2"><FileText size={20} className="text-primary" /> Loan Applications</h2>
              
              {loansHistory.length === 0 ? (
                <div className="text-center py-12 px-4 bg-background rounded-2xl border border-dashed border-border-subtle">
                  <FileText size={48} className="mx-auto text-text-secondary/30 mb-4" />
                  <h3 className="text-lg font-bold text-text-primary mb-2">No loan applications yet</h3>
                  <p className="text-text-secondary mb-6 max-w-sm mx-auto">Check your eligibility for a home loan instantly with our AI-powered engine.</p>
                  <a href="/dashboard/loan" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors">Apply Now</a>
                </div>
              ) : (
                <div className="space-y-4">
                  {loansHistory.map(app => {
                    const isApproved = app.result === 'Approved';
                    return (
                      <div key={app.id} className="p-5 rounded-2xl border border-border-subtle bg-background flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-border transition-colors">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">{new Date(app.date).toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-bold text-text-primary">Home Loan Check</h4>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xs text-text-secondary font-medium mb-1">Confidence</div>
                            <div className="font-bold text-text-primary">{formatConfidence(app.confidence)}%</div>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${isApproved ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
                            {app.result}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'cards' && (
          <motion.div 
            key="cards"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
          >
            <div className="bg-surface rounded-3xl border border-border-subtle shadow-sm overflow-hidden p-6 md:p-8">
              <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2"><CreditCard size={20} className="text-primary" /> Credit Card Applications</h2>
              
              {cardsHistory.length === 0 ? (
                <div className="text-center py-12 px-4 bg-background rounded-2xl border border-dashed border-border-subtle">
                  <CreditCard size={48} className="mx-auto text-text-secondary/30 mb-4" />
                  <h3 className="text-lg font-bold text-text-primary mb-2">No credit card checks yet</h3>
                  <p className="text-text-secondary mb-6 max-w-sm mx-auto">Find the perfect credit card tailored to your financial profile.</p>
                  <a href="/dashboard/cards" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors">Check Eligibility</a>
                </div>
              ) : (
                <div className="space-y-4">
                  {cardsHistory.map(app => {
                    const isApproved = app.result === 'Approved';
                    return (
                      <div key={app.id} className="p-5 rounded-2xl border border-border-subtle bg-background flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-border transition-colors">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">{new Date(app.date).toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-bold text-text-primary">Credit Card Match</h4>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xs text-text-secondary font-medium mb-1">Confidence</div>
                            <div className="font-bold text-text-primary">{formatConfidence(app.confidence)}%</div>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${isApproved ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
                            {app.result}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
