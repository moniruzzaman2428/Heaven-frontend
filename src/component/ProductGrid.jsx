import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api, { imgUrl } from '../api';
import { useCart } from '../context/CartContext';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};

const ProductGrid = ({ categories = [], initialSearch = '' }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(initialSearch);
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } =
    useCart();

  useEffect(() => {
    setSearch(initialSearch);
    setPage(1);
  }, [initialSearch]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit: 12 };
        if (selectedCategory && selectedCategory !== 'All Products')
          params.category = selectedCategory;
        if (search) params.search = search;
        if (sort) params.sort = sort;
        const data = await api.getProducts(params);
        setProducts(data.products || data);
        setTotalPages(data.pages || 1);
        setTotal(data.total ?? (data.products || data).length);
      } catch (err) {
        try {
          const res = await fetch('/product.json');
          const data = await res.json();
          let filtered = data;
          if (selectedCategory && selectedCategory !== 'All Products') {
            filtered = data.filter((p) => p.category === selectedCategory);
          }
          if (search) {
            const q = search.toLowerCase();
            filtered = filtered.filter(
              (p) =>
                p.product_title.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.brand?.toLowerCase().includes(q)
            );
          }
          if (sort === 'price-asc')
            filtered.sort((a, b) => a.price - b.price);
          if (sort === 'price-desc')
            filtered.sort((a, b) => b.price - a.price);
          if (sort === 'rating')
            filtered.sort((a, b) => b.rating - a.rating);
          setProducts(filtered);
          setTotalPages(1);
          setTotal(filtered.length);
        } catch {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, search, sort, page]);

  const handleAddCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart(product))
      toast.success(`${product.product_title} added to cart!`);
  };

  const handleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const id = product._id || product.product_id;
    if (isInWishlist(id)) {
      removeFromWishlist(id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  const cats = categories.length
    ? categories.map((c) => c.category || c.name)
    : [
        'All Products',
        'Laptops',
        'Phones',
        'Accessories',
        'Smart Watches',
        'MacBook',
        'IPhone',
      ];

  return (
    <section className="relative bg-slate-950 text-white py-12">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-60 shrink-0">
            <div className="lg:sticky lg:top-24 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                <FiFilter className="text-purple-400" size={16} />
                <h3 className="font-semibold text-white text-sm uppercase tracking-wide">
                  Categories
                </h3>
              </div>
              <ul className="space-y-1">
                {cats.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <li key={cat}>
                      <button
                        onClick={() => {
                          setSelectedCategory(cat);
                          setPage(1);
                        }}
                        className={`relative w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          active
                            ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/30'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {cat}
                        {active && (
                          <motion.span
                            layoutId="activeCat"
                            className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Clear filters */}
              {(selectedCategory !== 'All Products' || search || sort) && (
                <button
                  onClick={() => {
                    setSelectedCategory('All Products');
                    setSearch('');
                    setSort('');
                    setPage(1);
                  }}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <FiX size={14} /> Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Header + controls */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Explore{' '}
                  <span className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                    Cutting-Edge Gadgets
                  </span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {loading
                    ? 'Loading...'
                    : `${total} product${total === 1 ? '' : 's'} found`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Search box */}
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search..."
                    className="pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 w-40 sm:w-52 transition"
                  />
                </div>

                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900">Sort by</option>
                  <option value="price-asc" className="bg-slate-900">Price: Low → High</option>
                  <option value="price-desc" className="bg-slate-900">Price: High → Low</option>
                  <option value="rating" className="bg-slate-900">Top Rated</option>
                  <option value="name" className="bg-slate-900">Name A-Z</option>
                </select>
              </div>
            </motion.div>

            {/* Loading skeleton */}
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-square bg-white/5" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-white/5 rounded w-1/3" />
                      <div className="h-4 bg-white/5 rounded w-3/4" />
                      <div className="h-3 bg-white/5 rounded w-1/2" />
                      <div className="h-5 bg-white/5 rounded w-1/3 mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 text-rose-400">{error}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-slate-300 text-lg">No products found.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All Products');
                    setSearch('');
                    setSort('');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {/* Product grid */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  <AnimatePresence mode="popLayout">
                    {products.map((product) => {
                      const id = product._id || product.product_id;
                      const inWish = isInWishlist(id);
                      const inStock =
                        product.availability !== false &&
                        !(
                          typeof product.stock === 'number' &&
                          product.stock <= 0
                        );
                      return (
                        <motion.div
                          key={id}
                          layout
                          variants={itemVariants}
                          initial="hidden"
                          animate="show"
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ y: -6 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Link
                            to={`/product/${id}`}
                            className="group block h-full rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300"
                          >
                            {/* Image */}
                            <div className="relative aspect-square bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
                              <img
                                src={imgUrl(product.product_image)}
                                alt={product.product_title}
                                className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                              />
                              {/* Wishlist */}
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={(e) => handleWishlist(e, product)}
                                className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition ${
                                  inWish
                                    ? 'bg-pink-500/90 text-white border-pink-400'
                                    : 'bg-slate-900/70 text-slate-300 border-white/10 hover:text-pink-400 hover:border-pink-400/50'
                                }`}
                              >
                                <FiHeart
                                  size={15}
                                  fill={inWish ? 'currentColor' : 'none'}
                                />
                              </motion.button>

                              {/* Out of stock */}
                              {!inStock && (
                                <span className="absolute top-3 left-3 bg-rose-500/90 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full backdrop-blur">
                                  Out of Stock
                                </span>
                              )}

                              {/* Rating floating chip */}
                              <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10">
                                <FiStar
                                  size={12}
                                  className="text-amber-400"
                                  fill="currentColor"
                                />
                                <span className="text-xs font-semibold text-white">
                                  {product.rating || 0}
                                </span>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                              <p className="text-[11px] uppercase tracking-wider text-purple-400 font-semibold mb-1">
                                {product.category}
                              </p>
                              <h3 className="font-semibold text-white line-clamp-2 leading-snug group-hover:text-purple-300 transition">
                                {product.product_title}
                              </h3>

                              <div className="flex items-center justify-between mt-4">
                                <div>
                                  <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                                    Price
                                  </div>
                                  <span className="text-lg font-bold bg-gradient-to-r from-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
                                    ${product.price.toFixed(2)}
                                  </span>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.08 }}
                                  whileTap={{ scale: 0.92 }}
                                  onClick={(e) => handleAddCart(e, product)}
                                  disabled={!inStock}
                                  className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white hover:shadow-lg hover:shadow-purple-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                  <FiShoppingCart size={16} />
                                </motion.button>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center items-center gap-3 mt-12"
                  >
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <FiChevronLeft size={16} /> Prev
                    </button>
                    <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300">
                      Page <span className="text-white font-semibold">{page}</span>{' '}
                      of {totalPages}
                    </span>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      Next <FiChevronRight size={16} />
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;