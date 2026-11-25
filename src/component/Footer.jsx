import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">G</div>
              <span className="font-bold text-xl text-white">GadgetHeaven</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your one-stop destination for premium gadgets, smartphones, laptops and accessories.
            </p>
            <div className="flex gap-3 mt-4">
              {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-purple-400 transition">All Products</Link></li>
              <li><Link to="/?search=phone" className="hover:text-purple-400 transition">Phones</Link></li>
              <li><Link to="/?search=laptop" className="hover:text-purple-400 transition">Laptops</Link></li>
              <li><Link to="/?search=watch" className="hover:text-purple-400 transition">Smart Watches</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-purple-400 transition">Login</Link></li>
              <li><Link to="/register" className="hover:text-purple-400 transition">Register</Link></li>
              <li><Link to="/orders" className="hover:text-purple-400 transition">My Orders</Link></li>
              <li><Link to="/dashboard" className="hover:text-purple-400 transition">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-purple-400 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Returns</a></li>
              <li><a href="#" className="hover:text-purple-400 transition">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2024 Gadget Heaven. All rights reserved.</p>
          <p>Built with React + MongoDB + Express</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
