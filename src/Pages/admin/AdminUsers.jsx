import React, { useCallback, useEffect, useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiSlash, FiCheckCircle, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import {
  Card,
  PageHeader,
  Spinner,
  EmptyState,
  Pagination,
  Modal,
  ConfirmDialog,
  Field,
  Badge,
  StatusBadge,
  inputClass,
  btnPrimary,
  btnGhost,
  useDebounced,
} from '../../component/admin/ui';
import { money, formatDate, orderLabel } from '../../Utils/format';

const UserForm = ({ user, isSelf, onClose, onSaved }) => {
  const isEdit = !!user;
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'user',
    password: '',
  });
  const [saving, setSaving] = useState(false);
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form };
      if (isEdit && !body.password) delete body.password;
      if (isEdit && isSelf) delete body.role; // নিজের রোল বদলানো যায় না
      const saved = isEdit ? await api.updateUser(user._id, body) : await api.createUser(body);
      toast.success(isEdit ? 'User updated' : 'User created');
      onSaved(saved);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Full name *">
        <input name="name" value={form.name} onChange={onChange} required className={inputClass} />
      </Field>
      <Field label="Email *">
        <input name="email" type="email" value={form.email} onChange={onChange} required className={inputClass} />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Phone">
          <input name="phone" value={form.phone} onChange={onChange} className={inputClass} />
        </Field>
        <Field label="Role" hint={isSelf ? "You can't change your own role." : undefined}>
          <select name="role" value={form.role} onChange={onChange} disabled={isEdit && isSelf} className={inputClass}>
            <option value="user">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
      </div>
      <Field
        label={isEdit ? 'Reset password' : 'Password *'}
        hint={isEdit ? 'Leave blank to keep the current password.' : 'At least 6 characters.'}
      >
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          required={!isEdit}
          minLength={6}
          autoComplete="new-password"
          className={inputClass}
        />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className={btnGhost}>
          Cancel
        </button>
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create user'}
        </button>
      </div>
    </form>
  );
};

