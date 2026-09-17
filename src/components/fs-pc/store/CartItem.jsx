import React from 'react';
import { Image } from '@/components/ui/image';
import { Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/fspcUtils';
import { useCart } from '@/lib/CartContext';
import QuantityStepper from './QuantityStepper';

export default function CartItem({ item, compact = false }) {
  const { updateQty, removeItem } = useCart();
  const attrStr = item.attributes
    ? Object.entries(item.attributes).map(([k, v]) => v).join(' · ')
    : '';

  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 super-ellipse overflow-hidden bg-[hsl(var(--muted))]/40 border border-border">
        {item.image ? (
          <Image src={item.image} alt={item.name} className="w-full h-full object-cover" fittingType="fill" />
        ) : (
          <div className="w-full h-full grid place-items-center text-[hsl(var(--muted-foreground))]/40 text-[10px]">FS PC</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-heading font-600 text-[hsl(var(--primary))] leading-snug line-clamp-2">{item.name}</h4>
        {attrStr && <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{attrStr}</p>}
        <div className="mt-2 flex items-center justify-between gap-3">
          <QuantityStepper value={item.quantity} onChange={(q) => updateQty(item.productId, item.variantSku, q)} min={1} />
          <span className="font-heading font-600 text-[hsl(var(--accent))]">{formatPrice(item.unitPrice * item.quantity)}</span>
        </div>
        {!compact && (
          <button onClick={() => removeItem(item.productId, item.variantSku)} className="mt-2 inline-flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Retirer
          </button>
        )}
      </div>
    </div>
  );
}