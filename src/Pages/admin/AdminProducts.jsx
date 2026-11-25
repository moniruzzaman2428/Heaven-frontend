import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUpload } from 'react-icons/fi';
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
  Field,
  Badge,
  inputClass,
  btnPrimary,
  btnGhost,
  useDebounced,
} from '../../component/admin/ui';
import { money } from '../../Utils/format';

const emptyForm = {
  product_id: '',
  product_title: '',
  product_image: '',
  category: '',
  brand: '',
  price: '',
  stock: 20,
  rating: '',
  warranty: '',
  color: '',
  availability: true,
  description: '',
  Specification: '',
};

const toForm = (p) => ({
  product_id: p.product_id || '',
  product_title: p.product_title || '',
  product_image: p.product_image || '',
  category: p.category || '',
  brand: p.brand || '',
  price: p.price ?? '',
  stock: p.stock ?? 0,
  rating: p.rating ?? '',
  warranty: p.warranty || '',
  color: p.color || '',
  availability: p.availability !== false,
  description: p.description || '',
  Specification: (p.Specification || []).join('\n'),
});

const ProductForm = ({ product, categories, onClose, onSaved }) => {
  const isEdit = !!product;
  const [form, setForm] = useState(isEdit ? toForm(product) : { ...emptyForm, category: categories[0]?.name || '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'stock') {
      // স্টক বদলালে availability নিজে থেকে মিলিয়ে দেয় (চাইলে হাতে বদলানো যায়)
      setForm((f) => ({ ...f, stock: value, availability: Number(value) > 0 }));
      return;
    }
    set(name, type === 'checkbox' ? checked : value);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      set('product_image', url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.product_image) return toast.error('Please add a product image (upload or paste a link)');
    if (!form.category) return toast.error('Please choose a category');
    setSaving(true);
    try {
      const body = { ...form };
      if (isEdit) {
        delete body.product_id;
        delete body.rating; // রেটিং গ্রাহকের রিভিউ থেকে নিজে হিসাব হয়
      }
      const saved = isEdit ? await api.updateProduct(product._id, body) : await api.createProduct(body);
      toast.success(isEdit ? 'Product updated' : 'Product added');
      onSaved(saved);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
      <Field label="Product name *" className="sm:col-span-2">
        <input name="product_title" value={form.product_title} onChange={onChange} required className={inputClass} />
      </Field>

      <Field label="Image *" className="sm:col-span-2" hint="Upload a JPG, PNG, WEBP or GIF (max 3MB), or paste an image link.">
        <div className="flex gap-3 items-start">
          <div className="w-20 h-20 shrink-0 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
            {form.product_image ? (
              <img src={imgUrl(form.product_image)} alt="" className="w-full h-full object-contain" />
            ) : (
              <span className="text-xs text-gray-400">No image</span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <input
              name="product_image"
              value={form.product_image}
              onChange={onChange}
              placeholder="https://... or upload"
              className={inputClass}
            />
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleUpload} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className={btnGhost}>
              <FiUpload /> {uploading ? 'Uploading...' : 'Upload image'}
            </button>
          </div>
        </div>
      </Field>

      <Field label="Category *">
        <select name="category" value={form.category} onChange={onChange} required className={inputClass}>
          <option value="" disabled>
            Select category
          </option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
          {/* পুরনো প্রডাক্টের ক্যাটাগরি তালিকায় না থাকলেও যেন হারিয়ে না যায় */}
          {form.category && !categories.some((c) => c.name === form.category) && <option value={form.category}>{form.category}</option>}
        </select>
      </Field>
      <Field label="Brand">
        <input name="brand" value={form.brand} onChange={onChange} className={inputClass} />
      </Field>

      <Field label="Price (USD) *">
        <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} required className={inputClass} />
      </Field>
      <Field label="Stock quantity *">
        <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={onChange} required className={inputClass} />
      </Field>

      <Field label="Warranty">
        <input name="warranty" value={form.warranty} onChange={onChange} placeholder="e.g. 1 year" className={inputClass} />
      </Field>
      <Field label="Color">
        <input name="color" value={form.color} onChange={onChange} className={inputClass} />
      </Field>

      {!isEdit && (
        <>
          <Field label="Product ID" hint="Leave blank to generate automatically.">
            <input name="product_id" value={form.product_id} onChange={onChange} className={inputClass} />
          </Field>
          <Field label="Starting rating (0–5)" hint="Replaced by the average of customer reviews.">
            <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={onChange} className={inputClass} />
          </Field>
        </>
      )}

      <Field label="Description *" className="sm:col-span-2">
        <textarea name="description" value={form.description} onChange={onChange} required rows={3} className={inputClass} />
      </Field>
      <Field label="Specifications" className="sm:col-span-2" hint="One per line, e.g. RAM: 16GB">
        <textarea name="Specification" value={form.Specification} onChange={onChange} rows={4} className={inputClass} />
      </Field>

      <label className="sm:col-span-2 flex items-center gap-2.5 text-sm text-gray-700">
        <input type="checkbox" name="availability" checked={form.availability} onChange={onChange} className="w-4 h-4 accent-purple-600" />
        Available for sale
      </label>

      <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className={btnGhost}>
          Cancel
        </button>
        <button type="submit" disabled={saving || uploading} className={btnPrimary}>
          {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add product'}
        </button>
      </div>
    </form>
  );
};

const AdminProducts = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(searchParams.get('stock') || '');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const debouncedSearch = useDebounced(search);

  useEffect(() => {
    document.title = 'Products | Admin';
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({ page, limit: 10, search: debouncedSearch, category, stock });
      setProducts(data.products);
      setMeta({ page: data.page, pages: data.pages, total: data.total });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category, stock]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, stock]);

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await api.deleteProduct(deleting._id);
      toast.success('Product deleted');
      setDeleting(null);
      // শেষ পাতার একমাত্র আইটেম মুছলে আগের পাতায় ফেরা
      if (products.length === 1 && page > 1) setPage(page - 1);
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
        title="Products"
        subtitle={`${meta.total} product${meta.total === 1 ? '' : 's'}`}
        actions={
          <button onClick={() => setEditing('new')} className={btnPrimary}>
            <FiPlus /> Add product
          </button>
        }
      />

      <Card className="p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, brand or ID"
              className={`${inputClass} pl-9`}
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} sm:w-48`}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <select value={stock} onChange={(e) => setStock(e.target.value)} className={`${inputClass} sm:w-44`}>
            <option value="">Any stock</option>
            <option value="low">Low (10 or fewer)</option>
            <option value="out">Out of stock</option>
          </select>
        </div>

        {loading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <EmptyState title="No products found" hint="Try different filters, or add a new product." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="py-2.5 pr-4 font-medium">Product</th>
                  <th className="py-2.5 pr-4 font-medium">Category</th>
                  <th className="py-2.5 pr-4 font-medium text-right">Price</th>
                  <th className="py-2.5 pr-4 font-medium text-right">Stock</th>
                  <th className="py-2.5 pr-4 font-medium">Status</th>
                  <th className="py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <img src={imgUrl(p.product_image)} alt="" className="w-11 h-11 object-contain rounded-lg bg-gray-50 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate max-w-[260px]">{p.product_title}</p>
                          <p className="text-xs text-gray-500">{p.product_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{p.category}</td>
                    <td className="py-3 pr-4 text-right font-medium">{money(p.price)}</td>
                    <td className={`py-3 pr-4 text-right font-semibold ${p.stock === 0 ? 'text-red-600' : p.stock <= 10 ? 'text-amber-600' : 'text-gray-700'}`}>
                      {p.stock}
                    </td>
                    <td className="py-3 pr-4">
                      {p.availability && p.stock > 0 ? <Badge tone="green">In stock</Badge> : <Badge tone="red">Unavailable</Badge>}
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <button onClick={() => setEditing(p)} className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50" aria-label={`Edit ${p.product_title}`}>
                        <FiEdit2 size={16} />
                      </button>
                      <button onClick={() => setDeleting(p)} className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50" aria-label={`Delete ${p.product_title}`}>
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

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add product' : 'Edit product'} wide>
        {editing && (
          <ProductForm
            key={editing === 'new' ? 'new' : editing._id}
            product={editing === 'new' ? null : editing}
            categories={categories}
            onClose={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              load();
            }}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete product?"
        message={deleting ? `"${deleting.product_title}" and its reviews will be permanently deleted. Past orders keep their own copy of the product details.` : ''}
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
};

export default AdminProducts;