const UserDetail = ({ id }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    api
      .getUser(id)
      .then(setData)
      .catch((e) => toast.error(e.message));
  }, [id]);

  if (!data) return <Spinner />;
  const { user, orders } = data;
  const a = user.address || {};
  return (
    <div className="space-y-5 text-sm">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-gray-50 p-4 space-y-1">
          <p className="font-semibold text-gray-900 text-base">{user.name}</p>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.phone || 'No phone'}</p>
          <div className="flex gap-2 pt-1">
            <Badge tone={user.role === 'admin' ? 'purple' : 'gray'}>{user.role === 'admin' ? 'Admin' : 'Customer'}</Badge>
            <Badge tone={user.isActive === false ? 'red' : 'green'}>{user.isActive === false ? 'Blocked' : 'Active'}</Badge>
          </div>
        </div>
        <div className="rounded-xl bg-gray-50 p-4 space-y-1 text-gray-600">
          <p className="font-semibold text-gray-900">Details</p>
          <p>Joined {formatDate(user.createdAt)}</p>
          <p>Last login {user.lastLogin ? formatDate(user.lastLogin) : 'never'}</p>
          <p>{[a.street, a.city, a.state, a.zip, a.country].filter(Boolean).join(', ') || 'No saved address'}</p>
        </div>
      </div>
      <div>
        <p className="font-semibold text-gray-900 mb-2">Recent orders ({orders.length})</p>
        {orders.length === 0 ? (
          <p className="text-gray-500">This user hasn’t ordered yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl">
            {orders.map((o) => (
              <li key={o._id} className="flex items-center justify-between gap-3 p-3">
                <div>
                  <p className="font-mono text-xs">{orderLabel(o)}</p>
                  <p className="text-xs text-gray-500">{formatDate(o.createdAt)}</p>
                </div>
                <StatusBadge status={o.status} />
                <p className="font-semibold">{money(o.totalPrice)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null); // null | 'new' | user
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const debouncedSearch = useDebounced(search);

  useEffect(() => {
    document.title = 'Users | Admin';
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getUsers({ page, limit: 10, search: debouncedSearch, role, status });
      setUsers(data.users);
      setMeta({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, role, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, role, status]);

  const toggleBlock = async (u) => {
    const block = u.isActive !== false;
    try {
      await api.updateUser(u._id, { isActive: !block });
      toast.success(block ? `${u.name} blocked` : `${u.name} unblocked`);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const changeRole = async (u, newRole) => {
    try {
      await api.updateUser(u._id, { role: newRole });
      toast.success(`${u.name} is now ${newRole === 'admin' ? 'an admin' : 'a customer'}`);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await api.deleteUser(deleting._id);
      toast.success('User deleted');
      setDeleting(null);
      if (users.length === 1 && page > 1) setPage(page - 1);
      else load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={`${meta.total} account${meta.total === 1 ? '' : 's'}`}
        actions={
          <button onClick={() => setEditing('new')} className={btnPrimary}>
            <FiPlus /> Add user
          </button>
        }
      />

      <Card className="p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email or phone" className={`${inputClass} pl-9`} />
          </div>
          <select value={role} onChange={(e) => setRole(e.target.value)} className={`${inputClass} sm:w-40`}>
            <option value="">All roles</option>
            <option value="user">Customers</option>
            <option value="admin">Admins</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputClass} sm:w-40`}>
            <option value="">Any status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {loading ? (
          <Spinner />
        ) : users.length === 0 ? (
          <EmptyState title="No users found" hint="Try a different search or filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="py-2.5 pr-4 font-medium">User</th>
                  <th className="py-2.5 pr-4 font-medium">Role</th>
                  <th className="py-2.5 pr-4 font-medium text-right">Orders</th>
                  <th className="py-2.5 pr-4 font-medium text-right">Spent</th>
                  <th className="py-2.5 pr-4 font-medium">Joined</th>
                  <th className="py-2.5 pr-4 font-medium">Status</th>
                  <th className="py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u._id === me?._id;
                  const blocked = u.isActive === false;
                  return (
                    <tr key={u._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold shrink-0">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {u.name} {isSelf && <span className="text-xs text-gray-400">(you)</span>}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <select
                          value={u.role}
                          disabled={isSelf}
                          onChange={(e) => changeRole(u, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                          aria-label={`Role of ${u.name}`}
                        >
                          <option value="user">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 pr-4 text-right">{u.orderCount}</td>
                      <td className="py-3 pr-4 text-right font-medium">{money(u.totalSpent)}</td>
                      <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                      <td className="py-3 pr-4">
                        <Badge tone={blocked ? 'red' : 'green'}>{blocked ? 'Blocked' : 'Active'}</Badge>
                      </td>
                      <td className="py-3 text-right whitespace-nowrap">
                        <button onClick={() => setViewing(u)} className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50" aria-label={`View ${u.name}`}>
                          <FiEye size={16} />
                        </button>
                        <button onClick={() => setEditing(u)} className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50" aria-label={`Edit ${u.name}`}>
                          <FiEdit2 size={16} />
                        </button>
                        {!isSelf && (
                          <>
                            <button
                              onClick={() => toggleBlock(u)}
                              className={`p-2 rounded-lg text-gray-500 ${blocked ? 'hover:text-green-600 hover:bg-green-50' : 'hover:text-amber-600 hover:bg-amber-50'}`}
                              aria-label={blocked ? `Unblock ${u.name}` : `Block ${u.name}`}
                              title={blocked ? 'Unblock' : 'Block'}
                            >
                              {blocked ? <FiCheckCircle size={16} /> : <FiSlash size={16} />}
                            </button>
                            <button onClick={() => setDeleting(u)} className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50" aria-label={`Delete ${u.name}`}>
                              <FiTrash2 size={16} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Pagination {...meta} onChange={setPage} />
      </Card>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add user' : 'Edit user'}>
        {editing && (
          <UserForm
            key={editing === 'new' ? 'new' : editing._id}
            user={editing === 'new' ? null : editing}
            isSelf={editing !== 'new' && editing._id === me?._id}
            onClose={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              load();
            }}
          />
        )}
      </Modal>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="User details" wide>
        {viewing && <UserDetail id={viewing._id} />}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete user?"
        message={deleting ? `${deleting.name} (${deleting.email}) will be permanently deleted along with their reviews. Their past orders stay in your records.` : ''}
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
};

export default AdminUsers;
