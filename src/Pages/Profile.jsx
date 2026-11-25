import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiEye,
  FiEyeOff,
  FiSave,
  FiShield,
  FiArrowLeft,
  FiCheck,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const inputClass =
  'w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition';

const labelClass =
  'block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || 'Bangladesh',
  });
  const [pw, setPw] = useState({
    currentPassword: '',
    password: '',
    confirm: '',
  });
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    document.title = 'My Profile | Gadget Heaven';
  }, []);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onPwChange = (e) =>
    setPw((f) => ({ ...f, [e.target.name]: e.target.value }));

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { name, email, phone, street, city, state, zip, country } = form;
      const data = await api.updateProfile({
        name,
        email,
        phone,
        address: { street, city, state, zip, country },
      });
      updateUser(data);
      toast.success('Profile saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.password !== pw.confirm)
      return toast.error('New passwords do not match');
    setSavingPw(true);
    try {
      const data = await api.updateProfile({
        currentPassword: pw.currentPassword,
        password: pw.password,
      });
      updateUser(data);
      setPw({ currentPassword: '', password: '', confirm: '' });
      toast.success('Password changed');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingPw(false);
    }
  };

  // Password strength
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
  const strength = getStrength(pw.password);
  const pwMatch = pw.password && pw.password === pw.confirm;

  const initials = (form.name || user?.name || 'U')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4 transition-colors group"
          >
            <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My{' '}
            <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
              Profile
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Your details are used to pre-fill checkout.
          </p>
        </motion.div>

        {/* Avatar card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative rounded-2xl bg-gradient-to-br from-purple-600/25 via-fuchsia-600/15 to-indigo-600/25 border border-white/10 backdrop-blur-md p-6 overflow-hidden flex items-center gap-5"
        >
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-2xl font-extrabold shadow-lg shadow-purple-500/40">
            {initials}
          </div>
          <div className="relative min-w-0">
            <p className="font-semibold text-white text-lg truncate">
              {form.name || 'Your Name'}
            </p>
            <p className="text-sm text-slate-300 truncate">{form.email}</p>
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">
              <FiCheck size={10} /> Verified
            </span>
          </div>
        </motion.div>

        {/* Personal details */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          onSubmit={saveProfile}
          className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6 space-y-5"
        >
          <div className="flex items-center gap-2">
            <FiUser size={16} className="text-purple-400" />
            <h2 className="font-semibold text-lg text-white">
              Personal details
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <div className="relative group">
                <FiUser
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                  size={16}
                />
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  className={inputClass}
                  placeholder="Full name"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <div className="relative group">
                <FiPhone
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                  size={16}
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  className={inputClass}
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Email</label>
              <div className="relative group">
                <FiMail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                  size={16}
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <FiMapPin size={16} className="text-purple-400" />
            <h2 className="font-semibold text-lg text-white">
              Default delivery address
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Street address</label>
              <div className="relative group">
                <FiMapPin
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                  size={16}
                />
                <input
                  name="street"
                  value={form.street}
                  onChange={onChange}
                  className={inputClass}
                  placeholder="123 Main St, Apt 4B"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input
                name="city"
                value={form.city}
                onChange={onChange}
                className={`${inputClass} !pl-4`}
                placeholder="Dhaka"
              />
            </div>
            <div>
              <label className={labelClass}>State / Division</label>
              <input
                name="state"
                value={form.state}
                onChange={onChange}
                className={`${inputClass} !pl-4`}
                placeholder="Dhaka"
              />
            </div>
            <div>
              <label className={labelClass}>ZIP Code</label>
              <input
                name="zip"
                value={form.zip}
                onChange={onChange}
                className={`${inputClass} !pl-4`}
                placeholder="1207"
              />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input
                name="country"
                value={form.country}
                onChange={onChange}
                className={`${inputClass} !pl-4`}
                placeholder="Bangladesh"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <motion.button
              whileHover={{ scale: saving ? 1 : 1.02, y: saving ? 0 : -1 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {saving ? (
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
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={16} /> Save Changes
                </>
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Password form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={savePassword}
          className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6 space-y-5"
        >
          <div className="flex items-center gap-2">
            <FiShield size={16} className="text-purple-400" />
            <h2 className="font-semibold text-lg text-white">
              Change Password
            </h2>
          </div>

          <div>
            <label className={labelClass}>Current Password</label>
            <div className="relative group">
              <FiLock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                size={16}
              />
              <input
                name="currentPassword"
                type={show.current ? 'text' : 'password'}
                value={pw.currentPassword}
                onChange={onPwChange}
                required
                autoComplete="current-password"
                className={inputClass}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-colors"
                aria-label="Toggle current password"
              >
                {show.current ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>New Password</label>
              <div className="relative group">
                <FiLock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                  size={16}
                />
                <input
                  name="password"
                  type={show.next ? 'text' : 'password'}
                  value={pw.password}
                  onChange={onPwChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className={inputClass}
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-colors"
                  aria-label="Toggle new password"
                >
                  {show.next ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Confirm New Password</label>
              <div className="relative group">
                <FiLock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                  size={16}
                />
                <input
                  name="confirm"
                  type={show.confirm ? 'text' : 'password'}
                  value={pw.confirm}
                  onChange={onPwChange}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className={inputClass}
                  placeholder="Repeat password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShow((s) => ({ ...s, confirm: !s.confirm }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-colors"
                  aria-label="Toggle confirm password"
                >
                  {show.confirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Strength + match */}
          {pw.password && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
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
              <div className="flex justify-between mt-1.5 text-[11px]">
                <span className="text-slate-400">
                  Strength:{' '}
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
                </span>
                {pw.confirm && (
                  <span
                    className={
                      pwMatch
                        ? 'text-emerald-300 font-medium'
                        : 'text-rose-300 font-medium'
                    }
                  >
                    {pwMatch ? '✓ Passwords match' : '✗ Do not match'}
                  </span>
                )}
              </div>
            </motion.div>
          )}

          <div className="flex justify-end pt-1">
            <motion.button
              whileHover={{
                scale: savingPw ? 1 : 1.02,
                y: savingPw ? 0 : -1,
              }}
              whileTap={{ scale: savingPw ? 1 : 0.98 }}
              type="submit"
              disabled={savingPw}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/15 text-white font-semibold rounded-xl hover:bg-white/15 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {savingPw ? (
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
                  Updating...
                </>
              ) : (
                <>
                  <FiLock size={16} /> Update Password
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Profile;