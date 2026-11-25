import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
  FiLock,
  FiCheck,
  FiTruck,
  FiArrowLeft,
  FiChevronRight,
  FiUser,
  FiPhone,
  FiHome,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { imgUrl } from '../api';
import api from '../api';

const inputClass =
  'w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition';

const labelClass =
  'block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || 'Bangladesh',
    phone: user?.phone || '',
    paymentMethod: 'Cash on Delivery',
  });

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/checkout" replace />;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-4">
            <FiShoppingBag size={36} className="text-purple-300" />
          </div>
          <p className="text-lg font-semibold text-white">Your cart is empty</p>
          <p className="text-sm text-slate-400 mt-1">Add items to proceed to checkout.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/40 transition-all"
          >
            Go shopping
          </Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal > 500 ? 0 : 50;
  const tax = Number((cartTotal * 0.05).toFixed(2));
  const total = cartTotal + shipping + tax;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderItems = cart.map((item) => ({
        product: item._id || item.product_id,
        quantity: item.quantity,
      }));
      const order = await api.createOrder({
        orderItems,
        shippingAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
          phone: form.phone,
        },
        paymentMethod: form.paymentMethod,
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${order._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Cart', done: true },
    { label: 'Checkout', active: true },
    { label: 'Confirmation' },
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
        {/* Header + steps */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-4 transition-colors group"
          >
            <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Cart
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Secure{' '}
                <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                  Checkout
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Complete your purchase in a few steps
              </p>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <React.Fragment key={s.label}>
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${
                      s.done
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                        : s.active
                        ? 'bg-purple-500/15 border-purple-500/30 text-purple-200'
                        : 'bg-white/5 border-white/10 text-slate-500'
                    }`}
                  >
                    {s.done ? <FiCheck size={10} /> : <span>{i + 1}</span>}
                    {s.label}
                  </div>
                  {i < steps.length - 1 && (
                    <FiChevronRight size={12} className="text-slate-600" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-6">
          {/* Left: forms */}
          <div className="lg:col-span-3 space-y-5">
            {/* Shipping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6 overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-2 rounded-lg bg-purple-500/15 border border-purple-500/20">
                    <FiMapPin size={14} className="text-purple-300" />
                  </div>
                  <h2 className="font-semibold text-lg text-white">
                    Shipping Address
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Street Address</label>
                    <div className="relative group">
                      <FiHome
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                        size={16}
                      />
                      <input
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        required
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
                      onChange={handleChange}
                      required
                      className={`${inputClass} !pl-4`}
                      placeholder="Dhaka"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className={`${inputClass} !pl-4`}
                      placeholder="Dhaka"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>ZIP Code</label>
                    <input
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      className={`${inputClass} !pl-4`}
                      placeholder="1207"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      required
                      className={`${inputClass} !pl-4`}
                      placeholder="Bangladesh"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Phone</label>
                    <div className="relative group">
                      <FiPhone
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                        size={16}
                      />
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className={inputClass}
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6 overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-2 rounded-lg bg-indigo-500/15 border border-indigo-500/20">
                    <FiCreditCard size={14} className="text-indigo-300" />
                  </div>
                  <h2 className="font-semibold text-lg text-white">
                    Payment Method
                  </h2>
                </div>

                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    form.paymentMethod === 'Cash on Delivery'
                      ? 'bg-purple-500/10 border-purple-500/40 shadow-lg shadow-purple-500/10'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={form.paymentMethod === 'Cash on Delivery'}
                    onChange={handleChange}
                    className="accent-purple-500 w-4 h-4"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-white">
                      Cash on Delivery
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pay when your order arrives
                    </p>
                  </div>
                  <FiTruck size={20} className="text-purple-400" />
                </label>

                <div className="mt-4 flex items-start gap-2 text-xs text-slate-400 p-3 rounded-lg bg-white/5 border border-white/10">
                  <FiLock size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Your information is encrypted and securely processed. We
                    never share your data.
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: order summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="lg:sticky lg:top-24 relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FiShoppingBag size={16} className="text-purple-300" />
                    <h2 className="font-bold text-lg text-white">
                      Order Summary
                    </h2>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {cart.length} item{cart.length === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 mb-4">
                  {cart.map((item) => (
                    <div
                      key={item._id || item.product_id}
                      className="flex items-center gap-2.5"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-900/60 border border-white/5 p-1 shrink-0">
                        <img
                          src={imgUrl(item.product_image)}
                          alt=""
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">
                          {item.product_title}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          ×{item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-purple-300">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shipping</span>
                    <span
                      className={
                        shipping === 0
                          ? 'text-emerald-300 font-medium'
                          : 'text-white'
                      }
                    >
                      {shipping === 0 ? 'Free' : `$${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tax (5%)</span>
                    <span className="text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-3 border-t border-white/10">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent text-lg">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place order */}
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -1 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
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
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <FiLock size={16} /> Place Order
                    </>
                  )}
                </motion.button>

                <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <FiLock size={10} /> Secure
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FiTruck size={10} /> Fast Delivery
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;