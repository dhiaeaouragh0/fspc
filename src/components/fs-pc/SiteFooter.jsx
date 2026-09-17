import React from 'react';
import { MapPin, Phone, Mail, Clock, Cpu } from 'lucide-react';
import { useStore } from '@/lib/StoreContext';

export default function SiteFooter() {
  const { store } = useStore();

  const storeName = store?.name || 'Fast Solution PC';
  const logo = store?.logo;
  const phone = store?.phone;
  const whatsapp = store?.whatsapp;
  const address = store?.address;
  const description = store?.description;

  return (
    <footer
      id="contact"
      className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid lg:grid-cols-4 gap-10">

          {/* Store identity */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              {logo ? (
                <img
                  src={logo}
                  alt={storeName}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <span className="grid place-items-center w-10 h-10 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
                  <Cpu className="w-5 h-5" />
                </span>
              )}

              <span className="font-heading text-2xl font-600">
                {storeName}
              </span>
            </div>

            <p className="mt-5 text-[hsl(var(--primary-foreground))]/70 max-w-md leading-relaxed">
              {description ||
                'Vente de matériel informatique, maintenance et réparation. PC, laptops, imprimantes, serveurs et réseaux.'}
            </p>

            <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent-foreground))] status-dot" />
              <span className="text-sm font-semibold uppercase tracking-[0.1em]">
                Système · Ouvert
              </span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[hsl(var(--primary-foreground))]/50 font-semibold mb-4">
              Coordonnées
            </p>

            <ul className="space-y-3 text-sm">

              {address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-[hsl(var(--accent-foreground))] shrink-0" />
                  <span className="text-[hsl(var(--primary-foreground))]/80">
                    {address}
                  </span>
                </li>
              )}

              {phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[hsl(var(--accent-foreground))] shrink-0" />

                  <a
                    href={`tel:${phone}`}
                    className="text-[hsl(var(--primary-foreground))]/80 hover:text-[hsl(var(--accent-foreground))] transition-colors"
                  >
                    {phone}
                  </a>
                </li>
              )}

              {whatsapp && (
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[hsl(var(--accent-foreground))] shrink-0" />

                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[hsl(var(--primary-foreground))]/80 hover:text-[hsl(var(--accent-foreground))] transition-colors"
                  >
                    WhatsApp
                  </a>
                </li>
              )}

            </ul>
          </div>

          {/* Horaires */}
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[hsl(var(--primary-foreground))]/50 font-semibold mb-4">
              Horaires
            </p>

            <ul className="space-y-3 text-sm text-[hsl(var(--primary-foreground))]/80">
              <li className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[hsl(var(--accent-foreground))]" />
                  Sam – Jeu
                </span>

                <span>08:30 – 18:00</span>
              </li>

              <li className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[hsl(var(--accent-foreground))]" />
                  Vendredi
                </span>

                <span>Fermé</span>
              </li>
            </ul>

            <a
              href="/#devis"
              className="mt-6 inline-block text-sm font-semibold text-[hsl(var(--accent-foreground))] hover:underline"
            >
              Demander un devis →
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-7 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[hsl(var(--primary-foreground))]/50">
          <p>
            © {new Date().getFullYear()} {storeName}. Tous droits réservés.
          </p>

          <p>
            {store?.currency || 'DZD'} · Maintenance informatique de précision
          </p>
        </div>
      </div>
    </footer>
  );
}