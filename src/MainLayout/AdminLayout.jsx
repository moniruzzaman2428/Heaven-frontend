import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiTag,
  FiMenu,
  FiX,
  FiExternalLink,
  FiLogOut,
  FiSettings,
  FiActivity,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/products', label: 'Products', icon: FiBox },
  { to: '/admin/categories', label: 'Categories', icon: FiTag },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
];

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
      isActive
        ? 'text-white'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-slate-950/95 backdrop-blur-xl text-white border-r border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Brand */}
      <Link
        to="/admin"
        className="relative flex items-center gap-2.5 px-5 h-16 border-b border-white/5 shrink-0 group"
      >
        <motion.div
          whileHover={{ rotate: 8, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center font-bold shadow-lg shadow-purple-500/40"
        >
          G
        </motion.div>
        <div className="leading-tight">
          <p className="font-bold text-white">
            Gadget
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Heaven
            </span>
          </p>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <FiActivity size={9} className="text-emerald-400" />
            Admin panel
          </p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="relative flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
          Management
        </p>
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="adminActive"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-lg shadow-purple-500/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'} />
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="relative p-3 border-t border-white/5 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/5 hover:text-white transition"
        >
          <FiExternalLink size={18} /> View store
        </Link>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition"
        >
          <FiLogOut size={18} /> Logout
        </motion.button>

        {/* Admin card */}
        <div className="mt-2 p-3 rounded-xl bg-gradient-to-br from-purple-600/20 to-fuchsia-600/10 border border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center font-semibold text-sm shadow-lg shadow-purple-500/30">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-64 h-full relative z-10"
            >
              <Sidebar />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-300 hover:bg-white/5 transition"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu size={22} />
            </button>
            <div className="hidden lg:flex items-center gap-2 text-sm text-slate-400">
              <FiSettings size={14} className="text-purple-400" />
              <span>Manage your store</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right leading-tight">
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center font-semibold shadow-lg shadow-purple-500/30">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-8 relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
          </div>
          <div className="relative">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;