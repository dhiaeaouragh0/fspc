import React, { useState } from 'react';
import { Image } from '@/components/ui/image';
import { Wrench, Server, Printer, Wifi, Cpu, ShieldCheck } from 'lucide-react';

const REPAIR_IMG = 'https://media.base44.com/images/public/6aa5eae5ea57554dbe9fa078/7c2fca5a5_generated_image.png';
const SERVER_IMG = 'https://media.base44.com/images/public/6aa5eae5ea57554dbe9fa078/d3d89bfdc_generated_image.png';
const PRINTER_IMG = 'https://media.base44.com/images/public/6aa5eae5ea57554dbe9fa078/a8d717e25_generated_image.png';

const services = [
  {
    id: 'diagnostic',
    name: 'Diagnostic & Réparation PC',
    icon: Wrench,
    img: REPAIR_IMG,
    summary: 'PC, ordinateurs portables, unités centrales — panne, lenteur, écran, alimentation.',
    points: [
      'Diagnostic complet gratuit',
      'Réparation carte mère & composants',
      'Remplacement écran / clavier / batterie',
      'Récupération de données',
    ],
  },
  {
    id: 'printer',
    name: 'Maintenance Imprimantes & Copieurs',
    icon: Printer,
    img: PRINTER_IMG,
    summary: 'Imprimantes Brother & Lexmark, photocopieurs Ricoh, scanners — entretien et dépannage.',
    points: [
      'Désamorçage & nettoyage têtes',
      'Remplacement tambours & cartouches',
      'Maintenance préventive photocopieurs Ricoh',
      'Calibration & calibration couleur',
    ],
  },
  {
    id: 'server',
    name: 'Serveurs & Onduleurs',
    icon: Server,
    img: SERVER_IMG,
    summary: 'Installation de serveurs, onduleurs et infrastructure — stabilité et continuité.',
    points: [
      'Configuration serveurs & stockage',
      'Installation onduleurs (backup électrique)',
      'Sécurisation & sauvegarde automatique',
      'Mise en réseau d\'entreprise',
    ],
  },
  {
    id: 'system',
    name: 'Systèmes & Réseaux',
    icon: Wifi,
    img: REPAIR_IMG,
    summary: 'Installation / réinstallation de systèmes d\'exploitation et configuration de modems.',
    points: [
      'Installation & réinstallation Windows / Linux',
      'Configuration modems & routeurs',
      'Sécurisation réseau & pare-feu',
      'Optimisation des performances',
    ],
  },
];

export default function Services() {
  const [active, setActive] = useState('diagnostic');
  const current = services.find((s) => s.id === active);

  return (
    <section id="services" className="relative py-24 lg:py-32 bg-[hsl(var(--card))]/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-14 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[hsl(var(--accent))] font-semibold">
            02 — Le Hub Diagnostic
          </p>
          <h2 className="mt-3 font-heading text-4xl sm:text-5xl font-600 text-[hsl(var(--primary))] text-balance">
            Maintenance & réparation, menées avec une transparence chirurgicale.
          </h2>
          <p className="mt-5 text-lg text-[hsl(var(--muted-foreground))] leading-relaxed">
            Chaque intervention commence par un diagnostic clair. Vous savez ce qui dysfonctionne, ce que nous faisons, et combien ça coûte — avant le début des travaux.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-5">
          {/* service selector */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {services.map((s) => {
              const isActive = s.id === active;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`text-left super-ellipse p-6 border transition-all ${
                    isActive
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-[hsl(var(--primary))]'
                      : 'bg-[hsl(var(--card))] border-border hover:border-[hsl(var(--accent))]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`grid place-items-center w-11 h-11 super-ellipse shrink-0 ${
                        isActive ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--accent))]'
                      }`}
                    >
                      <s.icon className="w-5 h-5" />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-lg font-600">{s.name}</h3>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent-foreground))] status-dot" />
                        )}
                      </div>
                      <p className={`mt-1 text-sm ${isActive ? 'text-[hsl(var(--primary-foreground))]/70' : 'text-[hsl(var(--muted-foreground))]'}`}>
                        {s.summary}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="mt-2 flex items-center gap-3 px-2 text-sm text-[hsl(var(--muted-foreground))]">
              <Cpu className="w-4 h-4 text-[hsl(var(--accent))]" />
              Diagnostic offert · Devis détaillé sans engagement
            </div>
          </div>

          {/* sticky detail panel */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28 super-ellipse overflow-hidden border border-border bg-[hsl(var(--card))]">
              <div className="relative h-56 sm:h-72">
                <Image
                  key={current.img}
                  src={current.img}
                  alt={current.name}
                  className="w-full h-full object-cover"
                  fittingType="fill"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))] via-[hsl(var(--card))]/20 to-transparent" />
                <span className="absolute top-5 left-5 px-3 py-1.5 super-ellipse frost-glass bg-[hsl(var(--primary))]/70 text-[hsl(var(--primary-foreground))] text-xs uppercase tracking-[0.12em] font-semibold">
                  Service actif
                </span>
              </div>
              <div className="p-7 sm:p-9">
                <h3 className="font-heading text-2xl sm:text-3xl font-600 text-[hsl(var(--primary))]">{current.name}</h3>
                <p className="mt-3 text-[hsl(var(--muted-foreground))] leading-relaxed">{current.summary}</p>
                <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                  {current.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-[hsl(var(--foreground))]">
                      <ShieldCheck className="w-4 h-4 mt-0.5 text-[hsl(var(--accent))] shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#devis"
                  className="mt-8 inline-flex items-center gap-2 px-6 py-3 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold hover:bg-[hsl(var(--primary))] transition-colors"
                >
                  Demander un devis pour ce service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}