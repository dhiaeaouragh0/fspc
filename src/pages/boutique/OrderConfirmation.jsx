import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, MessageCircle } from 'lucide-react';
import { formatPrice } from '@/lib/fspcUtils';
import EmptyState from '@/components/fs-pc/store/EmptyState';

export default function OrderConfirmation() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('fspc_last_order');
      if (raw) setOrder(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20">
        <EmptyState title="Aucune commande à afficher" description="Si vous venez de passer commande, votre confirmation apparaîtra ici." action={<Link to="/boutique/produits" className="px-5 py-2.5 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-sm font-semibold">Retour à la boutique</Link>} />
      </div>
    );
  }

  const items = order.items || [];
  const subtotal = order.subtotal ?? order.itemsTotal ?? 0;
  const shipping = order.shippingFee ?? 0;
  const total = order.totalPrice ?? 0;
  const orderId = order.orderNumber || order._id || order.id;

  return (
    <div className="max-w-3xl mx-auto px-5 lg:px-8 py-12">
      <div className="text-center">
        <div className="mx-auto grid place-items-center w-16 h-16 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="mt-6 font-heading text-3xl sm:text-4xl font-600 text-[hsl(var(--primary))]">Commande confirmée 🎉</h1>
        <p className="mt-3 text-[hsl(var(--muted-foreground))] max-w-md mx-auto">Merci pour votre commande. Nous vous contacterons bientôt pour confirmer la livraison.</p>
        {orderId && <p className="mt-2 text-sm"><span className="text-[hsl(var(--muted-foreground))]">N° commande :</span> <span className="font-600 text-[hsl(var(--primary))]">{orderId}</span></p>}
      </div>

      <div className="mt-8 super-ellipse bg-[hsl(var(--card))] border border-border p-6">
        <h2 className="font-heading text-lg font-600 text-[hsl(var(--primary))]">Récapitulatif</h2>
        <div className="mt-4 space-y-3">
          {items.map((it, i) => {
            const name = it.product?.name || it.name || 'Produit';
            const price = it.price ?? it.unitPrice ?? 0;
            return (
              <div key={i} className="flex justify-between gap-3 text-sm">
                <span className="text-[hsl(var(--foreground))] line-clamp-2">{name} <span className="text-[hsl(var(--muted-foreground))]">×{it.quantity}</span></span>
                <span className="font-600 text-[hsl(var(--primary))] shrink-0">{formatPrice(price * it.quantity)}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Sous-total</span><span className="font-600 text-[hsl(var(--primary))]">{formatPrice(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Livraison</span><span className="font-600 text-[hsl(var(--primary))]">{shipping === 0 ? 'Gratuit' : formatPrice(shipping)}</span></div>
          <div className="flex justify-between pt-2 border-t border-border"><span className="font-600 text-[hsl(var(--primary))]">Total</span><span className="font-heading text-xl font-600 text-[hsl(var(--accent))]">{formatPrice(total)}</span></div>
        </div>
      </div>

      <div className="mt-6 super-ellipse bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/30 p-5 flex items-start gap-3">
        <MessageCircle className="w-5 h-5 text-[hsl(var(--accent))] shrink-0 mt-0.5" />
        <div>
          <p className="font-600 text-[hsl(var(--primary))]">Paiement à la livraison</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Vous ne payez rien en ligne. Le paiement se fait lors de la réception de votre commande.</p>
        </div>
      </div>

      {(order.wilaya || order.deliveryType) && (
        <p className="mt-4 text-sm text-center text-[hsl(var(--muted-foreground))]">
          Livraison {order.deliveryType === 'agence' ? 'en agence' : 'à domicile'} {order.wilaya ? `· ${order.wilaya}` : ''}
        </p>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/boutique/produits" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold hover:bg-[hsl(var(--primary))] transition-colors">
          <ShoppingBag className="w-4 h-4" /> Continuer mes achats
        </Link>
        <Link to="/apropos" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 super-ellipse border border-border text-sm font-medium text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))] transition-colors">
          Contact & support
        </Link>
      </div>
    </div>
  );
}