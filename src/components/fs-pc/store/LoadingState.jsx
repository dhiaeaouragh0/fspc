import React from 'react';

export default function LoadingState({ label = 'Chargement…', rows = 4 }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-[hsl(var(--muted-foreground))]">
        <span className="w-4 h-4 border-2 border-[hsl(var(--accent))]/30 border-t-[hsl(var(--accent))] rounded-full animate-spin" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="super-ellipse bg-[hsl(var(--card))] border border-border p-4 animate-pulse">
            <div className="aspect-square bg-[hsl(var(--muted))]/60 rounded-2xl" />
            <div className="h-3 bg-[hsl(var(--muted))]/60 rounded mt-4 w-2/3" />
            <div className="h-3 bg-[hsl(var(--muted))]/40 rounded mt-2 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}