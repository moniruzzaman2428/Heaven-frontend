import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const getId = (p) => p._id || p.product_id;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem('gh_cart') || '[]'));
      setWishlist(JSON.parse(localStorage.getItem('gh_wishlist') || '[]'));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // লোড হওয়ার আগে লিখলে সেভ করা কার্ট খালি array দিয়ে মুছে যেত
  useEffect(() => {
    if (hydrated) localStorage.setItem('gh_cart', JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem('gh_wishlist', JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  // true = যোগ হয়েছে, false = স্টক নেই/সীমা ছাড়িয়েছে
  const addToCart = (product, qty = 1) => {
    const id = getId(product);
    const existing = cart.find((item) => getId(item) === id);
    const current = existing ? existing.quantity : 0;
    const max = typeof product.stock === 'number' ? product.stock : Infinity;

    if (product.availability === false || max <= 0) {
      toast.error('This product is out of stock');
      return false;
    }
    let add = qty;
    if (current + add > max) {
      if (current >= max) {
        toast.error(`Only ${max} in stock — already in your cart`);
        return false;
      }
      add = max - current;
      toast(`Only ${max} in stock, added ${add}`, { icon: 'ℹ️' });
    }
    setCart((prev) =>
      existing
        ? prev.map((item) => (getId(item) === id ? { ...item, ...product, quantity: item.quantity + add } : item))
        : [...prev, { ...product, quantity: add }]
    );
    return true;
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => getId(item) !== id));

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) => {
        if (getId(item) !== id) return item;
        const max = typeof item.stock === 'number' ? item.stock : Infinity;
        if (quantity > max) {
          toast.error(`Only ${max} in stock`);
          return { ...item, quantity: max };
        }
        return { ...item, quantity };
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToWishlist = (product) => {
    const id = getId(product);
    setWishlist((prev) => (prev.find((p) => getId(p) === id) ? prev : [...prev, product]));
  };

  const removeFromWishlist = (id) => setWishlist((prev) => prev.filter((p) => getId(p) !== id));

  const isInWishlist = (id) => wishlist.some((p) => getId(p) === id);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
