import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, MapPin, Phone, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { fspcApi } from '@/lib/fspcApi';

export default function StoreFooter() {
  const [store, setStore] = useState(null);
  useEffect(() => { fspcApi.getStore().then(setStore).catch(() => {}); }, []);

  const name = store?.name || 'FS PC';
  const social = store?.socialLinks || {};

  return (
    <footer className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              {store?.logo ? (
                <img src={store.logo} alt={name} className="h-9 w-auto object-contain bg-white/5 p-1 super-ellipse" />
              ) : (
                <span className="grid place-items-center w-10 h-10 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
                  <Cpu className="w-5 h-5" />
                </span>
              )}
              <span className="font-heading text-2xl font-600">{name}</span>
            </div>
            <p className="mt-5 text-[hsl(var(--primary-foreground))]/70 max-w-md leading-relaxed">
              {store?.description || 'PC Gaming, composants, périphériques et accessoires. Livraison partout en Algérie, paiement à la livraison.'}
            </p>
            <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent-foreground))] status-dot" />
              <span className="text-sm font-semibold uppercase tracking-[0.1em]">Boutique · Ouverte</span>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[hsl(var(--primary-foreground))]/50 font-semibold mb-4">Contact</p>
            <ul className="space-y-3 text-sm">
              {store?.address && (
                <li className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-0.5 text-[hsl(var(--accent-foreground))] shrink-0" /><span className="text-[hsl(var(--primary-foreground))]/80">{store.address}</span></li>
              )}
              {store?.phone && (
                <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-[hsl(var(--accent-foreground))] shrink-0" /><a href={`tel:${store.phone}`} className="text-[hsl(var(--primary-foreground))]/80 hover:text-[hsl(var(--accent-foreground))] transition-colors">{store.phone}</a></li>
              )}
              {store?.whatsapp && (
                <li><a href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold hover:bg-[hsl(var(--accent-foreground))]/15 transition-colors">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a></li>
              )}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[hsl(var(--primary-foreground))]/50 font-semibold mb-4">Navigation</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/boutique" className="text-[hsl(var(--primary-foreground))]/80 hover:text-[hsl(var(--accent-foreground))] transition-colors">Boutique</Link></li>
              <li><Link to="/boutique/produits" className="text-[hsl(var(--primary-foreground))]/80 hover:text-[hsl(var(--accent-foreground))] transition-colors">Tous les produits</Link></li>
              <li><Link to="/apropos" className="text-[hsl(var(--primary-foreground))]/80 hover:text-[hsl(var(--accent-foreground))] transition-colors">À propos</Link></li>
              <li><Link to="/" className="text-[hsl(var(--primary-foreground))]/80 hover:text-[hsl(var(--accent-foreground))] transition-colors">Retour au site</Link></li>
            </ul>
            {(social.instagram || social.facebook || social.tiktok) && (
              <div className="flex items-center gap-3 mt-5">
                {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer" className="grid place-items-center w-9 h-9 super-ellipse border border-white/15 text-[hsl(var(--primary-foreground))]/80 hover:text-[hsl(var(--accent-foreground))] hover:border-[hsl(var(--accent-foreground))] transition-colors"><Instagram className="w-4 h-4" /></a>}
                {social.facebook && <a href={social.facebook} target="_blank" rel="noreferrer" className="grid place-items-center w-9 h-9 super-ellipse border border-white/15 text-[hsl(var(--primary-foreground))]/80 hover:text-[hsl(var(--accent-foreground))] hover:border-[hsl(var(--accent-foreground))] transition-colors"><Facebook className="w-4 h-4" /></a>}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-xs text-[hsl(var(--primary-foreground))]/50">
          © {new Date().getFullYear()} {name}. Paiement à la livraison · Livraison partout en Algérie.
        </div>
      </div>
    </footer>
  );
}