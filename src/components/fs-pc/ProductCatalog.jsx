import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Printer, Server, HardDrive, Monitor, Wifi, ArrowRight } from 'lucide-react';
import { fspcApi } from '@/lib/fspcApi';
import { Image } from '@/components/ui/image';
import ProductCard from '@/components/fs-pc/store/ProductCard';
import LoadingState from '@/components/fs-pc/store/LoadingState';

const GALLERY_IMG = 'https://media.base44.com/images/public/6aa5eae5ea57554dbe9fa078/187904fb3_generated_image.png';

const fallbackCategories = [
  { icon: Laptop, label: 'Ordinateurs portables', spec: 'Laptops pro & gaming' },
  { icon: Monitor, label: 'PC & Unités centrales', spec: 'Bureau & sur-mesure' },
  { icon: Printer, label: 'Imprimantes', spec: 'Brother · Lexmark' },
  { icon: HardDrive, label: 'Périphériques', spec: 'Stockage & composants' },
  { icon: Server, label: 'Serveurs', spec: 'Infrastructure & data' },
  { icon: Wifi, label: 'Modems & Réseaux', spec: 'Installation complète' },
];

export default function ProductCatalog() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const categoryIcons = {
  'Ordinateurs portables': Laptop,
  'PC & Unités centrales': Monitor,
  'Imprimantes': Printer,
  'Périphériques': HardDrive,
  'Serveurs': Server,
  'Modems & Réseaux': Wifi,
};

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [feat, cats] = await Promise.all([
          fspcApi.getProducts({ isFeatured: true, limit: 5 }).catch(() => ({ products: [] })),
          fspcApi.getCategories().catch(() => []),
        ]);
        if (!active) return;
        setFeatured(feat?.products || []);
        setCategories(Array.isArray(cats) ? cats : (cats?.categories || []));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const catStrip = categories.length > 0
  ? categories.slice(0, 6).map((c) => {
      const Icon =
        categoryIcons[c.name] ||
        (c.name?.toLowerCase().includes('portable')
          ? Laptop
          : c.name?.toLowerCase().includes('imprim')
            ? Printer
            : c.name?.toLowerCase().includes('serveur')
              ? Server
              : c.name?.toLowerCase().includes('réseau') ||
                c.name?.toLowerCase().includes('reseau') ||
                c.name?.toLowerCase().includes('modem')
                ? Wifi
                : c.name?.toLowerCase().includes('périph') ||
                  c.name?.toLowerCase().includes('periph')
                  ? HardDrive
                  : Monitor);

      return {
        icon: Icon,
        label: c.name,
        spec: `${c.productCount || ''} produits`.trim(),
        slug: c.slug || c._id,
      };
    })
  : fallbackCategories;

  return (
    <section id="boutique" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[hsl(var(--accent))] font-semibold">
              01 — La Boutique
            </p>
            <h2 className="mt-3 font-heading text-4xl sm:text-5xl font-600 text-[hsl(var(--primary))] max-w-xl text-balance">
              Une galerie de matériel informatique sélectionné.
            </h2>
          </div>
          <p className="text-[hsl(var(--muted-foreground))] max-w-md text-lg leading-relaxed">
            Du composant à la machine complète, chaque référence est choisie pour sa fiabilité. Prix en Dinar algérien, paiement à la livraison.
          </p>
        </div>

        {/* categories strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {catStrip.map((c, i) => {
            const Icon = c.icon;
            const inner = (
              <>
                <Icon className="w-6 h-6 text-[hsl(var(--accent))] group-hover:text-[hsl(var(--accent-foreground))] transition-colors" />
                <p className="mt-3 font-semibold text-sm leading-tight">{c.label}</p>
                {c.spec && <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--accent-foreground))]/70">{c.spec}</p>}
              </>
            );
            return c.slug ? (
              <Link key={i} to={`/boutique/produits?category=${c.slug}`} className="group super-ellipse bg-[hsl(var(--card))] border border-border p-5 hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition-colors">{inner}</Link>
            ) : (
              <div key={i} className="group super-ellipse bg-[hsl(var(--card))] border border-border p-5 hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition-colors cursor-default">{inner}</div>
            );
          })}
        </div>

        {/* feature image + product grid */}
        {loading ? (
          <LoadingState label="Chargement des produits…" rows={5} />
        ) : featured.length === 0 ? (
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:row-span-2 relative super-ellipse overflow-hidden border border-border min-h-[280px]">
              <img src={GALLERY_IMG} alt="Matériel informatique FS PC" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))]/80 via-[hsl(var(--primary))]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-7">
                <p className="text-xs uppercase tracking-[0.15em] text-[hsl(var(--background))]/70">Galerie</p>
                <p className="mt-2 font-heading text-2xl font-600 text-[hsl(var(--background))]">Du matériel traité comme une œuvre industrielle.</p>
              </div>
            </div>
            <div className="lg:col-span-2 super-ellipse border border-dashed border-border bg-[hsl(var(--card))]/50 p-10 text-center grid place-items-center">
              <div>
                <h3 className="font-heading text-2xl font-600 text-[hsl(var(--primary))]">Catalogue en préparation</h3>
                <p className="mt-2 text-[hsl(var(--muted-foreground))] max-w-sm mx-auto">Les produits vedettes apparaîtront ici dès qu'ils seront ajoutés à la boutique.</p>
                <Link to="/boutique" className="mt-6 inline-flex items-center gap-2 px-6 py-3 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold">
                  Accéder à la boutique <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:row-span-2 relative super-ellipse overflow-hidden border border-border min-h-[280px] lg:min-h-full">
              <img src={GALLERY_IMG} alt="Matériel informatique FS PC" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))]/80 via-[hsl(var(--primary))]/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-7">
                <p className="text-xs uppercase tracking-[0.15em] text-[hsl(var(--background))]/70">Galerie</p>
                <p className="mt-2 font-heading text-2xl font-600 text-[hsl(var(--background))]">Du matériel traité comme une œuvre industrielle.</p>
                <Link to="/boutique/produits" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--accent-foreground))] hover:gap-2.5 transition-all">
                  Tout voir <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}