import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { formatPrice } from '@/lib/fspcUtils';
import CartItem from '@/components/fs-pc/store/CartItem';
import EmptyState from '@/components/fs-pc/store/EmptyState';

export default function Cart() {
  const { items, subtotal, clearCart, count } = useCart();

  return (
    <div className="max-w-5xl mx-auto px-5 lg:px-8 py-10">
      <h1 className="font-heading text-3xl sm:text-4xl font-600 text-[hsl(var(--primary))] mb-2">Votre panier</h1>
      <p className="text-[hsl(var(--muted-foreground))] mb-8">{count} article(s)</p>

      {items.length === 0 ? (
        <EmptyState
          title="Votre panier est vide"
          description="Ajoutez des produits depuis la boutique pour commencer votre commande."
          action={<Link to="/boutique/produits" className="inline-flex items-center gap-2 px-5 py-2.5 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-sm font-semibold"><ShoppingCart className="w-4 h-4" /> Voir les produits</Link>}
        />
      ) : (
        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          <div className="space-y-5">
            {items.map((item) => <CartItem key={`${item.productId}-${item.variantSku}`} item={item} />)}
            <button onClick={clearCart} className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] transition-colors">
              <Trash2 className="w-3.5 h-3.5" /> Vider le panier
            </button>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit super-ellipse bg-[hsl(var(--card))] border border-border p-6">
            <h2 className="font-heading text-lg font-600 text-[hsl(var(--primary))]">Récapitulatif</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Sous-total</span><span className="font-600 text-[hsl(var(--primary))]">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Livraison</span><span className="text-[hsl(var(--muted-foreground))]">Calculée à l'étape suivante</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
              <span className="text-sm text-[hsl(var(--muted-foreground))]">Total</span>
              <span className="font-heading text-xl font-600 text-[hsl(var(--accent))]">{formatPrice(subtotal)}</span>
            </div>
            <Link to="/commande" className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold hover:bg-[hsl(var(--primary))] transition-colors">
              Passer la commande <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/boutique/produits" className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3 super-ellipse border border-border text-sm font-medium text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Continuer mes achats
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}