import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { ShoppingCart, Star } from 'lucide-react';
import {
  formatPrice,
  resolvePrice,
  resolveStock,
  findVariant,
  defaultSelection,
  resolveImages,
} from '@/lib/fspcUtils';
import { useCart } from '@/lib/CartContext';

// @ts-ignore
export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const selection = defaultSelection(product);
  const variant = findVariant(product, selection);

  const images = resolveImages(product, variant);
  const mainImg = images[0];

  const price = resolvePrice(product, variant);
  const stock = resolveStock(product, variant);
  const outOfStock = stock <= 0;


  const quickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (outOfStock) return;

    addItem({
      productId: product._id,
      name: product.name,
      image: mainImg,
      variantSku: variant?.sku || null,
      attributes: variant?.attributes || {},
      unitPrice: price,
      quantity: 1,
    });
  };

  return (
    <Link
      to={`/produit/${product._id}`}
      className="group block super-ellipse bg-[hsl(var(--card))] border border-border overflow-hidden hover:border-[hsl(var(--accent))] hover:-translate-y-0.5 transition-all"
    >
      <div className="relative aspect-square bg-[hsl(var(--muted))]/40 overflow-hidden">
        {mainImg ? (
          <Image
            src={mainImg}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            fittingType="fill"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-[hsl(var(--muted-foreground))]/40 text-xs">
            FS PC
          </div>
        )}

        {product.isFeatured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-[10px] font-semibold uppercase tracking-wide">
            <Star className="w-3 h-3" />
            À la une
          </span>
        )}

        {outOfStock && (
          <span className="absolute top-3 right-3 px-2.5 py-1 super-ellipse bg-[hsl(var(--primary))]/80 text-[hsl(var(--primary-foreground))] text-[10px] font-semibold uppercase">
            Rupture
          </span>
        )}
      </div>

      <div className="p-4">
        {product.brand && (
          <p className="text-[11px] uppercase tracking-[0.1em] text-[hsl(var(--muted-foreground))] font-semibold">
            {product.brand}
          </p>
        )}

        <h3 className="mt-1 font-heading text-base font-600 text-[hsl(var(--primary))] leading-snug line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-heading text-lg font-600 text-[hsl(var(--accent))]">
            {formatPrice(price)}
          </span>

          <button
            type="button"
            onClick={quickAdd}
            disabled={outOfStock}
            className="grid place-items-center w-9 h-9 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--primary))] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Ajouter au panier"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}