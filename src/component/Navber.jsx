import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiMenu,
  FiX,
  FiSearch,
  FiLogOut,
  FiSettings,
  FiPackage,
  FiGrid,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navber = () => {
  const { cartCount, wishlist } = useCart();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Add shadow/blur intensification on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-white'
        : 'text-slate-400 hover:text-white'
    }`;

  const navItems = [
    { to: '/', label: 'Home', end: true },
    { to: '/statistics', label: 'Statistics' },
    ...(isAuthenticated ? [{ to: '/orders', label: 'Orders' }] : []),
    { to: '/dashboard', label: 'Wishlist' },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-purple-500/5'
          : 'bg-slate-950/60 backdrop-blur-md border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/40"
            >
              G
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-60 blur-md transition-opacity" />
            </motion.div>
            <span className="font-bold text-xl text-white hidden sm:block">
              Gadget
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Heaven
              </span>
            </span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-6"
          >
            <div className="relative w-full group">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search gadgets..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
            </div>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="navActive"
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Wishlist */}
            <Link
              to="/dashboard"
              className="relative p-2 rounded-full text-slate-300 hover:text-pink-400 hover:bg-white/5 transition group"
              aria-label="Wishlist"
            >
              <FiHeart size={20} className="transition-transform group-hover:scale-110" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/50">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full text-slate-300 hover:text-purple-400 hover:bg-white/5 transition group"
              aria-label="Cart"
            >
              <FiShoppingCart size={20} className="transition-transform group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center gap-1.5 p-1 rounded-full hover:bg-white/5 transition">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white flex items-center justify-center font-semibold text-sm shadow-lg shadow-purple-500/30">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-500/10 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                  <div className="px-4 py-2.5 border-b border-white/5">
                    <p className="font-medium text-sm text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <div className="py-1">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-300 hover:bg-purple-500/10 transition"
                      >
                        <FiSettings size={14} /> Admin panel
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition"
                    >
                      <FiUser size={14} /> My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition"
                    >
                      <FiPackage size={14} /> My Orders
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition"
                    >
                      <FiGrid size={14} /> Wishlist
                    </Link>
                  </div>

                  <div className="border-t border-white/5 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <FiLogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/40 transition-all"
              >
                <FiUser size={16} /> Login
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-white/5 transition"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block"
                >
                  {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden border-t border-white/5"
            >
              <div className="pt-3 pb-4 space-y-1.5">
                <form onSubmit={handleSearch} className="md:hidden mb-3">
                  <div className="relative group">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search gadgets..."
                      className="w-full pl-10 pr-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </form>

                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-sm font-medium transition ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}

                {isAuthenticated && (
                  <NavLink
                    to="/profile"
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </NavLink>
                )}

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin panel
                  </NavLink>
                )}

                {!isAuthenticated && (
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-purple-300 hover:bg-purple-500/10 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-purple-300 hover:bg-purple-500/10 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navber;