import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiDollarSign, FiShoppingBag, FiUsers, FiBox,
  FiClock, FiAlertTriangle, FiTrendingUp,
} from 'react-icons/fi';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
} from 'recharts';
import api, { imgUrl } from '../../api';
import { Card, PageHeader, Spinner, StatusBadge } from '../../component/admin/ui';
import { money, formatDate, orderLabel } from '../../Utils/format';

const PIE_COLORS = {
  Pending: '#eab308', Processing: '#3b82f6', Shipped: '#6366f1',
  Delivered: '#22c55e', Cancelled: '#ef4444',
};

const StatCard = ({ icon: Icon, label, value, sub, tone = 'purple', to }) => {
  const tones = {
    purple: 'from-purple-500 to-fuchsia-500',
    green: 'from-emerald-500 to-teal-500',
    blue: 'from-sky-500 to-indigo-500',
    amber: 'from-amber-500 to-orange-500',
  };
  const body = (
    <Card className="p-5 h-full hover:border-purple-500/30 transition-colors group relative overflow-hidden">
      <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${tones[tone]} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
      <div className="relative flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tones[tone]} flex items-center justify-center shadow-lg`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mt-3">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </Card>
  );
  return to ? <Link to={to}>{body}</Link> : body;
};

const AdminDashboard = () => {
  const [days, setDays] = useState(14);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { document.title = 'Admin Dashboard | Gadget Heaven'; }, []);

  useEffect(() => {
    setError('');
    api.getAdminStats(days).then(setStats).catch((e) => setError(e.message));
  }, [days]);

  if (error) return <div className="text-center py-16 text-rose-400">{error}</div>;
  if (!stats) return <Spinner />;

  const { totals, ordersByStatus, salesByDay, topProducts, lowStock, recentOrders } = stats;
  const pieData = Object.entries(ordersByStatus).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Sales, orders and stock at a glance" />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={FiDollarSign} label="Revenue" value={money(totals.revenue)} sub={`${money(totals.paidRevenue)} collected`} tone="green" to="/admin/orders" />
        <StatCard icon={FiShoppingBag} label="Orders" value={totals.orders} sub={`${totals.pendingOrders} pending`} tone="purple" to="/admin/orders?status=Pending" />
        <StatCard icon={FiUsers} label="Customers" value={totals.users} sub={`${totals.newUsers} new in 30 days`} tone="blue" to="/admin/users" />
        <StatCard icon={FiBox} label="Products" value={totals.products} sub={`${lowStock.length} low or out of stock`} tone="amber" to="/admin/products" />
      </div>

      <div className="grid xl:grid-cols-3 gap-4 mt-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="xl:col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FiTrendingUp className="text-purple-400" size={16} />
                <h2 className="font-semibold text-white">Revenue</h2>
              </div>
              <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="text-sm bg-white/5 border border-white/10 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesByDay} margin={{ left: -10, right: 8, top: 5 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} tick={{ fontSize: 11, fill: '#94a3b8' }} minTickGap={20} stroke="rgba(255,255,255,0.1)" />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="rgba(255,255,255,0.1)" />
                  <Tooltip
                    contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: '#fff', fontSize: '12px' }}
                    formatter={(v, name) => (name === 'revenue' ? [money(v), 'Revenue'] : [v, 'Orders'])}
                    labelFormatter={(d) => formatDate(d)}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={2} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
          <Card className="p-5">
            <h2 className="font-semibold text-white mb-4">Orders by status</h2>
            {pieData.length === 0 ? (
              <p className="text-sm text-slate-500 py-16 text-center">No orders yet.</p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                      {pieData.map((d) => (<Cell key={d.name} fill={PIE_COLORS[d.name] || '#94a3b8'} />))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: '#cbd5e1' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      <div className="grid xl:grid-cols-3 gap-4 mt-4">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="xl:col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-white">Recent orders</h2>
              <Link to="/admin/orders" className="text-sm text-purple-300 hover:text-purple-200 hover:underline">View all</Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-white/10">
                      <th className="py-2 pr-4 font-medium">Order</th>
                      <th className="py-2 pr-4 font-medium">Customer</th>
                      <th className="py-2 pr-4 font-medium">Date</th>
                      <th className="py-2 pr-4 font-medium text-right">Total</th>
                      <th className="py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o) => (
                      <tr key={o._id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="py-2.5 pr-4 font-mono text-xs text-slate-300">{orderLabel(o)}</td>
                        <td className="py-2.5 pr-4 text-white">{o.user?.name || <span className="text-slate-500">Deleted user</span>}</td>
                        <td className="py-2.5 pr-4 text-slate-400">{formatDate(o.createdAt)}</td>
                        <td className="py-2.5 pr-4 text-right font-medium text-white">{money(o.totalPrice)}</td>
                        <td className="py-2.5"><StatusBadge status={o.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </motion.div>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="font-semibold text-white mb-3">Best sellers</h2>
            {topProducts.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">No sales yet.</p>
            ) : (
              <ul className="space-y-3">
                {topProducts.map((p) => (
                  <li key={p._id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900/60 border border-white/5 p-1 shrink-0">
                      <img src={imgUrl(p.image)} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{p.title}</p>
                      <p className="text-xs text-slate-500">{p.sold} sold</p>
                    </div>
                    <p className="text-sm font-semibold text-purple-300">{money(p.revenue)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiAlertTriangle className="text-amber-400" size={16} />
              <h2 className="font-semibold text-white">Low stock</h2>
            </div>
            {lowStock.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">All products are well stocked.</p>
            ) : (
              <ul className="space-y-2.5">
                {lowStock.map((p) => (
                  <li key={p._id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-slate-300">{p.product_title}</span>
                    <span className={`shrink-0 font-semibold ${p.stock === 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/admin/products?stock=low" className="inline-flex items-center gap-1 text-sm text-purple-300 hover:text-purple-200 hover:underline mt-3">
              <FiClock size={14} /> Restock products
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;