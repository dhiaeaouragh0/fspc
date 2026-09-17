import React from 'react';
import { PackageSearch } from 'lucide-react';

export default function EmptyState({ title = 'Rien à afficher', description, icon: Icon = PackageSearch, action }) {
  return (
    <div className="super-ellipse border border-dashed border-border bg-[hsl(var(--card))]/50 p-10 sm:p-14 text-center">
      <div className="mx-auto grid place-items-center w-14 h-14 super-ellipse bg-[hsl(var(--muted))] text-[hsl(var(--accent))]">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="mt-5 font-heading text-xl font-600 text-[hsl(var(--primary))]">{title}</h3>
      {description && <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}