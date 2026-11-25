import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
} from 'react-icons/fi';

/* -------------------- Inputs & Buttons -------------------- */

export const inputClass =
  'w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed';

export const btnPrimary =
  'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all';

export const btnGhost =
  'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-50 transition';

export const btnDanger =
  'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-rose-500/30 disabled:opacity-50 transition-all';

/* -------------------- Form Field -------------------- */

export const Field = ({ label, hint, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
      {label}
    </span>
    {children}
    {hint && <span className="block text-[11px] text-slate-500 mt-1">{hint}</span>}
  </label>
);

/* -------------------- Badges -------------------- */

const TONE_MAP = {
  gray: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  red: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  yellow: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  blue: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  indigo: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
};

const STATUS_TONE = {
  Pending: 'yellow',
  Processing: 'blue',
  Shipped: 'indigo',
  Delivered: 'green',
  Cancelled: 'red',
};

export const Badge = ({ children, tone = 'gray' }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
      TONE_MAP[tone] || TONE_MAP.gray
    }`}
  >
    {children}
  </span>
);

export const StatusBadge = ({ status }) => (
  <Badge tone={STATUS_TONE[status] || 'gray'}>{status}</Badge>
);

/* -------------------- Spinner -------------------- */

export const Spinner = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center gap-3 py-16 text-slate-400 text-sm">
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-5 h-5 border-2 border-purple-500/40 border-t-purple-500 rounded-full"
    />
    {label}
  </div>
);

/* -------------------- Empty state -------------------- */

export const EmptyState = ({ title, hint, action }) => (
  <div className="text-center py-14">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-3">
      <span className="text-2xl">📦</span>
    </div>
    <p className="font-semibold text-white">{title}</p>
    {hint && <p className="text-sm text-slate-400 mt-1">{hint}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

/* -------------------- Page header -------------------- */

export const PageHeader = ({ title, subtitle, actions }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="flex flex-wrap items-start justify-between gap-3 mb-6"
  >
    <div>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
        {title}
      </h1>
      {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </motion.div>
);

/* -------------------- Card -------------------- */

export const Card = ({ children, className = '' }) => (
  <div
    className={`relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md ${className}`}
  >
    {children}
  </div>
);

/* -------------------- Pagination -------------------- */

export const Pagination = ({ page, pages, total, onChange }) => {
  if (!pages || pages <= 1) {
    return total !== undefined ? (
      <p className="text-xs text-slate-500 px-1 pt-3">{total} total</p>
    ) : null;
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
      <p className="text-xs text-slate-500">
        Page <span className="text-white font-semibold">{page}</span> of {pages} ·{' '}
        {total} total
      </p>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className={btnGhost}
          aria-label="Previous page"
        >
          <FiChevronLeft /> Prev
        </button>
        <button
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className={btnGhost}
          aria-label="Next page"
        >
          Next <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

/* -------------------- Modal -------------------- */

export const Modal = ({
  open,
  onClose,
  title,
  children,
  wide = false,
  footer,
}) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`relative w-full ${
              wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'
            } max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-slate-900/95 border border-white/10 backdrop-blur-xl shadow-2xl shadow-purple-500/10`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
              <h2 className="font-bold text-lg text-white">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                aria-label="Close"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto text-slate-300">
              {children}
            </div>
            {footer && (
              <div className="px-6 py-4 border-t border-white/5 flex justify-end gap-2 shrink-0 bg-slate-900/60">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* -------------------- Confirm dialog -------------------- */

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  busy,
  onConfirm,
  onClose,
  tone = 'danger',
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    footer={
      <>
        <button onClick={onClose} className={btnGhost} disabled={busy}>
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={tone === 'danger' ? btnDanger : btnPrimary}
          disabled={busy}
        >
          {busy ? 'Please wait...' : confirmLabel}
        </button>
      </>
    }
  >
    <div className="flex gap-3">
      <div
        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          tone === 'danger'
            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
            : 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
        }`}
      >
        <FiAlertTriangle />
      </div>
      <p className="text-sm text-slate-300 leading-relaxed pt-2">{message}</p>
    </div>
  </Modal>
);

/* -------------------- Debounce hook -------------------- */

export const useDebounced = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};