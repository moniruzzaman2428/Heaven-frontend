import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPackage,
  FiCalendar,
  FiDollarSign,
  FiChevronRight,
  FiXCircle,
  FiShoppingBag,
  FiArrowLeft,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api, { imgUrl } from '../api';
import { money, formatDate, orderLabel, STATUS_STYLES } from '../Utils/format';

// Dark-theme status colors (fallback to lighter variants of STATUS_STYLES)
const STATUS_DARK = {
  Pending: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  Processing: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  Shipped: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
  Delivered: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  Cancelled: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    document.title = 'My Orders | Gadget Heaven';
    api
      .getMyOrders()
      .then(setOrders)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (order) => {
    if (!window.confirm('Cancel this order? This can’t be undone.')) return;
    setCancellingId(order._id);
    try {
      const updated = await api.cancelOrder(order._id);
      setOrders((list) =>
        list.map((o) => (o._id === updated._id ? updated : o))
      );
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="h-8 w-40 bg-white/5 rounded-lg animate-pulse mb-8" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
              >
                <div className="h-4 bg-white/5 rounded w-1/3 mb-4" />
                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-white/5 rounded-xl" />
                  <div className="w-14 h-14 bg-white/5 rounded-xl" />
                  <div className="w-14 h-14 bg-white/5 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10">
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
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 shadow-lg shadow-purple-500/30">
              <FiPackage className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                My{' '}
                <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                  Orders
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {orders.length > 0
                  ? `${orders.length} order${orders.length === 1 ? '' : 's'} placed`
                  : 'Track and manage your purchases'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/20 to-fuchsia-600/20 border border-white/10 mb-4">
              <FiShoppingBag size={36} className="text-purple-300" />
            </div>
            <p className="text-lg font-semibold text-white">
              You have no orders yet
            </p>
            <p className="text-sm text-slate-400 mt-1 mb-6">
              Start exploring to find your next gadget.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/40 transition-all"
            >
              Start Shopping <FiChevronRight />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {orders.map((order) => {
                const statusClass =
                  STATUS_DARK[order.status] ||
                  'bg-slate-500/10 text-slate-300 border-slate-500/30';
                const isPending = order.status === 'Pending';
                const isCancelling = cancellingId === order._id;

                return (
                  <motion.div
                    key={order._id}
                    layout
                    variants={itemVariants}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.3 }}
                    className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 transition-colors"
                  >
                    {/* Glow accent */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative p-5">
                      {/* Top meta row */}
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">
                              Order ID
                            </p>
                            <p className="font-mono text-sm font-semibold text-white">
                              {orderLabel(order)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5 flex items-center gap-1">
                              <FiCalendar size={10} /> Date
                            </p>
                            <p className="text-sm font-medium text-slate-200">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5 flex items-center gap-1">
                              <FiDollarSign size={10} /> Total
                            </p>
                            <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300">
                              {money(order.totalPrice)}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusClass}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Order items */}
                      <div className="flex flex-wrap gap-2.5">
                        {order.orderItems.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 bg-white/5 border border-white/5 rounded-xl p-2 pr-3 hover:border-white/15 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-lg bg-slate-900/50 p-1.5 shrink-0">
                              <img
                                src={imgUrl(item.product_image)}
                                alt=""
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-medium line-clamp-1 max-w-[160px] text-white">
                                {item.product_title}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                ×{item.quantity}{' '}
                                <span className="text-slate-500">·</span>{' '}
                                <span className="text-purple-300 font-medium">
                                  {money(item.price)}
                                </span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-4 mt-4 pt-3 border-t border-white/5 text-sm">
                        {isPending && (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleCancel(order)}
                            disabled={isCancelling}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            <FiXCircle size={14} />
                            {isCancelling ? 'Cancelling...' : 'Cancel order'}
                          </motion.button>
                        )}
                        <Link
                          to={`/orders/${order._id}`}
                          className="inline-flex items-center gap-1 text-purple-300 hover:text-purple-200 font-medium transition group"
                        >
                          View details
                          <FiChevronRight className="transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Orders;