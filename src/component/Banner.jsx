import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap, FiTruck, FiShield } from 'react-icons/fi';
import bannerImg from '../image/banner.jpg';

const Banner = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/25 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px]"
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-sm font-medium text-slate-200">
                New arrivals every week
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight"
            >
              Upgrade Your
              <br />
              <motion.span
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 bg-[length:200%_100%] bg-clip-text text-transparent"
              >
                Tech Life
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Discover premium gadgets, smartphones, laptops & accessories at
              unbeatable prices. Free shipping over $500.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-9 flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                href="#products"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector('section.max-w-7xl')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-900 font-semibold rounded-2xl hover:bg-purple-50 transition-colors shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
              >
                Shop Now
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </motion.a>

              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/statistics"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 border border-white/15 text-white font-semibold rounded-2xl hover:bg-white/10 hover:border-white/30 backdrop-blur-md transition-colors"
                >
                  View Stats
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-slate-400"
            >
              {[
                { icon: FiTruck, label: 'Free Shipping' },
                { icon: FiShield, label: '2 Year Warranty' },
                { icon: FiZap, label: 'Fast Delivery' },
              ].map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <Icon className="text-purple-400" />
                  <span>{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right visual — rotating image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="flex-1 flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
              {/* Pulsing glow ring */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -inset-4 bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-indigo-500 rounded-full opacity-30 blur-2xl"
              />

              {/* Rotating gradient ring — outer */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-6 rounded-full"
                style={{
                  background:
                    'conic-gradient(from 0deg, #a855f7, #d946ef, #6366f1, #a855f7)',
                  padding: '2px',
                  WebkitMask:
                    'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                  mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                }}
              />

              {/* Rotating dashed ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-2 rounded-full border-2 border-dashed border-purple-400/40"
              />

              {/* Rotating image container */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="relative w-full h-full rounded-full overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/30"
              >
                <img
                  src={bannerImg}
                  alt="Gadgets"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
              </motion.div>

              {/* Floating discount badge — counter-rotates to stay upright */}
              <motion.div
                animate={{ rotate: [-4, 4, -4], y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 sm:-left-6 px-5 py-3 bg-white text-slate-900 rounded-2xl shadow-xl shadow-purple-500/20"
              >
                <div className="text-2xl font-extrabold leading-none">50%</div>
                <div className="text-xs font-medium text-slate-500 mt-1">
                  OFF TODAY
                </div>
              </motion.div>

              {/* Floating rating card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-4 -right-4 sm:-right-6 px-4 py-2.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  ★★★★★
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  10k+ Happy Users
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner;