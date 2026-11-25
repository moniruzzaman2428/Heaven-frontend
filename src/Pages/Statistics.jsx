import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { FiArrowLeft, FiTrendingUp, FiPackage, FiAward } from 'react-icons/fi';
import api from '../api';

const Statistics = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Gadget Heaven || Statistics';
    const load = async () => {
      try {
        const data = await api.getProducts({ limit: 100, sort: 'rating' });
        setProducts(data.products || data);
      } catch {
        try {
          const res = await fetch('/product.json');
          setProducts(await res.json());
        } catch {
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const topRated = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8)
    .map((p) => ({
      name:
        p.product_title.length > 14
          ? `${p.product_title.slice(0, 14)}…`
          : p.product_title,
      Price: p.price,
      'Rating (×100)': Math.round((p.rating || 0) * 20),
    }));

  const byCategory = Object.entries(
    products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, Products]) => ({ name, Products }));

  // Summary stats
  const avgPrice =
    products.length > 0
      ? Math.round(
          products.reduce((s, p) => s + (p.price || 0), 0) / products.length
        )
      : 0;
  const avgRating =
    products.length > 0
      ? (
          products.reduce((s, p) => s + (p.rating || 0), 0) / products.length
        ).toFixed(1)
      : 0;
  const categoryCount = byCategory.length;

  const categoryColors = ['#a855f7', '#d946ef', '#6366f1', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Header */}
      <div className="relative border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6 group"
            >
              <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300 mb-4">
                <FiTrendingUp /> Live Analytics
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Product{' '}
                <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                  Statistics
                </span>
              </h1>
              <p className="mt-3 text-slate-400 max-w-xl">
                See how our gadgets compare on price, rating and range.
              </p>
            </div>
          </motion.div>

          {/* KPI cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: FiPackage,
                label: 'Total Products',
                value: products.length,
                color: 'from-purple-500 to-fuchsia-500',
              },
              {
                icon: FiAward,
                label: 'Avg. Rating',
                value: avgRating,
                color: 'from-indigo-500 to-purple-500',
              },
              {
                icon: FiTrendingUp,
                label: 'Avg. Price',
                value: `$${avgPrice}`,
                color: 'from-fuchsia-500 to-pink-500',
              },
            ].map(({ icon: Icon, label, value, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="relative p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden group hover:border-white/20 transition-all"
              >
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${color} opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`}
                />
                <div className="relative flex items-center gap-4">
                  <div
                    className={`p-2.5 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
                  >
                    <Icon className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">
                      {label}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {loading ? '—' : value}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts area */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent"
            />
            <p className="text-slate-400">Loading statistics...</p>
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-slate-400 py-24">
            No product data to show yet.
          </p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top rated products chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden hover:border-white/20 transition-colors"
            >
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-start justify-between mb-1">
                  <h2 className="font-semibold text-white">
                    Top Rated Products
                  </h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    Top 8
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-5">
                  Price in USD; rating shown out of 100.
                </p>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart data={topRated} barGap={4}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6} />
                      </linearGradient>
                      <linearGradient id="ratingGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f472b6" stopOpacity={1} />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.06)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }}
                    />
                    <Bar
                      dataKey="Price"
                      fill="url(#priceGrad)"
                      radius={[6, 6, 0, 0]}
                      animationDuration={1200}
                    />
                    <Bar
                      dataKey="Rating (×100)"
                      fill="url(#ratingGrad)"
                      radius={[6, 6, 0, 0]}
                      animationDuration={1400}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Products per category chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden hover:border-white/20 transition-colors"
            >
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-start justify-between mb-1">
                  <h2 className="font-semibold text-white">
                    Products per Category
                  </h2>
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {categoryCount} categories
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-5">
                  How our range is spread across categories.
                </p>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart data={byCategory} barGap={4}>
                    <defs>
                      <linearGradient id="catGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.06)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={60}
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    />
                    <Bar
                      dataKey="Products"
                      radius={[6, 6, 0, 0]}
                      animationDuration={1200}
                    >
                      {byCategory.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={categoryColors[idx % categoryColors.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;