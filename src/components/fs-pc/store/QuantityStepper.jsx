import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({ value, onChange, min = 1, max }) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(max ? Math.min(max, value + 1) : value + 1);
  return (
    <div className="inline-flex items-center super-ellipse border border-border bg-[hsl(var(--background))] overflow-hidden">
      <button onClick={dec} disabled={value <= min} className="grid place-items-center w-10 h-10 text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))] disabled:opacity-40 transition-colors" aria-label="Diminuer">
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-10 text-center font-heading font-600 text-[hsl(var(--primary))]">{value}</span>
      <button onClick={inc} disabled={max !== undefined && value >= max} className="grid place-items-center w-10 h-10 text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))] disabled:opacity-40 transition-colors" aria-label="Augmenter">
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}