import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { ShoppingCart, ChevronLeft, Check, AlertCircle, Truck, ShieldCheck } from 'lucide-react';
import { fspcApi } from '@/lib/fspcApi';
import { formatPrice, findVariant, resolvePrice, resolveStock, resolveImages, defaultSelection } from '@/lib/fspcUtils';
import { useCart } from '@/lib/CartContext';
import VariantPicker from '@/components/fs-pc/store/VariantPicker';
import QuantityStepper from '@/components/fs-pc/store/QuantityStepper';
import LoadingState from '@/components/fs-pc/store/LoadingState';
import EmptyState from '@/components/fs-pc/store/EmptyState';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selected, setSelected] = useState({});
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true); setNotFound(false); setProduct(null);
    fspcApi.getProduct(id)
      .then((p) => {
        if (!active) return;
        if (!p || !p._id) { setNotFound(true); return; }
        setProduct(p);
        setSelected(defaultSelection(p));
        setActiveImg(0);
      })
      .catch((e) => { if (active) setNotFound(e.status === 404 || true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const variant = product ? findVariant(product, selected) : null;
  const price = product ? resolvePrice(product, variant) : 0;
  const stock = product ? resolveStock(product, variant) : 0;
  const images = product ? resolveImages(product, variant) : [];
  const outOfStock = stock <= 0;

  const handleAdd = () => {
    if (outOfStock || !product) return;
    addItem({
      productId: product._id,
      name: product.name,
      image: images[0],
      variantSku: variant?.sku || null,
      attributes: variant?.attributes || {},
      unitPrice: price,
      quantity: qty,
    });
  };

  if (loading) return <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12"><LoadingState label="Chargement du produit…" rows={1} /></div>;
  if (notFound || !product) return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <EmptyState title="Produit introuvable" description="Ce produit n'existe pas ou n'est plus disponible." action={<Link to="/boutique/produits" className="px-5 py-2.5 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-sm font-semibold">Retour à la boutique</Link>} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
      <Link to="/boutique/produits" className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] transition-colors mb-6">
        <ChevronLeft className="w-4 h-4" /> Retour aux produits
      </Link>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* gallery */}
        <div>
          <div className="super-ellipse overflow-hidden border border-border bg-[hsl(var(--muted))]/30 aspect-square">
            {images[activeImg] ? (
              <Image src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" fittingType="fill" />
            ) : (
              <div className="w-full h-full grid place-items-center text-[hsl(var(--muted-foreground))]/40">FS PC</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 shrink-0 super-ellipse overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-[hsl(var(--accent))]' : 'border-border'}`}>
                  <Image src={img} alt="" className="w-full h-full object-cover" fittingType="fill" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* info */}
        <div>
          {product.brand && <p className="text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--accent))]">{product.brand}</p>}
          <h1 className="mt-1 font-heading text-3xl sm:text-4xl font-600 text-[hsl(var(--primary))] leading-tight">{product.name}</h1>
          {product.category?.name && <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{product.category.name}</p>}

          <div className="mt-5 flex items-center gap-4">
            <span className="font-heading text-3xl font-600 text-[hsl(var(--accent))]">{formatPrice(price)}</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 super-ellipse text-xs font-semibold ${outOfStock ? 'bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))]' : 'bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]'}`}>
              {outOfStock ? <AlertCircle className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
              {outOfStock ? 'Rupture de stock' : `En stock${stock ? ` (${stock})` : ''}`}
            </span>
          </div>

          {product.optionTypes?.length > 0 && (
            <div className="mt-7">
              <VariantPicker product={product} selected={selected} onChange={setSelected} />
            </div>
          )}

          <div className="mt-7 flex items-center gap-4">
            <span className="text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))]">Quantité</span>
            <QuantityStepper value={qty} onChange={setQty} min={1} max={outOfStock ? 0 : (stock || undefined)} />
          </div>

          <button onClick={handleAdd} disabled={outOfStock} className="mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold hover:bg-[hsl(var(--primary))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <ShoppingCart className="w-5 h-5" /> {outOfStock ? 'Indisponible' : 'Ajouter au panier'}
          </button>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 text-sm text-[hsl(var(--muted-foreground))]"><Truck className="w-4 h-4 text-[hsl(var(--accent))]" /> Livraison partout en Algérie</div>
            <div className="flex items-center gap-2.5 text-sm text-[hsl(var(--muted-foreground))]"><ShieldCheck className="w-4 h-4 text-[hsl(var(--accent))]" /> Paiement à la livraison</div>
          </div>
        </div>
      </div>

      {/* description */}
      {product.description && (
        <section className="mt-14 max-w-3xl">
          <h2 className="font-heading text-2xl font-600 text-[hsl(var(--primary))] mb-4">Description</h2>
          <div className="prose prose-sm max-w-none text-[hsl(var(--foreground))]/80 leading-relaxed whitespace-pre-line">{product.description}</div>
        </section>
      )}
    </div>
  );
}