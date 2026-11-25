import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiArrowRight,
  FiChevronRight,
  FiPlus,
  FiTag,
  FiPackage,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { imgUrl } from '../api';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.25 } },
};

const Dashboard = () => {
  const {
    cart,
    wishlist,
    removeFromWishlist,
    addToCart,
    removeFromCart,
    cartTotal,
  } = useCart();
  const [tab, setTab] = useState('cart');

  const handleMoveToCart = (product) => {
    if (!addToCart(product)) return;
    removeFromWishlist(product._id || product.product_id);
    toast.success('Moved to cart!');
  };

  const tabs = [
    { key: 'cart', label: 'Cart', icon: FiShoppingCart, count: cart.length },
    { key: 'wishlist', label: 'Wishlist', icon: FiHeart, count: wishlist.length },
  ];

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

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero summary card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden mb-8 p-6 sm:p-8 bg-gradient-to-br from-purple-600/30 via-fuchsia-600/20 to-indigo-600/30 border border-white/10 backdrop-blur-xl"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <FiPackage className="text-purple-300" size={16} />
              <span className="text-xs uppercase tracking-wider text-purple-200 font-semibold">
                Your Dashboard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Cart &{' '}
              <span className="bg-gradient-to-r from-purple-200 to-fuchsia-200 bg-clip-text text-transparent">
                Wishlist
              </span>
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Manage the things you want to buy
            </p>

            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { label: 'Cart Items', value: cart.length },
                { label: 'Wishlist', value: wishlist.length },
                { label: 'Total', value: `$${cartTotal.toFixed(2)}` },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur-sm"
                >
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                    {label}
                  </div>
                  <div className="text-lg sm:text-xl font-bold mt-0.5 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md w-fit">
          {tabs.map(({ key, label, icon: Icon, count }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  active ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-lg shadow-purple-500/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <Icon size={16} /> {label} ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Panels */}
        <AnimatePresence mode="wait">
          {tab === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {cart.length === 0 ? (
                <div className="text-center py-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-4">
                    <FiShoppingCart size={36} className="text-purple-300" />
                  </div>
                  <p className="text-lg font-semibold text-white">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-slate-400 mt-1 mb-6">
                    Add some gadgets to get started.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/40 transition-all"
                  >
                    Shop now <FiArrowRight />
                  </Link>
                </div>
              ) : (
                <>
                  <AnimatePresence mode="popLayout">
                    {cart.map((item) => {
                      const id = item._id || item.product_id;
                      return (
                        <motion.div
                          key={id}
                          layout
                          variants={itemVariants}
                          initial="hidden"
                          animate="show"
                          exit="exit"
                          whileHover={{ y: -2 }}
                          className="group flex items-center gap-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-3 sm:p-4 hover:border-purple-500/30 transition-colors"
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-900/60 border border-white/5 p-2 shrink-0 overflow-hidden">
                            <img
                              src={imgUrl(item.product_image)}
                              alt=""
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/product/${id}`}
                              className="font-semibold text-white truncate block hover:text-purple-300 transition"
                            >
                              {item.product_title}
                            </Link>
                            <p className="text-sm text-slate-400 mt-0.5">
                              ${item.price}{' '}
                              <span className="text-slate-500">×</span>{' '}
                              {item.quantity}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-[10px] uppercase tracking-wider text-slate-500">
                              Subtotal
                            </div>
                            <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(id)}
                            className="p-2 rounded-lg text-rose-400 hover:text-white bg-rose-500/5 hover:bg-rose-500/20 border border-rose-500/10 hover:border-rose-500/30 transition-colors"
                            aria-label="Remove from cart"
                          >
                            <FiTrash2 size={16} />
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  <Link
                    to="/cart"
                    className="flex items-center justify-center gap-2 mt-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-purple-300 hover:text-white hover:bg-white/10 transition group"
                  >
                    Proceed to Checkout
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </>
              )}
            </motion.div>
          )}

          {tab === 'wishlist' && (
            <motion.div
              key="wishlist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {wishlist.length === 0 ? (
                <div className="text-center py-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-pink-500/10 border border-pink-500/20 mb-4">
                    <FiHeart size={36} className="text-pink-300" />
                  </div>
                  <p className="text-lg font-semibold text-white">
                    Your wishlist is empty
                  </p>
                  <p className="text-sm text-slate-400 mt-1 mb-6">
                    Save products you love to see them here.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-fuchsia-600 text-white font-semibold hover:shadow-lg hover:shadow-pink-500/40 transition-all"
                  >
                    Browse Products <FiArrowRight />
                  </Link>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {wishlist.map((item) => {
                    const id = item._id || item.product_id;
                    return (
                      <motion.div
                        key={id}
                        layout
                        variants={itemVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        whileHover={{ y: -2 }}
                        className="group flex items-center gap-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-3 sm:p-4 hover:border-pink-500/30 transition-colors"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-900/60 border border-white/5 p-2 shrink-0 overflow-hidden">
                          <img
                            src={imgUrl(item.product_image)}
                            alt=""
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${id}`}
                            className="font-semibold text-white truncate block hover:text-pink-300 transition"
                          >
                            {item.product_title}
                          </Link>
                          <p className="text-sm mt-0.5">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-fuchsia-300 font-semibold">
                              ${item.price?.toFixed(2)}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleMoveToCart(item)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                          >
                            <FiPlus size={14} />
                            <span className="hidden sm:inline">Add to Cart</span>
                            <span className="sm:hidden">Add</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromWishlist(id)}
                            className="p-2 rounded-lg text-rose-400 hover:text-white bg-rose-500/5 hover:bg-rose-500/20 border border-rose-500/10 hover:border-rose-500/30 transition-colors"
                            aria-label="Remove from wishlist"
                          >
                            <FiTrash2 size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;