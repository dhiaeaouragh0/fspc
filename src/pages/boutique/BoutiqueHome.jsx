import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, CreditCard, Gamepad2, Headphones } from 'lucide-react';
import { fspcApi } from '@/lib/fspcApi';
import { Image } from '@/components/ui/image';
import ProductCard from '@/components/fs-pc/store/ProductCard';
import CategoryGrid from '@/components/fs-pc/store/CategoryGrid';
import LoadingState from '@/components/fs-pc/store/LoadingState';
import EmptyState from '@/components/fs-pc/store/EmptyState';

const HERO_IMG = 'https://media.base44.com/images/public/6aa5eae5ea57554dbe9fa078/9416af631_generated_image.png';

const trust = [
  { icon: Truck, label: 'Livraison partout en Algérie' },
  { icon: CreditCard, label: 'Paiement à la livraison' },
  { icon: Gamepad2, label: 'Produits gaming' },
  { icon: Headphones, label: 'Support client' },
];

export default function BoutiqueHome() {
  const [store, setStore] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [s, feat, cats] = await Promise.all([
          fspcApi.getStore().catch(() => null),
          fspcApi.getProducts({ isFeatured: true, limit: 8 }).catch(() => ({ products: [] })),
          fspcApi.getCategories().catch(() => []),
        ]);
        if (!active) return;
        setStore(s);
        setFeatured(feat?.products || []);
        setCategories(Array.isArray(cats) ? cats : (cats?.categories || []));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div>
      {/* hero */}
      <section className="relative overflow-hidden bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #F0F5F5 1px, transparent 1px), linear-gradient(to bottom, #F0F5F5 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 super-ellipse border border-white/20 bg-white/5 text-xs font-medium uppercase tracking-[0.15em] text-[hsl(var(--background))]/90">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent-foreground))] status-dot" /> FS PC · Boutique
            </span>
            <h1 className="mt-6 font-heading text-4xl sm:text-5xl lg:text-6xl font-600 leading-[1.05] text-balance">
              {store?.description ? 'Votre matériel gaming, livré.' : 'PC Gaming & composants en Algérie.'}
            </h1>
            <p className="mt-5 text-lg text-[hsl(var(--background))]/75 max-w-xl leading-relaxed">
              {store?.description || 'PC gaming, cartes graphiques, processeurs, RAM, SSD, écrans, claviers, souris et accessoires. Qualité, prix justes et paiement à la livraison.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/boutique/produits" className="group inline-flex items-center gap-2 px-7 py-3.5 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold hover:bg-[hsl(var(--background))] hover:text-[hsl(var(--primary))] transition-colors">
                Voir les produits <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/boutique/produits?category=pc-gaming" className="inline-flex items-center gap-2 px-7 py-3.5 super-ellipse border border-white/25 text-[hsl(var(--background))] font-semibold hover:bg-white/5 transition-colors">
                Découvrir les PC Gaming
              </Link>
            </div>
          </div>
          <div className="relative super-ellipse overflow-hidden border border-white/10 shadow-2xl">
            <Image src={HERO_IMG} alt="FS PC gaming" className="w-full h-[300px] sm:h-[420px] object-cover" fittingType="fill" />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))]/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* trust bar */}
      <section className="border-y border-border bg-[hsl(var(--card))]/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {trust.map((t) => (
            <div key={t.label} className="flex items-center gap-3">
              <t.icon className="w-5 h-5 text-[hsl(var(--accent))] shrink-0" />
              <span className="text-sm font-medium text-[hsl(var(--foreground))]">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20 space-y-20">
        {/* featured */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[hsl(var(--accent))] font-semibold">À la une</p>
              <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-600 text-[hsl(var(--primary))]">Produits vedettes</h2>
            </div>
            <Link to="/boutique/produits" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--accent))] hover:gap-2.5 transition-all">Tout voir <ArrowRight className="w-4 h-4" /></Link>
          </div>
          {loading ? <LoadingState label="Chargement des produits…" rows={4} /> : featured.length === 0 ? (
            <EmptyState title="Catalogue en préparation" description="Les produits vedettes apparaîtront ici dès qu'ils seront ajoutés." action={<Link to="/boutique/produits" className="px-5 py-2.5 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-sm font-semibold">Parcourir tout</Link>} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </section>

        {/* categories */}
        <section>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.18em] text-[hsl(var(--accent))] font-semibold">Catégories</p>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-600 text-[hsl(var(--primary))]">Explorez par univers</h2>
          </div>
          {loading ? <LoadingState rows={4} /> : categories.length === 0 ? (
            <EmptyState title="Catégories à venir" description="Les catégories seront affichées dès leur configuration." />
          ) : <CategoryGrid categories={categories} />}
        </section>
      </div>
    </div>
  );
}