import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiArrowLeft,
  FiCheck,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiMinus,
  FiPlus,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api, { imgUrl } from '../api';
import Reviews from './Reviews';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } =
    useCart();

  const load = React.useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const data = await api.getProduct(id);
        setProduct(data);
        document.title = `${data.product_title} | Gadget Heaven`;
      } catch {
        try {
          const res = await fetch('/product.json');
          const list = await res.json();
          const found = list.find((p) => p.product_id === id || p._id === id);
          setProduct(found || null);
          if (found) document.title = `${found.product_title} | Gadget Heaven`;
        } catch {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    load();
    setQty(1);
  }, [load]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="aspect-square bg-white/5 rounded-3xl animate-pulse" />
            <div className="space-y-4 pt-4">
              <div className="h-4 bg-white/5 rounded w-1/4 animate-pulse" />
              <div className="h-8 bg-white/5 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
              <div className="h-10 bg-white/5 rounded w-1/3 animate-pulse mt-4" />
              <div className="h-20 bg-white/5 rounded w-full animate-pulse" />
              <div className="h-12 bg-white/5 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 py-24">
        <div className="text-6xl">📦</div>
        <p className="text-xl text-slate-300">Product not found</p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const pid = product._id || product.product_id;
  const inWish = isInWishlist(pid);
  const hasStockInfo = typeof product.stock === 'number';
  const inStock =
    product.availability !== false && (!hasStockInfo || product.stock > 0);
  const maxQty = hasStockInfo ? Math.max(product.stock, 1) : 99;

  const handleAdd = () => {
    if (addToCart(product, qty))
      toast.success(`Added ${qty} item(s) to cart!`);
  };

  const handleWish = () => {
    if (inWish) {
      removeFromWishlist(pid);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 group transition-colors"
          >
            <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
            Back to products
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
          {/* Image panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 backdrop-blur-md p-8 overflow-hidden group">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-fuchsia-500/10 to-indigo-500/20 opacity-60 blur-2xl" />

              <motion.img
                src={imgUrl(product.product_image)}
                alt={product.product_title}
                className="relative w-full h-full object-contain drop-shadow-2xl"
                whileHover={{ scale: 1.06, rotate: -1 }}
                transition={{ duration: 0.4 }}
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop';
                }}
              />

              {/* Wishlist floating top-right */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleWish}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition ${
                  inWish
                    ? 'bg-pink-500/90 text-white border-pink-400 shadow-lg shadow-pink-500/30'
                    : 'bg-slate-900/70 text-slate-300 border-white/10 hover:text-pink-400 hover:border-pink-400/50'
                }`}
              >
                <FiHeart size={18} fill={inWish ? 'currentColor' : 'none'} />
              </motion.button>
            </div>

            {/* Trust strip under image */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { icon: FiTruck, label: 'Free Shipping' },
                { icon: FiRefreshCw, label: 'Easy Returns' },
                { icon: FiShield, label: 'Warranty' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300"
                >
                  <Icon className="text-purple-400" size={16} />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Details panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 uppercase tracking-wider mb-3">
              {product.category}
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
              {product.product_title}
            </h1>

            {/* Rating + brand */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                <FiStar
                  size={14}
                  className="text-amber-400"
                  fill="currentColor"
                />
                <span className="font-semibold text-amber-300 text-sm">
                  {product.rating || 0}
                </span>
                {product.numReviews > 0 && (
                  <span className="text-xs text-amber-400/70">
                    ({product.numReviews} review
                    {product.numReviews === 1 ? '' : 's'})
                  </span>
                )}
              </div>
              {product.brand && (
                <span className="text-sm text-slate-400">
                  Brand:{' '}
                  <span className="font-medium text-slate-200">
                    {product.brand}
                  </span>
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mt-5 flex items-end gap-3">
              <span className="text-4xl font-extrabold bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-slate-500 line-through mb-1.5">
                ${(product.price * 1.2).toFixed(2)}
              </span>
              <span className="mb-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                Save 20%
              </span>
            </div>

            {/* Description */}
            <p className="text-slate-300 mt-4 leading-relaxed">
              {product.description}
            </p>

            {/* Stock + warranty */}
            <div className="flex flex-wrap items-center gap-2 mt-5">
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                  <FiCheck size={14} />
                  {hasStockInfo && product.stock <= 10
                    ? `Only ${product.stock} left`
                    : 'In Stock'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full">
                  Out of Stock
                </span>
              )}
              {product.warranty && (
                <span className="inline-flex items-center gap-1.5 text-sm text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <FiShield size={14} className="text-purple-400" />
                  {product.warranty} Warranty
                </span>
              )}
            </div>

            {/* Specifications */}
            {product.Specification?.length > 0 && (
              <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="font-semibold text-white mb-2.5 text-sm uppercase tracking-wider">
                  Specifications
                </h3>
                <ul className="space-y-1.5">
                  {product.Specification.map((spec, i) => (
                    <li
                      key={i}
                      className="text-sm text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-400 mt-1.5 shrink-0" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Qty + CTA */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <div className="flex items-center rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-slate-300 hover:bg-white/10 hover:text-white transition"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={14} />
                </button>
                <span className="px-4 py-3 font-semibold min-w-[3rem] text-center text-white">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  className="px-4 py-3 text-slate-300 hover:bg-white/10 hover:text-white transition"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={14} />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: inStock ? 1.03 : 1, y: inStock ? -2 : 0 }}
                whileTap={{ scale: inStock ? 0.97 : 1 }}
                onClick={handleAdd}
                disabled={!inStock}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <FiShoppingCart size={18} /> Add to Cart
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <Reviews product={product} onChanged={() => load(true)} />
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;