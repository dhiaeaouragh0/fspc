import React from 'react';
import Navbar from '@/components/fs-pc/Navbar';
import Hero from '@/components/fs-pc/Hero';
import ProductCatalog from '@/components/fs-pc/ProductCatalog';
import Services from '@/components/fs-pc/Services';
import QuoteForm from '@/components/fs-pc/QuoteForm';
import SiteFooter from '@/components/fs-pc/SiteFooter';

export default function Home() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Navbar />
      <main>
        <Hero />
        <ProductCatalog />
        <Services />
        <QuoteForm />
      </main>
      <SiteFooter />
    </div>
  );
}