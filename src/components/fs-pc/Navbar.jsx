import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Cpu } from 'lucide-react';

const navLinks = [
  { label: 'Services', href: '/#services' },
  { label: 'Devis', href: '/#devis' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'frost-glass bg-[hsl(var(--background))]/80 border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2.5 group"
        >
          <span className="grid place-items-center w-10 h-10 super-ellipse bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
            <Cpu className="w-5 h-5" />
          </span>

          <span className="font-heading text-xl font-600 tracking-tight text-[hsl(var(--primary))]">
            FS<span className="text-[hsl(var(--accent))]"> PC</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">

          {/* Boutique */}
          <Link
            to="/boutique"
            className="text-sm font-medium text-[hsl(var(--foreground))]/80 hover:text-[hsl(var(--accent))] transition-colors"
          >
            Boutique
          </Link>

          {/* Home sections */}
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[hsl(var(--foreground))]/80 hover:text-[hsl(var(--accent))] transition-colors"
            >
              {link.label}
            </a>
          ))}

          {/* Quote button */}
          <a
            href="/#devis"
            className="px-5 py-2.5 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-sm font-semibold hover:bg-[hsl(var(--primary))] transition-colors"
          >
            Demander un devis
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 text-[hsl(var(--primary))]"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
        >
          {open ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile navigation */}
      {open && (
        <div className="md:hidden frost-glass bg-[hsl(var(--background))]/95 border-b border-border">
          <div className="px-6 py-6 flex flex-col gap-4">

            <Link
              to="/boutique"
              onClick={closeMenu}
              className="text-base font-medium text-[hsl(var(--primary))]"
            >
              Boutique
            </Link>

            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="text-base font-medium text-[hsl(var(--primary))]"
              >
                {link.label}
              </a>
            ))}

            <a
              href="/#devis"
              onClick={closeMenu}
              className="mt-2 px-5 py-3 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-sm font-semibold text-center"
            >
              Demander un devis
            </a>

          </div>
        </div>
      )}
    </header>
  );
}