import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiStar,
  FiTrash2,
  FiMessageSquare,
  FiUser,
  FiLock,
  FiSend,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../Utils/format';

/* -------------------- Stars display -------------------- */
const Stars = ({ value, size = 14 }) => (
  <span
    className="inline-flex gap-0.5 text-amber-400"
    aria-label={`${value} out of 5`}
  >
    {[1, 2, 3, 4, 5].map((n) => (
      <FiStar
        key={n}
        size={size}
        fill={n <= Math.round(value) ? 'currentColor' : 'none'}
        className={n <= Math.round(value) ? '' : 'opacity-30'}
      />
    ))}
  </span>
);

/* -------------------- Interactive star picker -------------------- */
const StarPicker = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  return (
    <div className="flex gap-1.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.1 }}
          className={`p-0.5 transition-colors ${
            n <= active ? 'text-amber-400' : 'text-slate-600'
          }`}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          aria-pressed={n === value}
        >
          <FiStar
            size={28}
            fill={n <= active ? 'currentColor' : 'none'}
            className="drop-shadow-sm"
          />
        </motion.button>
      ))}
    </div>
  );
};

const Reviews = ({ product, onChanged }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  const productId = product._id;

  const load = useCallback(async () => {
    if (!productId) return setLoading(false);
    try {
      setReviews(await api.getReviews(productId));
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  const mine = reviews.find((r) => r.user === user?._id);

  useEffect(() => {
    if (mine) {
      setRating(mine.rating);
      setComment(mine.comment);
    }
  }, [mine?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshProduct = async () => {
    await load();
    onChanged?.();
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.addReview(productId, { rating, comment });
      toast.success(mine ? 'Review updated' : 'Thanks for your review!');
      await refreshProduct();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.deleteReview(r._id);
      toast.success('Review deleted');
      if (r.user === user?._id) {
        setComment('');
        setRating(5);
      }
      await refreshProduct();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Compute average + distribution
  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, counts: [0, 0, 0, 0, 0] };
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const i = Math.min(5, Math.max(1, Math.round(r.rating))) - 1;
      counts[i]++;
    });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    return { avg, counts };
  }, [reviews]);

  if (!productId) return null;

  return (
    <section className="mt-14">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/15 border border-purple-500/20">
          <FiMessageSquare size={16} className="text-purple-300" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          Customer{' '}
          <span className="bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
            Reviews
          </span>
        </h2>
        {reviews.length > 0 && (
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
            {reviews.length}
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* ------------ Reviews list ------------ */}
        <div className="lg:col-span-3 space-y-4">
          {/* Summary card */}
          {reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5"
            >
              <div className="flex items-center gap-4">
                <div className="text-center shrink-0">
                  <p className="text-4xl font-extrabold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                    {stats.avg.toFixed(1)}
                  </p>
                  <Stars value={stats.avg} size={12} />
                  <p className="text-[11px] text-slate-500 mt-1">
                    {reviews.length} review{reviews.length === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = stats.counts[star - 1];
                    const pct = (count / reviews.length) * 100;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-slate-400">{star}</span>
                        <FiStar
                          size={10}
                          className="text-amber-400 shrink-0"
                          fill="currentColor"
                        />
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                          />
                        </div>
                        <span className="w-6 text-right text-slate-500">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex items-center gap-3 py-8 text-slate-400 text-sm">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-purple-500/40 border-t-purple-500 rounded-full"
              />
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10 rounded-2xl bg-white/5 border border-white/10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-3">
                <FiMessageSquare size={22} className="text-amber-300" />
              </div>
              <p className="font-semibold text-white">No reviews yet</p>
              <p className="text-sm text-slate-400 mt-1">
                Be the first to share your experience.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              <ul className="space-y-3">
                {reviews.map((r) => (
                  <motion.li
                    key={r._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-4 sm:p-5 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                          {(r.name || 'U')[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">
                            {r.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <Stars value={r.rating} size={12} />
                            <span className="text-[11px] text-slate-500">
                              {formatDate(r.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {(isAdmin || r.user === user?._id) && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => remove(r)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
                          aria-label="Delete review"
                        >
                          <FiTrash2 size={15} />
                        </motion.button>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm mt-3 leading-relaxed whitespace-pre-line">
                      {r.comment}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </AnimatePresence>
          )}
        </div>

        {/* ------------ Write review form ------------ */}
        <div className="lg:col-span-2">
          {isAuthenticated ? (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={submit}
              className="lg:sticky lg:top-24 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5 space-y-4 relative overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <FiStar size={16} className="text-amber-400" />
                  <h3 className="font-semibold text-white">
                    {mine ? 'Edit your review' : 'Write a review'}
                  </h3>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Your rating
                  </p>
                  <StarPicker value={rating} onChange={setRating} />
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  maxLength={1000}
                  rows={5}
                  placeholder="What did you like or dislike?"
                  className="mt-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition"
                />
                <p className="text-[11px] text-slate-500 mt-1 text-right">
                  {comment.length}/1000
                </p>

                <motion.button
                  whileHover={{ scale: saving ? 1 : 1.02, y: saving ? 0 : -1 }}
                  whileTap={{ scale: saving ? 1 : 0.98 }}
                  type="submit"
                  disabled={saving}
                  className="w-full mt-3 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
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
                      <FiSend size={15} />
                      {mine ? 'Update Review' : 'Submit Review'}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <div className="rounded-2xl bg-gradient-to-br from-purple-600/20 to-fuchsia-600/10 border border-purple-500/20 p-5 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <FiLock size={14} className="text-purple-300" />
                <p className="font-semibold text-white">Sign in to review</p>
              </div>
              <p className="text-slate-300 text-xs mb-3">
                Share your experience with other shoppers.
              </p>
              <Link
                to={`/login?redirect=/product/${productId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                <FiUser size={14} /> Log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Reviews;