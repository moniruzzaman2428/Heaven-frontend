import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowRight,
  FiTruck,
  FiShield,
  FiTag,
  FiArrowLeft,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { imgUrl } from '../api';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.25 } },
};

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } =
    useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ---------- Empty state ----------
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex items-center justify-center px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-md w-full text-center py-16 px-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/20 to-fuchsia-600/20 border border-purple-500/20 mb-5">
            <FiShoppingBag size={36} className="text-purple-300" />
          </div>
          <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
          <p className="text-slate-400 mt-2 text-sm">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/40 transition-all"
          >
            Continue Shopping <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    );
  }

  // ---------- Totals ----------
  const shipping = cartTotal > 500 ? 0 : 50;
  const tax = Number((cartTotal * 0.05).toFixed(2));
  const total = cartTotal + shipping + tax;
  const freeShipProgress = Math.min((cartTotal / 500) * 100, 100);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

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

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4 transition-colors group"
          >
            <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
            Back to shopping
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 shadow-lg shadow-purple-500/30">
              <FiShoppingBag size={20} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Shopping{' '}
                <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                  Cart
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {cart.length} item{cart.length === 1 ? '' : 's'} in your bag
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* ---------- Cart items ---------- */}
          <div className="lg:col-span-2 space-y-3">
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
                    className="group flex flex-col sm:flex-row gap-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 hover:border-purple-500/30 transition-colors"
                  >
                    {/* Image */}
                    <div className="w-full sm:w-24 h-24 rounded-xl bg-slate-900/60 border border-white/5 p-2 shrink-0 overflow-hidden">
                      <img
                        src={imgUrl(item.product_image)}
                        alt={item.product_title}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${id}`}
                        className="font-semibold text-white hover:text-purple-300 line-clamp-1 transition"
                      >
                        {item.product_title}
                      </Link>
                      <p className="text-xs uppercase tracking-wider text-purple-400 font-semibold mt-1">
                        {item.category}
                      </p>
                      <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300 mt-1.5">
                        ${item.price.toFixed(2)}
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        {/* Qty stepper */}
                        <div className="flex items-center rounded-lg bg-white/5 border border-white/10 overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(id, item.quantity - 1)
                            }
                            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 transition"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-3 text-sm font-semibold text-white min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(id, item.quantity + 1)
                            }
                            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 transition"
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        {/* Remove */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(id)}
                          className="p-2 rounded-lg text-rose-400 hover:text-white bg-rose-500/5 hover:bg-rose-500/20 border border-rose-500/10 hover:border-rose-500/30 transition-colors"
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500">
                          Subtotal
                        </div>
                        <div className="font-bold text-lg text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={clearCart}
                className="text-sm text-rose-400 hover:text-rose-300 font-medium transition-colors"
              >
                Clear cart
              </button>
              <Link
                to="/"
                className="text-sm text-purple-300 hover:text-purple-200 font-medium transition-colors"
              >
                Continue shopping →
              </Link>
            </div>
          </div>

          {/* ---------- Order summary ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <FiTag className="text-purple-300" size={16} />
                  <h2 className="font-bold text-lg text-white">
                    Order Summary
                  </h2>
                </div>

                {/* Free shipping progress */}
                <div className="mb-5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                    <FiTruck className="text-purple-400" size={14} />
                    {cartTotal >= 500 ? (
                      <span className="text-emerald-300 font-medium">
                        🎉 You've unlocked free shipping!
                      </span>
                    ) : (
                      <span>
                        Add{' '}
                        <span className="text-white font-semibold">
                          ${(500 - cartTotal).toFixed(2)}
                        </span>{' '}
                        more for free shipping
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${freeShipProgress}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
                    />
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="font-medium text-white">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shipping</span>
                    <span
                      className={
                        shipping === 0
                          ? 'font-medium text-emerald-300'
                          : 'font-medium text-white'
                      }
                    >
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tax (5%)</span>
                    <span className="font-medium text-white">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between text-base">
                    <span className="font-bold text-white">Total</span>
                    <span className="font-bold text-lg bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full mt-6 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <FiArrowRight size={16} />
                </motion.button>

                {/* Trust badges */}
                <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <FiShield size={12} className="text-purple-400" /> Secure
                  </span>
                  <span className="flex items-center gap-1">
                    <FiTruck size={12} className="text-purple-400" /> Fast
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;