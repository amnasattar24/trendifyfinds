import { useState, useEffect } from 'react';
import { X, Plus, Image as ImageIcon, Link as LinkIcon, DollarSign, Package } from 'lucide-react';
import type { Product } from '@/types';
import { CATEGORIES } from '@/categories';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

const emptyForm = {
  title: '',
  image: '',
  affiliateLink: '',
  category: CATEGORIES[0].id,
  subCategory: 'All',
  originalPrice: '',
  discountedPrice: '',
};

export function AddProductModal({ open, onClose, onAdd }: AddProductModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const categoryDef = CATEGORIES.find((c) => c.id === form.category);
  const subs = categoryDef?.subCategories ?? ['All'];

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, category: CATEGORIES[0].id, subCategory: 'All' });
      setError('');
    }
  }, [open]);

  // Reset sub-category when main category changes
  function handleCategoryChange(categoryId: string) {
    const cat = CATEGORIES.find((c) => c.id === categoryId);
    setForm((f) => ({
      ...f,
      category: categoryId,
      subCategory: cat?.subCategories[0] ?? 'All',
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const original = parseFloat(form.originalPrice);
    const discounted = parseFloat(form.discountedPrice);

    if (!form.title.trim() || !form.image.trim() || !form.affiliateLink.trim()) {
      setError('Please fill in title, image URL, and affiliate link.');
      return;
    }
    if (isNaN(original) || original <= 0) {
      setError('Please enter a valid original price.');
      return;
    }
    if (isNaN(discounted) || discounted <= 0) {
      setError('Please enter a valid discounted price.');
      return;
    }
    if (discounted > original) {
      setError('Discounted price should be lower than the original price.');
      return;
    }

    onAdd({
      id: `user-${Date.now()}`,
      title: form.title.trim(),
      image: form.image.trim(),
      affiliateLink: form.affiliateLink.trim(),
      category: form.category,
      subCategory: form.subCategory,
      originalPrice: original,
      discountedPrice: discounted,
    });

    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="my-8 w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between gradient-burgundy-magenta px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-white" />
            <h2 className="text-lg font-bold text-white">Add New Product</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Title */}
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Package className="h-4 w-4 text-burgundy-600" /> Product Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Wireless Gaming Mouse RGB 16000 DPI"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-magenta-500 focus:ring-2 focus:ring-magenta-100"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <ImageIcon className="h-4 w-4 text-burgundy-600" /> Image URL
            </label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://example.com/product-image.jpg"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-magenta-500 focus:ring-2 focus:ring-magenta-100"
            />
          </div>

          {/* Affiliate Link */}
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <LinkIcon className="h-4 w-4 text-burgundy-600" /> Amazon Affiliate Link
            </label>
            <input
              type="url"
              value={form.affiliateLink}
              onChange={(e) => setForm({ ...form, affiliateLink: e.target.value })}
              placeholder="https://www.amazon.com/dp/..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-magenta-500 focus:ring-2 focus:ring-magenta-100"
            />
          </div>

          {/* Category + Sub-Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Main Category</label>
              <select
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-magenta-500 focus:ring-2 focus:ring-magenta-100"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Sub-Category</label>
              <select
                value={form.subCategory}
                onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-magenta-500 focus:ring-2 focus:ring-magenta-100"
              >
                {subs.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <DollarSign className="h-4 w-4 text-burgundy-600" /> Original Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                placeholder="49.99"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-magenta-500 focus:ring-2 focus:ring-magenta-100"
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <DollarSign className="h-4 w-4 text-magenta-600" /> Discounted Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.discountedPrice}
                onChange={(e) => setForm({ ...form, discountedPrice: e.target.value })}
                placeholder="34.99"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition-colors focus:border-magenta-500 focus:ring-2 focus:ring-magenta-100"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg gradient-card-cta px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-glow hover:brightness-110"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
