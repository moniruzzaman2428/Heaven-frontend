import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './MainLayout/Layout';
import AdminLayout from './MainLayout/AdminLayout';
import ProtectedRoute from './component/ProtectedRoute';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import Statistics from './Pages/Statistics';
import Testimonials from './Pages/Testimonials';
import NotFound from './Pages/NotFound';
import ProductDetails from './component/ProductDetails';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Orders from './Pages/Orders';
import OrderDetails from './Pages/OrderDetails';
import Profile from './Pages/Profile';
import AdminDashboard from './Pages/admin/AdminDashboard';
import AdminProducts from './Pages/admin/AdminProducts';
import AdminOrders from './Pages/admin/AdminOrders';
import AdminUsers from './Pages/admin/AdminUsers';
import AdminCategories from './Pages/admin/AdminCategories';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'product/:id', element: <ProductDetails /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <ProtectedRoute><Checkout /></ProtectedRoute> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'orders', element: <ProtectedRoute><Orders /></ProtectedRoute> },
      { path: 'orders/:id', element: <ProtectedRoute><OrderDetails /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: 'statistics', element: <Statistics /> },
      { path: 'testimonials', element: <Testimonials /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'categories', element: <AdminCategories /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
