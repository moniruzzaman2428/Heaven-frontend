import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiPackage,
  FiMapPin,
  FiCreditCard,
  FiCalendar,
  FiTruck,
  FiCheck,
  FiClock,
  FiXCircle,
  FiFileText,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api, { imgUrl } from '../api';
import { money, formatDateTime, orderLabel } from '../Utils/format';

const STATUS_DARK = {
  Pending: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  Processing: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  Shipped: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
  Delivered: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  Cancelled: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
};

const STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .getOrder(id)
      .then((o) => {
        setOrder(o);
        document.title = `Order ${orderLabel(o)} | Gadget Heaven`;
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order? This can’t be undone.')) return;
    setCancelling(true);
    try {
      setOrder(await api.cancelOrder(order._id));
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(false);
    }
  };

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-purple-500/40 border-t-purple-500 rounded-full"
          />
          Loading order...
        </div>
      </div>
    );
  }

  // ---------- Not found ----------
  if (!order) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-4">
            <FiFileText size={36} className="text-rose-300" />
          </div>
          <p className="text-xl font-semibold text-white">Order not found</p>
          <p className="text-sm text-slate-400 mt-1">
            This order may have been removed.
          </p>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/40 transition-all"
          >
            <FiArrowLeft size={14} /> Back to my orders
          </Link>
        </div>
      </div>
    );
  }

  const a = order.shippingAddress || {};
  const statusClass =
    STATUS_DARK[order.status] || 'bg-slate-500/10 text-slate-300 border-slate-500/30';
  const currentStepIndex = STEPS.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors group"
          >
            <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
            My orders
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-start justify-between gap-4 mb-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-lg bg-purple-500/15 border border-purple-500/20">
                <FiPackage size={16} className="text-purple-300" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Order{' '}
                <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent font-mono">
                  {orderLabel(order)}
                </span>
              </h1>
            </div>
            <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
              <FiCalendar size={12} /> Placed {formatDateTime(order.createdAt)}
            </p>
          </div>
          <span
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border ${statusClass}`}
          >
            {order.status}
          </span>
        </motion.div>

        {/* Progress stepper (unless cancelled) */}
        {!isCancelled && currentStepIndex >= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5"
          >
            <div className="flex items-center justify-between relative">
              {/* Background line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-white/10" />
              {/* Active line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                className="absolute top-4 left-6 h-0.5 bg-gradient-to-r from-purple-500 to-fuchsia-500"
                style={{ maxWidth: 'calc(100% - 3rem)' }}
              />
              {STEPS.map((step, i) => {
                const done = i <= currentStepIndex;
                return (
                  <div
                    key={step}
                    className="relative flex flex-col items-center gap-2 z-10"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        done
                          ? 'bg-gradient-to-br from-purple-500 to-fuchsia-500 border-purple-400 shadow-lg shadow-purple-500/40'
                          : 'bg-slate-900 border-white/20 text-slate-500'
                      }`}
                    >
                      {done ? (
                        <FiCheck size={14} className="text-white" />
                      ) : (
                        <span className="text-xs">{i + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-medium ${
                        done ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Cancelled banner */}
        {isCancelled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 flex items-center gap-3"
          >
            <FiXCircle className="text-rose-300 shrink-0" size={20} />
            <div>
              <p className="font-semibold text-rose-200">Order cancelled</p>
              <p className="text-xs text-rose-300/80">
                This order has been cancelled and cannot be reopened.
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="md:col-span-2 space-y-5">
            {/* Items */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden"
            >
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
                <FiPackage size={15} className="text-purple-400" />
                <h2 className="font-semibold text-white">Items</h2>
                <span className="ml-auto text-xs text-slate-500">
                  {order.orderItems.length} item
                  {order.orderItems.length === 1 ? '' : 's'}
                </span>
              </div>
              <ul className="divide-y divide-white/5">
                {order.orderItems.map((it, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition"
                  >
                    <div className="w-16 h-16 rounded-xl bg-slate-900/60 border border-white/5 p-2 shrink-0">
                      <img
                        src={imgUrl(it.product_image)}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {it.product_title}
                      </p>
                      <p className="text-sm text-slate-400 mt-0.5">
                        {money(it.price)}{' '}
                        <span className="text-slate-600">×</span>{' '}
                        {it.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300">
                      {money(it.price * it.quantity)}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Order history timeline */}
            {order.statusHistory?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FiClock size={15} className="text-purple-400" />
                  <h2 className="font-semibold text-white">Order progress</h2>
                </div>
                <ol className="space-y-4 border-l-2 border-purple-500/20 pl-5">
                  {order.statusHistory.map((h, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                      className="relative"
                    >
                      <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 ring-4 ring-slate-950" />
                      <p className="font-medium text-white">{h.status}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDateTime(h.at)}
                        {h.note ? ` · ${h.note}` : ''}
                      </p>
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5 relative overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <FiCreditCard size={15} className="text-purple-400" />
                  <h2 className="font-semibold text-white">Summary</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white">{money(order.itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Shipping</span>
                    <span
                      className={
                        order.shippingPrice === 0
                          ? 'text-emerald-300 font-medium'
                          : 'text-white'
                      }
                    >
                      {order.shippingPrice === 0
                        ? 'Free'
                        : money(order.shippingPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tax</span>
                    <span className="text-white">{money(order.taxPrice)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-3 border-t border-white/10">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                      {money(order.totalPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 pt-1 flex items-center gap-1">
                    {order.paymentMethod} ·{' '}
                    {order.isPaid ? (
                      <span className="text-emerald-300">Paid</span>
                    ) : (
                      <span className="text-amber-300">Payment due</span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Delivery address */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <FiMapPin size={15} className="text-purple-400" />
                <h2 className="font-semibold text-white">Delivery address</h2>
              </div>
              <div className="text-sm text-slate-300 space-y-0.5">
                <p>{a.street}</p>
                <p>{[a.city, a.state, a.zip].filter(Boolean).join(', ')}</p>
                <p>{a.country}</p>
                <p className="text-slate-500 mt-2 flex items-center gap-1">
                  <FiTruck size={11} /> Phone: {a.phone}
                </p>
              </div>
            </motion.div>

            {/* Cancel */}
            {order.status === 'Pending' && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                whileHover={{ scale: cancelling ? 1 : 1.02 }}
                whileTap={{ scale: cancelling ? 1 : 0.98 }}
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-medium hover:bg-rose-500/20 hover:text-rose-200 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                <FiXCircle size={15} />
                {cancelling ? 'Cancelling...' : 'Cancel order'}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;