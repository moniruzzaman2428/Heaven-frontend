import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiZap,
  FiGift,
  FiCheck,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // ----- Password strength -----
  const getStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) || /[^a-zA-Z0-9]/.test(pwd)) score++;
    const levels = [
      { label: 'Weak', color: 'from-rose-500 to-rose-400' },
      { label: 'Fair', color: 'from-amber-500 to-amber-400' },
      { label: 'Good', color: 'from-sky-500 to-sky-400' },
      { label: 'Strong', color: 'from-emerald-500 to-emerald-400' },
    ];
    return { score, ...levels[Math.min(score, 3)] };
  };
  const strength = getStrength(form.password);

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-fuchsia-500/20 rounded-full blur-[100px]"
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-4xl rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-purple-500/10"
      >
        <div className="grid md:grid-cols-2">
          {/* Left: Brand panel */}
          <div className="hidden md:flex relative flex-col justify-between p-8 bg-gradient-to-br from-fuchsia-600/40 via-purple-600/20 to-indigo-600/40 border-r border-white/10 overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-fuchsia-500/40 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />

            <div className="relative">
              <Link to="/" className="flex items-center gap-2 mb-12">
                <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold text-lg">
                  G
                </div>
                <span className="font-bold text-lg">
                  Gadget
                  <span className="text-fuchsia-200">Heaven</span>
                </span>
              </Link>

              <h2 className="text-3xl font-extrabold leading-tight">
                Join the
                <br />
                <span className="bg-gradient-to-r from-fuchsia-200 to-purple-200 bg-clip-text text-transparent">
                  gadget revolution.
                </span>
              </h2>
              <p className="text-sm text-slate-300 mt-3 max-w-xs">
                Create an account to unlock exclusive deals, faster checkout,
                and personalized recommendations.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  { icon: FiGift, text: 'Exclusive member deals' },
                  { icon: FiZap, text: '1-click fast checkout' },
                  { icon: FiShield, text: 'Secure order tracking' },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2.5 text-sm text-slate-200"
                  >
                    <div className="p-1.5 rounded-lg bg-white/10 border border-white/10">
                      <Icon size={14} className="text-fuchsia-200" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <p className="relative text-xs text-slate-400">
              © {new Date().getFullYear()} Gadget Heaven
            </p>
          </div>

          {/* Right: Register form */}
          <div className="p-8 sm:p-10">
            <div className="mb-6">
              <div className="md:hidden flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-white font-bold">
                  G
                </div>
                <span className="font-bold text-lg">
                  Gadget
                  <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Heaven
                  </span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Create{' '}
                <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                  Account
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Join Gadget Heaven today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative group">
                  <FiUser
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                    size={16}
                  />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Email
                </label>
                <div className="relative group">
                  <FiMail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                    size={16}
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Phone <span className="text-slate-600">(optional)</span>
                </label>
                <div className="relative group">
                  <FiPhone
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                    size={16}
                  />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Password + strength */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <FiLock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                    size={16}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-colors"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff size={16} />
                    ) : (
                      <FiEye size={16} />
                    )}
                  </button>
                </div>

                {/* Strength meter */}
                {form.password && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2"
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i < strength.score
                              ? `bg-gradient-to-r ${strength.color}`
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] mt-1 flex items-center gap-1 text-slate-400">
                      {strength.score === 3 && (
                        <FiCheck size={11} className="text-emerald-400" />
                      )}
                      Password strength:{' '}
                      <span
                        className={`font-semibold ${
                          strength.score >= 3
                            ? 'text-emerald-300'
                            : strength.score === 2
                            ? 'text-sky-300'
                            : strength.score === 1
                            ? 'text-amber-300'
                            : 'text-rose-300'
                        }`}
                      >
                        {strength.label}
                      </span>
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -1 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white inline-block"
                    />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account <FiArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-purple-300 font-medium hover:text-purple-200 hover:underline transition"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;