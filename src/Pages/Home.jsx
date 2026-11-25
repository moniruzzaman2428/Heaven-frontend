import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Banner from '../component/Banner';
import ProductGrid from '../component/ProductGrid';
import api from '../api';

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    document.title = 'Gadget Heaven | Premium Gadgets Store';
    // অ্যাডমিনের বানানো ক্যাটাগরি লিস্ট; খালি/ব্যর্থ হলে নিচের ডিফল্ট লিস্ট
    api.getCategories()
      .then((data) => (data.length ? data : Promise.reject(new Error('empty'))))
      .then((data) =>
        setCategories([{ id: 0, category: 'All Products', slug: 'all' }, ...data.map((c) => ({ id: c._id, category: c.name, slug: c.slug }))])
      )
      .catch(() => {
        setCategories([
          { id: 0, category: 'All Products', slug: 'all' },
          { id: 1, category: 'Laptops', slug: 'laptops' },
          { id: 2, category: 'Phones', slug: 'phones' },
          { id: 3, category: 'Accessories', slug: 'accessories' },
          { id: 4, category: 'Smart Watches', slug: 'smart-watches' },
          { id: 5, category: 'MacBook', slug: 'mac-book' },
          { id: 6, category: 'IPhone', slug: 'iphone' },
        ]);
      });
  }, []);

  return (
    <div>
      <Banner />
      <ProductGrid categories={categories} initialSearch={searchQuery} />
    </div>
  );
};

export default Home;
