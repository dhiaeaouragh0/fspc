import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/fs-pc/Navbar';
import StoreFooter from '@/components/fs-pc/store/StoreFooter';

export default function StoreLayout() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      <StoreFooter />
    </div>
  );
}