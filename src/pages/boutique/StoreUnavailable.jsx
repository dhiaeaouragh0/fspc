import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function StoreUnavailable() {
  return (
    <div className="max-w-xl mx-auto px-6 py-20 text-center">
      <div className="mx-auto grid place-items-center w-16 h-16 super-ellipse bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="mt-6 font-heading text-3xl font-600 text-[hsl(var(--primary))]">FS PC est actuellement indisponible.</h1>
      <p className="mt-3 text-[hsl(var(--muted-foreground))]">Nous sommes désolés, cette boutique n'est pas disponible pour le moment.</p>
      <Link to="/" className="mt-7 inline-block px-6 py-3 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold">Retour à l'accueil</Link>
    </div>
  );
}