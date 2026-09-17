import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { fspcApi } from '@/lib/fspcApi';
import { useCart } from '@/lib/CartContext';
import { formatPrice, validatePhone } from '@/lib/fspcUtils';

const FREE_SHIPPING_THRESHOLD = 20000;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [wilayas, setWilayas] = useState([]);
  const [form, setForm] = useState({ customerName: '', customerPhone: '', customerEmail: '', wilaya: '', deliveryType: 'domicile', address: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fspcApi.getWilayas().then((w) => setWilayas(Array.isArray(w) ? w : [])).catch(() => {}); }, []);

  const selectedWilaya = wilayas.find((w) => w.nom === form.wilaya || w.numero === Number(form.wilaya));
  const shippingEstimate = useMemo(() => {
    if (!selectedWilaya) return 0;
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    return form.deliveryType === 'domicile' ? Number(selectedWilaya.prixDomicile) || 0 : Number(selectedWilaya.prixAgence) || 0;
  }, [selectedWilaya, form.deliveryType, subtotal]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (items.length === 0) { setError('Votre panier est vide.'); return; }
    if (!validatePhone(form.customerPhone)) { setError('Numéro de téléphone invalide. Format attendu : 05/06/07XXXXXXXX ou +213 5/6/7XXXXXXXX.'); return; }
    if (!selectedWilaya) { setError('Veuillez sélectionner votre wilaya.'); return; }

    setSubmitting(true);
    try {
      const order = await fspcApi.createOrder({
        items: items.map((i) => ({ productId: i.productId, variantSku: i.variantSku, quantity: i.quantity })),
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail || undefined,
        wilaya: selectedWilaya.nom,
        deliveryType: form.deliveryType,
        address: form.address,
        note: form.note || undefined,
      });
      sessionStorage.setItem('fspc_last_order', JSON.stringify(order));
      clearCart();
      navigate('/confirmation');
    } catch (err) {
      if (err.status === 429) setError('Trop de commandes en peu de temps. Veuillez patienter quelques minutes avant de réessayer.');
      else setError('Une erreur est survenue lors de la création de votre commande. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-heading text-2xl font-600 text-[hsl(var(--primary))]">Votre panier est vide</h1>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">Ajoutez des produits avant de passer commande.</p>
        <button onClick={() => navigate('/boutique/produits')} className="mt-6 px-6 py-3 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold">Voir les produits</button>
      </div>
    );
  }

  const inputCls = 'w-full px-4 py-3 super-ellipse border border-input bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/40';

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10">
      <h1 className="font-heading text-3xl sm:text-4xl font-600 text-[hsl(var(--primary))] mb-8">Commande</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-6">
          <div className="super-ellipse bg-[hsl(var(--card))] border border-border p-6 space-y-4">
            <h2 className="font-heading text-lg font-600 text-[hsl(var(--primary))]">Vos informations</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">Nom complet *</label>
                <input required value={form.customerName} onChange={update('customerName')} className={inputCls} placeholder="Votre nom" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">Téléphone *</label>
                <input required value={form.customerPhone} onChange={update('customerPhone')} className={inputCls} placeholder="06 00 00 00 00" inputMode="tel" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">Email (optionnel)</label>
              <input type="email" value={form.customerEmail} onChange={update('customerEmail')} className={inputCls} placeholder="vous@email.com" />
            </div>
          </div>

          <div className="super-ellipse bg-[hsl(var(--card))] border border-border p-6 space-y-4">
            <h2 className="font-heading text-lg font-600 text-[hsl(var(--primary))]">Livraison</h2>
            <div>
              <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">Wilaya *</label>
              <select required value={form.wilaya} onChange={update('wilaya')} className={inputCls}>
                <option value="">Sélectionnez votre wilaya</option>
                {wilayas.map((w) => <option key={w.numero} value={w.nom}>{w.numero}. {w.nom}</option>)}
              </select>
            </div>

            {selectedWilaya && (
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">Type de livraison *</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button type="button" onClick={() => setForm((f) => ({ ...f, deliveryType: 'domicile' }))} className={`p-4 super-ellipse border-2 text-left transition-all ${form.deliveryType === 'domicile' ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10' : 'border-border'}`}>
                    <span className="block font-semibold text-sm text-[hsl(var(--primary))]">À domicile</span>
                    <span className="block text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{subtotal >= FREE_SHIPPING_THRESHOLD ? 'Gratuit' : formatPrice(selectedWilaya.prixDomicile)}</span>
                  </button>
                  <button type="button" onClick={() => setForm((f) => ({ ...f, deliveryType: 'agence' }))} className={`p-4 super-ellipse border-2 text-left transition-all ${form.deliveryType === 'agence' ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10' : 'border-border'}`}>
                    <span className="block font-semibold text-sm text-[hsl(var(--primary))]">Bureau/agence</span>
                    <span className="block text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{subtotal >= FREE_SHIPPING_THRESHOLD ? 'Gratuit' : formatPrice(selectedWilaya.prixAgence)}</span>
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">Adresse *</label>
              <textarea required rows={2} value={form.address} onChange={update('address')} className={`${inputCls} resize-none`} placeholder="Adresse de livraison" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">Note (optionnel)</label>
              <textarea rows={2} value={form.note} onChange={update('note')} className={`${inputCls} resize-none`} placeholder="Instructions de livraison…" />
            </div>
          </div>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-24 h-fit super-ellipse bg-[hsl(var(--card))] border border-border p-6">
          <h2 className="font-heading text-lg font-600 text-[hsl(var(--primary))]">Votre commande</h2>
          <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
            {items.map((i) => (
              <div key={`${i.productId}-${i.variantSku}`} className="flex justify-between gap-3 text-sm">
                <span className="text-[hsl(var(--foreground))] line-clamp-2">{i.name} <span className="text-[hsl(var(--muted-foreground))]">×{i.quantity}</span></span>
                <span className="font-600 text-[hsl(var(--primary))] shrink-0">{formatPrice(i.unitPrice * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Sous-total</span><span className="font-600 text-[hsl(var(--primary))]">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-[hsl(var(--muted-foreground))]">Livraison (est.)</span><span className="font-600 text-[hsl(var(--primary))]">{selectedWilaya ? (shippingEstimate === 0 ? 'Gratuit' : formatPrice(shippingEstimate)) : '—'}</span></div>
            <div className="flex justify-between pt-2 border-t border-border"><span className="font-600 text-[hsl(var(--primary))]">Total</span><span className="font-heading text-xl font-600 text-[hsl(var(--accent))]">{selectedWilaya ? formatPrice(subtotal + shippingEstimate) : formatPrice(subtotal)}</span></div>
          </div>

          {subtotal < FREE_SHIPPING_THRESHOLD && (
            <p className="mt-3 text-xs text-[hsl(var(--muted-foreground))]">Livraison gratuite dès {formatPrice(FREE_SHIPPING_THRESHOLD)} d'achat.</p>
          )}
          <p className="mt-3 text-xs text-[hsl(var(--muted-foreground))]">Le montant final est confirmé par le backend après validation.</p>

          {error && (
            <div className="mt-4 flex items-start gap-2 p-3 super-ellipse bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))] text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /><span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={submitting} className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-4 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold hover:bg-[hsl(var(--primary))] transition-colors disabled:opacity-60">
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Traitement…</> : 'Confirmer la commande'}
          </button>
          <button type="button" onClick={() => navigate('/panier')} className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3 super-ellipse border border-border text-sm font-medium text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour au panier
          </button>
        </aside>
      </form>
    </div>
  );
}