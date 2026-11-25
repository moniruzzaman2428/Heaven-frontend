import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../api';
import {
  Card, PageHeader, Spinner, EmptyState, Modal, ConfirmDialog,
  Field, inputClass, btnPrimary, btnGhost,
} from '../../component/admin/ui';

const CategoryForm = ({ category, onClose, onSaved }) => {
  const isEdit = !!category;
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { name, description };
      if (isEdit) await api.updateCategory(category._id, body);
      else await api.createCategory(body);
      toast.success(isEdit ? 'Category updated' : 'Category added');
      onSaved();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Category name *" hint={isEdit ? 'Renaming also updates every product in this category.' : undefined}>
        <input value={name} onChange={(e) => setName(e.target.value)} required autoFocus className={inputClass} />
      </Field>
      <Field label="Description">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add category'}
        </button>
      </div>
    </form>
  );
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { document.title = 'Categories | Admin'; }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try { setCategories(await api.getCategories({ withCount: 'true' })); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await api.deleteCategory(deleting._id);
      toast.success('Category deleted');
      setDeleting(null); load();
    } catch (err) { toast.error(err.message); setDeleting(null); }
    finally { setBusy(false); }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Groups shown in the store's product filter"
        actions={
          <button onClick={() => setEditing('new')} className={btnPrimary}>
            <FiPlus /> Add category
          </button>
        }
      />

      <Card className="p-4">
        {loading ? (
          <Spinner />
        ) : categories.length === 0 ? (
          <EmptyState title="No categories yet" hint="Add a category, then assign products to it." />
        ) : (
          <ul className="divide-y divide-white/5">
            <AnimatePresence>
              {categories.map((c) => (
                <motion.li
                  key={c._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4 py-3.5 hover:bg-white/5 px-2 rounded-lg transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/20 flex items-center justify-center shrink-0">
                    <FiTag className="text-purple-300" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">{c.name}</p>
                    <p className="text-xs text-slate-500 truncate">{c.description || `/${c.slug}`}</p>
                  </div>
                  <span className="text-sm text-slate-400 whitespace-nowrap">
                    {c.productCount} product{c.productCount === 1 ? '' : 's'}
                  </span>
                  <div className="whitespace-nowrap flex gap-1">
                    <button onClick={() => setEditing(c)} className="p-2 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 transition" aria-label={`Edit ${c.name}`}>
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => setDeleting(c)} className="p-2 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 transition" aria-label={`Delete ${c.name}`}>
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </Card>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add category' : 'Edit category'}>
        {editing && (
          <CategoryForm
            key={editing === 'new' ? 'new' : editing._id}
            category={editing === 'new' ? null : editing}
            onClose={() => setEditing(null)}
            onSaved={() => { setEditing(null); load(); }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete category?"
        message={deleting
          ? deleting.productCount > 0
            ? `"${deleting.name}" still has ${deleting.productCount} product(s). Move or delete them first — otherwise this will be refused.`
            : `"${deleting.name}" will be deleted.`
          : ''}
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
};

export default AdminCategories;