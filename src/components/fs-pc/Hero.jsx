import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Image } from '@/components/ui/image';

const HERO_IMG = 'https://media.base44.com/images/public/6aa5eae5ea57554dbe9fa078/9416af631_generated_image.png';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
      {/* subtle glacial grid lines */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #F0F5F5 1px, transparent 1px), linear-gradient(to bottom, #F0F5F5 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-36 pb-20 lg:pt-44 lg:pb-28 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="frost-enter">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 super-ellipse border border-white/20 bg-white/5 text-xs font-medium uppercase tracking-[0.15em] text-[hsl(var(--background))]/90">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent-foreground))] status-dot" />
            Sub-Zero Clarity · Maintenance & Vente
          </span>
          <h1 className="mt-6 font-heading text-5xl sm:text-6xl lg:text-7xl font-600 leading-[1.02] text-balance">
            La précision glaciale au service de votre informatique.
          </h1>
          <p className="mt-6 text-lg text-[hsl(var(--background))]/75 max-w-xl leading-relaxed">
            FS PC vend, installe et répare vos PC, ordinateurs portables, imprimantes, serveurs et réseaux. Du matériel fiable, une expertise chirurgicale, un dépannage transparent.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#boutique"
              className="group inline-flex items-center gap-2 px-7 py-3.5 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold hover:bg-[hsl(var(--background))] hover:text-[hsl(var(--primary))] transition-colors"
            >
              Explorer la boutique
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-7 py-3.5 super-ellipse border border-white/25 text-[hsl(var(--background))] font-semibold hover:bg-white/5 transition-colors"
            >
              Nos services
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-[hsl(var(--background))]/60">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[hsl(var(--accent-foreground))]" />
              Garantie matériel
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[hsl(var(--accent-foreground))]" />
              Devis gratuit
            </span>
          </div>
        </div>

        <div className="relative frost-enter">
          <div className="relative super-ellipse overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={HERO_IMG}
              alt="Châssis PC haute performance avec refroidissement liquide"
              className="w-full h-[360px] sm:h-[460px] lg:h-[540px] object-cover"
              fittingType="fill"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))]/60 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-6 -left-4 sm:left-6 frost-glass bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] px-5 py-4 super-ellipse border border-white/10">
            <p className="text-xs uppercase tracking-[0.15em] text-[hsl(var(--muted-foreground))]">Temps de réponse</p>
            <p className="font-heading text-2xl font-600">&lt; 24h</p>
          </div>
        </div>
      </div>
    </section>
  );
}