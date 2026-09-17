import React from 'react';
import { X, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/lib/CartContext';
import { formatPrice } from '@/lib/fspcUtils';
import CartItem from './CartItem';
import EmptyState from './EmptyState';

export default function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, count, clearCart } = useCart();

  return (
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-[hsl(var(--primary))]/50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />
      {/* panel */}
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-[hsl(var(--background))] shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="font-heading text-lg font-600 text-[hsl(var(--primary))] flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[hsl(var(--accent))]" />
            Panier {count > 0 && <span className="text-sm text-[hsl(var(--muted-foreground))]">({count})</span>}
          </h3>
          <button onClick={closeCart} className="p-2 text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))] super-ellipse transition-colors" aria-label="Fermer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <EmptyState
              title="Votre panier est vide"
              description="Parcourez la boutique et ajoutez vos produits."
              action={<Link to="/boutique/produits" onClick={closeCart} className="px-5 py-2.5 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-sm font-semibold">Voir les produits</Link>}
            />
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <CartItem key={`${item.productId}-${item.variantSku}`} item={item} />
              ))}
              <button onClick={clearCart} className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Vider le panier
              </button>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[hsl(var(--muted-foreground))]">Sous-total</span>
              <span className="font-heading text-xl font-600 text-[hsl(var(--primary))]">{formatPrice(subtotal)}</span>
            </div>
            <Link
              to="/commande"
              onClick={closeCart}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold hover:bg-[hsl(var(--primary))] transition-colors"
            >
              Passer la commande <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/panier" onClick={closeCart} className="block text-center text-sm text-[hsl(var(--accent))] font-medium hover:underline">
              Voir le panier
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}