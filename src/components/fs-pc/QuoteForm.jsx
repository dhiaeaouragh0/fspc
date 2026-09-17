import React, { useState } from 'react';
import { ShoppingCart, Wrench, Send, CheckCircle2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function QuoteForm() {
  const [intent, setIntent] = useState('maintenance');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    device: '',
    issue: '',
  });

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await emailjs.send(
      'service_fspc',
      'template_fspc',
      {
        name: form.name,
        phone: form.phone,
        email: form.email,
        intent: intent === 'purchase'
          ? 'Achat matériel'
          : 'Maintenance / Réparation',
        device: form.device,
        issue: form.issue,
      },
      'r2q3CD-7hJCu2VcOd'
    );

    setSubmitted(true);
  } catch (error) {
    console.error(error);
    alert("Une erreur est survenue. Veuillez réessayer.");
  }
};

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section id="devis" className="relative py-24 lg:py-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-[hsl(var(--accent))] font-semibold">
            03 — Le Moteur à Devis
          </p>
          <h2 className="mt-3 font-heading text-4xl sm:text-5xl font-600 text-[hsl(var(--primary))] text-balance">
            Décrivez votre besoin, on s'occupe du reste.
          </h2>
          <p className="mt-5 text-lg text-[hsl(var(--muted-foreground))] leading-relaxed">
            Choisissez l'objet de votre demande puis laissez-nous les détails. Réponse sous 24h.
          </p>
        </div>

        <div className="super-ellipse bg-[hsl(var(--card))] border border-border p-6 sm:p-10 shadow-xl">
          {submitted ? (
            <div className="py-12 text-center">
              <div className="mx-auto grid place-items-center w-16 h-16 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="mt-6 font-heading text-2xl font-600 text-[hsl(var(--primary))]">
                Demande enregistrée, {form.name.split(' ')[0] || 'merci'} !
              </h3>
              <p className="mt-3 text-[hsl(var(--muted-foreground))] max-w-md mx-auto">
                Nous vous recontactons très vite. Nous vous contacterons au{' '}
                <strong className="text-[hsl(var(--primary))]">
                  {form.phone}
                </strong>.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', device: '', issue: '' }); }}
                className="mt-7 px-6 py-3 super-ellipse border border-border text-sm font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))] transition-colors"
              >
                Nouvelle demande
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-3">
                  Quel est l'objet de votre demande ?
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIntent('purchase')}
                    className={`flex items-center gap-3 p-4 super-ellipse border-2 transition-all ${
                      intent === 'purchase'
                        ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10'
                        : 'border-border hover:border-[hsl(var(--accent))]/50'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5 text-[hsl(var(--accent))]" />
                    <span className="text-left">
                      <span className="block font-semibold text-[hsl(var(--primary))]">Achat matériel</span>
                      <span className="block text-xs text-[hsl(var(--muted-foreground))]">Laptop, PC, imprimante…</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntent('maintenance')}
                    className={`flex items-center gap-3 p-4 super-ellipse border-2 transition-all ${
                      intent === 'maintenance'
                        ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent))]/10'
                        : 'border-border hover:border-[hsl(var(--accent))]/50'
                    }`}
                  >
                    <Wrench className="w-5 h-5 text-[hsl(var(--accent))]" />
                    <span className="text-left">
                      <span className="block font-semibold text-[hsl(var(--primary))]">Maintenance / Réparation</span>
                      <span className="block text-xs text-[hsl(var(--muted-foreground))]">PC, imprimante, serveur…</span>
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">
                    Nom complet
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 super-ellipse border border-input bg-[hsl(var(--background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">
                    Téléphone
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="06 00 00 00 00"
                    className="w-full px-4 py-3 super-ellipse border border-input bg-[hsl(var(--background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/40"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">
                    Email (optionnel)
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="vous@email.com"
                    className="w-full px-4 py-3 super-ellipse border border-input bg-[hsl(var(--background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">
                    {intent === 'purchase' ? 'Matériel souhaité' : 'Appareil concerné'}
                  </label>
                  <input
                    value={form.device}
                    onChange={update('device')}
                    placeholder={intent === 'purchase' ? 'ex: Laptop Core i7' : 'ex: Imprimante Brother'}
                    className="w-full px-4 py-3 super-ellipse border border-input bg-[hsl(var(--background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.12em] font-semibold text-[hsl(var(--muted-foreground))] mb-2">
                  Décrivez votre besoin
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.issue}
                  onChange={update('issue')}
                  placeholder={intent === 'purchase' ? 'Configuration, budget, quantité…' : 'Panne, symptômes, contexte…'}
                  className="w-full px-4 py-3 super-ellipse border border-input bg-[hsl(var(--background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]/40 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 super-ellipse bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] font-semibold hover:bg-[hsl(var(--primary))] transition-colors"
              >
                <Send className="w-4 h-4" />
                Envoyer ma demande
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}