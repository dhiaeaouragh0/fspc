import React, { useEffect, useState } from 'react';
import { Cpu, MapPin, Phone, MessageCircle, Instagram, Facebook, Music2, AlertCircle } from 'lucide-react';
import { fspcApi } from '@/lib/fspcApi';
import LoadingState from '@/components/fs-pc/store/LoadingState';
import StoreUnavailable from './StoreUnavailable';

export default function About() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    fspcApi.getStore()
      .then((s) => { if (active) { setStore(s); setLoading(false); } })
      .catch((e) => { if (active) { setUnavailable(e.status === 404); setLoading(false); } });
    return () => { active = false; };
  }, []);

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-12"><LoadingState label="Chargement des informations…" rows={2} /></div>;
  if (unavailable || !store) return <StoreUnavailable />;

  const social = store.socialLinks || {};
  const whatsappNum = store.whatsapp ? store.whatsapp.replace(/\D/g, '') : '';

  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-8 py-12">
      <div className="super-ellipse bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] p-8 sm:p-12">
        <div className="flex items-center gap-3">
          {store.logo ? (
            <img src={store.logo} alt={store.name} className="h-12 w-auto object-contain bg-white/5 p-1.5 super-ellipse" />
          ) : (
            <span className="grid place-items-center w-12 h-12 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"><Cpu className="w-6 h-6" /></span>
          )}
          <div>
            <h1 className="font-heading text-3xl font-600">{store.name || 'FS PC'}</h1>
            <p className="text-[hsl(var(--primary-foreground))]/70 text-sm">PC Gaming & matériel informatique en Algérie</p>
          </div>
        </div>
        {store.description && <p className="mt-6 text-[hsl(var(--primary-foreground))]/85 leading-relaxed">{store.description}</p>}
      </div>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        {store.address && (
          <div className="super-ellipse bg-[hsl(var(--card))] border border-border p-6">
            <MapPin className="w-5 h-5 text-[hsl(var(--accent))]" />
            <h2 className="mt-3 font-heading font-600 text-[hsl(var(--primary))]">Adresse</h2>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{store.address}</p>
          </div>
        )}
        {store.phone && (
          <div className="super-ellipse bg-[hsl(var(--card))] border border-border p-6">
            <Phone className="w-5 h-5 text-[hsl(var(--accent))]" />
            <h2 className="mt-3 font-heading font-600 text-[hsl(var(--primary))]">Téléphone</h2>
            <a href={`tel:${store.phone}`} className="mt-1 block text-sm text-[hsl(var(--accent))] font-medium">{store.phone}</a>
          </div>
        )}
      </div>

      {whatsappNum && (
        <a href={`https://wa.me/${whatsappNum}`} target="_blank" rel="noreferrer" className="mt-6 w-full inline-flex items-center justify-center gap-3 px-6 py-4 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold text-lg hover:bg-[hsl(var(--primary))] transition-colors">
          <MessageCircle className="w-6 h-6" /> Contacter FS PC sur WhatsApp
        </a>
      )}

      {(social.instagram || social.facebook || social.tiktok) && (
        <div className="mt-8">
          <h2 className="font-heading text-xl font-600 text-[hsl(var(--primary))] mb-4">Suivez-nous</h2>
          <div className="flex flex-wrap gap-3">
            {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 super-ellipse border border-border text-sm font-medium text-[hsl(var(--primary))] hover:border-[hsl(var(--accent))] transition-colors"><Instagram className="w-4 h-4 text-[hsl(var(--accent))]" /> Instagram</a>}
            {social.facebook && <a href={social.facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 super-ellipse border border-border text-sm font-medium text-[hsl(var(--primary))] hover:border-[hsl(var(--accent))] transition-colors"><Facebook className="w-4 h-4 text-[hsl(var(--accent))]" /> Facebook</a>}
            {social.tiktok && <a href={social.tiktok} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 super-ellipse border border-border text-sm font-medium text-[hsl(var(--primary))] hover:border-[hsl(var(--accent))] transition-colors"><Music2 className="w-4 h-4 text-[hsl(var(--accent))]" /> TikTok</a>}
          </div>
        </div>
      )}

      {!store.address && !store.phone && !whatsappNum && !store.description && (
        <div className="mt-8 super-ellipse bg-[hsl(var(--card))] border border-dashed border-border p-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[hsl(var(--muted-foreground))] shrink-0" />
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Les informations de contact seront affichées ici dès qu'elles seront configurées dans la boutique.</p>
        </div>
      )}
    </div>
  );
}