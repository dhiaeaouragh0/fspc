import React from 'react';
import { Check } from 'lucide-react';
import { isOptionAvailable } from '@/lib/fspcUtils';

const COLOR_HINTS = ['black', 'white', 'red', 'blue', 'green', 'gray', 'grey', 'silver', 'pink', 'purple', 'yellow', 'orange', 'gold', 'rose'];
const COLOR_MAP = {
  black: '#1a1a1a', white: '#f5f5f5', red: '#dc2626', blue: '#2563eb', green: '#16a34a',
  gray: '#6b7280', grey: '#6b7280', silver: '#c0c0c0', pink: '#ec4899', purple: '#7c3aed',
  yellow: '#eab308', orange: '#f97316', gold: '#d4af37', rose: '#f43f5e',
};

function isColorOption(name) {
  return /color|couleur/i.test(name);
}
function colorFor(value) {
  const v = String(value).toLowerCase();
  for (const h of COLOR_HINTS) if (v.includes(h)) return COLOR_MAP[h] || null;
  return null;
}

export default function VariantPicker({ product, selected, onChange }) {
  const types = product?.optionTypes || [];
  if (types.length === 0) return null;

  return (
    <div className="space-y-5">
      {types.map((type) => {
        const isColor = isColorOption(type.name);
        return (
          <div key={type.name}>
            <p className="text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2.5">
              {type.name}
              {selected[type.name] && <span className="ml-2 text-[hsl(var(--accent))] normal-case tracking-normal">: {selected[type.name]}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {type.values.map((val) => {
                const active = selected[type.name] === val;
                const available = isOptionAvailable(product, type.name, val, selected);
                if (isColor) {
                  const swatch = colorFor(val);
                  return (
                    <button
                      key={val}
                      disabled={!available}
                      onClick={() => onChange({ ...selected, [type.name]: val })}
                      title={val}
                      className={`relative w-10 h-10 super-ellipse border-2 transition-all ${
                        active ? 'border-[hsl(var(--accent))]' : 'border-border'
                      } ${!available ? 'opacity-30 cursor-not-allowed' : 'hover:border-[hsl(var(--accent))]/60'}`}
                    >
                      <span className="block w-full h-full super-ellipse" style={swatch ? { background: swatch } : { background: 'transparent' }} />
                      {active && <Check className="absolute inset-0 m-auto w-4 h-4 mix-blend-difference text-white" />}
                    </button>
                  );
                }
                return (
                  <button
                    key={val}
                    disabled={!available}
                    onClick={() => onChange({ ...selected, [type.name]: val })}
                    className={`px-4 py-2 super-ellipse border text-sm font-medium transition-all ${
                      active
                        ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]'
                        : 'border-border text-[hsl(var(--primary))] hover:border-[hsl(var(--accent))]/60'
                    } ${!available ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}