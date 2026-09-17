import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { fspcApi } from '@/lib/fspcApi';
import { formatPrice } from '@/lib/fspcUtils';
import ProductCard from '@/components/fs-pc/store/ProductCard';
import LoadingState from '@/components/fs-pc/store/LoadingState';
import EmptyState from '@/components/fs-pc/store/EmptyState';

const SORTS = [
  { value: '', label: 'Pertinence' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'featured', label: 'Produits populaires' },
];

const mapSort = (s) => {
  switch (s) {
    case 'price-asc': return { sort: 'price', order: 'asc' };
    case 'price-desc': return { sort: 'price', order: 'desc' };
    case 'newest': return { sort: 'createdAt', order: 'desc' };
    case 'featured': return { isFeatured: true };
    default: return {};
  }
};

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);

  const search = params.get('search') || '';
  const category = params.get('category') || '';
  const brand = params.get('brand') || '';
  const inStock = params.get('inStock') === '1';
  const sort = params.get('sort') || '';
  const page = Number(params.get('page') || '1');
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';

  const update = useCallback((patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === '' || v === null || v === undefined) next.delete(k);
      else next.set(k, String(v));
    });
    if (patch.page === undefined && Object.keys(patch).some((k) => k !== 'page')) next.delete('page');
    setParams(next, { replace: true });
  }, [params, setParams]);

  useEffect(() => { fspcApi.getCategories().then((c) => setCategories(Array.isArray(c) ? c : (c?.categories || []))).catch(() => {}); }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const sortParams = mapSort(sort);
    fspcApi.getProducts({
      page, limit: 12, search, category, brand, minPrice, maxPrice, inStock: inStock ? true : undefined, ...sortParams,
    }).then((res) => {
      if (!active) return;
      setProducts(res?.products || []);
      setPagination(res?.pagination || null);
      const unique = [...new Set((res?.products || []).map((p) => p.brand).filter(Boolean))];
      setBrands((prev) => (prev.length ? prev : unique));
    }).catch(() => { if (active) { setProducts([]); setPagination(null); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [search, category, brand, inStock, sort, page, minPrice, maxPrice]);

  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-600 text-[hsl(var(--primary))]">Tous les produits</h1>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">PC gaming, composants et périphériques — paiement à la livraison.</p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* filters */}
        <aside className="space-y-6">
          <div className="super-ellipse bg-[hsl(var(--card))] border border-border p-5 space-y-5 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 text-[hsl(var(--primary))]">
              <SlidersHorizontal className="w-4 h-4 text-[hsl(var(--accent))]" />
              <h2 className="font-heading font-600">Filtres</h2>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                <input value={search} onChange={(e) => update({ search: e.target.value, page: 1 })} placeholder="Rechercher…" className="w-full pl-9 pr-3 py-2.5 super-ellipse border border-input bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/40" />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">Catégorie</label>
              <select value={category} onChange={(e) => update({ category: e.target.value, page: 1 })} className="w-full px-3 py-2.5 super-ellipse border border-input bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/40">
                <option value="">Toutes</option>
                {categories.map((c) => <option key={c._id} value={c.slug || c._id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">Prix (DA)</label>
              <div className="flex items-center gap-2">
                <input type="number" value={minPrice} onChange={(e) => update({ minPrice: e.target.value, page: 1 })} placeholder="Min" className="w-full px-3 py-2 super-ellipse border border-input bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/40" />
                <span className="text-[hsl(var(--muted-foreground))]">–</span>
                <input type="number" value={maxPrice} onChange={(e) => update({ maxPrice: e.target.value, page: 1 })} placeholder="Max" className="w-full px-3 py-2 super-ellipse border border-input bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/40" />
              </div>
            </div>

            {brands.length > 0 && (
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">Marque</label>
                <select value={brand} onChange={(e) => update({ brand: e.target.value, page: 1 })} className="w-full px-3 py-2.5 super-ellipse border border-input bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/40">
                  <option value="">Toutes</option>
                  {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            )}

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={inStock} onChange={(e) => update({ inStock: e.target.checked ? '1' : '', page: 1 })} className="w-4 h-4 accent-[hsl(var(--accent))]" />
              <span className="text-sm text-[hsl(var(--foreground))]">En stock uniquement</span>
            </label>

            <button onClick={() => setParams(new URLSearchParams(), { replace: true })} className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] transition-colors">
              <X className="w-3.5 h-3.5" /> Réinitialiser
            </button>
          </div>
        </aside>

        {/* results */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-5">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {loading ? '…' : `${pagination?.totalProducts ?? products.length} produit(s)`}
            </p>
            <select value={sort} onChange={(e) => update({ sort: e.target.value, page: 1 })} className="px-3 py-2 super-ellipse border border-input bg-[hsl(var(--card))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/40">
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {loading ? <LoadingState label="Chargement…" rows={6} /> : products.length === 0 ? (
            <EmptyState title="Aucun produit trouvé" description="Essayez d'ajuster vos filtres ou votre recherche." action={<button onClick={() => setParams(new URLSearchParams(), { replace: true })} className="px-5 py-2.5 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-sm font-semibold">Réinitialiser les filtres</button>} />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button disabled={page <= 1} onClick={() => update({ page: page - 1 })} className="px-4 py-2 super-ellipse border border-border text-sm font-medium disabled:opacity-40 hover:border-[hsl(var(--accent))] transition-colors">Précédent</button>
                  <span className="px-4 py-2 text-sm text-[hsl(var(--muted-foreground))]">{page} / {totalPages}</span>
                  <button disabled={page >= totalPages} onClick={() => update({ page: page + 1 })} className="px-4 py-2 super-ellipse border border-border text-sm font-medium disabled:opacity-40 hover:border-[hsl(var(--accent))] transition-colors">Suivant</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}