import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { fspcApi } from '@/lib/fspcApi';

const links = [
  { label: 'Boutique', to: '/boutique' },
  { label: 'Produits', to: '/boutique/produits' },
  { label: 'À propos', to: '/apropos' },
];

export default function StoreNavbar() {
  const { count, openCart } = useCart();
  const [store, setStore] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    fspcApi.getStore().then((s) => active && setStore(s)).catch(() => {});
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => { active = false; window.removeEventListener('scroll', onScroll); };
  }, []);

  const brandName = store?.name || 'FS PC';

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'frost-glass bg-[hsl(var(--background))]/85 border-b border-border' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-5 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          {store?.logo ? (
            <img src={store.logo} alt={brandName} className="h-9 w-auto object-contain" />
          ) : (
            <span className="grid place-items-center w-9 h-9 super-ellipse bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
              <Cpu className="w-4.5 h-4.5" />
            </span>
          )}
          <span className="font-heading text-lg font-600 tracking-tight text-[hsl(var(--primary))] hidden sm:block">{brandName}</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-[hsl(var(--foreground))]/80 hover:text-[hsl(var(--accent))] transition-colors">{l.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={openCart} className="relative grid place-items-center w-10 h-10 super-ellipse bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--accent))] transition-colors" aria-label="Panier">
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid place-items-center min-w-5 h-5 px-1 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-[10px] font-bold">{count}</span>
            )}
          </button>
          <button onClick={() => setOpen((v) => !v)} className="md:hidden grid place-items-center w-10 h-10 super-ellipse border border-border text-[hsl(var(--primary))]" aria-label="Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden frost-glass bg-[hsl(var(--background))]/95 border-b border-border">
          <div className="px-5 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-base font-medium text-[hsl(var(--primary))]">{l.label}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}