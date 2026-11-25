import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiEye, FiTrash2, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api, { imgUrl } from '../../api';
import {
  Card,
  PageHeader,
  Spinner,
  EmptyState,
  Pagination,
  Modal,
  ConfirmDialog,
  StatusBadge,
  Badge,
  Field,
  inputClass,
  btnPrimary,
  btnGhost,
  useDebounced,
} from '../../component/admin/ui';
import { money, formatDateTime, formatDate, orderLabel, ORDER_STATUSES } from '../../Utils/format';

const NEXT_STEP = { Pending: 'Processing', Processing: 'Shipped', Shipped: 'Delivered' };

const OrderDetail = ({ order, onChanged, onDelete, onClose }) => {
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const closed = order.status === 'Cancelled' || order.status === 'Delivered';
  const options = ORDER_STATUSES.filter((s) => s !== order.status);

  const applyStatus = async () => {
    setBusy(true);
    try {
      const updated = await api.updateOrderStatus(order._id, status, note);
      toast.success(`Order marked ${status}`);
      setConfirm(false);
      setStatus('');
      setNote('');
      onChanged(updated);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const togglePaid = async () => {
    setBusy(true);
    try {
      const updated = await api.updateOrderPayment(order._id, !order.isPaid);
      toast.success(updated.isPaid ? 'Marked as paid' : 'Marked as unpaid');
      onChanged(updated);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const a = order.shippingAddress || {};

  return (
    <div className="space-y-5 text-sm">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div>
          <p className="font-mono font-semibold text-gray-900">{orderLabel(order)}</p>
          <p className="text-gray-500 text-xs">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <Badge tone={order.isPaid ? 'green' : 'yellow'}>{order.isPaid ? 'Paid' : 'Unpaid'}</Badge>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="font-semibold text-gray-900 mb-1">Customer</p>
          {order.user ? (
            <>
              <p>{order.user.name}</p>
              <p className="text-gray-500">{order.user.email}</p>
            </>
          ) : (
            <p className="text-gray-400">Deleted user</p>
          )}
        </div>
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="font-semibold text-gray-900 mb-1">Ship to</p>
          <p>{a.street}</p>
          <p>{[a.city, a.state, a.zip].filter(Boolean).join(', ')}</p>
          <p>{a.country}</p>
          <p className="text-gray-500 mt-1">Phone: {a.phone}</p>
        </div>
      </div>

      <div>
        <p className="font-semibold text-gray-900 mb-2">Items</p>
        <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl">
          {order.orderItems.map((it, i) => (
            <li key={i} className="flex items-center gap-3 p-3">
              <img src={imgUrl(it.product_image)} alt="" className="w-12 h-12 object-contain rounded-lg bg-gray-50" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{it.product_title}</p>
                <p className="text-xs text-gray-500">
                  {money(it.price)} × {it.quantity}
                </p>
              </div>
              <p className="font-semibold">{money(it.price * it.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-3 ml-auto max-w-xs space-y-1">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>{money(order.itemsPrice)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Shipping</span>
            <span>{order.shippingPrice === 0 ? 'Free' : money(order.shippingPrice)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Tax</span>
            <span>{money(order.taxPrice)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-100">
            <span>Total</span>
            <span className="text-purple-600">{money(order.totalPrice)}</span>
          </div>
          <p className="text-xs text-gray-400 text-right">{order.paymentMethod}</p>
        </div>
      </div>

      {order.statusHistory?.length > 0 && (
        <div>
          <p className="font-semibold text-gray-900 mb-2">History</p>
          <ol className="space-y-2 border-l-2 border-purple-100 pl-4">
            {order.statusHistory.map((h, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[22px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-500" />
                <p className="font-medium">{h.status}</p>
                <p className="text-xs text-gray-500">
                  {formatDateTime(h.at)}
                  {h.note ? ` · ${h.note}` : ''}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="rounded-xl border border-gray-100 p-4 space-y-3">
        <p className="font-semibold text-gray-900">Manage order</p>
        {closed ? (
          <p className="text-gray-500">This order is {order.status.toLowerCase()} and can no longer change status.</p>
        ) : (
          <div className="grid sm:grid-cols-[1fr_1.4fr_auto] gap-2 items-end">
            <Field label="New status">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
                <option value="">Choose...</option>
                {options.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Note (optional)">
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Handed to courier" className={inputClass} />
            </Field>
            <button
              disabled={!status || busy}
              onClick={() => (status === 'Cancelled' || status === 'Delivered' ? setConfirm(true) : applyStatus())}
              className={btnPrimary}
            >
              Update status
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          {order.status !== 'Cancelled' && (
            <button onClick={togglePaid} disabled={busy} className={btnGhost}>
              {order.isPaid ? 'Mark as unpaid' : 'Mark as paid'}
            </button>
          )}
          <button onClick={() => onDelete(order)} className={`${btnGhost} text-red-600 hover:bg-red-50`}>
            <FiTrash2 /> Delete order
          </button>
          <button onClick={onClose} className={`${btnGhost} ml-auto`}>
            Close
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirm}
        title={`Mark order as ${status}?`}
        message={
          status === 'Cancelled'
            ? 'The items will go back into stock. A cancelled order can’t be reopened.'
            : 'Cash on Delivery orders are marked as paid when delivered. A delivered order can’t be changed afterwards.'
        }
        confirmLabel={`Mark ${status}`}
        tone="primary"
        busy={busy}
        onConfirm={applyStatus}
        onClose={() => setConfirm(false)}
      />
    </div>
  );
};

const AdminOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') || '';
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paid, setPaid] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const debouncedSearch = useDebounced(search);

  useEffect(() => {
    document.title = 'Orders | Admin';
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAllOrders({ page, limit: 10, status, search: debouncedSearch, paid });
      setOrders(data.orders);
      setMeta({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, status, debouncedSearch, paid]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [status, debouncedSearch, paid]);

  const setStatusFilter = (s) => {
    const next = new URLSearchParams(searchParams);
    if (s) next.set('status', s);
    else next.delete('status');
    setSearchParams(next, { replace: true });
  };

  const replaceInList = (updated) => {
    setOrders((list) => list.map((o) => (o._id === updated._id ? { ...o, ...updated, user: updated.user || o.user } : o)));
    setSelected((s) => (s && s._id === updated._id ? { ...s, ...updated, user: updated.user || s.user } : s));
  };

  const quickAdvance = async (order) => {
    const next = NEXT_STEP[order.status];
    if (!next) return;
    try {
      const updated = await api.updateOrderStatus(order._id, next);
      toast.success(`${orderLabel(order)} → ${next}`);
      replaceInList(updated);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await api.deleteOrder(deleting._id);
      toast.success('Order deleted');
      setDeleting(null);
      setSelected(null);
      if (orders.length === 1 && page > 1) setPage(page - 1);
      else load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader title="Orders" subtitle={`${meta.total} order${meta.total === 1 ? '' : 's'}`} />

      <div className="flex flex-wrap gap-2 mb-4">
        {['', ...ORDER_STATUSES].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              status === s ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-purple-50'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order no., customer or phone"
              className={`${inputClass} pl-9`}
            />
          </div>
          <select value={paid} onChange={(e) => setPaid(e.target.value)} className={`${inputClass} sm:w-44`}>
            <option value="">Any payment</option>
            <option value="true">Paid</option>
            <option value="false">Unpaid</option>
          </select>
        </div>

        {loading ? (
          <Spinner />
        ) : orders.length === 0 ? (
          <EmptyState title="No orders found" hint="Orders will appear here once customers check out." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="py-2.5 pr-4 font-medium">Order</th>
                  <th className="py-2.5 pr-4 font-medium">Customer</th>
                  <th className="py-2.5 pr-4 font-medium">Date</th>
                  <th className="py-2.5 pr-4 font-medium text-right">Total</th>
                  <th className="py-2.5 pr-4 font-medium">Payment</th>
                  <th className="py-2.5 pr-4 font-medium">Status</th>
                  <th className="py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="py-3 pr-4 font-mono text-xs whitespace-nowrap">{orderLabel(o)}</td>
                    <td className="py-3 pr-4">
                      {o.user ? (
                        <>
                          <p className="font-medium">{o.user.name}</p>
                          <p className="text-xs text-gray-500">{o.user.email}</p>
                        </>
                      ) : (
                        <span className="text-gray-400">Deleted user</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{formatDate(o.createdAt)}</td>
                    <td className="py-3 pr-4 text-right font-medium">{money(o.totalPrice)}</td>
                    <td className="py-3 pr-4">
                      <Badge tone={o.isPaid ? 'green' : 'yellow'}>{o.isPaid ? 'Paid' : 'Unpaid'}</Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      {NEXT_STEP[o.status] && o.status !== 'Shipped' && (
                        <button
                          onClick={() => quickAdvance(o)}
                          className="mr-1 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100"
                          title={`Mark as ${NEXT_STEP[o.status]}`}
                        >
                          {NEXT_STEP[o.status]} <FiArrowRight size={12} />
                        </button>
                      )}
                      <button onClick={() => setSelected(o)} className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50" aria-label="View order">
                        <FiEye size={16} />
                      </button>
                      <button onClick={() => setDeleting(o)} className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50" aria-label="Delete order">
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination {...meta} onChange={setPage} />
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Order details" wide>
        {selected && <OrderDetail order={selected} onChanged={replaceInList} onDelete={setDeleting} onClose={() => setSelected(null)} />}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete order?"
        message={
          deleting
            ? `Order ${orderLabel(deleting)} will be permanently deleted.${
                ['Pending', 'Processing', 'Shipped'].includes(deleting.status) ? ' Its items will go back into stock.' : ''
              }`
            : ''
        }
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
};

export default AdminOrders;
