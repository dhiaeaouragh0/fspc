import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import { ArrowRight } from 'lucide-react';

export default function CategoryGrid({ categories = [] }) {
  if (!categories.length) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((c) => (
        <Link
          key={c._id}
          to={`/boutique/produits?category=${c.slug || c._id}`}
          className="group relative super-ellipse overflow-hidden border border-border bg-[hsl(var(--card))] aspect-[4/3] hover:border-[hsl(var(--accent))] transition-colors"
        >
          {c.image ? (
            <Image src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" fittingType="fill" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--muted))] to-[hsl(var(--card))]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))]/85 via-[hsl(var(--primary))]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="font-heading text-lg font-600 text-[hsl(var(--primary-foreground))]">{c.name}</h3>
            <span className="mt-1 inline-flex items-center gap-1 text-xs text-[hsl(var(--primary-foreground))]/70 group-hover:text-[hsl(var(--accent-foreground))] transition-colors">
              Découvrir <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}